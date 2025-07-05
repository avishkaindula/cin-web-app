import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";

const PUBLIC_PATHS = [
  "/sign-in",
  "/organization-signup",
  "/forgot-password",
  "/reset-password",
  "/about",
  "/contact",
  "/help",
  "/how-it-works",
  "/privacy",
  "/terms",
  "/",
  "/auth/callback",
];

export const updateSession = async (request: NextRequest) => {
  try {
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            );
            response = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    const user = await supabase.auth.getUser();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    let userRole;

    if (session?.access_token) {
      try {
        const jwt = jwtDecode(session.access_token) as any;
        userRole = jwt.user_role;
      } catch (e) {
        // If JWT decoding fails, continue without role
      }
    }

    const path = request.nextUrl.pathname;

    // If not authenticated and not on a public path, redirect to sign-in
    if (user.error && !PUBLIC_PATHS.includes(path)) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    // If authenticated, handle role-based routing
    if (!user.error && userRole) {
      // Handle root path redirection
      if (path === "/") {
        switch (userRole) {
          case "user":
            return NextResponse.redirect(new URL("/dashboard", request.url));
          case "user_inactive":
            return NextResponse.redirect(
              new URL("/account-suspended", request.url)
            );
          case "org_admin_active":
            return NextResponse.redirect(
              new URL("/org-admin/organization-dashboard", request.url)
            );
          case "org_admin_pending":
            return NextResponse.redirect(
              new URL("/pending-approval", request.url)
            );
          case "org_admin_inactive":
            return NextResponse.redirect(
              new URL("/application-rejected", request.url)
            );
          case "cin_admin":
            return NextResponse.redirect(
              new URL("/cin-admin/dashboard", request.url)
            );
          case "super_admin":
            return NextResponse.redirect(
              new URL("/super-admin/super-admin-dashboard", request.url)
            );
          default:
            return NextResponse.redirect(new URL("/sign-in", request.url));
        }
      }

      // Role-based access control
      if (path.startsWith("/org-admin") && userRole !== "org_admin_active") {
        if (userRole === "org_admin_pending") {
          return NextResponse.redirect(
            new URL("/pending-approval", request.url)
          );
        } else if (userRole === "org_admin_inactive") {
          return NextResponse.redirect(
            new URL("/application-rejected", request.url)
          );
        } else {
          return NextResponse.redirect(new URL("/sign-in", request.url));
        }
      }

      if (path.startsWith("/cin-admin") && userRole !== "cin_admin") {
        return NextResponse.redirect(new URL("/sign-in", request.url));
      }

      if (path.startsWith("/super-admin") && userRole !== "super_admin") {
        return NextResponse.redirect(new URL("/sign-in", request.url));
      }

      // Special redirections for inactive users
      if (
        userRole === "org_admin_inactive" &&
        path !== "/application-rejected" &&
        !PUBLIC_PATHS.includes(path)
      ) {
        return NextResponse.redirect(
          new URL("/application-rejected", request.url)
        );
      }

      if (
        userRole === "org_admin_pending" &&
        path !== "/pending-approval" &&
        !PUBLIC_PATHS.includes(path)
      ) {
        return NextResponse.redirect(new URL("/pending-approval", request.url));
      }

      if (
        userRole === "user_inactive" &&
        path !== "/account-suspended" &&
        !PUBLIC_PATHS.includes(path)
      ) {
        return NextResponse.redirect(
          new URL("/account-suspended", request.url)
        );
      }

      // Prevent authenticated users from accessing auth pages
      if (
        ["/sign-in", "/organization-signup", "/forgot-password"].includes(path)
      ) {
        switch (userRole) {
          case "org_admin_active":
            return NextResponse.redirect(
              new URL("/org-admin/organization-dashboard", request.url)
            );
          case "org_admin_pending":
            return NextResponse.redirect(
              new URL("/pending-approval", request.url)
            );
          case "org_admin_inactive":
            return NextResponse.redirect(
              new URL("/application-rejected", request.url)
            );
          case "cin_admin":
            return NextResponse.redirect(
              new URL("/cin-admin/dashboard", request.url)
            );
          case "super_admin":
            return NextResponse.redirect(
              new URL("/super-admin/super-admin-dashboard", request.url)
            );
          default:
            return NextResponse.redirect(new URL("/dashboard", request.url));
        }
      }
    }

    return response;
  } catch (e) {
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
};
