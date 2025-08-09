"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { jwtDecode } from "jwt-decode";

// JWT Payload type for decoding tokens
interface JWTPayload {
  active_organization_id?: string;
  user_roles?: Array<{
    role: string;
    scope: string;
    organization_id?: string;
  }>;
  user_organizations?: Array<{
    id: string;
    name: string;
    privileges: Array<{
      type: string;
      status: string;
    }>;
  }>;
}

// Types for mission management
export type MissionWithStats = {
  id: string;
  title: string;
  description: string;
  points_awarded: number;
  energy_awarded: number;
  status: string;
  is_featured: boolean;
  thumbnail_url: string | null;
  created_at: string;
  updated_at: string;
  organization_id: string;
  created_by: string;
  // Stats
  participants_count: number;
  submissions_count: number;
  completed_submissions_count: number;
};

export type MissionStats = {
  total_missions: number;
  active_missions: number;
  completed_missions: number;
  draft_missions: number;
  paused_missions: number;
  total_participants: number;
  total_submissions: number;
};

export async function getMissionStats(): Promise<{ data: MissionStats | null; error: string | null }> {
  try {
    const supabase = await createClient();
    
    // Check authentication and get session
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (authError || !user || !session?.access_token) {
      return { data: null, error: "Authentication required" };
    }

    // Decode JWT to get active organization
    let activeOrgId: string | null = null;
    try {
      const jwt = jwtDecode<JWTPayload>(session.access_token);
      activeOrgId = jwt.active_organization_id || null;
    } catch (jwtError) {
      return { data: null, error: "Invalid session token" };
    }

    if (!activeOrgId) {
      return { data: null, error: "No active organization found" };
    }

    // Get mission statistics
    const { data: missions, error: missionsError } = await supabase
      .from("missions")
      .select(`
        id,
        status,
        mission_submissions(
          id,
          agent_id,
          status
        )
      `)
      .eq("organization_id", activeOrgId);

    if (missionsError) {
      return { data: null, error: missionsError.message };
    }

    // Calculate stats
    const stats: MissionStats = {
      total_missions: missions.length,
      active_missions: missions.filter((m: any) => m.status === 'published').length,
      completed_missions: missions.filter((m: any) => m.status === 'completed').length,
      draft_missions: missions.filter((m: any) => m.status === 'draft').length,
      paused_missions: missions.filter((m: any) => m.status === 'paused').length,
      total_participants: 0,
      total_submissions: missions.reduce((sum: number, m: any) => 
        sum + (m.mission_submissions?.length || 0), 0),
    };

    // Calculate unique participants
    const uniqueParticipants = new Set();
    missions.forEach((mission: any) => {
      if (mission.mission_submissions) {
        mission.mission_submissions.forEach((submission: any) => {
          uniqueParticipants.add(submission.agent_id);
        });
      }
    });
    stats.total_participants = uniqueParticipants.size;

    return { data: stats, error: null };
  } catch (error) {
    console.error("Error fetching mission stats:", error);
    return { data: null, error: "Failed to fetch mission statistics" };
  }
}

export async function getOrganizationMissions(
  searchQuery?: string,
  statusFilter?: string
): Promise<{ data: MissionWithStats[] | null; error: string | null }> {
  try {
    const supabase = await createClient();
    
    // Check authentication and get session
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (authError || !user || !session?.access_token) {
      return { data: null, error: "Authentication required" };
    }

    // Decode JWT to get active organization
    let activeOrgId: string | null = null;
    try {
      const jwt = jwtDecode<JWTPayload>(session.access_token);
      activeOrgId = jwt.active_organization_id || null;
    } catch (jwtError) {
      return { data: null, error: "Invalid session token" };
    }

    if (!activeOrgId) {
      return { data: null, error: "No active organization found" };
    }

    // Build query
    let query = supabase
      .from("missions")
      .select(`
        id,
        title,
        description,
        points_awarded,
        energy_awarded,
        status,
        is_featured,
        thumbnail_url,
        created_at,
        updated_at,
        organization_id,
        created_by,
        mission_submissions(
          id,
          agent_id,
          status
        )
      `)
      .eq("organization_id", activeOrgId)
      .order("updated_at", { ascending: false });

    // Apply filters
    if (statusFilter && statusFilter !== "") {
      query = query.eq("status", statusFilter);
    }

    if (searchQuery && searchQuery.trim() !== "") {
      query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
    }

    const { data: missions, error: missionsError } = await query;

    if (missionsError) {
      return { data: null, error: missionsError.message };
    }

    // Transform data to include stats
    const missionsWithStats: MissionWithStats[] = missions.map((mission: any) => {
      const submissions = mission.mission_submissions || [];
      const uniqueParticipants = new Set(submissions.map((s: any) => s.agent_id));
      const completedSubmissions = submissions.filter((s: any) => s.status === 'approved');
      
      return {
        ...mission,
        participants_count: uniqueParticipants.size,
        submissions_count: submissions.length,
        completed_submissions_count: completedSubmissions.length,
      };
    });

    return { data: missionsWithStats, error: null };
  } catch (error) {
    console.error("Error fetching missions:", error);
    return { data: null, error: "Failed to fetch missions" };
  }
}

export async function updateMissionStatus(
  missionId: string, 
  newStatus: string
): Promise<{ success: boolean; error: string | null }> {
  try {
    const supabase = await createClient();
    
    // Check authentication and get session
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (authError || !user || !session?.access_token) {
      return { success: false, error: "Authentication required" };
    }

    // Decode JWT to get active organization
    let activeOrgId: string | null = null;
    try {
      const jwt = jwtDecode<JWTPayload>(session.access_token);
      activeOrgId = jwt.active_organization_id || null;
    } catch (jwtError) {
      return { success: false, error: "Invalid session token" };
    }

    if (!activeOrgId) {
      return { success: false, error: "No active organization found" };
    }

    // Verify mission belongs to user's organization
    const { data: mission, error: missionError } = await supabase
      .from("missions")
      .select("organization_id")
      .eq("id", missionId)
      .single();

    if (missionError || !mission) {
      return { success: false, error: "Mission not found" };
    }

    if (mission.organization_id !== activeOrgId) {
      return { success: false, error: "Unauthorized to modify this mission" };
    }

    // Update mission status
    const { error: updateError } = await supabase
      .from("missions")
      .update({ 
        status: newStatus,
        updated_at: new Date().toISOString()
      })
      .eq("id", missionId);

    if (updateError) {
      return { success: false, error: updateError.message };
    }

    revalidatePath("/manage-missions");
    return { success: true, error: null };
  } catch (error) {
    console.error("Error updating mission status:", error);
    return { success: false, error: "Failed to update mission status" };
  }
}

export async function deleteMission(missionId: string): Promise<{ success: boolean; error: string | null }> {
  try {
    const supabase = await createClient();
    
    // Check authentication and get session
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (authError || !user || !session?.access_token) {
      return { success: false, error: "Authentication required" };
    }

    // Decode JWT to get active organization
    let activeOrgId: string | null = null;
    try {
      const jwt = jwtDecode<JWTPayload>(session.access_token);
      activeOrgId = jwt.active_organization_id || null;
    } catch (jwtError) {
      return { success: false, error: "Invalid session token" };
    }

    if (!activeOrgId) {
      return { success: false, error: "No active organization found" };
    }

    // Verify mission belongs to user's organization and is in draft status
    const { data: mission, error: missionError } = await supabase
      .from("missions")
      .select("organization_id, status")
      .eq("id", missionId)
      .single();

    if (missionError || !mission) {
      return { success: false, error: "Mission not found" };
    }

    if (mission.organization_id !== activeOrgId) {
      return { success: false, error: "Unauthorized to delete this mission" };
    }

    // Only allow deletion of draft missions
    if (mission.status !== 'draft') {
      return { success: false, error: "Only draft missions can be deleted" };
    }

    // Delete mission (cascade will handle related records)
    const { error: deleteError } = await supabase
      .from("missions")
      .delete()
      .eq("id", missionId);

    if (deleteError) {
      return { success: false, error: deleteError.message };
    }

    revalidatePath("/manage-missions");
    return { success: true, error: null };
  } catch (error) {
    console.error("Error deleting mission:", error);
    return { success: false, error: "Failed to delete mission" };
  }
}
