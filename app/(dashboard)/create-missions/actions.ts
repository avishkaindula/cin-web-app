"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
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

// Validation schemas
const StepSchema = z.object({
  id: z.string(),
  icon: z.string(),
  title: z
    .string()
    .min(1, "Step title is required")
    .max(15, "Step title must be 15 characters or less"),
  description: z
    .string()
    .min(1, "Step description is required")
    .max(100, "Step description must be 100 characters or less"),
});

const GuidanceStepSchema = z.object({
  id: z.string(),
  icon: z.string(),
  title: z
    .string()
    .min(1, "Guidance step title is required")
    .max(20, "Guidance step title must be 20 characters or less"),
  description: z
    .string()
    .min(1, "Guidance step description is required")
    .max(150, "Guidance step description must be 150 characters or less"),
  requiredEvidence: z.array(z.string()),
});

const MissionSchema = z.object({
  title: z.string().min(1, "Mission title is required"),
  description: z
    .string()
    .min(1, "Mission description is required")
    .max(300, "Mission description must be 300 characters or less"),
  points: z.coerce.number().min(1, "Points must be at least 1"),
  energy: z.coerce.number().min(1, "Energy must be at least 1"),
  instructions: z.array(StepSchema),
  guidanceSteps: z.array(GuidanceStepSchema),
});

export async function createMission(formData: FormData) {
  console.log("🚀 createMission called");

  try {
    const supabase = await createClient();
    console.log("✅ Supabase client created");

    // Get current user and session
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    console.log("👤 User lookup result:", { user: user?.id, error: userError });
    console.log("🎫 Session lookup result:", {
      session: !!session,
      error: sessionError,
    });

    if (userError || !user || !session?.access_token) {
      console.log("❌ Authentication failed");
      return { error: "You must be logged in to create missions" };
    }

    // Decode JWT to get active organization and check permissions
    let activeOrgId: string | null = null;
    let userPrivileges: Array<{ type: string; status: string }> = [];

    try {
      const jwt = jwtDecode<JWTPayload>(session.access_token);
      activeOrgId = jwt.active_organization_id || null;

      console.log("🎫 Decoded JWT - Active Org ID:", activeOrgId);
      console.log("🎫 User organizations:", jwt.user_organizations);

      // Get privileges from active organization
      if (activeOrgId && jwt.user_organizations) {
        const activeOrg = jwt.user_organizations.find(
          (org) => org.id === activeOrgId
        );
        userPrivileges = activeOrg?.privileges || [];
        console.log("🔐 User privileges in active org:", userPrivileges);
      }
    } catch (jwtError) {
      console.error("❌ JWT decode error:", jwtError);
      return { error: "Invalid session token" };
    }

    if (!activeOrgId) {
      console.log("❌ No active organization found in token");
      return { error: "No active organization found" };
    }

    // Check if user has mission creation privileges
    const hasMissionPartnerPrivilege = userPrivileges.some(
      (priv) => priv.type === "mission_partners" && priv.status === "approved"
    );

    console.log(
      "🔐 Has mission_partners privilege:",
      hasMissionPartnerPrivilege
    );

    if (!hasMissionPartnerPrivilege) {
      console.log("❌ Permission denied - no mission_partners privilege");
      return { error: "You don't have permission to create missions" };
    }

    // Parse and validate form data
    console.log("📝 Parsing form data...");
    const rawData = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      points: formData.get("points") as string,
      energy: formData.get("energy") as string,
      instructions: JSON.parse(
        (formData.get("instructions") as string) || "[]"
      ),
      guidanceSteps: JSON.parse(
        (formData.get("guidanceSteps") as string) || "[]"
      ),
    };

    console.log("📝 Raw form data:", rawData);

    const validatedData = MissionSchema.parse(rawData);
    console.log("✅ Data validation passed:", validatedData);

    // Handle thumbnail upload (simplified)
    console.log("🖼️ Processing thumbnail upload...");
    let thumbnailUrl = null;
    const thumbnailFile = formData.get("thumbnail") as File | null;

    console.log("🖼️ Thumbnail file:", {
      exists: !!thumbnailFile,
      size: thumbnailFile?.size,
      name: thumbnailFile?.name,
    });

    if (thumbnailFile && thumbnailFile.size > 0) {
      try {
        // Validate file type - reject SVG files
        const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
        if (!allowedTypes.includes(thumbnailFile.type)) {
          console.error("❌ Invalid file type:", thumbnailFile.type);
          console.log("⚠️ Continuing mission creation without thumbnail - SVG not supported");
        } else {
          const fileExt = thumbnailFile.name.split(".").pop();
          const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;

          console.log("📤 Uploading thumbnail as:", fileName);

          const { data: uploadData, error: uploadError } = await supabase.storage
            .from("mission-content")
            .upload(`thumbnails/${fileName}`, thumbnailFile, {
              cacheControl: "3600",
              upsert: false,
            });

          console.log("📤 Upload result:", { uploadData, uploadError });

          if (uploadError) {
            console.error("❌ Upload error:", uploadError);
            // Continue without thumbnail instead of failing the entire mission
            console.log("⚠️ Continuing mission creation without thumbnail");
          } else {
            // Store the file path instead of public URL for private storage
            thumbnailUrl = uploadData.path;
            console.log("🖼️ Thumbnail path stored:", thumbnailUrl);
          }
        }
      } catch (uploadError) {
        console.error("❌ Thumbnail upload exception:", uploadError);
        console.log("⚠️ Continuing mission creation without thumbnail");
      }
    }

    // Create the mission
    console.log("💾 Creating mission in database...");
    const missionData = {
      title: validatedData.title,
      description: validatedData.description,
      points_awarded: validatedData.points,
      energy_awarded: validatedData.energy,
      instructions: validatedData.instructions,
      guidance_steps: validatedData.guidanceSteps,
      thumbnail_path: thumbnailUrl,
      created_by: user.id,
      organization_id: activeOrgId,
      status: "draft",
    };

    console.log("💾 Mission data to insert:", missionData);

    const { data: resultMissionData, error: missionError } = await supabase
      .from("missions")
      .insert(missionData)
      .select()
      .single();

    console.log("💾 Database insert result:", {
      resultMissionData,
      missionError,
    });

    if (missionError) {
      console.error("❌ Mission creation error:", missionError);
      return { error: "Failed to create mission" };
    }

    console.log(
      "✅ Mission created successfully with ID:",
      resultMissionData.id
    );
    revalidatePath("/manage-missions");
    return { success: true, mission: resultMissionData };
  } catch (error) {
    console.error("❌ Unexpected error in createMission:", error);
    if (error instanceof z.ZodError) {
      console.error("❌ Validation errors:", error.errors);
      return {
        error:
          "Validation failed: " + error.errors.map((e) => e.message).join(", "),
      };
    }
    return { error: "An unexpected error occurred" };
  }
}

export async function publishMission(missionId: string) {
  try {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      return { error: "You must be logged in" };
    }

    // Update mission status to published
    const { error: updateError } = await supabase
      .from("missions")
      .update({ status: "published" })
      .eq("id", missionId)
      .eq("created_by", user.id); // Ensure user can only publish their own missions

    if (updateError) {
      console.error("Publish error:", updateError);
      return { error: "Failed to publish mission" };
    }

    revalidatePath("/manage-missions");
    return { success: true };
  } catch (error) {
    console.error("Error publishing mission:", error);
    return { error: "An unexpected error occurred" };
  }
}
