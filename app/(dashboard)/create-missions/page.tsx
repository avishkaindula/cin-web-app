"use client";

import React, { useState, useTransition } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { FileUploadZone } from "@/components/ui/file-upload-zone";
import {
  Target,
  Plus,
  X,
  Image,
  FileText,
  Leaf,
  Recycle,
  Eye,
  TreePine,
  Megaphone,
  Zap,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/auth-context";
import { createMission, publishMission } from "./actions";
import { useRouter } from "next/navigation";

// Evidence types
const evidenceTypes = [
  { value: "photo", label: "Photo" },
  { value: "video", label: "Video" },
  { value: "document", label: "Document/File" },
  { value: "audio", label: "Audio Recording" },
  { value: "text", label: "Text Input" },
  { value: "gps", label: "GPS Location" },
  { value: "none", label: "None (Attendance Only)" },
];

// Available icons for steps
const stepIcons = [
  { name: "target", icon: Target },
  { name: "leaf", icon: Leaf },
  { name: "recycle", icon: Recycle },
  { name: "eye", icon: Eye },
  { name: "tree", icon: TreePine },
  { name: "megaphone", icon: Megaphone },
  { name: "image", icon: Image },
  { name: "file", icon: FileText },
  { name: "map", icon: MapPin },
  { name: "clock", icon: Clock },
];

// Form state interfaces
interface MissionStep {
  id: string;
  icon: string;
  title: string;
  description: string;
}

interface GuidanceStep {
  id: string;
  icon: string;
  title: string;
  description: string;
  requiredEvidence: string[];
}

export default function CreateMissionsPage() {
  const { user, hasPrivilege, isLoading } = useAuth();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Form state
  const [steps, setSteps] = useState<MissionStep[]>([]);
  const [guidanceSteps, setGuidanceSteps] = useState<GuidanceStep[]>([]);
  const [showIconSelector, setShowIconSelector] = useState<string | null>(null);
  const [showGuidanceIconSelector, setShowGuidanceIconSelector] = useState<
    string | null
  >(null);
  const [thumbnailFiles, setThumbnailFiles] = useState<File[]>([]);
  const [createdMissionId, setCreatedMissionId] = useState<string | null>(null);

  // Form data state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    points: "",
    energy: "",
  });

  // Check permissions
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    router.push("/auth/sign-in");
    return null;
  }

  if (!hasPrivilege("mission_partners")) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="p-6">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Access Denied
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              You need mission partner privileges to create missions.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  const addStep = () => {
    const newStep: MissionStep = {
      id: `step-${Date.now()}`,
      icon: "target",
      title: "",
      description: "",
    };
    setSteps([...steps, newStep]);
  };

  const updateStep = (id: string, field: keyof MissionStep, value: string) => {
    setSteps(
      steps.map((step) => (step.id === id ? { ...step, [field]: value } : step))
    );
  };

  const removeStep = (id: string) => {
    setSteps(steps.filter((step) => step.id !== id));
  };

  // Guidance Steps Functions
  const addGuidanceStep = () => {
    const newGuidanceStep: GuidanceStep = {
      id: `guidance-${Date.now()}`,
      icon: "target",
      title: "",
      description: "",
      requiredEvidence: [],
    };
    setGuidanceSteps([...guidanceSteps, newGuidanceStep]);
  };

  const updateGuidanceStep = (
    id: string,
    field: keyof GuidanceStep,
    value: string | string[]
  ) => {
    setGuidanceSteps(
      guidanceSteps.map((step) =>
        step.id === id ? { ...step, [field]: value } : step
      )
    );
  };

  const removeGuidanceStep = (id: string) => {
    setGuidanceSteps(guidanceSteps.filter((step) => step.id !== id));
  };

  const handleGuidanceEvidenceChange = (
    stepId: string,
    evidenceType: string,
    checked: boolean
  ) => {
    const step = guidanceSteps.find((s) => s.id === stepId);
    if (!step) return;

    let newEvidence: string[];
    if (checked) {
      newEvidence = [...step.requiredEvidence, evidenceType];
    } else {
      newEvidence = step.requiredEvidence.filter((e) => e !== evidenceType);
    }

    updateGuidanceStep(stepId, "requiredEvidence", newEvidence);
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (
      !formData.title ||
      !formData.description ||
      !formData.points ||
      !formData.energy
    ) {
      console.log("❌ Validation failed - missing required fields");
      toast.error(
        "Please fill in all required fields including points and energy"
      );
      return;
    }

    if (isPending) {
      console.log("⏳ Already pending, skipping submission");
      return;
    }

    console.log("🚀 Starting form submission...");
    startTransition(async () => {
      try {
        const submitFormData = new FormData();
        submitFormData.append("title", formData.title);
        submitFormData.append("description", formData.description);
        submitFormData.append("points", formData.points);
        submitFormData.append("energy", formData.energy);
        submitFormData.append("instructions", JSON.stringify(steps));
        submitFormData.append("guidanceSteps", JSON.stringify(guidanceSteps));

        if (thumbnailFiles[0]) {
          submitFormData.append("thumbnail", thumbnailFiles[0]);
          console.log("🖼️ Added thumbnail to FormData");
        }

        console.log("📤 Calling createMission action...");
        const result = await createMission(submitFormData);
        console.log("📥 Action result:", result);

        if (result.error) {
          console.log("❌ Server error:", result.error);
          toast.error(result.error);
        } else if (result.success && result.mission) {
          console.log("✅ Mission created successfully:", result.mission);
          toast.success("Mission created successfully!");
          setCreatedMissionId(result.mission.id);
        } else {
          console.log("⚠️ Unexpected result format:", result);
          toast.error("Unexpected response from server");
        }
      } catch (error) {
        console.error("❌ Client-side error submitting form:", error);
        toast.error("An unexpected error occurred");
      }
    });
  };

  const handlePublish = async () => {
    if (!createdMissionId || isPending) return;

    startTransition(async () => {
      try {
        const result = await publishMission(createdMissionId);

        if (result.error) {
          toast.error(result.error);
        } else if (result.success) {
          toast.success("Mission published successfully!");
          router.push("/manage-missions");
        }
      } catch (error) {
        console.error("Error publishing mission:", error);
        toast.error("An unexpected error occurred");
      }
    });
  };

  const clearForm = () => {
    setFormData({
      title: "",
      description: "",
      points: "",
      energy: "",
    });
    setSteps([]);
    setGuidanceSteps([]);
    setThumbnailFiles([]);
    setCreatedMissionId(null);
    toast.success("Form cleared");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Mission Creator
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Create comprehensive climate action missions for the community
          </p>
        </div>
      </div>

      {/* Create Mission Form */}
      <Card>
        <CardHeader>
          <CardTitle>Create New Mission</CardTitle>
          <CardDescription>
            Design impactful climate missions with detailed instructions and
            requirements
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Core Fields */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold border-b pb-2">
              Core Mission Information
            </h3>

            {/* Mission Title */}
            <div>
              <Label htmlFor="title">Mission Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="e.g., Beach Cleanup at Galle Face Green"
                className="mt-1"
              />
            </div>

            {/* Mission Description */}
            <div>
              <Label htmlFor="description">Mission Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Explain the purpose and importance of the mission..."
                maxLength={300}
                rows={4}
                className="mt-1"
              />
              <p className="text-sm text-gray-500 mt-1">
                {formData.description.length}/300 characters
              </p>
            </div>

            {/* Detailed Instructions */}
            <div>
              <Label className="text-base font-semibold">
                Detailed Instructions
              </Label>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Add step-by-step instructions for volunteers
              </p>

              {steps.map((step, index) => (
                <div key={step.id} className="border rounded-lg p-4 mb-3">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowIconSelector(step.id)}
                        className="w-10 h-10 p-0"
                      >
                        {React.createElement(
                          stepIcons.find((icon) => icon.name === step.icon)
                            ?.icon || Target,
                          { className: "h-4 w-4" }
                        )}
                      </Button>

                      {showIconSelector === step.id && (
                        <div className="absolute z-10 mt-2 p-3 bg-white dark:bg-gray-800 border rounded-lg shadow-lg">
                          <div className="grid grid-cols-5 gap-2 mb-2">
                            {stepIcons.map((iconOption) => (
                              <Button
                                key={iconOption.name}
                                variant="ghost"
                                size="sm"
                                className="w-8 h-8 p-0"
                                onClick={() => {
                                  updateStep(step.id, "icon", iconOption.name);
                                  setShowIconSelector(null);
                                }}
                              >
                                {React.createElement(iconOption.icon, {
                                  className: "h-4 w-4",
                                })}
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 space-y-3">
                      <div>
                        <Label>Step Title</Label>
                        <Input
                          value={step.title}
                          onChange={(e) =>
                            updateStep(step.id, "title", e.target.value)
                          }
                          placeholder="e.g., Gather Materials"
                          maxLength={15}
                        />
                        <p className="text-xs text-gray-500">
                          {step.title.length}/15 characters
                        </p>
                      </div>

                      <div>
                        <Label>Step Description</Label>
                        <Textarea
                          value={step.description}
                          onChange={(e) =>
                            updateStep(step.id, "description", e.target.value)
                          }
                          placeholder="Detailed instructions for this step..."
                          maxLength={100}
                          rows={2}
                        />
                        <p className="text-xs text-gray-500">
                          {step.description.length}/100 characters
                        </p>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeStep(step.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}

              <Button variant="outline" onClick={addStep}>
                <Plus className="h-4 w-4 mr-2" />
                Add Step
              </Button>
            </div>

            {/* Guidance Steps */}
            <div>
              <Label className="text-base font-semibold">
                Guidance Steps with Evidence Requirements
              </Label>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Define guidance steps and specify what evidence volunteers need
                to submit for each step
              </p>

              {guidanceSteps.map((step, index) => (
                <div
                  key={step.id}
                  className="border rounded-lg p-4 mb-3 bg-blue-50 dark:bg-blue-950"
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowGuidanceIconSelector(step.id)}
                        className="w-10 h-10 p-0"
                      >
                        {React.createElement(
                          stepIcons.find((icon) => icon.name === step.icon)
                            ?.icon || Target,
                          { className: "h-4 w-4" }
                        )}
                      </Button>

                      {showGuidanceIconSelector === step.id && (
                        <div className="absolute z-10 mt-2 p-3 bg-white dark:bg-gray-800 border rounded-lg shadow-lg">
                          <div className="grid grid-cols-5 gap-2 mb-2">
                            {stepIcons.map((iconOption) => (
                              <Button
                                key={iconOption.name}
                                variant="ghost"
                                size="sm"
                                className="w-8 h-8 p-0"
                                onClick={() => {
                                  updateGuidanceStep(
                                    step.id,
                                    "icon",
                                    iconOption.name
                                  );
                                  setShowGuidanceIconSelector(null);
                                }}
                              >
                                {React.createElement(iconOption.icon, {
                                  className: "h-4 w-4",
                                })}
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 space-y-3">
                      <div>
                        <Label>Guidance Step Title</Label>
                        <Input
                          value={step.title}
                          onChange={(e) =>
                            updateGuidanceStep(step.id, "title", e.target.value)
                          }
                          placeholder="e.g., Document Species Found"
                          maxLength={20}
                        />
                        <p className="text-xs text-gray-500">
                          {step.title.length}/20 characters
                        </p>
                      </div>

                      <div>
                        <Label>Guidance Description</Label>
                        <Textarea
                          value={step.description}
                          onChange={(e) =>
                            updateGuidanceStep(
                              step.id,
                              "description",
                              e.target.value
                            )
                          }
                          placeholder="Explain what volunteers should do and how to document it..."
                          maxLength={150}
                          rows={2}
                        />
                        <p className="text-xs text-gray-500">
                          {step.description.length}/150 characters
                        </p>
                      </div>

                      <div>
                        <Label className="font-medium">
                          Required Evidence for This Step
                        </Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                          {evidenceTypes
                            .filter((e) => e.value !== "none")
                            .map((evidence) => (
                              <div
                                key={evidence.value}
                                className="flex items-center space-x-2"
                              >
                                <Checkbox
                                  id={`${step.id}-${evidence.value}`}
                                  checked={step.requiredEvidence.includes(
                                    evidence.value
                                  )}
                                  onCheckedChange={(checked) =>
                                    handleGuidanceEvidenceChange(
                                      step.id,
                                      evidence.value,
                                      checked as boolean
                                    )
                                  }
                                />
                                <Label
                                  htmlFor={`${step.id}-${evidence.value}`}
                                  className="text-sm"
                                >
                                  {evidence.label}
                                </Label>
                              </div>
                            ))}
                        </div>
                        {step.requiredEvidence.length > 0 && (
                          <div className="mt-2">
                            <div className="flex flex-wrap gap-1">
                              {step.requiredEvidence.map((evidence) => (
                                <Badge
                                  key={evidence}
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  {
                                    evidenceTypes.find(
                                      (e) => e.value === evidence
                                    )?.label
                                  }
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeGuidanceStep(step.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}

              <Button
                variant="outline"
                onClick={addGuidanceStep}
                className="border-blue-300 text-blue-700 hover:bg-blue-50 dark:border-blue-700 dark:text-blue-300 dark:hover:bg-blue-950"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Guidance Step
              </Button>
            </div>

            {/* Points, Experience and Mission Type */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="points">Points Awarded *</Label>
                <Input
                  id="points"
                  type="number"
                  value={formData.points}
                  onChange={(e) =>
                    setFormData({ ...formData, points: e.target.value })
                  }
                  placeholder="50"
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Regular points for completion
                </p>
              </div>

              <div>
                <Label htmlFor="energy">Energy *</Label>
                <Input
                  id="energy"
                  type="number"
                  value={formData.energy}
                  onChange={(e) =>
                    setFormData({ ...formData, energy: e.target.value })
                  }
                  placeholder="25"
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Energy points for completion
                </p>
              </div>
            </div>
            {/* Mission Thumbnail */}
            <div>
              <Label>Mission Thumbnail/Banner Image</Label>
              <FileUploadZone
                onFilesChange={(files) => setThumbnailFiles(files)}
                acceptedTypes={["image/*"]}
                maxFiles={1}
                maxSizeMB={5}
                className="mt-2"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4 pt-6 border-t">
            {!createdMissionId ? (
              <>
                <Button
                  onClick={handleSubmit}
                  disabled={isPending}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isPending ? "Creating..." : "Create Mission"}
                </Button>
                <Button
                  variant="ghost"
                  onClick={clearForm}
                  disabled={isPending}
                >
                  Clear Form
                </Button>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">
                    Mission Created Successfully!
                  </span>
                </div>
                <Button
                  onClick={handlePublish}
                  disabled={isPending}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isPending ? "Publishing..." : "Publish Mission"}
                </Button>
                <Button
                  variant="outline"
                  onClick={clearForm}
                  disabled={isPending}
                >
                  Create Another
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
