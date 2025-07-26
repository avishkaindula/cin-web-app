import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { FileUploadZone } from "@/components/ui/file-upload-zone";
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock,
  Plus,
  Edit,
  Trash2,
  Image,
  FileText,
  Shield,
  Package,
  Tag,
  Contact,
  Award
} from "lucide-react";

// Event tags options
const eventTags = [
  "Cleanup",
  "Workshop", 
  "Awareness",
  "Marine",
  "Recycling",
  "Reforestation",
  "Education",
  "Community",
  "Conservation",
  "Sustainability"
];

// Event status options
const eventStatuses = [
  { value: "draft", label: "Draft" },
  { value: "upcoming", label: "Upcoming" },
  { value: "active", label: "Active" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" }
];
const mockEvents = [
  {
    id: "1",
    title: "Community Tree Planting Day",
    description: "Join us for a day of tree planting in the local park to help combat climate change.",
    date: "2025-02-15",
    time: "09:00 AM",
    location: "Central Park, Downtown",
    attendeeCount: 25,
    maxAttendees: 50,
    status: "upcoming",
    organizer: "GreenTech Solutions"
  },
  {
    id: "2", 
    title: "Sustainability Workshop",
    description: "Learn about sustainable living practices and how to reduce your carbon footprint.",
    date: "2025-02-22",
    time: "02:00 PM", 
    location: "Community Center",
    attendeeCount: 18,
    maxAttendees: 30,
    status: "upcoming",
    organizer: "GreenTech Solutions"
  },
  {
    id: "3",
    title: "Beach Cleanup Campaign",
    description: "Help us clean our local beaches and protect marine life from plastic pollution.",
    date: "2025-01-20",
    time: "08:00 AM",
    location: "Sunset Beach",
    attendeeCount: 42,
    maxAttendees: 40,
    status: "completed",
    organizer: "GreenTech Solutions"
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'upcoming':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    case 'completed':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case 'cancelled':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
  }
};

export default function CreateEventsPage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    endTime: "",
    locationName: "",
    latitude: "",
    longitude: "",
    pointsAwarded: 0,
    registrationRequired: false,
    capacityLimit: "",
    organizerContact: "",
    selectedTags: [] as string[],
    detailedAgenda: "",
    equipmentToBring: "",
    safetyGuidelines: "",
    status: "draft",
    bannerImage: null as File | null
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTagToggle = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      selectedTags: prev.selectedTags.includes(tag)
        ? prev.selectedTags.filter(t => t !== tag)
        : prev.selectedTags.length < 3
        ? [...prev.selectedTags, tag]
        : prev.selectedTags
    }));
  };

  const handleImageUpload = (files: File[]) => {
    if (files.length > 0) {
      setFormData(prev => ({
        ...prev,
        bannerImage: files[0]
      }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Event Creator Portal
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Create and manage events for your organization members
          </p>
        </div>
        <Button 
          className="bg-green-600 hover:bg-green-700"
          onClick={() => setFormData({
            title: "",
            description: "",
            date: "",
            time: "",
            endTime: "",
            locationName: "",
            latitude: "",
            longitude: "",
            pointsAwarded: 0,
            registrationRequired: false,
            capacityLimit: "",
            organizerContact: "",
            selectedTags: [],
            detailedAgenda: "",
            equipmentToBring: "",
            safetyGuidelines: "",
            status: "draft",
            bannerImage: null
          })}
        >
          <Plus className="h-4 w-4 mr-2" />
          New Event
        </Button>
      </div>

      {/* Event Creator Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Create New Event</span>
          </CardTitle>
          <CardDescription>
            Define all details for your upcoming event to engage the community in climate action
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Event Title *
                </Label>
                <Input 
                  id="title"
                  placeholder="e.g., Marine Conservation Workshop"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="points" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center space-x-1">
                  <Award className="h-4 w-4" />
                  <span>Points Awarded *</span>
                </Label>
                <Input 
                  id="points"
                  type="number"
                  min="0"
                  placeholder="50"
                  value={formData.pointsAwarded}
                  onChange={(e) => handleInputChange("pointsAwarded", parseInt(e.target.value) || 0)}
                  className="mt-1"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="description" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Event Description *
              </Label>
              <Textarea 
                id="description"
                placeholder="Detailed explanation of the event, objectives, target audience, and activities..."
                rows={4}
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          {/* Date & Time */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Date & Time</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="date" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Event Date *
                </Label>
                <Input 
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange("date", e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="time" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Start Time *
                </Label>
                <Input 
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => handleInputChange("time", e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="endTime" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  End Time (Optional)
                </Label>
                <Input 
                  id="endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => handleInputChange("endTime", e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center space-x-2">
              <MapPin className="h-5 w-5" />
              <span>Location</span>
            </h3>
            
            <div>
              <Label htmlFor="locationName" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Location Name *
              </Label>
              <Input 
                id="locationName"
                placeholder="e.g., Galle Face Green Amphitheater"
                value={formData.locationName}
                onChange={(e) => handleInputChange("locationName", e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="latitude" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Latitude (Optional)
                </Label>
                <Input 
                  id="latitude"
                  type="number"
                  step="any"
                  placeholder="e.g., 6.9271"
                  value={formData.latitude}
                  onChange={(e) => handleInputChange("latitude", e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="longitude" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Longitude (Optional)
                </Label>
                <Input 
                  id="longitude"
                  type="number"
                  step="any"
                  placeholder="e.g., 79.8612"
                  value={formData.longitude}
                  onChange={(e) => handleInputChange("longitude", e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          {/* Registration & Capacity */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Registration Settings</span>
            </h3>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="registration"
                checked={formData.registrationRequired}
                onCheckedChange={(checked) => handleInputChange("registrationRequired", checked)}
              />
              <Label htmlFor="registration" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Registration Required
              </Label>
            </div>
            
            {formData.registrationRequired && (
              <div>
                <Label htmlFor="capacity" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Capacity Limit (Optional)
                </Label>
                <Input 
                  id="capacity"
                  type="number"
                  min="1"
                  placeholder="e.g., 50 (leave empty for unlimited)"
                  value={formData.capacityLimit}
                  onChange={(e) => handleInputChange("capacityLimit", e.target.value)}
                  className="mt-1"
                />
              </div>
            )}
          </div>

          {/* Event Tags */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center space-x-2">
              <Tag className="h-5 w-5" />
              <span>Event Tags (Select up to 3)</span>
            </h3>
            
            <div className="flex flex-wrap gap-2">
              {eventTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleTagToggle(tag)}
                  className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                    formData.selectedTags.includes(tag)
                      ? "bg-green-100 border-green-300 text-green-800 dark:bg-green-900 dark:border-green-700 dark:text-green-300"
                      : "bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                  } ${
                    !formData.selectedTags.includes(tag) && formData.selectedTags.length >= 3
                      ? "opacity-50 cursor-not-allowed"
                      : "cursor-pointer"
                  }`}
                  disabled={!formData.selectedTags.includes(tag) && formData.selectedTags.length >= 3}
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>

          {/* Banner Image */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center space-x-2">
              <Image className="h-5 w-5" />
              <span>Event Banner (Optional)</span>
            </h3>
            
            <FileUploadZone
              acceptedTypes={["image/*"]}
              maxFiles={1}
              onFilesChange={handleImageUpload}
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Upload an engaging banner image for your event
            </p>
            {formData.bannerImage && (
              <p className="text-sm text-green-600 dark:text-green-400">
                Selected: {formData.bannerImage.name}
              </p>
            )}
          </div>

          {/* Organizer Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center space-x-2">
              <Contact className="h-5 w-5" />
              <span>Organizer Contact (Optional)</span>
            </h3>
            
            <div>
              <Label htmlFor="contact" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Contact Information
              </Label>
              <Textarea 
                id="contact"
                placeholder="Email: organizer@example.com&#10;Phone: +94 11 234 5678&#10;Additional contact details..."
                rows={3}
                value={formData.organizerContact}
                onChange={(e) => handleInputChange("organizerContact", e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          {/* Optional Additional Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Additional Information (Optional)</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="agenda" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Detailed Agenda/Schedule
                </Label>
                <Textarea 
                  id="agenda"
                  placeholder="9:00 AM - Registration&#10;9:30 AM - Welcome Speech&#10;10:00 AM - Main Activity..."
                  rows={4}
                  value={formData.detailedAgenda}
                  onChange={(e) => handleInputChange("detailedAgenda", e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="equipment" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center space-x-1">
                  <Package className="h-4 w-4" />
                  <span>Equipment to Bring</span>
                </Label>
                <Textarea 
                  id="equipment"
                  placeholder="• Water bottle&#10;• Hat and sunblock&#10;• Gloves&#10;• Comfortable walking shoes..."
                  rows={4}
                  value={formData.equipmentToBring}
                  onChange={(e) => handleInputChange("equipmentToBring", e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="safety" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center space-x-1">
                <Shield className="h-4 w-4" />
                <span>Safety Guidelines</span>
              </Label>
              <Textarea 
                id="safety"
                placeholder="Safety instructions and precautions relevant to this event..."
                rows={3}
                value={formData.safetyGuidelines}
                onChange={(e) => handleInputChange("safetyGuidelines", e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          {/* Event Status */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Event Status</h3>
            
            <div>
              <Label htmlFor="status" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Status *
              </Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select event status" />
                </SelectTrigger>
                <SelectContent>
                  {eventStatuses.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <Button className="bg-green-600 hover:bg-green-700">
                Create Event
              </Button>
              <Button variant="outline">
                Save as Draft
              </Button>
            </div>
            <Button 
              variant="outline"
              onClick={() => setFormData({
                title: "",
                description: "",
                date: "",
                time: "",
                endTime: "",
                locationName: "",
                latitude: "",
                longitude: "",
                pointsAwarded: 0,
                registrationRequired: false,
                capacityLimit: "",
                organizerContact: "",
                selectedTags: [],
                detailedAgenda: "",
                equipmentToBring: "",
                safetyGuidelines: "",
                status: "draft",
                bannerImage: null
              })}
            >
              Clear Form
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Existing Events */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Your Events
        </h2>
        <div className="grid gap-4">
          {mockEvents.map((event) => (
            <Card key={event.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{event.title}</CardTitle>
                    <CardDescription>{event.description}</CardDescription>
                  </div>
                  <Badge className={getStatusColor(event.status)}>
                    {event.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <Calendar className="h-4 w-4" />
                    <span>{event.date} at {event.time}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <MapPin className="h-4 w-4" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <Users className="h-4 w-4" />
                    <span>{event.attendeeCount}/{event.maxAttendees} attendees</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <Clock className="h-4 w-4" />
                    <span>{event.status}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm">
                    <Users className="h-4 w-4 mr-2" />
                    View Attendees
                  </Button>
                  {event.status === 'upcoming' && (
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
