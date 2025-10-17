"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Gift,
  Calendar,
  Award,
  DollarSign,
  Clock,
  Trash2,
  Users,
  Star,
  BarChart3,
  Play,
  Pause,
} from "lucide-react";
import { RewardWithStats } from "./actions";
import { updateRewardStatus, deleteReward } from "./actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState, useTransition } from "react";

interface RewardsListProps {
  rewards: RewardWithStats[];
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case "draft":
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    case "expired":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    case "paused":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case "Digital Badge":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
    case "Discount Voucher":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    case "Educational Access":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    case "Certificate":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case "Credit Voucher":
      return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "active":
      return <Play className="h-4 w-4" />;
    case "paused":
      return <Pause className="h-4 w-4" />;
    case "expired":
      return <Clock className="h-4 w-4" />;
    default:
      return <Gift className="h-4 w-4" />;
  }
};

export default function RewardsList({ rewards }: RewardsListProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = async (
    rewardId: string,
    newStatus: "active" | "paused" | "draft" | "expired"
  ) => {
    startTransition(async () => {
      const result = await updateRewardStatus(rewardId, newStatus);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`Reward ${newStatus} successfully`);
        router.refresh();
      }
    });
  };

  const handleDelete = async (rewardId: string) => {
    if (!confirm("Are you sure you want to delete this reward?")) return;

    startTransition(async () => {
      const result = await deleteReward(rewardId);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Reward deleted successfully");
        router.refresh();
      }
    });
  };

  if (rewards.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <Gift className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            No rewards found. Create your first reward to get started!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {rewards.map((reward) => (
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
                <span>{reward.points_cost} points</span>
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
              {reward.expiry_date && (
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Expires {new Date(reward.expiry_date).toLocaleDateString()}
                  </span>
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
              <Badge variant="outline">{reward.category}</Badge>
              <Badge variant="outline">{reward.availability}</Badge>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Created{" "}
                {reward.created_at
                  ? new Date(reward.created_at).toLocaleDateString()
                  : "N/A"}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              {reward.status === "active" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleStatusChange(reward.id, "paused")}
                  disabled={isPending}
                >
                  <Pause className="h-4 w-4 mr-2" />
                  Pause
                </Button>
              )}

              {reward.status === "paused" && (
                <Button
                  variant="outline"
                  size="sm"
                  className="text-green-600 hover:text-green-700"
                  onClick={() => handleStatusChange(reward.id, "active")}
                  disabled={isPending}
                >
                  <Play className="h-4 w-4 mr-2" />
                  Resume
                </Button>
              )}

              {reward.status === "draft" && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-green-600 hover:text-green-700"
                    onClick={() => handleStatusChange(reward.id, "active")}
                    disabled={isPending}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Publish
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                    onClick={() => handleDelete(reward.id)}
                    disabled={isPending}
                  >
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
  );
}
