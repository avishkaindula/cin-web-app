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

    let userRoles = [];
    let userOrganizations = [];
    let isCinAdmin = false;
    let isOrgAdmin = false;

    if (session?.access_token) {
      try {
        const jwt = jwtDecode(session.access_token) as any;
        userRoles = jwt.user_roles || [];
        userOrganizations = jwt.user_organizations || [];
        
        // Check if user has cin_admin role (global)
        isCinAdmin = userRoles.some((role: any) => 
          role.role === 'cin_admin' && role.scope === 'global'
        );
        
        // Check if user has org_admin role (for any organization)
        isOrgAdmin = userRoles.some((role: any) => 
          role.role === 'org_admin' && role.scope === 'organization'
        );
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
    if (!user.error && (isCinAdmin || isOrgAdmin)) {
      // Handle root path redirection - all authenticated users go to unified dashboard
      if (path === "/") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }

      // Protect dashboard routes - only authenticated org_admin or cin_admin can access
      if (path.startsWith("/dashboard") && !isCinAdmin && !isOrgAdmin) {
        return NextResponse.redirect(new URL("/sign-in", request.url));
      }

      // Prevent authenticated users from accessing auth pages
      if (["/sign-in", "/organization-signup", "/forgot-password"].includes(path)) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
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
