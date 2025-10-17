import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Gift, 
  Calendar, 
  Award, 
  DollarSign,
  Clock,
  Edit,
  Trash2,
  Users,
  Star
} from "lucide-react";
import { getRewards } from "../manage-rewards/actions";
import CreateRewardForm from "./create-reward-form";

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
    case 'digital-badge':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
    case 'discount-voucher':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    case 'educational-access':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    case 'certificate':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case 'physical-item':
      return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300';
    case 'experience':
      return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
  }
};

const formatType = (type: string) => {
  return type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

export default async function CreateRewardsPage() {
  const { data: rewards, error } = await getRewards();
  const rewardsData = rewards || [];

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
      </div>

      {/* Create Reward Form */}
      <CreateRewardForm />

      {/* Existing Rewards */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Your Rewards ({rewardsData.length})
        </h2>
        
        {error && (
          <Card className="p-6 mb-4">
            <p className="text-red-600 dark:text-red-400 text-center">{error}</p>
          </Card>
        )}

        {rewardsData.length === 0 && !error ? (
          <Card className="p-12">
            <div className="text-center">
              <Gift className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No rewards yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Create your first reward to start incentivizing climate action
              </p>
            </div>
          </Card>
        ) : (
          <div className="grid gap-4">
            {rewardsData.map((reward) => (
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
                        {formatType(reward.type)}
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
                      <span>{reward.points_cost} points</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                      <DollarSign className="h-4 w-4" />
                      <span>{reward.value || 'N/A'}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                      <Users className="h-4 w-4" />
                      <span>{reward.totalClaimed} claimed</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                      <Award className="h-4 w-4" />
                      <span>{reward.availability}</span>
                    </div>
                    {reward.expiry_date && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                        <Calendar className="h-4 w-4" />
                        <span>Expires {new Date(reward.expiry_date).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>

                  {/* Category and Created Date */}
                  <div className="flex items-center space-x-4 mb-4">
                    <Badge variant="outline">
                      {reward.category}
                    </Badge>
                    {reward.created_at && (
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Created {new Date(reward.created_at).toLocaleDateString()}
                      </span>
                    )}
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
        )}
      </div>
    </div>
  );
}
