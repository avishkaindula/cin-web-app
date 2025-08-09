"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

// Validation schemas
const StepSchema = z.object({
  id: z.string(),
  icon: z.string(),
  title: z.string().min(1, "Step title is required").max(15, "Step title must be 15 characters or less"),
  description: z.string().min(1, "Step description is required").max(100, "Step description must be 100 characters or less"),
});

const GuidanceStepSchema = z.object({
  id: z.string(),
  icon: z.string(),
  title: z.string().min(1, "Guidance step title is required").max(20, "Guidance step title must be 20 characters or less"),
  description: z.string().min(1, "Guidance step description is required").max(150, "Guidance step description must be 150 characters or less"),
  requiredEvidence: z.array(z.string()),
});

const MissionSchema = z.object({
  title: z.string().min(1, "Mission title is required"),
  description: z.string().min(1, "Mission description is required").max(300, "Mission description must be 300 characters or less"),
  points: z.coerce.number().min(1, "Points must be at least 1"),
  energy: z.coerce.number().min(1, "Energy must be at least 1"),
  instructions: z.array(StepSchema),
  guidanceSteps: z.array(GuidanceStepSchema),
});

export async function createMission(formData: FormData) {
  try {
    const supabase = await createClient();
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return { error: "You must be logged in to create missions" };
    }

    // Check if user has mission creation privileges
    const hasPermission = await supabase.rpc('authorize', {
      requested_permission: 'create_missions'
    });

    if (!hasPermission) {
      return { error: "You don't have permission to create missions" };
    }

    // Get user's active organization
    const { data: adminData } = await supabase
      .from('admins')
      .select('active_organization_id')
      .eq('id', user.id)
      .single();

    if (!adminData?.active_organization_id) {
      return { error: "No active organization found" };
    }

    // Parse and validate form data
    const rawData = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      points: formData.get("points") as string,
      energy: formData.get("energy") as string,
      instructions: JSON.parse(formData.get("instructions") as string || "[]"),
      guidanceSteps: JSON.parse(formData.get("guidanceSteps") as string || "[]"),
    };

    const validatedData = MissionSchema.parse(rawData);

    // Handle thumbnail upload
    let thumbnailUrl = null;
    const thumbnailFile = formData.get("thumbnail") as File | null;
    
    if (thumbnailFile && thumbnailFile.size > 0) {
      const fileExt = thumbnailFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('mission-content')
        .upload(`thumbnails/${fileName}`, thumbnailFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        return { error: "Failed to upload thumbnail image" };
      }

      // Get public URL for the uploaded image
      const { data: { publicUrl } } = supabase.storage
        .from('mission-content')
        .getPublicUrl(uploadData.path);
      
      thumbnailUrl = publicUrl;
    }

    // Create the mission
    const { data: missionData, error: missionError } = await supabase
      .from('missions')
      .insert({
        title: validatedData.title,
        description: validatedData.description,
        points_awarded: validatedData.points,
        energy_awarded: validatedData.energy,
        instructions: validatedData.instructions,
        guidance_steps: validatedData.guidanceSteps,
        thumbnail_url: thumbnailUrl,
        created_by: user.id,
        organization_id: adminData.active_organization_id,
        status: 'draft'
      })
      .select()
      .single();

    if (missionError) {
      console.error("Mission creation error:", missionError);
      return { error: "Failed to create mission" };
    }

    revalidatePath("/dashboard/missions");
    return { success: true, mission: missionData };

  } catch (error) {
    console.error("Error creating mission:", error);
    if (error instanceof z.ZodError) {
      return { error: "Validation failed: " + error.errors.map(e => e.message).join(", ") };
    }
    return { error: "An unexpected error occurred" };
  }
}

export async function publishMission(missionId: string) {
  try {
    const supabase = await createClient();
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return { error: "You must be logged in" };
    }

    // Update mission status to published
    const { error: updateError } = await supabase
      .from('missions')
      .update({ status: 'published' })
      .eq('id', missionId)
      .eq('created_by', user.id); // Ensure user can only publish their own missions

    if (updateError) {
      console.error("Publish error:", updateError);
      return { error: "Failed to publish mission" };
    }

    revalidatePath("/dashboard/missions");
    return { success: true };

  } catch (error) {
    console.error("Error publishing mission:", error);
    return { error: "An unexpected error occurred" };
  }
}
