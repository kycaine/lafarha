import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";

const API_WORKER_URL = process.env.NEXT_PUBLIC_API_URL;
const API_SECRET_KEY = process.env.API_SECRET_KEY;

export async function middleware(req: NextRequest) {
  // We handle all HTTP methods
  return handleProxy(req);
}

export const GET = handleProxy;
export const POST = handleProxy;
export const PUT = handleProxy;
export const PATCH = handleProxy;
export const DELETE = handleProxy;
export const OPTIONS = handleProxy;

async function handleProxy(req: NextRequest) {
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

  // Forward headers, but attach secret key and user info
  const headers = new Headers(req.headers);
  headers.set("X-API-Key", API_SECRET_KEY);
  
  if (session.isLoggedIn && session.uid && session.role) {
    headers.set("X-User-ID", session.uid);
    headers.set("X-User-Role", session.role);
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
      fetchOptions.body = await req.arrayBuffer();
    }

    const response = await fetch(targetUrl, fetchOptions);

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
