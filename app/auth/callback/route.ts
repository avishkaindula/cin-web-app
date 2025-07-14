import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";

export async function GET(request: Request) {
  // The `/auth/callback` route is required for the server-side auth flow implemented
  // by the SSR package. It exchanges an auth code for the user's session.
  // https://supabase.com/docs/guides/auth/server-side/nextjs
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const origin = requestUrl.origin;
  const redirectTo = requestUrl.searchParams.get("redirect_to")?.toString();

  let userRole: string | undefined;

  if (code) {
    const supabase = await createClient();
    const {
      data: { session },
    } = await supabase.auth.exchangeCodeForSession(code);

    if (session?.access_token) {
      // Decode the JWT to get the user_role
      const jwt: any = jwtDecode(session.access_token);
      userRole = jwt.user_role;
    }
  }

  // Redirect based on redirectTo if present
  if (redirectTo) {
    return NextResponse.redirect(`${origin}${redirectTo}`);
  }

  // Redirect based on userRole for Climate Intelligence Network
  switch (userRole) {
    case "org_admin":
      return NextResponse.redirect(`${origin}/dashboard/dashboard`);
    case "cin_admin":
      return NextResponse.redirect(`${origin}/dashboard/dashboard`);
    case "org_admin_pending":
      return NextResponse.redirect(`${origin}/pending-approval`);
    case "org_admin_inactive":
      return NextResponse.redirect(`${origin}/application-rejected`);
    case "user_inactive":
      return NextResponse.redirect(`${origin}/account-suspended`);
    default:
      // Default redirect for unknown roles or no role
      return NextResponse.redirect(`${origin}/dashboard/dashboard`);
  }
}
