import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock,
  Plus,
  Edit,
  Trash2
} from "lucide-react";

// Mock data for events
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
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Events Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Create and manage events for your organization members
          </p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700">
          <Plus className="h-4 w-4 mr-2" />
          Create New Event
        </Button>
      </div>

      {/* Create Event Form */}
      <Card>
        <CardHeader>
          <CardTitle>Create New Event</CardTitle>
          <CardDescription>
            Organize events to engage your community in climate action
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
                Event Title
              </label>
              <Input placeholder="e.g., Community Tree Planting Day" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
                Location
              </label>
              <Input placeholder="e.g., Central Park, Downtown" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
                Date
              </label>
              <Input type="date" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
                Time
              </label>
              <Input type="time" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
                Max Attendees
              </label>
              <Input type="number" placeholder="50" />
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
              Description
            </label>
            <Textarea 
              placeholder="Describe your event, what participants can expect, and how it contributes to climate action..."
              rows={4}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Button className="bg-green-600 hover:bg-green-700">
              Create Event
            </Button>
            <Button variant="outline">
              Save as Draft
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
