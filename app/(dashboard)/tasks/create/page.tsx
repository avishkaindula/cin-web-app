"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { MultiStepForm } from "@/components/ui/multi-step-form"
import { RichTextEditor } from "@/components/ui/rich-text-editor"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Plus, Trash2, FileImage, Target, Users, AlertCircle } from "lucide-react"
import { taskCategories, fileTypes } from "@/lib/mock-data-extended"
import type { TaskFormData, FormField } from "@/lib/mock-data-extended"
import { useToast } from "@/hooks/use-toast"

export default function CreateTaskPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [formData, setFormData] = useState<TaskFormData>({
    basicInfo: {
      title: "",
      description: "",
      instructions: "",
      category: "",
      difficulty: "easy",
      pointsReward: 50,
    },
    settings: {
      maxSubmissionsPerUser: 1,
      cooldownPeriodDays: 0,
      locationRequired: false,
      targetLocation: "",
      locationRadiusKm: 10,
      fileUploadRequired: false,
      allowedFileTypes: [],
      maxFileSizeMB: 10,
      maxFilesPerSubmission: 3,
    },
    customFields: [],
    validationRules: {},
  })

  const [selectedTaskType, setSelectedTaskType] = useState<string>("")

  const updateBasicInfo = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      basicInfo: { ...prev.basicInfo, [field]: value },
    }))
  }

  const updateSettings = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      settings: { ...prev.settings, [field]: value },
    }))
  }

  const addCustomField = () => {
    const newField: FormField = {
      id: `field_${Date.now()}`,
      name: "",
      label: "",
      type: "text",
      required: false,
      options: [],
    }
    setFormData((prev) => ({
      ...prev,
      customFields: [...prev.customFields, newField],
    }))
  }

  const updateCustomField = (index: number, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      customFields: prev.customFields.map((f, i) => (i === index ? { ...f, [field]: value } : f)),
    }))
  }

  const removeCustomField = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      customFields: prev.customFields.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async () => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    toast({
      title: "Task Submitted",
      description: "Your task has been submitted for super admin approval.",
    })

    router.push("/tasks")
  }

  const taskTypes = [
    {
      id: "data_collection",
      name: "Data Collection",
      description: "Structured data entry and measurements",
      icon: <Target className="h-6 w-6 text-green-500" />,
    },
    {
      id: "photo_submission",
      name: "Photo Submission",
      description: "Image-based documentation tasks",
      icon: <FileImage className="h-6 w-6 text-blue-500" />,
    },
    {
      id: "survey",
      name: "Survey",
      description: "Questionnaire and feedback collection",
      icon: <Users className="h-6 w-6 text-purple-500" />,
    },
    {
      id: "observation",
      name: "Observation",
      description: "Field notes and qualitative documentation",
      icon: <AlertCircle className="h-6 w-6 text-orange-500" />,
    },
  ]

  const steps = [
    {
      id: "basic",
      title: "Basic Information",
      description: "Define the core details of your task",
      component: (
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Task Title *</Label>
            <Input
              id="title"
              placeholder="Enter a clear, descriptive title"
              value={formData.basicInfo.title}
              onChange={(e) => updateBasicInfo("title", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select value={formData.basicInfo.category} onValueChange={(value) => updateBasicInfo("category", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {taskCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="difficulty">Difficulty Level</Label>
              <Select
                value={formData.basicInfo.difficulty}
                onValueChange={(value) => updateBasicInfo("difficulty", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="points">Points Reward</Label>
              <Input
                id="points"
                type="number"
                min="1"
                max="1000"
                value={formData.basicInfo.pointsReward}
                onChange={(e) => updateBasicInfo("pointsReward", Number(e.target.value))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <RichTextEditor
              value={formData.basicInfo.description}
              onChange={(value) => updateBasicInfo("description", value)}
              placeholder="Describe what this task is about and why it's important..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="instructions">Instructions for Users</Label>
            <RichTextEditor
              value={formData.basicInfo.instructions}
              onChange={(value) => updateBasicInfo("instructions", value)}
              placeholder="Provide clear, step-by-step instructions for completing this task..."
            />
          </div>
        </div>
      ),
    },
    {
      id: "type",
      title: "Task Type & Requirements",
      description: "Choose the type of task and configure requirements",
      component: (
        <div className="space-y-6">
          <div className="space-y-4">
            <Label>Task Type *</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {taskTypes.map((type) => (
                <Card
                  key={type.id}
                  className={`cursor-pointer transition-colors ${
                    selectedTaskType === type.id ? "border-blue-500 bg-blue-50 dark:bg-blue-950" : ""
                  }`}
                  onClick={() => setSelectedTaskType(type.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      {type.icon}
                      <div>
                        <h3 className="font-medium">{type.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{type.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="fileUpload"
                checked={formData.settings.fileUploadRequired}
                onCheckedChange={(checked) => updateSettings("fileUploadRequired", checked)}
              />
              <Label htmlFor="fileUpload">Require file uploads</Label>
            </div>

            {formData.settings.fileUploadRequired && (
              <div className="ml-6 space-y-4 border-l-2 border-gray-200 pl-4">
                <div className="space-y-2">
                  <Label>Allowed File Types</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {fileTypes.map((type) => (
                      <div key={type.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={type.value}
                          checked={formData.settings.allowedFileTypes.includes(type.value)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              updateSettings("allowedFileTypes", [...formData.settings.allowedFileTypes, type.value])
                            } else {
                              updateSettings(
                                "allowedFileTypes",
                                formData.settings.allowedFileTypes.filter((t) => t !== type.value),
                              )
                            }
                          }}
                        />
                        <Label htmlFor={type.value} className="text-sm">
                          {type.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="maxSize">Max File Size (MB)</Label>
                    <Input
                      id="maxSize"
                      type="number"
                      min="1"
                      max="100"
                      value={formData.settings.maxFileSizeMB}
                      onChange={(e) => updateSettings("maxFileSizeMB", Number(e.target.value))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxFiles">Max Files per Submission</Label>
                    <Input
                      id="maxFiles"
                      type="number"
                      min="1"
                      max="10"
                      value={formData.settings.maxFilesPerSubmission}
                      onChange={(e) => updateSettings("maxFilesPerSubmission", Number(e.target.value))}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      id: "settings",
      title: "Submission Settings",
      description: "Configure submission limits and location requirements",
      component: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="maxSubmissions">Max Submissions per User</Label>
              <Input
                id="maxSubmissions"
                type="number"
                min="1"
                max="100"
                value={formData.settings.maxSubmissionsPerUser}
                onChange={(e) => updateSettings("maxSubmissionsPerUser", Number(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cooldown">Cooldown Period (Days)</Label>
              <Input
                id="cooldown"
                type="number"
                min="0"
                max="365"
                value={formData.settings.cooldownPeriodDays}
                onChange={(e) => updateSettings("cooldownPeriodDays", Number(e.target.value))}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="location"
                checked={formData.settings.locationRequired}
                onCheckedChange={(checked) => updateSettings("locationRequired", checked)}
              />
              <Label htmlFor="location">Require specific location</Label>
            </div>

            {formData.settings.locationRequired && (
              <div className="ml-6 space-y-4 border-l-2 border-gray-200 pl-4">
                <div className="space-y-2">
                  <Label htmlFor="targetLocation">Target Location</Label>
                  <Input
                    id="targetLocation"
                    placeholder="Enter address or location description"
                    value={formData.settings.targetLocation}
                    onChange={(e) => updateSettings("targetLocation", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="radius">Radius (Kilometers)</Label>
                  <Input
                    id="radius"
                    type="number"
                    min="1"
                    max="1000"
                    value={formData.settings.locationRadiusKm}
                    onChange={(e) => updateSettings("locationRadiusKm", Number(e.target.value))}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      id: "fields",
      title: "Custom Fields Builder",
      description: "Define additional data fields for user submissions",
      component: (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">Custom Data Fields</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Add custom fields that users must complete when submitting this task
              </p>
            </div>
            <Button onClick={addCustomField}>
              <Plus className="mr-2 h-4 w-4" />
              Add Field
            </Button>
          </div>

          <div className="space-y-4">
            {formData.customFields.map((field, index) => (
              <Card key={field.id}>
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label>Field Name</Label>
                      <Input
                        placeholder="field_name"
                        value={field.name}
                        onChange={(e) => updateCustomField(index, "name", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Display Label</Label>
                      <Input
                        placeholder="Field Label"
                        value={field.label}
                        onChange={(e) => updateCustomField(index, "label", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Field Type</Label>
                      <Select value={field.type} onValueChange={(value) => updateCustomField(index, "type", value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="text">Text</SelectItem>
                          <SelectItem value="number">Number</SelectItem>
                          <SelectItem value="date">Date</SelectItem>
                          <SelectItem value="dropdown">Dropdown</SelectItem>
                          <SelectItem value="checkbox">Checkbox</SelectItem>
                          <SelectItem value="file">File Upload</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-end space-x-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`required_${index}`}
                          checked={field.required}
                          onCheckedChange={(checked) => updateCustomField(index, "required", checked)}
                        />
                        <Label htmlFor={`required_${index}`} className="text-sm">
                          Required
                        </Label>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => removeCustomField(index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {field.type === "dropdown" && (
                    <div className="mt-4 space-y-2">
                      <Label>Dropdown Options (one per line)</Label>
                      <textarea
                        className="w-full p-2 border rounded-md"
                        rows={3}
                        placeholder="Option 1&#10;Option 2&#10;Option 3"
                        value={field.options?.join("\n") || ""}
                        onChange={(e) =>
                          updateCustomField(index, "options", e.target.value.split("\n").filter(Boolean))
                        }
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}

            {formData.customFields.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p>No custom fields added yet.</p>
                <p className="text-sm">Click "Add Field" to create custom data collection fields.</p>
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      id: "review",
      title: "Review & Submit",
      description: "Review your task configuration and submit for approval",
      component: (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Task Summary</CardTitle>
              <CardDescription>Review all settings before submitting for approval</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium">Basic Information</h4>
                <div className="mt-2 space-y-1 text-sm text-gray-600">
                  <p>
                    <strong>Title:</strong> {formData.basicInfo.title || "Not set"}
                  </p>
                  <p>
                    <strong>Category:</strong> {formData.basicInfo.category || "Not set"}
                  </p>
                  <p>
                    <strong>Difficulty:</strong>{" "}
                    <Badge
                      className={
                        formData.basicInfo.difficulty === "easy"
                          ? "bg-green-100 text-green-800"
                          : formData.basicInfo.difficulty === "medium"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }
                    >
                      {formData.basicInfo.difficulty}
                    </Badge>
                  </p>
                  <p>
                    <strong>Points:</strong> {formData.basicInfo.pointsReward}
                  </p>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium">Task Type & Requirements</h4>
                <div className="mt-2 space-y-1 text-sm text-gray-600">
                  <p>
                    <strong>Type:</strong> {selectedTaskType || "Not selected"}
                  </p>
                  <p>
                    <strong>File Upload Required:</strong> {formData.settings.fileUploadRequired ? "Yes" : "No"}
                  </p>
                  {formData.settings.fileUploadRequired && (
                    <>
                      <p>
                        <strong>Allowed Types:</strong> {formData.settings.allowedFileTypes.join(", ") || "None"}
                      </p>
                      <p>
                        <strong>Max Size:</strong> {formData.settings.maxFileSizeMB}MB
                      </p>
                      <p>
                        <strong>Max Files:</strong> {formData.settings.maxFilesPerSubmission}
                      </p>
                    </>
                  )}
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium">Submission Settings</h4>
                <div className="mt-2 space-y-1 text-sm text-gray-600">
                  <p>
                    <strong>Max Submissions per User:</strong> {formData.settings.maxSubmissionsPerUser}
                  </p>
                  <p>
                    <strong>Cooldown Period:</strong> {formData.settings.cooldownPeriodDays} days
                  </p>
                  <p>
                    <strong>Location Required:</strong> {formData.settings.locationRequired ? "Yes" : "No"}
                  </p>
                  {formData.settings.locationRequired && (
                    <>
                      <p>
                        <strong>Target Location:</strong> {formData.settings.targetLocation || "Not set"}
                      </p>
                      <p>
                        <strong>Radius:</strong> {formData.settings.locationRadiusKm}km
                      </p>
                    </>
                  )}
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium">Custom Fields ({formData.customFields.length})</h4>
                {formData.customFields.length > 0 ? (
                  <div className="mt-2 space-y-1 text-sm text-gray-600">
                    {formData.customFields.map((field, index) => (
                      <p key={index}>
                        <strong>{field.label || field.name}:</strong> {field.type}
                        {field.required && <span className="text-red-500"> (required)</span>}
                      </p>
                    ))}
                  </div>
                ) : (
                  <p className="mt-2 text-sm text-gray-500">No custom fields defined</p>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 dark:text-blue-100">Next Steps</h4>
            <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
              After submission, your task will be reviewed by super administrators. You'll receive a notification once
              it's approved or if changes are requested.
            </p>
          </div>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Create New Task</h2>
        <p className="text-gray-600 dark:text-gray-400">Design a climate action task for your organization members</p>
      </div>

      <MultiStepForm steps={steps} onComplete={handleSubmit} onSave={() => console.log("Saving draft...")} />
    </div>
  )
}
