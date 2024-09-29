import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  role: string;
}

const USER_PATHS = ["/profile", "/orders", "/cart", "/wishlist"];
const ADMIN_PATHS = ["/spanel"];

export const ROLES = {
  USER: "USER",
  ADMIN: "ADMIN",
};

const requiresAdminAccess = (path: string) => {
  return ADMIN_PATHS.some((adminPath) => path.startsWith(adminPath));
};

const requiresUserAccess = (path: string) => {
  return USER_PATHS.some((userPath) => path.startsWith(userPath));
};

// Fix: Check if the pathname starts with any protected path (user/admin paths)
const requiresLogin = (path: string) => {
  return [...USER_PATHS, ...ADMIN_PATHS].some((protectedPath) =>
    path.startsWith(protectedPath),
  );
};

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const tokenCookie = req.cookies.get("token");

  if (tokenCookie) {
    const token = tokenCookie.value;

    try {
      const decodedToken = jwtDecode<DecodedToken>(token);
      const userRole = decodedToken.role;

      // Redirect logged-in users away from login page
      if (pathname === "/login") {
        return NextResponse.redirect(new URL("/", req.url));
      }

      // Check for admin access
      if (requiresAdminAccess(pathname) && userRole !== ROLES.ADMIN) {
        return NextResponse.redirect(new URL("/login", req.url));
      }

      return NextResponse.next();
    } catch (error) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  } else {
    // If no token and user tries to access a protected path, redirect to login
    if (requiresLogin(pathname)) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/spanel/:path*", ...USER_PATHS],
};
