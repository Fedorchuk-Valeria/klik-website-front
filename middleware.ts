import { ROOT_CITY, ROOT_DOMAIN } from "@/src/lib/env";
import { getCities } from "@/src/lib/getCities";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(req: NextRequest) {

    const host = req.headers.get("host") || "";

    const hostname = host.split(":")[0];

    const rootDomain = ROOT_DOMAIN.split(":")[0];

    let subdomain = ROOT_CITY;

    if (hostname.endsWith(`.${rootDomain}`)) {
        subdomain = hostname.replace(`.${rootDomain}`, "");
    } else if (
        hostname === rootDomain
    ) {
        subdomain = ROOT_CITY;
    }

  console.log("MIDDLEWARE", {
    host,
    pathname: req.nextUrl.pathname,
    subdomain,
  });

  const allowedCities = getCities();

  const isValidCity = allowedCities.some((city) => city.slug === subdomain);

  if (!isValidCity && subdomain !== ROOT_CITY) {
    const url = req.nextUrl.clone();
    url.pathname = "/404";
    const res = NextResponse.rewrite(url);
    res.headers.set("x-pathname", req.nextUrl.pathname);
    return res;
  }

  const res = NextResponse.next();
  res.headers.set("x-city", subdomain);
  res.headers.set("x-pathname", req.nextUrl.pathname);

  return res;
}

export const config = {
    matcher: [
        "/((?!_next|favicon.ico|.*\\..*).*)",
    ],
};
