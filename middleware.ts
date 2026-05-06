import { ROOT_CITY, ROOT_DOMAIN } from "@/src/lib/env";
import { getCities } from "@/src/lib/getCities";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const host = req.headers.get("host") || "";

  let subdomain = host;

  if (subdomain === ROOT_DOMAIN) {
    subdomain = ROOT_CITY;
  }

  const allowedCities = getCities();

  const isValidCity = allowedCities.some((city) => city.slug === subdomain);

  if (!isValidCity && subdomain !== ROOT_CITY) {
    const url = req.nextUrl.clone();
    url.pathname = "/404";
    return NextResponse.rewrite(url);
  }

  const res = NextResponse.next();
  res.headers.set("x-city", subdomain);

  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
