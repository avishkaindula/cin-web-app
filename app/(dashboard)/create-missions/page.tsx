import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Target, 
  Calendar, 
  MapPin, 
  Award,
  Clock,
  Plus,
  Edit,
  Trash2,
  Users
} from "lucide-react";

// Mock data for missions
const mockMissions = [
  {
    id: "1",
    title: "Carbon Footprint Reduction Challenge",
    description: "Reduce your organization's carbon footprint by 20% over the next quarter.",
    category: "Carbon Reduction",
    difficulty: "Intermediate",
    points: 500,
    deadline: "2025-04-15",
    status: "active",
    participants: 12,
    maxParticipants: 50,
    requirements: [
      "Install energy monitoring systems",
      "Implement recycling program", 
      "Switch to renewable energy sources"
    ]
  },
  {
    id: "2",
    title: "Biodiversity Conservation Project",
    description: "Create a habitat restoration plan and implement it in your local area.",
    category: "Conservation",
    difficulty: "Advanced", 
    points: 750,
    deadline: "2025-06-30",
    status: "draft",
    participants: 0,
    maxParticipants: 25,
    requirements: [
      "Conduct biodiversity assessment",
      "Develop restoration plan",
      "Plant native species"
    ]
  },
  {
    id: "3",
    title: "Waste Reduction Initiative",
    description: "Implement a comprehensive waste reduction program in your workplace.",
    category: "Waste Management",
    difficulty: "Beginner",
    points: 300,
    deadline: "2025-03-31",
    status: "completed",
    participants: 28,
    maxParticipants: 30,
    requirements: [
      "Audit current waste streams",
      "Implement composting program",
      "Reduce single-use plastics"
    ]
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case 'draft':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    case 'completed':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    case 'paused':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
  }
};

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'Beginner':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case 'Intermediate':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    case 'Advanced':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
  }
};

export default function CreateMissionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Missions Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Create and manage climate action missions for the community
          </p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700">
          <Plus className="h-4 w-4 mr-2" />
          Create New Mission
        </Button>
      </div>

      {/* Create Mission Form */}
      <Card>
        <CardHeader>
          <CardTitle>Create New Mission</CardTitle>
          <CardDescription>
            Design impactful climate missions that inspire action and drive change
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
                Mission Title
              </label>
              <Input placeholder="e.g., Carbon Footprint Reduction Challenge" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
                Category
              </label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="carbon-reduction">Carbon Reduction</SelectItem>
                  <SelectItem value="conservation">Conservation</SelectItem>
                  <SelectItem value="waste-management">Waste Management</SelectItem>
                  <SelectItem value="renewable-energy">Renewable Energy</SelectItem>
                  <SelectItem value="sustainable-transport">Sustainable Transport</SelectItem>
                  <SelectItem value="education">Education & Awareness</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
                Difficulty Level
              </label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
                Points Reward
              </label>
              <Input type="number" placeholder="500" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
                Max Participants
              </label>
              <Input type="number" placeholder="50" />
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
              Deadline
            </label>
            <Input type="date" />
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
              Description
            </label>
            <Textarea 
              placeholder="Describe the mission objectives, expected outcomes, and impact on climate action..."
              rows={4}
            />
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
              Requirements (one per line)
            </label>
            <Textarea 
              placeholder="List the specific requirements or tasks that need to be completed..."
              rows={3}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Button className="bg-green-600 hover:bg-green-700">
              Create Mission
            </Button>
            <Button variant="outline">
              Save as Draft
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Existing Missions */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Your Missions
        </h2>
        <div className="grid gap-4">
          {mockMissions.map((mission) => (
            <Card key={mission.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="flex items-center space-x-2">
                      <Target className="h-5 w-5" />
                      <span>{mission.title}</span>
                    </CardTitle>
                    <CardDescription>{mission.description}</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getDifficultyColor(mission.difficulty)}>
                      {mission.difficulty}
                    </Badge>
                    <Badge className={getStatusColor(mission.status)}>
                      {mission.status}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <Award className="h-4 w-4" />
                    <span>{mission.points} points</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <Calendar className="h-4 w-4" />
                    <span>Due {mission.deadline}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <Users className="h-4 w-4" />
                    <span>{mission.participants}/{mission.maxParticipants} participants</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <Target className="h-4 w-4" />
                    <span>{mission.category}</span>
                  </div>
                </div>

                {/* Requirements Preview */}
                <div className="mb-4">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Key Requirements:
                  </span>
                  <ul className="mt-1 text-sm text-gray-600 dark:text-gray-400 list-disc list-inside">
                    {mission.requirements.slice(0, 2).map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                    {mission.requirements.length > 2 && (
                      <li>+{mission.requirements.length - 2} more...</li>
                    )}
                  </ul>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm">
                    <Users className="h-4 w-4 mr-2" />
                    View Participants
                  </Button>
                  {mission.status === 'active' && (
                    <Button variant="outline" size="sm">
                      <Clock className="h-4 w-4 mr-2" />
                      Pause
                    </Button>
                  )}
                  {mission.status === 'draft' && (
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
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
