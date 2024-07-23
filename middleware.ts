import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value;
  const userRole = request.cookies.get("userRole")?.value;

  // console.log("middleware", { userRole });

  if (!accessToken) {
    console.log("redirecting to login");
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const pathname = request.nextUrl.pathname;

  if ((pathname === "/driver" || pathname === "/driver-route") && userRole !== "Driver") {
    console.log("Access denied for non-Driver user");
    return NextResponse.redirect(new URL("/allow-location", request.url));
  }
  if (pathname === "/passenger" && userRole !== "Passenger") {
    console.log("Access denied for non-Driver user");
    return NextResponse.redirect(new URL("/allow-location", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/passenger", "/driver", "/allow-location", "/driver-route"],
};
