import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  XCircle,
  Clock,
  Target,
  Eye,
} from "lucide-react";

export default function MissionApprovalsPage() {
  // Mock data - in real app this would come from API/database
  const pendingMissions = [
    {
      id: "1",
      title: "Urban Tree Planting Initiative",
      organization: "Green Future Foundation",
      submittedAt: "2024-07-10",
      description: "A community-driven mission to plant 1000 trees in urban areas to improve air quality and biodiversity.",
      category: "Biodiversity & Ecosystem Protection",
      difficulty: "Intermediate",
      points: 500,
      status: "pending"
    },
    {
      id: "2", 
      title: "Plastic Waste Reduction Challenge",
      organization: "EcoTech Solutions",
      submittedAt: "2024-07-12",
      description: "Reduce single-use plastic consumption by implementing alternative solutions in daily life.",
      category: "Pollution & Waste Management", 
      difficulty: "Beginner",
      points: 250,
      status: "pending"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "approved":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "Advanced":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Mission Approvals
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Review and approve mission submissions from organizations
        </p>
        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>Review Process:</strong> Evaluate missions for quality, feasibility, and alignment with Mission 1.5° goals. 
            Ensure missions provide clear value to users and contribute to climate action objectives.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {pendingMissions.length}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Pending Review
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  24
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Approved This Month
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <XCircle className="h-5 w-5 text-red-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  3
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Rejected This Month
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Missions */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Pending Mission Reviews
        </h2>
        
        {pendingMissions.map((mission) => (
          <Card key={mission.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="h-5 w-5" />
                    <span>{mission.title}</span>
                  </CardTitle>
                  <CardDescription>
                    Submitted by {mission.organization} on {mission.submittedAt}
                  </CardDescription>
                </div>
                <Badge className={getStatusColor(mission.status)}>
                  Pending Review
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-600 dark:text-gray-400">
                  {mission.description}
                </p>
                
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">
                    {mission.category}
                  </Badge>
                  <Badge className={getDifficultyColor(mission.difficulty)}>
                    {mission.difficulty}
                  </Badge>
                  <Badge variant="outline">
                    {mission.points} points
                  </Badge>
                </div>
                
                <div className="flex space-x-2 pt-4">
                  <Button
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-600 border-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
