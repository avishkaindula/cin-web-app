import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Gift, 
  Calendar, 
  Award, 
  DollarSign,
  Clock,
  Edit,
  Trash2,
  Users,
  Star,
  Eye,
  BarChart3,
  Play,
  Pause
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
    totalClaimed: 23,
    activeClaims: 23,
    status: "active",
    createdDate: "2025-01-01",
    expiryDate: null,
    redemptionRate: "78%"
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
    totalClaimed: 12,
    activeClaims: 8,
    status: "active", 
    createdDate: "2024-12-15",
    expiryDate: "2025-06-30",
    redemptionRate: "67%"
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
    totalClaimed: 45,
    activeClaims: 42,
    status: "active",
    createdDate: "2024-11-20",
    expiryDate: "2025-12-31",
    redemptionRate: "93%"
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
    totalClaimed: 8,
    activeClaims: 8,
    status: "paused",
    createdDate: "2025-01-10",
    expiryDate: null,
    redemptionRate: "100%"
  },
  {
    id: "5",
    title: "Green Transportation Credit",
    description: "Credit towards electric vehicle charging or public transport",
    type: "Credit Voucher",
    category: "Transportation",
    value: "$25 credit",
    pointsCost: 600,
    availability: "Limited (200)",
    totalClaimed: 156,
    activeClaims: 134,
    status: "active",
    createdDate: "2024-10-05",
    expiryDate: "2025-12-31",
    redemptionRate: "86%"
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
    case 'Credit Voucher':
      return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300';
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
    case 'expired':
      return <Clock className="h-4 w-4" />;
    default:
      return <Gift className="h-4 w-4" />;
  }
};

export default function ManageRewardsPage() {
  const activeRewards = mockRewards.filter(r => r.status === 'active').length;
  const totalClaimed = mockRewards.reduce((sum, r) => sum + r.totalClaimed, 0);
  const pausedRewards = mockRewards.filter(r => r.status === 'paused').length;
  const avgRedemption = mockRewards.reduce((sum, r) => sum + parseInt(r.redemptionRate), 0) / mockRewards.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Manage Rewards
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Monitor and manage your reward programs and redemptions
          </p>
        </div>
      </div>

      {/* Reward Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Play className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {activeRewards}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Active Rewards
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {totalClaimed}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Total Claims
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Pause className="h-5 w-5 text-orange-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {pausedRewards}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Paused
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-purple-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {Math.round(avgRedemption)}%
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Avg Redemption
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
              placeholder="Search rewards..." 
              className="max-w-sm"
            />
            <select className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800">
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="draft">Draft</option>
              <option value="expired">Expired</option>
            </select>
            <select className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800">
              <option value="">All Types</option>
              <option value="digital-badge">Digital Badge</option>
              <option value="discount-voucher">Discount Voucher</option>
              <option value="educational-access">Educational Access</option>
              <option value="certificate">Certificate</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Rewards List */}
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
                    <div className="flex items-center space-x-1">
                      {getStatusIcon(reward.status)}
                      <span>{reward.status}</span>
                    </div>
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-4">
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
                  <span>{reward.totalClaimed} total</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <Award className="h-4 w-4" />
                  <span>{reward.activeClaims} active</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <BarChart3 className="h-4 w-4" />
                  <span>{reward.redemptionRate} used</span>
                </div>
                {reward.expiryDate && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <Calendar className="h-4 w-4" />
                    <span>Expires {reward.expiryDate}</span>
                  </div>
                )}
              </div>

              {/* Redemption Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                  <span>Redemption Rate</span>
                  <span>{reward.redemptionRate}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ width: reward.redemptionRate }}
                  ></div>
                </div>
              </div>

              {/* Category and Created Date */}
              <div className="flex items-center space-x-4 mb-4">
                <Badge variant="outline">
                  {reward.category}
                </Badge>
                <Badge variant="outline">
                  {reward.availability}
                </Badge>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Created {reward.createdDate}
                </span>
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
                <Button variant="outline" size="sm">
                  <Users className="h-4 w-4 mr-2" />
                  View Claims
                </Button>
                
                {reward.status === 'active' && (
                  <Button variant="outline" size="sm">
                    <Pause className="h-4 w-4 mr-2" />
                    Pause
                  </Button>
                )}
                
                {reward.status === 'paused' && (
                  <Button variant="outline" size="sm" className="text-green-600 hover:text-green-700">
                    <Play className="h-4 w-4 mr-2" />
                    Resume
                  </Button>
                )}
                
                {reward.status === 'draft' && (
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
