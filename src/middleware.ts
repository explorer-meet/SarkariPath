import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const origin = request.headers.get("origin");
  const webOrigin = process.env.EXPO_WEB_ORIGIN;

  if (process.env.NODE_ENV !== "development" || !origin || origin !== webOrigin) {
    return NextResponse.next();
  }

  const headers = new Headers({
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Accept, Content-Type",
    Vary: "Origin",
  });

  if (request.method === "OPTIONS") {
    return new NextResponse(null, { status: 204, headers });
  }

  const response = NextResponse.next();
  headers.forEach((value, name) => response.headers.set(name, value));
  return response;
}

export const config = {
  matcher: "/api/:path*",
};
