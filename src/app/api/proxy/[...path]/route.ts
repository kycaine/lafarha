import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";

export const runtime = 'edge';

export const GET = handleProxy;
export const POST = handleProxy;
export const PUT = handleProxy;
export const PATCH = handleProxy;
export const DELETE = handleProxy;
export const OPTIONS = handleProxy;

async function handleProxy(req: NextRequest) {
  const API_WORKER_URL = process.env.NEXT_PUBLIC_API_URL || "https://la-dev-api.rizkyap90s.workers.dev";
  const API_SECRET_KEY = process.env.API_SECRET_KEY || "super_secret_api_key_for_backend_worker";

  if (!API_WORKER_URL || !API_SECRET_KEY) {
    return NextResponse.json({ error: "API configuration missing" }, { status: 500 });
  }

  // Check session
  const session = await getSession();
  
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
    };

    // Forward body if not GET/HEAD
    if (req.method !== "GET" && req.method !== "HEAD") {
      const bodyBuffer = await req.arrayBuffer();
      if (bodyBuffer.byteLength > 0) {
        fetchOptions.body = bodyBuffer;
      }
    }

    const response = await fetch(targetUrl, fetchOptions);

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
