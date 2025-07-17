"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Building,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import {StatDashboard} from "@/components/StatDashboard";

const getStatusIcon = (status: string) => {
  switch (status) {
    case "approved":
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    case "pending":
      return <Clock className="h-4 w-4 text-yellow-600" />;
    case "rejected":
      return <XCircle className="h-4 w-4 text-red-600" />;
    default:
      return null;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "approved":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case "pending":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    case "rejected":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
  }
};

export default function DashboardPage() {
  const { isCinAdmin, isOrgAdmin, activeOrganization, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  // Get approved capabilities if we have an active organization
  const approvedCapabilities =
    activeOrganization?.capabilities?.filter(
      (cap) => cap.status === "approved"
    ) || [];
  const hasPlayerOrg = approvedCapabilities.some(
    (cap) => cap.type === "player_org"
  );
  const hasMissionCreator = approvedCapabilities.some(
    (cap) => cap.type === "mission_creator"
  );
  const hasRewardCreator = approvedCapabilities.some(
    (cap) => cap.type === "reward_creator"
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Welcome to Climate Intelligence Network
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          {isCinAdmin
            ? "CIN Administrator"
            : activeOrganization
            ? `${activeOrganization.name} - Organization Dashboard`
            : "Dashboard"}
        </p>
      </div>

      {/* Organization Status Card - Only show if user has an active organization */}
      {activeOrganization && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building className="h-5 w-5" />
              <span>{activeOrganization.name}</span>
            </CardTitle>
            <CardDescription>
              Current capabilities and approval status for{" "}
              {activeOrganization.name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {activeOrganization.capabilities?.map((capability) => (
                <div
                  key={capability.type}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(capability.status)}
                    <span className="font-medium capitalize">
                      {capability.type.replace("_", " ")}
                    </span>
                  </div>
                  <Badge className={getStatusColor(capability.status)}>
                    {capability.status}
                  </Badge>
                </div>
              )) || []}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stat Grid */}
      <StatDashboard/>

      {/* Pending Capabilities Notice */}
      {activeOrganization?.capabilities?.some(
        (cap) => cap.status === "pending"
      ) && (
        <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950">
          <CardHeader>
            <CardTitle className="text-yellow-800 dark:text-yellow-200">
              Pending Approvals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-yellow-700 dark:text-yellow-300">
              You have capabilities pending approval. Once approved by CIN
              administrators, additional features will become available in your
              dashboard.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
