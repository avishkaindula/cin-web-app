"use server";

import { createClient } from "@/lib/supabase/server";
import { Database } from "@/lib/supabase/types";

type Reward = Database["public"]["Tables"]["rewards"]["Row"];
type RewardRedemption = Database["public"]["Tables"]["reward_redemptions"]["Row"];

export interface RewardWithStats extends Reward {
  totalClaimed: number;
  activeClaims: number;
  redemptionRate: string;
}

export async function getRewards() {
  try {
    const supabase = await createClient();

    // Get current user and session
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { error: "You must be logged in to view rewards" };
    }

    // Fetch rewards with redemption counts
    const { data: rewards, error: rewardsError } = await supabase
      .from("rewards")
      .select(
        `
        *,
        reward_redemptions (
          id,
          status
        )
      `
      )
      .order("created_at", { ascending: false });

    if (rewardsError) {
      console.error("Error fetching rewards:", rewardsError);
      return { error: "Failed to fetch rewards" };
    }

    // Calculate stats for each reward
    const rewardsWithStats: RewardWithStats[] = rewards.map((reward) => {
      const redemptions = reward.reward_redemptions || [];
      const totalClaimed = redemptions.length;
      const activeClaims = redemptions.filter(
        (r: any) => r.status === "pending" || r.status === "approved"
      ).length;

      // Calculate redemption rate
      let redemptionRate = "0%";
      if (reward.availability === "limited" && reward.quantity_available) {
        const percentage = Math.round(
          (totalClaimed / reward.quantity_available) * 100
        );
        redemptionRate = `${percentage}%`;
      } else if (totalClaimed > 0) {
        // For unlimited rewards, show usage rate based on active vs total
        const percentage = activeClaims > 0 
          ? Math.round((activeClaims / totalClaimed) * 100)
          : 100;
        redemptionRate = `${percentage}%`;
      }

      return {
        ...reward,
        totalClaimed,
        activeClaims,
        redemptionRate,
      };
    });

    return { data: rewardsWithStats };
  } catch (error) {
    console.error("Error in getRewards:", error);
    return { error: "An unexpected error occurred" };
  }
}

export async function updateRewardStatus(
  rewardId: string,
  newStatus: "active" | "paused" | "draft" | "expired"
) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { error: "You must be logged in" };
    }

    const { error: updateError } = await supabase
      .from("rewards")
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq("id", rewardId)
      .eq("created_by", user.id); // Ensure user can only update their own rewards

    if (updateError) {
      console.error("Error updating reward status:", updateError);
      return { error: "Failed to update reward status" };
    }

    return { success: true };
  } catch (error) {
    console.error("Error in updateRewardStatus:", error);
    return { error: "An unexpected error occurred" };
  }
}

export async function deleteReward(rewardId: string) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { error: "You must be logged in" };
    }

    // Only allow deleting draft rewards
    const { data: reward, error: fetchError } = await supabase
      .from("rewards")
      .select("status, created_by")
      .eq("id", rewardId)
      .single();

    if (fetchError || !reward) {
      return { error: "Reward not found" };
    }

    if (reward.created_by !== user.id) {
      return { error: "You can only delete your own rewards" };
    }

    if (reward.status !== "draft") {
      return { error: "Only draft rewards can be deleted" };
    }

    const { error: deleteError } = await supabase
      .from("rewards")
      .delete()
      .eq("id", rewardId);

    if (deleteError) {
      console.error("Error deleting reward:", deleteError);
      return { error: "Failed to delete reward" };
    }

    return { success: true };
  } catch (error) {
    console.error("Error in deleteReward:", error);
    return { error: "An unexpected error occurred" };
  }
}

export interface CreateRewardData {
  title: string;
  description: string;
  type: string;
  category: string;
  value?: string;
  points_cost: number;
  availability: "unlimited" | "limited";
  quantity_available?: number;
  expiry_date?: string;
  status: "draft" | "active";
}

export async function createReward(data: CreateRewardData) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { error: "You must be logged in to create rewards" };
    }

    // Validate required fields
    if (!data.title || data.title.trim().length === 0) {
      return { error: "Reward title is required" };
    }

    if (!data.description || data.description.trim().length === 0) {
      return { error: "Reward description is required" };
    }

    if (!data.type) {
      return { error: "Reward type is required" };
    }

    if (!data.category) {
      return { error: "Category is required" };
    }

    if (!data.points_cost || data.points_cost < 0) {
      return { error: "Valid points cost is required" };
    }

    if (data.availability === "limited" && (!data.quantity_available || data.quantity_available <= 0)) {
      return { error: "Quantity available is required for limited rewards" };
    }

    // Insert the reward
    const { data: newReward, error: insertError } = await supabase
      .from("rewards")
      .insert({
        title: data.title.trim(),
        description: data.description.trim(),
        type: data.type,
        category: data.category,
        value: data.value?.trim() || "",
        points_cost: data.points_cost,
        availability: data.availability,
        quantity_available: data.availability === "limited" ? data.quantity_available : null,
        quantity_claimed: 0,
        expiry_date: data.expiry_date || null,
        status: data.status,
        created_by: user.id,
      })
      .select()
      .single();

    if (insertError) {
      console.error("Error creating reward:", insertError);
      return { error: "Failed to create reward" };
    }

    return { success: true, data: newReward };
  } catch (error) {
    console.error("Error in createReward:", error);
    return { error: "An unexpected error occurred" };
  }
}
