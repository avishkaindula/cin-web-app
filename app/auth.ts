"use server";

import { encodedRedirect } from "@/lib/utils";
import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { jwtDecode } from "jwt-decode";

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const adminName = formData.get("adminName")?.toString();
  const organizationName = formData.get("organizationName")?.toString();
  const phone = formData.get("phone")?.toString();
  const address = formData.get("address")?.toString();
  const confirmPassword = formData.get("confirmPassword")?.toString();

  // Get selected privileges from checkboxes
  const selectedPrivileges = formData.getAll("privileges");
  const permissionTypes =
    selectedPrivileges.length > 0
      ? selectedPrivileges.join(",")
      : "mobilizing_partners"; // Default to mobilizing_partners if nothing selected

  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  if (!email || !password) {
    return encodedRedirect(
      "error",
      "/organization-signup",
      "Email and password are required"
    );
  }
  if (!adminName || !organizationName) {
    return encodedRedirect(
      "error",
      "/organization-signup",
      "Admin name and organization name are required"
    );
  }
  if (password !== confirmPassword) {
    return encodedRedirect(
      "error",
      "/organization-signup",
      "Passwords do not match"
    );
  }

  // This web app only handles organization signups - users sign up via mobile app
  // New organizations get org_admin role with pending privileges by default
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      data: {
        user_type: "admin",
        full_name: adminName,
        phone,
        address,
        organization_name: organizationName,
        permission_types: permissionTypes, // Use selected privileges
      },
    },
  });

  if (error) {
    console.error(error.code + " " + error.message);
    return encodedRedirect("error", "/organization-signup", error.message);
  } else {
    return encodedRedirect(
      "success",
      "/organization-signup",
      "Thanks for signing up! Please check your email for a verification link."
    );
  }
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const {
    error,
    data: { session },
  } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }

  // Redirect based on role - All authenticated users go to common dashboard
  // In the new system, both cin_admin and org_admin use the unified dashboard
  return redirect("/dashboard");
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Could not reset password"
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password."
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    encodedRedirect(
      "error",
      "/reset-password",
      "Password and confirm password are required"
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect("error", "/reset-password", "Passwords do not match");
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect("error", "/reset-password", "Password update failed");
  }

  encodedRedirect("success", "/reset-password", "Password updated");
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};
