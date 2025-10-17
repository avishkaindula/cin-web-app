"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export interface RedemptionWithDetails {
  id: string;
  user_id: string;
  reward_id: string;
  points_spent: number;
  status: "pending" | "approved" | "rejected" | "fulfilled";
  redemption_notes: string | null;
  review_notes: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  fulfilled_at: string | null;
  created_at: string;
  rewards: {
    title: string;
    description: string;
    type: string;
    category: string;
    value: string;
    points_cost: number;
  } | null;
  agent: {
    full_name: string | null;
    email: string | null;
  } | null;
}

export async function getRedemptions(status?: "pending" | "approved" | "rejected" | "fulfilled") {
  const supabase = await createClient();

  let query = supabase
    .from("reward_redemptions")
    .select(
      `
      *,
      rewards:reward_id (
        title,
        description,
        type,
        category,
        value,
        points_cost
      )
    `
    )
    .order("created_at", { ascending: false });

  if (status) {
    query = query.eq("status", status);
  }

  const { data: redemptions, error } = await query;

  if (error) {
    console.error("Error fetching redemptions:", error);
    return { data: null, error: error.message };
  }

  if (!redemptions) {
    return { data: [], error: null };
  }

  // Fetch agent details for each redemption
  const redemptionsWithAgents = await Promise.all(
    redemptions.map(async (redemption) => {
      const { data: agent } = await supabase
        .from("agents")
        .select("full_name, email")
        .eq("id", redemption.user_id)
        .single();

      return {
        ...redemption,
        agent: agent || null,
      } as RedemptionWithDetails;
    })
  );

  return { data: redemptionsWithAgents, error: null };
}

export async function getRedemptionStats() {
  const supabase = await createClient();

  const [
    { count: totalCount },
    { count: pendingCount },
    { count: approvedCount },
    { count: fulfilledCount },
    { count: rejectedCount },
  ] = await Promise.all([
    supabase.from("reward_redemptions").select("*", { count: "exact", head: true }),
    supabase
      .from("reward_redemptions")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending"),
    supabase
      .from("reward_redemptions")
      .select("*", { count: "exact", head: true })
      .eq("status", "approved"),
    supabase
      .from("reward_redemptions")
      .select("*", { count: "exact", head: true })
      .eq("status", "fulfilled"),
    supabase
      .from("reward_redemptions")
      .select("*", { count: "exact", head: true })
      .eq("status", "rejected"),
  ]);

  return {
    total: totalCount || 0,
    pending: pendingCount || 0,
    approved: approvedCount || 0,
    fulfilled: fulfilledCount || 0,
    rejected: rejectedCount || 0,
  };
}

export async function reviewRedemption(
  redemptionId: string,
  action: "approve" | "reject",
  adminNotes?: string
) {
  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: "Unauthorized" };
  }

  // Call the RPC function
  const { data, error } = await supabase.rpc("review_redemption", {
    p_redemption_id: redemptionId,
    p_status: action === "approve" ? "approved" : "rejected",
    p_review_notes: adminNotes || undefined,
  });

  if (error) {
    console.error("Error reviewing redemption:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/review-redemptions");
  return { success: true, error: null };
}
