import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  role: string;
}

const ADMIN_PATHS = ["/spanel"];
const PUBLIC_PATHS = ["/", "/login"];
export const ROLES = {
  USER: "USER",
  ADMIN: "ADMIN",
};

// Helper function to check if the route requires admin access
const requiresAdminAccess = (path: string) => {
  return ADMIN_PATHS.some((adminPath) => path.startsWith(adminPath));
};

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const tokenCookie = req.cookies.get("token");

  // If token is present, user is logged in
  if (tokenCookie) {
    const token = tokenCookie.value;

    try {
      // Decode the JWT token to extract the user role
      const decodedToken = jwtDecode<DecodedToken>(token);
      const userRole = decodedToken.role;

      // Redirect away from login page if user is authenticated
      if (pathname === "/login") {
        return NextResponse.redirect(new URL("/", req.url)); // Redirect to a logged-in area
      }

      // If the user is trying to access an admin path but isn't an admin, redirect to login
      if (requiresAdminAccess(pathname) && userRole !== ROLES.ADMIN) {
        return NextResponse.redirect(new URL("/login", req.url));
      }

      // Allow access to the requested path if all checks pass
      return NextResponse.next();
    } catch (error) {
      // In case of token decoding errors (e.g., invalid token), redirect to login
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // If no token and user tries to access a protected path, redirect to login
  if (!PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // If the user is not authenticated and they access public paths, allow it
  return NextResponse.next();
}

// Specify which paths the middleware should apply to
export const config = {
  matcher: ["/", "/login", "/spanel/:path*"], // Apply to root, login, and /spanel paths
};
