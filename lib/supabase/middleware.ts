import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";
import type { JWTPayload, UserPrivilege, UserRole, RoutePermission } from "../types/auth";

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

// Define route permissions - what roles and privileges are required for each route
const ROUTE_PERMISSIONS: Record<string, RoutePermission> = {
  // CIN Admin only routes (global admin functions)
  "/view-all-organizations": { roles: ["cin_admin"], privileges: [] },
  "/view-all-users": { roles: ["cin_admin"], privileges: [] },
  "/organization-requests": { roles: ["cin_admin"], privileges: [] },
  "/mission-approvals": { roles: ["cin_admin"], privileges: [] },
  "/review-submissions": { roles: ["cin_admin"], privileges: [] },
  
  // Org Admin routes (organization management)
  "/add-organization-admins": { roles: ["org_admin"], privileges: [] },
  "/view-members": { roles: ["org_admin"], privileges: [] },
  "/join-requests": { roles: ["org_admin"], privileges: [] },
  
  // Mission management (requires mission_partners privilege)
  "/create-missions": { roles: ["org_admin"], privileges: ["mission_partners"] },
  "/manage-missions": { roles: ["org_admin"], privileges: ["mission_partners"] },
  
  // Reward management (requires reward_partners privilege)
  "/create-rewards": { roles: ["org_admin"], privileges: ["reward_partners"] },
  "/manage-rewards": { roles: ["org_admin"], privileges: ["reward_partners"] },
  
  // Event management (requires mobilizing_partners privilege)
  "/create-events": { roles: ["org_admin"], privileges: ["mobilizing_partners"] },
  "/scan-event-qr": { roles: ["org_admin"], privileges: ["mobilizing_partners"] },
  
  // Dashboard (accessible to both roles)
  "/dashboard": { roles: ["cin_admin", "org_admin"], privileges: [] },
};

// Helper function to check if user has required privileges
const hasRequiredPrivileges = (userPrivileges: UserPrivilege[], requiredPrivileges: string[]): boolean => {
  if (requiredPrivileges.length === 0) return true;
  
  return requiredPrivileges.every(required => 
    userPrivileges.some(priv => 
      priv.type === required && priv.status === 'approved'
    )
  );
};

// Helper function to check if user has required role
const hasRequiredRole = (userRoles: UserRole[], requiredRoles: string[]): boolean => {
  return requiredRoles.some(required => 
    userRoles.some(role => role.role === required)
  );
};

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

    let userRoles: UserRole[] = [];
    let userOrganizations = [];
    let userPrivileges: UserPrivilege[] = [];
    let isCinAdmin = false;
    let isOrgAdmin = false;

    if (session?.access_token) {
      try {
        const jwt = jwtDecode<JWTPayload>(session.access_token);
        userRoles = jwt.user_roles || [];
        userOrganizations = jwt.user_organizations || [];
        
        // Extract privileges from active organization
        const activeOrgId = jwt.active_organization_id;
        const activeOrg = userOrganizations.find((org: any) => org.id === activeOrgId);
        userPrivileges = activeOrg?.privileges || [];
        
        // Check if user has cin_admin role (global)
        isCinAdmin = userRoles.some((role: UserRole) => 
          role.role === 'cin_admin' && role.scope === 'global'
        );
        
        // Check if user has org_admin role (for any organization)
        isOrgAdmin = userRoles.some((role: UserRole) => 
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

      // Check if the current path requires specific permissions
      const routePermission = ROUTE_PERMISSIONS[path];
      
      if (routePermission) {
        // Check if user has required role
        const hasRole = hasRequiredRole(userRoles, routePermission.roles);
        
        // Check if user has required privileges (if any)
        const hasPrivileges = hasRequiredPrivileges(userPrivileges, routePermission.privileges);
        
        if (!hasRole) {
          // User doesn't have required role - redirect to dashboard with error
          const redirectUrl = new URL("/dashboard", request.url);
          redirectUrl.searchParams.set("error", "insufficient_role");
          redirectUrl.searchParams.set("required_role", routePermission.roles.join(","));
          return NextResponse.redirect(redirectUrl);
        }
        
        if (!hasPrivileges) {
          // User doesn't have required privileges - redirect to dashboard with error
          const redirectUrl = new URL("/dashboard", request.url);
          redirectUrl.searchParams.set("error", "insufficient_privileges");
          redirectUrl.searchParams.set("required_privileges", routePermission.privileges.join(","));
          return NextResponse.redirect(redirectUrl);
        }
      }

      // Protect dashboard routes - only authenticated org_admin or cin_admin can access
      if (path.startsWith("/dashboard") && !isCinAdmin && !isOrgAdmin) {
        return NextResponse.redirect(new URL("/sign-in", request.url));
      }

      // Prevent authenticated users from accessing auth pages
      if (["/sign-in", "/organization-signup", "/forgot-password"].includes(path)) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    } else if (!user.error) {
      // User is authenticated but doesn't have required roles (cin_admin or org_admin)
      // This could happen if user has other roles or is pending approval
      if (!PUBLIC_PATHS.includes(path)) {
        const redirectUrl = new URL("/dashboard", request.url);
        redirectUrl.searchParams.set("error", "no_admin_role");
        return NextResponse.redirect(redirectUrl);
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
