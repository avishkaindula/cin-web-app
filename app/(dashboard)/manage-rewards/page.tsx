import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Play, Users, Pause, BarChart3 } from "lucide-react";
import { getRewards } from "./actions";
import RewardsList from "./rewards-list";

export default async function ManageRewardsPage() {
  const { data: rewards, error } = await getRewards();

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="p-6">
          <div className="text-center">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        </Card>
      </div>
    );
  }

  const rewardsData = rewards || [];
  const activeRewards = rewardsData.filter((r) => r.status === "active").length;
  const totalClaimed = rewardsData.reduce((sum, r) => sum + r.totalClaimed, 0);
  const pausedRewards = rewardsData.filter((r) => r.status === "paused").length;
  const avgRedemption =
    rewardsData.length > 0
      ? rewardsData.reduce((sum, r) => sum + parseInt(r.redemptionRate), 0) / rewardsData.length
      : 0;

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

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <Input placeholder="Search rewards..." className="max-w-sm" />
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

      <RewardsList rewards={rewardsData} />
    </div>
  );
}
