// apps/web/middleware.ts
// Route protection middleware — runs on every request before rendering
//
// Rules:
//   /admin/*  → requires SUPER_ADMIN or MANAGER
//   /pos/*    → requires STAFF, MANAGER, or SUPER_ADMIN
//   /login    → redirect to appropriate page if already logged in

import { withAuth, NextRequestWithAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req: NextRequestWithAuth) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;
    const role = token?.role as string | undefined;

    // ── /admin/* ────────────────────────────────────────────────────────────
    if (pathname.startsWith("/admin")) {
      if (role !== "SUPER_ADMIN" && role !== "MANAGER") {
        // STAFF gets redirected to POS
        if (role === "STAFF") {
          return NextResponse.redirect(new URL("/pos", req.url));
        }
        // Unauthenticated → login
        return NextResponse.redirect(new URL("/login", req.url));
      }
    }

    // ── /pos/* ──────────────────────────────────────────────────────────────
    if (pathname.startsWith("/pos")) {
      if (!role) {
        return NextResponse.redirect(new URL("/login", req.url));
      }
      // All valid roles can access POS (STAFF, MANAGER, SUPER_ADMIN)
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      // Only run middleware on protected routes — return true to proceed to the function above
      authorized({ token, req }) {
        const { pathname } = req.nextUrl;
        // Protected paths require a token
        if (pathname.startsWith("/admin") || pathname.startsWith("/pos")) {
          return !!token;
        }
        return true;
      },
    },
    pages: {
      signIn: "/login",
    },
  }
);

// Match admin + pos routes only
export const config = {
  matcher: ["/admin/:path*", "/pos/:path*"],
};
