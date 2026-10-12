import { NextRequest } from "next/server";

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const API_WORKER_URL = process.env.NEXT_PUBLIC_API_URL;
  if (!API_WORKER_URL) {
    return new Response("Storage not configured", { status: 500 });
  }

  const url = new URL(req.url);
  const path = url.pathname.replace(/^\/storage/, "");
  const targetUrl = `${API_WORKER_URL}/storage${path}${url.search}`;

  try {
    const upstream = await fetch(targetUrl, {
      method: "GET",
      headers: {
        accept: req.headers.get("accept") || "*/*",
      },
    });

    if (!upstream.ok) {
      return new Response(upstream.statusText, { status: upstream.status });
    }

    const headers = new Headers();
    const contentType = upstream.headers.get("content-type") || "image/webp";
    headers.set("Content-Type", contentType);
    headers.set("Cache-Control", "public, max-age=31536000, immutable");
    headers.set("Access-Control-Allow-Origin", "*");

    const etag = upstream.headers.get("etag");
    if (etag) headers.set("ETag", etag);

    return new Response(upstream.body, {
      status: 200,
      headers,
    });
  } catch (err: any) {
    return new Response(`Error fetching storage: ${err.message}`, { status: 502 });
  }
}
