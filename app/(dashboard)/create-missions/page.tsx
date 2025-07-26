"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileUploadZone } from "@/components/ui/file-upload-zone";
import { 
  Target, 
  Calendar, 
  MapPin, 
  Award,
  Clock,
  Plus,
  Edit,
  Trash2,
  Users,
  X,
  Search,
  Image,
  FileText,
  Leaf,
  Recycle,
  Eye,
  TreePine,
  Megaphone,
  Zap
} from "lucide-react";
import { toast } from "sonner";

// Mission types and their icons
const missionTypes = [
  { value: "citizen-science", label: "Citizen Science Data Collection", icon: Target },
  { value: "cleanup", label: "Cleanup & Waste Management", icon: Recycle },
  { value: "monitoring", label: "Monitoring & Reporting", icon: Eye },
  { value: "reforestation", label: "Reforestation & Habitat Restoration", icon: TreePine },
  { value: "awareness", label: "Awareness & Education Campaigns", icon: Megaphone },
  { value: "energy-audit", label: "Energy & Resource Audits", icon: Zap }
];

// Evidence types
const evidenceTypes = [
  { value: "photo", label: "Photo" },
  { value: "video", label: "Video" },
  { value: "text", label: "Text Input" },
  { value: "gps", label: "GPS Location" },
  { value: "none", label: "None (Attendance Only)" }
];

// Location types
const locationTypes = [
  { value: "coordinates", label: "Specific Coordinates" },
  { value: "general", label: "General Area" },
  { value: "current", label: "User's Current Location" }
];

// Available icons for steps (subset for demo)
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
  { name: "clock", icon: Clock }
];

// Form state interface
interface MissionStep {
  id: string;
  icon: string;
  title: string;
  description: string;
}

interface DataField {
  id: string;
  name: string;
  type: 'text' | 'number' | 'decimal' | 'dropdown' | 'checkbox' | 'date' | 'time';
  required: boolean;
  options?: string[];
}

export default function CreateMissionsPage() {
  const [missionType, setMissionType] = useState<string>("");
  const [selectedEvidence, setSelectedEvidence] = useState<string[]>([]);
  const [locationType, setLocationType] = useState<string>("");
  const [steps, setSteps] = useState<MissionStep[]>([]);
  const [dataFields, setDataFields] = useState<DataField[]>([]);
  const [showIconSelector, setShowIconSelector] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Form data state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    points: "",
    thumbnailImage: null as File | null,
    locationName: "",
    latitude: "",
    longitude: "",
    geofenceRadius: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    repeatFrequency: "",
    status: "draft"
  });

  const addStep = () => {
    const newStep: MissionStep = {
      id: `step-${Date.now()}`,
      icon: "target",
      title: "",
      description: ""
    };
    setSteps([...steps, newStep]);
  };

  const updateStep = (id: string, field: keyof MissionStep, value: string) => {
    setSteps(steps.map(step => 
      step.id === id ? { ...step, [field]: value } : step
    ));
  };

  const removeStep = (id: string) => {
    setSteps(steps.filter(step => step.id !== id));
  };

  const addDataField = () => {
    const newField: DataField = {
      id: `field-${Date.now()}`,
      name: "",
      type: "text",
      required: false,
      options: []
    };
    setDataFields([...dataFields, newField]);
  };

  const updateDataField = (id: string, field: keyof DataField, value: any) => {
    setDataFields(dataFields.map(df => 
      df.id === id ? { ...df, [field]: value } : df
    ));
  };

  const removeDataField = (id: string) => {
    setDataFields(dataFields.filter(df => df.id !== id));
  };

  const handleEvidenceChange = (evidenceType: string, checked: boolean) => {
    if (checked) {
      setSelectedEvidence([...selectedEvidence, evidenceType]);
    } else {
      setSelectedEvidence(selectedEvidence.filter(e => e !== evidenceType));
    }
  };

  const handleSubmit = () => {
    // Validate required fields
    if (!formData.title || !formData.description || !missionType) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    toast.success("Mission created successfully!");
  };

  const renderConditionalFields = () => {
    switch (missionType) {
      case "citizen-science":
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-semibold">Data Fields to Collect</Label>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Define what data volunteers should collect
              </p>
              {dataFields.map((field) => (
                <div key={field.id} className="border rounded-lg p-4 mb-3">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                    <div>
                      <Label>Field Name</Label>
                      <Input
                        value={field.name}
                        onChange={(e) => updateDataField(field.id, 'name', e.target.value)}
                        placeholder="e.g., Species Name"
                      />
                    </div>
                    <div>
                      <Label>Field Type</Label>
                      <Select 
                        value={field.type} 
                        onValueChange={(value) => updateDataField(field.id, 'type', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="text">Text</SelectItem>
                          <SelectItem value="number">Number</SelectItem>
                          <SelectItem value="decimal">Decimal</SelectItem>
                          <SelectItem value="dropdown">Single Choice (Dropdown)</SelectItem>
                          <SelectItem value="checkbox">Multiple Choice (Checkboxes)</SelectItem>
                          <SelectItem value="date">Date</SelectItem>
                          <SelectItem value="time">Time</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id={`required-${field.id}`}
                        checked={field.required}
                        onCheckedChange={(checked) => updateDataField(field.id, 'required', checked)}
                      />
                      <Label htmlFor={`required-${field.id}`}>Required</Label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeDataField(field.id)}
                        className="ml-auto"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {(field.type === 'dropdown' || field.type === 'checkbox') && (
                    <div>
                      <Label>Options (comma-separated)</Label>
                      <Textarea
                        value={field.options?.join(', ') || ''}
                        onChange={(e) => updateDataField(field.id, 'options', e.target.value.split(', '))}
                        placeholder="Option 1, Option 2, Option 3"
                        rows={2}
                      />
                    </div>
                  )}
                </div>
              ))}
              <Button variant="outline" onClick={addDataField}>
                <Plus className="h-4 w-4 mr-2" />
                Add Data Field
              </Button>
            </div>

            <div>
              <Label>Reference Materials</Label>
              <Textarea
                placeholder="Links to species identification guides, research protocols, etc."
                rows={3}
              />
            </div>

            <div>
              <Label>Scientific Partner (Optional)</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select research organization" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="university-colombo">University of Colombo - Marine Biology</SelectItem>
                  <SelectItem value="wildlife-trust">Sri Lanka Wildlife Trust</SelectItem>
                  <SelectItem value="environmental-foundation">Environmental Foundation</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case "cleanup":
        return (
          <div className="space-y-6">
            <div>
              <Label>Target Waste Type</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                {['Plastics', 'Glass', 'Metals', 'E-Waste', 'Organic', 'General Litter'].map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox id={type} />
                    <Label htmlFor={type}>{type}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label>Safety Guidelines</Label>
              <Textarea
                placeholder="Important safety instructions for cleanup activities..."
                rows={4}
              />
            </div>

            <div>
              <Label>Collection Point Instructions</Label>
              <Textarea
                placeholder="Where collected waste should be brought, disposal procedures..."
                rows={3}
              />
            </div>

            <div>
              <Label>Equipment Needed</Label>
              <Textarea
                placeholder="Gloves, garbage bags, rake, safety vests..."
                rows={2}
              />
            </div>
          </div>
        );

      case "monitoring":
        return (
          <div className="space-y-6">
            <div>
              <Label>Reporting Categories</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                {['Illegal Dumping', 'Deforestation', 'Water Pollution', 'Wildlife Distress', 'Air Quality Issue'].map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox id={category} />
                    <Label htmlFor={category}>{category}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label>Observation Guidelines</Label>
              <Textarea
                placeholder="What specific details to look for and how to document them..."
                rows={4}
              />
            </div>

            <div>
              <Label>Severity/Impact Scale</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select scale type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low-medium-high">Low / Medium / High</SelectItem>
                  <SelectItem value="1-5-scale">1-5 Scale</SelectItem>
                  <SelectItem value="critical-levels">Low / Medium / High / Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Relevant Authorities for Alert</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                {['Environmental Authority', 'Police', 'Municipal Council', 'Wildlife Department', 'Coast Guard'].map((authority) => (
                  <div key={authority} className="flex items-center space-x-2">
                    <Checkbox id={authority} />
                    <Label htmlFor={authority}>{authority}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case "reforestation":
        return (
          <div className="space-y-6">
            <div>
              <Label>Species/Plant Type</Label>
              <Input placeholder="e.g., Native hardwood saplings, Mangrove propagules" />
            </div>

            <div>
              <Label>Planting Density/Pattern</Label>
              <Textarea
                placeholder="Instructions on spacing, arrangement, depth..."
                rows={3}
              />
            </div>

            <div>
              <Label>Maintenance Instructions</Label>
              <Textarea
                placeholder="Water daily for 3 months, weed regularly, monitoring schedule..."
                rows={4}
              />
            </div>

            <div>
              <Label>Land Ownership/Permission Notes</Label>
              <Textarea
                placeholder="Special permissions, contacts for planting site, legal considerations..."
                rows={3}
              />
            </div>
          </div>
        );

      case "awareness":
        return (
          <div className="space-y-6">
            <div>
              <Label>Target Message/Topic</Label>
              <Input placeholder="e.g., Benefits of Recycling, Impacts of Climate Change" />
            </div>

            <div>
              <Label>Call to Action for Volunteer</Label>
              <Textarea
                placeholder="Share this post on social media, conduct a mini-workshop with 5 friends..."
                rows={3}
              />
            </div>

            <div>
              <Label>Required Proof of Action</Label>
              <Textarea
                placeholder="Screenshot of shared post, photo of workshop participants, testimonials..."
                rows={3}
              />
            </div>
          </div>
        );

      case "energy-audit":
        return (
          <div className="space-y-6">
            <div>
              <Label>Audit Scope</Label>
              <Textarea
                placeholder="Household energy consumption, community water usage, waste generation..."
                rows={3}
              />
            </div>

            <div>
              <Label className="text-base font-semibold">Audit Data Points to Collect</Label>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Define what specific measurements volunteers should record
              </p>
              {dataFields.map((field) => (
                <div key={field.id} className="border rounded-lg p-4 mb-3">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                    <div>
                      <Label>Data Point Name</Label>
                      <Input
                        value={field.name}
                        onChange={(e) => updateDataField(field.id, 'name', e.target.value)}
                        placeholder="e.g., Monthly Electricity Bill"
                      />
                    </div>
                    <div>
                      <Label>Data Type</Label>
                      <Select 
                        value={field.type} 
                        onValueChange={(value) => updateDataField(field.id, 'type', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="number">Number</SelectItem>
                          <SelectItem value="decimal">Decimal</SelectItem>
                          <SelectItem value="text">Text</SelectItem>
                          <SelectItem value="dropdown">Dropdown</SelectItem>
                          <SelectItem value="date">Date</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id={`audit-required-${field.id}`}
                        checked={field.required}
                        onCheckedChange={(checked) => updateDataField(field.id, 'required', checked)}
                      />
                      <Label htmlFor={`audit-required-${field.id}`}>Required</Label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeDataField(field.id)}
                        className="ml-auto"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              <Button variant="outline" onClick={addDataField}>
                <Plus className="h-4 w-4 mr-2" />
                Add Data Point
              </Button>
            </div>

            <div>
              <Label>Recommendations/Guidance</Label>
              <Textarea
                placeholder="General advice for users based on audit results, energy-saving tips..."
                rows={4}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
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
            Design impactful climate missions with detailed instructions and requirements
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Core Fields */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold border-b pb-2">Core Mission Information</h3>
            
            {/* Mission Title */}
            <div>
              <Label htmlFor="title">Mission Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
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
                onChange={(e) => setFormData({...formData, description: e.target.value})}
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
              <Label className="text-base font-semibold">Detailed Instructions</Label>
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
                        {React.createElement(stepIcons.find(icon => icon.name === step.icon)?.icon || Target, { className: "h-4 w-4" })}
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
                                  updateStep(step.id, 'icon', iconOption.name);
                                  setShowIconSelector(null);
                                }}
                              >
                                {React.createElement(iconOption.icon, { className: "h-4 w-4" })}
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
                          onChange={(e) => updateStep(step.id, 'title', e.target.value)}
                          placeholder="e.g., Gather Materials"
                          maxLength={15}
                        />
                        <p className="text-xs text-gray-500">{step.title.length}/15 characters</p>
                      </div>
                      
                      <div>
                        <Label>Step Description</Label>
                        <Textarea
                          value={step.description}
                          onChange={(e) => updateStep(step.id, 'description', e.target.value)}
                          placeholder="Detailed instructions for this step..."
                          maxLength={100}
                          rows={2}
                        />
                        <p className="text-xs text-gray-500">{step.description.length}/100 characters</p>
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

            {/* Points and Mission Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="points">Points Awarded *</Label>
                <Input
                  id="points"
                  type="number"
                  value={formData.points}
                  onChange={(e) => setFormData({...formData, points: e.target.value})}
                  placeholder="50"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label>Mission Type *</Label>
                <Select value={missionType} onValueChange={setMissionType}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select mission type" />
                  </SelectTrigger>
                  <SelectContent>
                    {missionTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center space-x-2">
                          {React.createElement(type.icon, { className: "h-4 w-4" })}
                          <span>{type.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Required Evidence Type */}
            <div>
              <Label className="text-base font-semibold">Required Evidence Type</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
                {evidenceTypes.map((evidence) => (
                  <div key={evidence.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={evidence.value}
                      checked={selectedEvidence.includes(evidence.value)}
                      onCheckedChange={(checked) => handleEvidenceChange(evidence.value, checked as boolean)}
                    />
                    <Label htmlFor={evidence.value}>{evidence.label}</Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Location */}
            <div className="space-y-4">
              <Label className="text-base font-semibold">Location</Label>
              
              <div>
                <Label>Location Type</Label>
                <Select value={locationType} onValueChange={setLocationType}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select location type" />
                  </SelectTrigger>
                  <SelectContent>
                    {locationTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Location Name/Description</Label>
                <Input
                  value={formData.locationName}
                  onChange={(e) => setFormData({...formData, locationName: e.target.value})}
                  placeholder="e.g., Galle Face Beach Stretch 1, Around Kandy Lake"
                  className="mt-1"
                />
              </div>

              {locationType === "coordinates" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Latitude</Label>
                    <Input
                      type="number"
                      step="any"
                      value={formData.latitude}
                      onChange={(e) => setFormData({...formData, latitude: e.target.value})}
                      placeholder="6.9271"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Longitude</Label>
                    <Input
                      type="number"
                      step="any"
                      value={formData.longitude}
                      onChange={(e) => setFormData({...formData, longitude: e.target.value})}
                      placeholder="79.8612"
                      className="mt-1"
                    />
                  </div>
                </div>
              )}

              <div>
                <Label>Geofence Radius (meters) - Optional</Label>
                <Input
                  type="number"
                  value={formData.geofenceRadius}
                  onChange={(e) => setFormData({...formData, geofenceRadius: e.target.value})}
                  placeholder="100"
                  className="mt-1"
                />
              </div>
            </div>

            {/* Time Constraints */}
            <div className="space-y-4">
              <Label className="text-base font-semibold">Time Constraints</Label>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Start Date & Time</Label>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <Input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                    />
                    <Input
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                    />
                  </div>
                </div>
                
                <div>
                  <Label>End Date & Time</Label>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <Input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                    />
                    <Input
                      type="time"
                      value={formData.endTime}
                      onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label>Repeat Frequency Instructions</Label>
                <Textarea
                  value={formData.repeatFrequency}
                  onChange={(e) => setFormData({...formData, repeatFrequency: e.target.value})}
                  placeholder="e.g., This mission can be repeated daily/weekly"
                  rows={2}
                  className="mt-1"
                />
              </div>
            </div>

            {/* Mission Thumbnail */}
            <div>
              <Label>Mission Thumbnail/Banner Image</Label>
              <FileUploadZone
                onFilesChange={(files) => setFormData({...formData, thumbnailImage: files[0] || null})}
                acceptedTypes={["image/*"]}
                maxFiles={1}
                maxSizeMB={5}
                className="mt-2"
              />
            </div>

            {/* Tags */}
            <div>
              <Label>Tags</Label>
              <div className="mt-2">
                <Input placeholder="Search and add tags..." />
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedTags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => setSelectedTags(selectedTags.filter(t => t !== tag))}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Status */}
            <div>
              <Label>Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="unpublished">Unpublished</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Conditional Fields */}
          {missionType && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold border-b pb-2">
                {missionTypes.find(t => t.value === missionType)?.label} Specific Fields
              </h3>
              {renderConditionalFields()}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center space-x-4 pt-6 border-t">
            <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
              Create Mission
            </Button>
            <Button variant="outline">
              Save as Draft
            </Button>
            <Button variant="ghost">
              Clear Form
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
