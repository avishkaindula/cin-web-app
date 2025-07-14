import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Target, 
  Calendar, 
  Users,
  Award,
  Clock,
  Edit,
  Trash2,
  Play,
  Pause,
  Eye,
  BarChart3
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
    completions: 3,
    createdDate: "2025-01-01",
    lastUpdated: "2025-01-10"
  },
  {
    id: "2",
    title: "Biodiversity Conservation Project",
    description: "Create a habitat restoration plan and implement it in your local area.",
    category: "Conservation",
    difficulty: "Advanced", 
    points: 750,
    deadline: "2025-06-30",
    status: "paused",
    participants: 8,
    maxParticipants: 25,
    completions: 0,
    createdDate: "2024-12-15",
    lastUpdated: "2025-01-05"
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
    completions: 25,
    createdDate: "2024-11-01",
    lastUpdated: "2025-01-12"
  },
  {
    id: "4",
    title: "Renewable Energy Transition",
    description: "Plan and implement renewable energy solutions for your organization.",
    category: "Renewable Energy",
    difficulty: "Advanced",
    points: 1000,
    deadline: "2025-08-15",
    status: "draft",
    participants: 0,
    maxParticipants: 20,
    completions: 0,
    createdDate: "2025-01-08",
    lastUpdated: "2025-01-08"
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case 'draft':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
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

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'active':
      return <Play className="h-4 w-4" />;
    case 'paused':
      return <Pause className="h-4 w-4" />;
    case 'completed':
      return <Award className="h-4 w-4" />;
    case 'draft':
      return <Edit className="h-4 w-4" />;
    default:
      return <Clock className="h-4 w-4" />;
  }
};

export default function ManageMissionsPage() {
  const activeMissions = mockMissions.filter(m => m.status === 'active').length;
  const completedMissions = mockMissions.filter(m => m.status === 'completed').length;
  const draftMissions = mockMissions.filter(m => m.status === 'draft').length;
  const totalParticipants = mockMissions.reduce((sum, m) => sum + m.participants, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Manage Missions
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Monitor and manage your climate action missions
          </p>
        </div>
      </div>

      {/* Mission Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Play className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {activeMissions}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Active Missions
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {completedMissions}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Completed
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Edit className="h-5 w-5 text-gray-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {draftMissions}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Drafts
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-purple-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {totalParticipants}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Total Participants
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <Input 
              placeholder="Search missions..." 
              className="max-w-sm"
            />
            <select className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800">
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="paused">Paused</option>
              <option value="draft">Draft</option>
            </select>
            <select className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800">
              <option value="">All Categories</option>
              <option value="carbon-reduction">Carbon Reduction</option>
              <option value="conservation">Conservation</option>
              <option value="waste-management">Waste Management</option>
              <option value="renewable-energy">Renewable Energy</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Missions List */}
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
                    <div className="flex items-center space-x-1">
                      {getStatusIcon(mission.status)}
                      <span>{mission.status}</span>
                    </div>
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
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
                  <span>{mission.participants}/{mission.maxParticipants}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <Target className="h-4 w-4" />
                  <span>{mission.completions} completed</span>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Updated {mission.lastUpdated}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                  <span>Participation</span>
                  <span>{Math.round((mission.participants / mission.maxParticipants) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ width: `${(mission.participants / mission.maxParticipants) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Button>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button variant="outline" size="sm">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Analytics
                </Button>
                
                {mission.status === 'active' && (
                  <Button variant="outline" size="sm">
                    <Pause className="h-4 w-4 mr-2" />
                    Pause
                  </Button>
                )}
                
                {mission.status === 'paused' && (
                  <Button variant="outline" size="sm" className="text-green-600 hover:text-green-700">
                    <Play className="h-4 w-4 mr-2" />
                    Resume
                  </Button>
                )}
                
                {mission.status === 'draft' && (
                  <>
                    <Button variant="outline" size="sm" className="text-green-600 hover:text-green-700">
                      <Play className="h-4 w-4 mr-2" />
                      Publish
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
