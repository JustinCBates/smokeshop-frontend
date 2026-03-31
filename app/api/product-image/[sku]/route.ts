import { NextRequest } from "next/server";

const DEFAULT_BACKEND_API = "http://backend:3000";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ sku: string }> },
) {
  const { sku } = await params;
  const backendBase = process.env.NEXT_PUBLIC_API_URL || DEFAULT_BACKEND_API;
  const target = `${backendBase}/api/product-image/${encodeURIComponent(sku)}`;

  const upstream = await fetch(target, { cache: "no-store" });
  if (!upstream.ok) {
    return new Response("Not Found", { status: upstream.status });
  }

  const data = await upstream.arrayBuffer();
  const contentType = upstream.headers.get("content-type") || "image/svg+xml";
  const cacheControl =
    upstream.headers.get("cache-control") || "public, max-age=300";

  return new Response(data, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": cacheControl,
    },
  });
}
