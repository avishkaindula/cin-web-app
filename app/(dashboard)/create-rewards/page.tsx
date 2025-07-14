import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Gift, 
  Calendar, 
  Award, 
  DollarSign,
  Clock,
  Plus,
  Edit,
  Trash2,
  Users,
  Star
} from "lucide-react";

// Mock data for rewards
const mockRewards = [
  {
    id: "1",
    title: "Eco-Warrior Badge",
    description: "Digital badge for completing 5 climate missions",
    type: "Digital Badge",
    category: "Achievement",
    value: "Recognition",
    pointsCost: 500,
    availability: "Unlimited",
    claimedCount: 23,
    status: "active",
    createdDate: "2025-01-01",
    expiryDate: null
  },
  {
    id: "2",
    title: "Solar Panel Installation Discount",
    description: "20% discount on solar panel installation from our partner companies",
    type: "Discount Voucher",
    category: "Environmental",
    value: "$500 savings",
    pointsCost: 2000,
    availability: "Limited (50)",
    claimedCount: 12,
    status: "active", 
    createdDate: "2024-12-15",
    expiryDate: "2025-06-30"
  },
  {
    id: "3",
    title: "Sustainable Living Workshop",
    description: "Free access to our premium sustainable living online course",
    type: "Educational Access",
    category: "Education",
    value: "$99 course",
    pointsCost: 800,
    availability: "Limited (100)",
    claimedCount: 45,
    status: "active",
    createdDate: "2024-11-20",
    expiryDate: "2025-12-31"
  },
  {
    id: "4",
    title: "Climate Champion Certificate",
    description: "Official certificate recognizing outstanding climate action leadership",
    type: "Certificate",
    category: "Recognition",
    value: "Official Recognition",
    pointsCost: 1500,
    availability: "Unlimited",
    claimedCount: 8,
    status: "draft",
    createdDate: "2025-01-10",
    expiryDate: null
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case 'draft':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    case 'expired':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    case 'paused':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case 'Digital Badge':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
    case 'Discount Voucher':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    case 'Educational Access':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    case 'Certificate':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
  }
};

export default function CreateRewardsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Rewards Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Create and manage rewards to incentivize climate action
          </p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700">
          <Plus className="h-4 w-4 mr-2" />
          Create New Reward
        </Button>
      </div>

      {/* Create Reward Form */}
      <Card>
        <CardHeader>
          <CardTitle>Create New Reward</CardTitle>
          <CardDescription>
            Design compelling rewards that motivate environmental action
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
                Reward Title
              </label>
              <Input placeholder="e.g., Eco-Warrior Badge" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
                Reward Type
              </label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="digital-badge">Digital Badge</SelectItem>
                  <SelectItem value="discount-voucher">Discount Voucher</SelectItem>
                  <SelectItem value="educational-access">Educational Access</SelectItem>
                  <SelectItem value="certificate">Certificate</SelectItem>
                  <SelectItem value="physical-item">Physical Item</SelectItem>
                  <SelectItem value="experience">Experience</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
                Category
              </label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="achievement">Achievement</SelectItem>
                  <SelectItem value="environmental">Environmental</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="recognition">Recognition</SelectItem>
                  <SelectItem value="discount">Discount</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
                Points Cost
              </label>
              <Input type="number" placeholder="500" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
                Availability
              </label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select availability" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unlimited">Unlimited</SelectItem>
                  <SelectItem value="limited">Limited Quantity</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
                Value/Savings
              </label>
              <Input placeholder="e.g., $50 savings, Recognition" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
                Expiry Date (Optional)
              </label>
              <Input type="date" />
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
              Description
            </label>
            <Textarea 
              placeholder="Describe the reward, how to claim it, and any terms and conditions..."
              rows={4}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Button className="bg-green-600 hover:bg-green-700">
              Create Reward
            </Button>
            <Button variant="outline">
              Save as Draft
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Existing Rewards */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Your Rewards
        </h2>
        <div className="grid gap-4">
          {mockRewards.map((reward) => (
            <Card key={reward.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="flex items-center space-x-2">
                      <Gift className="h-5 w-5" />
                      <span>{reward.title}</span>
                    </CardTitle>
                    <CardDescription>{reward.description}</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getTypeColor(reward.type)}>
                      {reward.type}
                    </Badge>
                    <Badge className={getStatusColor(reward.status)}>
                      {reward.status}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <Star className="h-4 w-4" />
                    <span>{reward.pointsCost} points</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <DollarSign className="h-4 w-4" />
                    <span>{reward.value}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <Users className="h-4 w-4" />
                    <span>{reward.claimedCount} claimed</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <Award className="h-4 w-4" />
                    <span>{reward.availability}</span>
                  </div>
                  {reward.expiryDate && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                      <Calendar className="h-4 w-4" />
                      <span>Expires {reward.expiryDate}</span>
                    </div>
                  )}
                </div>

                {/* Category and Created Date */}
                <div className="flex items-center space-x-4 mb-4">
                  <Badge variant="outline">
                    {reward.category}
                  </Badge>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Created {reward.createdDate}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm">
                    <Users className="h-4 w-4 mr-2" />
                    View Claims
                  </Button>
                  {reward.status === 'active' && (
                    <Button variant="outline" size="sm">
                      <Clock className="h-4 w-4 mr-2" />
                      Pause
                    </Button>
                  )}
                  {reward.status === 'draft' && (
                    <>
                      <Button variant="outline" size="sm" className="text-green-600 hover:text-green-700">
                        <Star className="h-4 w-4 mr-2" />
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
    </div>
  );
}
