"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FileUploadZone } from "@/components/ui/file-upload-zone";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Edit,
  Building2,
  Globe,
  Phone,
  MapPin,
  User,
  Camera,
  X,
  Check,
  ChevronsUpDown,
  Shield,
  Target,
  Gift,
  Users,
} from "lucide-react";
import { toast } from "sonner";

// Organization categories
const organizationCategories = [
  "Environmental NGO",
  "Community Based Organization",
  "Educational Institution",
  "Youth Organization",
];

// Organized tags by category
const organizationTags = {
  "Biodiversity & Ecosystem Protection": [
    "Wildlife Conservation",
    "Marine Conservation",
    "Forest Conservation",
    "Biodiversity Protection",
    "Habitat Restoration",
    "Ecosystem Preservation",
    "Wetlands Conservation",
    "Coral Reef Protection",
    "Coastal Zone Management",
    "Endangered Species Protection",
    "Urban Ecology",
    "Protected Areas Management",
  ],
  "Pollution & Waste Management": [
    "Plastic Waste Reduction",
    "Waste Management",
    "Recycling Promotion",
    "Litter Prevention",
    "Ocean Cleanup",
    "River Cleanup",
    "Air Quality Monitoring",
    "Water Quality Testing",
    "Electronic Waste",
    "Chemical Pollution Control",
  ],
  "Climate Change Action": [
    "Climate Change Mitigation",
    "Climate Change Adaptation",
    "Renewable Energy Promotion",
    "Carbon Sequestration",
    "Climate Advocacy",
    "Greenhouse Gas Reduction",
    "Climate Resilience",
    "Sustainable Energy",
  ],
  "Resource Management & Sustainable Practices": [
    "Water Conservation",
    "Sustainable Agriculture",
    "Land Restoration",
    "Soil Health",
    "Afforestation/Reforestation",
    "Sustainable Tourism",
    "Energy Efficiency",
    "Sustainable Consumption",
  ],
  "Community, Education & Awareness": [
    "Environmental Education",
    "Community Engagement",
    "Citizen Science",
    "Environmental Awareness",
    "Youth Empowerment",
    "Eco-Tourism Promotion",
  ],
  "Animal Welfare & Specific Species Focus": [
    "Animal Rescue",
    "Animal Welfare",
    "Veterinary Care",
    "Bird Conservation",
    "Reptile Conservation",
    "Mammal Conservation",
  ],
};

// Flatten tags for search
const allTags = Object.values(organizationTags).flat();

export default function EditOrganizationPage() {
  const { activeOrganization, hasPrivilege } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tagSearchOpen, setTagSearchOpen] = useState(false);
  const [carouselPhotos, setCarouselPhotos] = useState<File[]>([]);
  const [requestedPrivileges, setRequestedPrivileges] = useState<string[]>(
    []
  );

  // Form state
  const [formData, setFormData] = useState({
    organizationName: activeOrganization?.name || "",
    logo: null as File | null,
    coverPhoto: null as File | null,
    shortDescription: "",
    websiteUrl: "",
    primaryContact: "",
    contactPerson: "",
    address: "",
    category: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (field: string, file: File | null) => {
    setFormData((prev) => ({ ...prev, [field]: file }));
  };

  const handleTagSelect = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags((prev) => prev.filter((t) => t !== tag));
    } else if (selectedTags.length < 3) {
      setSelectedTags((prev) => [...prev, tag]);
    } else {
      toast.error("You can only select up to 3 tags");
    }
  };

  const removeCarouselPhoto = (index: number) => {
    setCarouselPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handlePrivilegeRequest = (privilege: string) => {
    if (requestedPrivileges.includes(privilege)) {
      setRequestedPrivileges((prev) => prev.filter((c) => c !== privilege));
    } else {
      setRequestedPrivileges((prev) => [...prev, privilege]);
    }
  };

  const handleSave = () => {
    // Implement save logic here
    toast.success("Organization details updated successfully!");
    setIsEditing(false);
  };

  const handleRequestPrivileges = () => {
    if (requestedPrivileges.length === 0) {
      toast.error("Please select at least one privilege to request");
      return;
    }
    // Implement privilege request logic here
    toast.success("Privilege request submitted successfully!");
    setRequestedPrivileges([]);
  };

  if (!activeOrganization) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-500">No organization found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Organization Settings</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage your organization profile, privileges, and account settings
          </p>
        </div>
      </div>

      {/* Section 1: Organization Profile */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Organization Profile
          </CardTitle>
          <div className="flex items-center gap-2">
            {isEditing && (
              <Button onClick={handleSave} className="flex items-center gap-2">
                <Check className="h-4 w-4" />
                Save Changes
              </Button>
            )}
            <Button
              variant={isEditing ? "outline" : "default"}
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-2"
            >
              <Edit className="h-4 w-4" />
              {isEditing ? "Cancel" : "Edit"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Basic Info & Media */}
            <div className="space-y-6">
          {/* Organization Name */}
          <div className="space-y-2">
            <Label htmlFor="orgName">Organization Name</Label>
            <Input
              id="orgName"
              value={formData.organizationName}
              disabled
              className="bg-gray-50 dark:bg-gray-900"
            />
            <p className="text-sm text-gray-600 dark:text-gray-400">
              To change the organization name, send an email to{" "}
              <a
                href="mailto:team@mission1point5.org"
                className="text-blue-600 hover:underline"
              >
                team@mission1point5.org
              </a>
            </p>
          </div>

          {/* Organization Logo */}
          <div className="space-y-2">
            <Label>Organization Logo</Label>
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={formData.logo ? URL.createObjectURL(formData.logo) : ""} />
                <AvatarFallback>
                  <Building2 className="h-8 w-8" />
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <div className="flex-1">
                  <FileUploadZone
                    onFilesChange={(files) => handleFileUpload("logo", files[0] || null)}
                    acceptedTypes={["image/*"]}
                    maxFiles={1}
                    maxSizeMB={5}
                    className="w-full"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Cover Photo */}
          <div className="space-y-2">
            <Label>Cover Photo</Label>
            <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center border-2 border-dashed">
              {isEditing ? (
                <FileUploadZone
                  onFilesChange={(files) => handleFileUpload("coverPhoto", files[0] || null)}
                  acceptedTypes={["image/*"]}
                  maxFiles={1}
                  maxSizeMB={10}
                  className="w-full h-full"
                />
              ) : (
                <div className="text-center text-gray-500">
                  {formData.coverPhoto ? (
                    <img 
                      src={URL.createObjectURL(formData.coverPhoto)} 
                      alt="Cover Photo"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <>
                      <Camera className="h-12 w-12 mx-auto mb-2" />
                      <p>No cover photo uploaded</p>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Short Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Short Description</Label>
            <Textarea
              id="description"
              value={formData.shortDescription}
              onChange={(e) =>
                handleInputChange("shortDescription", e.target.value)
              }
              disabled={!isEditing}
              maxLength={300}
              className="resize-none"
              rows={4}
            />
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {formData.shortDescription.length}/300 characters
            </p>
          </div>
            </div>

            {/* Right Column - Contact & Classification */}
            <div className="space-y-6">
          {/* Website/Social Media Link */}
          <div className="space-y-2">
            <Label htmlFor="website">Website / Social Media Profile</Label>
            <div className="flex">
              <div className="flex items-center px-3 bg-gray-50 dark:bg-gray-900 border border-r-0 rounded-l-md">
                <Globe className="h-4 w-4 text-gray-500" />
              </div>
              <Input
                id="website"
                value={formData.websiteUrl}
                onChange={(e) =>
                  handleInputChange("websiteUrl", e.target.value)
                }
                disabled={!isEditing}
                placeholder="https://example.com"
                className="rounded-l-none"
              />
            </div>
          </div>

          {/* Primary Contact Number */}
          <div className="space-y-2">
            <Label htmlFor="contact">Primary Contact Number</Label>
            <div className="flex">
              <div className="flex items-center px-3 bg-gray-50 dark:bg-gray-900 border border-r-0 rounded-l-md">
                <Phone className="h-4 w-4 text-gray-500" />
              </div>
              <Input
                id="contact"
                value={formData.primaryContact}
                onChange={(e) =>
                  handleInputChange("primaryContact", e.target.value)
                }
                disabled={!isEditing}
                placeholder="+94 (71) 123-4567"
                className="rounded-l-none"
              />
            </div>
          </div>

          {/* Contact Person's Name */}
          <div className="space-y-2">
            <Label htmlFor="contactPerson">Contact Person's Name</Label>
            <div className="flex">
              <div className="flex items-center px-3 bg-gray-50 dark:bg-gray-900 border border-r-0 rounded-l-md">
                <User className="h-4 w-4 text-gray-500" />
              </div>
              <Input
                id="contactPerson"
                value={formData.contactPerson}
                onChange={(e) =>
                  handleInputChange("contactPerson", e.target.value)
                }
                disabled={!isEditing}
                placeholder="John Doe"
                className="rounded-l-none"
              />
            </div>
          </div>

          {/* Organization Address */}
          <div className="space-y-2">
            <Label htmlFor="address">Organization Address</Label>
            <div className="flex">
              <div className="flex items-center px-3 bg-gray-50 dark:bg-gray-900 border border-r-0 rounded-l-md">
                <MapPin className="h-4 w-4 text-gray-500" />
              </div>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                disabled={!isEditing}
                className="rounded-l-none resize-none"
                rows={3}
              />
            </div>
          </div>

          {/* Organization Category */}
          <div className="space-y-2">
            <Label>Organization Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => handleInputChange("category", value)}
              disabled={!isEditing}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {organizationCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Organization Tags */}
          <div className="space-y-2">
            <Label>Organization Tags (Up to 3)</Label>
            <div className="space-y-2">
              {/* Selected Tags */}
              {selectedTags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedTags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {tag}
                      {isEditing && (
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => handleTagSelect(tag)}
                        />
                      )}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Tag Selector */}
              {isEditing && (
                <Popover open={tagSearchOpen} onOpenChange={setTagSearchOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={tagSearchOpen}
                      className="w-full justify-between"
                      disabled={selectedTags.length >= 3}
                    >
                      {selectedTags.length >= 3
                        ? "Maximum tags selected"
                        : "Search and select tags..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search tags..." />
                      <CommandEmpty>No tags found.</CommandEmpty>
                      <CommandList className="max-h-60">
                        {Object.entries(organizationTags).map(
                          ([category, tags]) => (
                            <CommandGroup key={category} heading={category}>
                              {tags.map((tag) => (
                                <CommandItem
                                  key={tag}
                                  onSelect={() => handleTagSelect(tag)}
                                  className="flex items-center gap-2"
                                >
                                  <Check
                                    className={`h-4 w-4 ${
                                      selectedTags.includes(tag)
                                        ? "opacity-100"
                                        : "opacity-0"
                                    }`}
                                  />
                                  {tag}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          )
                        )}
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              )}
            </div>
          </div>
            </div>
          </div>

          {/* Carousel Photos - Full width section */}
          <div className="space-y-2">
            <Label>Carousel Photos (Up to 5)</Label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {carouselPhotos.map((photo, index) => (
                <div
                  key={index}
                  className="relative aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg"
                >
                  <img
                    src={URL.createObjectURL(photo)}
                    alt={`Carousel ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  {isEditing && (
                    <Button
                      size="icon"
                      variant="destructive"
                      className="absolute -top-2 -right-2 h-6 w-6"
                      onClick={() => removeCarouselPhoto(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              ))}

              {isEditing && carouselPhotos.length < 5 && (
                <div className="aspect-square border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center">
                  <FileUploadZone
                    onFilesChange={(files) => {
                      const remainingSlots = 5 - carouselPhotos.length;
                      const filesToAdd = files.slice(0, remainingSlots);
                      setCarouselPhotos(prev => [...prev, ...filesToAdd]);
                    }}
                    acceptedTypes={["image/*"]}
                    maxFiles={5 - carouselPhotos.length}
                    maxSizeMB={5}
                    className="w-full h-full"
                  />
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 2: Request Additional Privileges */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Request Additional Privileges
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-gray-600 dark:text-gray-400">
            Request additional privileges for your organization. All requests
            will be reviewed by CIN administrators.
          </p>

          {/* Current Privileges */}
          <div className="space-y-2">
            <Label>Current Privileges</Label>
            <div className="flex flex-wrap gap-2">
              {activeOrganization.privileges?.map((privilege) => (
                <Badge
                  key={privilege.type}
                  variant={
                    privilege.status === "approved" ? "default" : "secondary"
                  }
                  className="flex items-center gap-1"
                >
                  {privilege.type === "mobilizing_partners" && (
                    <Users className="h-3 w-3" />
                  )}
                  {privilege.type === "mission_partners" && (
                    <Target className="h-3 w-3" />
                  )}
                  {privilege.type === "reward_partners" && (
                    <Gift className="h-3 w-3" />
                  )}
                  {privilege.type.replace("_", " ")} ({privilege.status})
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          {/* Request New Privileges */}
          <div className="space-y-4">
            <Label>Request New Privileges</Label>

            {/* Mission Partners */}
            {!hasPrivilege("mission_partners") && (
              <div className="flex items-start space-x-3 p-4 border rounded-lg">
                <Checkbox
                  id="mission_partners"
                  checked={requestedPrivileges.includes("mission_partners")}
                  onCheckedChange={() =>
                    handlePrivilegeRequest("mission_partners")
                  }
                />
                <div className="flex-1 space-y-1">
                  <div className="flex items-center space-x-2">
                    <Target className="h-4 w-4 text-green-600" />
                    <Label
                      htmlFor="mission_partners"
                      className="font-medium cursor-pointer"
                    >
                      Mission Partners
                    </Label>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Create and manage climate action missions for your
                    organization and the network. Requires approval based on
                    organization credibility.
                  </p>
                </div>
              </div>
            )}

            {/* Reward Partners */}
            {!hasPrivilege("reward_partners") && (
              <div className="flex items-start space-x-3 p-4 border rounded-lg">
                <Checkbox
                  id="reward_partners"
                  checked={requestedPrivileges.includes("reward_partners")}
                  onCheckedChange={() =>
                    handlePrivilegeRequest("reward_partners")
                  }
                />
                <div className="flex-1 space-y-1">
                  <div className="flex items-center space-x-2">
                    <Gift className="h-4 w-4 text-purple-600" />
                    <Label
                      htmlFor="reward_partners"
                      className="font-medium cursor-pointer"
                    >
                      Reward Partners
                    </Label>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Create and distribute rewards for mission completion.
                    Requires approval and verification of reward fulfillment
                    privileges.
                  </p>
                </div>
              </div>
            )}

            {requestedPrivileges.length === 0 &&
              !hasPrivilege("mission_partners") &&
              !hasPrivilege("reward_partners") && (
                <p className="text-gray-500 text-center py-4">
                  Select privileges above to request additional access.
                </p>
              )}
          </div>

          {requestedPrivileges.length > 0 && (
            <Button onClick={handleRequestPrivileges} className="w-full">
              Submit Privilege Request
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
