import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";

export const runtime = 'edge';
// Proxy ini selalu dinamis: jangan pernah di-cache oleh Next/Cloudflare.
export const dynamic = 'force-dynamic';

export const GET = handleProxy;
export const POST = handleProxy;
export const PUT = handleProxy;
export const PATCH = handleProxy;
export const DELETE = handleProxy;
export const OPTIONS = handleProxy;

const RETRYABLE_STATUS = new Set([502, 503, 504]);

async function handleProxy(req: NextRequest) {
  // NEXT_PUBLIC_API_URL  -> di-inline saat build dari .env.development / .env.production.
  // API_SECRET_KEY       -> dibaca saat runtime (.env.development lokal, Pages secret di dev/prod).
  // Tidak ada fallback hardcoded agar lokal & deployment berperilaku sama.
  const API_WORKER_URL = process.env.NEXT_PUBLIC_API_URL;
  const API_SECRET_KEY = process.env.API_SECRET_KEY;

  if (!API_WORKER_URL || !API_SECRET_KEY) {
    const missing = [
      !API_WORKER_URL && "NEXT_PUBLIC_API_URL",
      !API_SECRET_KEY && "API_SECRET_KEY",
    ].filter(Boolean).join(", ");
    console.error(`[Proxy] Konfigurasi hilang: ${missing}. Lihat DEPLOYMENTS.md.`);
    return NextResponse.json({ error: `API configuration missing: ${missing}` }, { status: 500 });
  }

  // Check session
  // Public endpoints (e.g. /mitra) must still work if the session cookie is
  // missing/invalid or the session lib throws on the edge runtime.
  let session: { isLoggedIn?: boolean; uid?: string; role?: string } = { isLoggedIn: false };
  try {
    session = await getSession();
  } catch (e) {
    console.error("[Proxy] getSession failed:", e);
  }

  // Extract path to proxy
  const url = new URL(req.url);
  const path = url.pathname.replace(/^\/api\/proxy/, "");

  // Build the target URL
  const targetUrl = `${API_WORKER_URL}${path}${url.search}`;

  console.log(`[Proxy] ${req.method} ${path} | session.isLoggedIn=${session.isLoggedIn} | uid=${session.uid ?? 'none'} | role=${session.role ?? 'none'}`);

  // Forward headers, but overwrite/strip sensitive ones
  const headers = new Headers(req.headers);
  headers.set("X-API-Key", API_SECRET_KEY);

  if (session.isLoggedIn && session.uid && session.role) {
    headers.set("X-User-ID", session.uid);
    headers.set("X-User-Role", session.role);
  } else {
    // SECURITY FIX: Strip headers if not logged in to prevent client spoofing
    headers.delete("X-User-ID");
    headers.delete("X-User-Role");
  }

  // Don't forward host header to avoid conflicts
  headers.delete("host");

  try {
    const fetchOptions: RequestInit = {
      method: req.method,
      headers,
      redirect: "manual",
      cache: "no-store",
    };

    // Forward body if not GET/HEAD
    if (req.method !== "GET" && req.method !== "HEAD") {
      const bodyBuffer = await req.arrayBuffer();
      if (bodyBuffer.byteLength > 0) {
        fetchOptions.body = bodyBuffer;
      }
    }

    // Hanya request idempoten (GET/HEAD) yang boleh di-retry sekali jika
    // upstream gagal sementara (cold start worker / error jaringan edge).
    const canRetry = req.method === "GET" || req.method === "HEAD";
    let response: Response;
    try {
      response = await fetch(targetUrl, fetchOptions);
      if (canRetry && RETRYABLE_STATUS.has(response.status)) {
        console.warn(`[Proxy] Upstream ${response.status} dari ${targetUrl}, retry sekali`);
        response = await fetch(targetUrl, fetchOptions);
      }
    } catch (firstError) {
      if (!canRetry) throw firstError;
      console.warn("[Proxy] Fetch gagal, retry sekali:", firstError);
      response = await fetch(targetUrl, fetchOptions);
    }

    console.log(`[Proxy] Response: ${response.status} from ${targetUrl}`);

    // Create a new response to send back to the client
    const proxyResponse = new NextResponse(response.body, {
      status: response.status,
      statusText: response.statusText,
    });

    // Copy over headers, but exclude encoding and length headers
    // because fetch automatically decompresses the response body.
    response.headers.forEach((value, key) => {
      if (key.toLowerCase() !== "content-encoding" && key.toLowerCase() !== "content-length") {
        proxyResponse.headers.set(key, value);
      }
    });

    return proxyResponse;
  } catch (error: any) {
    console.error("Proxy error:", error);
    return NextResponse.json({ error: "Failed to fetch from API" }, { status: 502 });
  }
}
