import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // The `/auth/callback` route is required for the server-side auth flow implemented
  // by the SSR package. It exchanges an auth code for the user's session.
  // https://supabase.com/docs/guides/auth/server-side/nextjs
  const requestUrl = new URL(request.url);
  const origin = requestUrl.origin;
  const redirectTo = requestUrl.searchParams.get("redirect_to")?.toString();

  // Redirect based on redirectTo if present
  if (redirectTo) {
    return NextResponse.redirect(`${origin}${redirectTo}`);
  }

  return NextResponse.redirect(`${origin}/dashboard`);
}
