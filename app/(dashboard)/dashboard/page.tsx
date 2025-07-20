"use client";

import {
  Card,
  CardContent,
  CardDescription, CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Activity,
  BarChart3,
  Building, Building2,
  CheckCircle,
  Clock, FileText, Target, TrendingUp, Users,
  XCircle,
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import React from "react";

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

const stats = {
  users: 12483,
  organizations: 387,
  submissions: 5642,
  missionsCreated: 924,
}
const recentActivity = [
  {
    type: 'user',
    action: 'joined',
    name: 'EcoWarrior',
    time: '2 minutes ago',
  },
  {
    type: 'mission',
    action: 'created',
    name: 'Coastal Cleanup',
    time: '15 minutes ago',
  },
  {
    type: 'organization',
    action: 'approved',
    name: 'Green Planet Initiative',
    time: '32 minutes ago',
  },
  {
    type: 'submission',
    action: 'reviewed',
    name: 'Reforestation Project',
    time: '1 hour ago',
  },
  {
    type: 'user',
    action: 'completed',
    name: 'ClimateDefender',
    time: '2 hours ago',
  },
]
const growthData = [
  {
    month: 'Jan',
    users: 8240,
    missions: 623,
  },
  {
    month: 'Feb',
    users: 9120,
    missions: 687,
  },
  {
    month: 'Mar',
    users: 9840,
    missions: 745,
  },
  {
    month: 'Apr',
    users: 10680,
    missions: 798,
  },
  {
    month: 'May',
    users: 11520,
    missions: 856,
  },
  {
    month: 'Jun',
    users: 12483,
    missions: 924,
  },
]

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
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Users Stat Card */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="bg-gray-100 dark:bg-blue-900/30 p-3 rounded-lg">
                  <Users size={24} className="text-blue-400" />
                </div>
                <div className="bg-[#1c2432] rounded-md px-2 py-1">
                  <span className="text-xs text-green-400">+8.4%</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>Total Users</CardDescription>
              <div className="text-2xl font-bold mt-1">
                {stats.users.toLocaleString()}
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex items-center">
                <TrendingUp size={14} className="text-green-400 mr-1" />
                <span className="text-xs text-gray-400">
                <span className="text-green-400">243</span> new this week
              </span>
              </div>
            </CardFooter>
          </Card>
          {/* Organizations Stat Card */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="bg-gray-100 dark:bg-teal-900/30 p-3 rounded-lg">
                  <Building2 size={24} className="text-teal-400" />
                </div>
                <div className="bg-[#1c2432] rounded-md px-2 py-1">
                  <span className="text-xs text-green-400">+5.2%</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>Organizations</CardDescription>
              <div className="text-2xl font-bold mt-1">
                {stats.organizations.toLocaleString()}
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex items-center">
                <TrendingUp size={14} className="text-green-400 mr-1" />
                <span className="text-xs text-gray-400">
                <span className="text-green-400">12</span> new this week
              </span>
              </div>
            </CardFooter>
          </Card>
          {/* Submissions Stat Card */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="bg-gray-100 dark:bg-purple-900/30 p-3 rounded-lg">
                  <FileText size={24} className="text-purple-400" />
                </div>
                <div className="bg-[#1c2432] rounded-md px-2 py-1">
                  <span className="text-xs text-green-400">+12.7%</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>Submissions</CardDescription>
              <div className="text-2xl font-bold mt-1">
                {stats.submissions.toLocaleString()}
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex items-center">
                <TrendingUp size={14} className="text-green-400 mr-1" />
                <span className="text-xs text-gray-400">
                <span className="text-green-400">87</span> new this week
              </span>
              </div>
            </CardFooter>
          </Card>
          {/* Missions Stat Card */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="bg-gray-100 dark:bg-green-900/30 p-3 rounded-lg">
                  <Target size={24} className="text-green-400" />
                </div>
                <div className="bg-[#1c2432] rounded-md px-2 py-1">
                  <span className="text-xs text-green-400">+9.3%</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>Missions Created</CardDescription>
              <div className="text-2xl font-bold mt-1">
                {stats.missionsCreated.toLocaleString()}
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex items-center">
                <TrendingUp size={14} className="text-green-400 mr-1" />
                <span className="text-xs text-gray-400">
                <span className="text-green-400">34</span> new this week
              </span>
              </div>
            </CardFooter>
          </Card>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Growth Chart */}
          <Card className="lg:col-span-2">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <BarChart3 size={20} className="mr-2 text-blue-400" />
                  Network Growth
                </CardTitle>
                <div className="flex items-center bg-[#1c2432] rounded-md px-3 py-1">
                  <Clock size={16} className="text-gray-400 mr-2" />
                  <span className="text-sm text-gray-300">Last 6 months</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-end justify-between">
                {growthData.map((data, index) => (
                    <div key={index} className="flex flex-col items-center w-1/6">
                      <div className="w-full flex justify-center space-x-1">
                        <div
                            className="w-3 bg-blue-500/70 rounded-t"
                            style={{
                              height: `${(data.users / 15000) * 200}px`,
                            }}
                        ></div>
                        <div
                            className="w-3 bg-green-500/70 rounded-t"
                            style={{
                              height: `${(data.missions / 1000) * 200}px`,
                            }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-400 mt-2">{data.month}</div>
                    </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex items-center justify-center w-full space-x-6">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500/70 rounded mr-2"></div>
                  <span className="text-xs text-gray-400">Users</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500/70 rounded mr-2"></div>
                  <span className="text-xs text-gray-400">Missions</span>
                </div>
              </div>
            </CardFooter>
          </Card>
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity size={20} className="mr-2 text-green-400" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start">
                      <div
                          className={`p-2 rounded-lg mr-3 ${activity.type === 'user' ? 'bg-gray-100 dark:bg-blue-900/30 text-blue-400' : activity.type === 'mission' ? 'bg-gray-100 dark:bg-green-900/30 text-green-400' : activity.type === 'organization' ? 'bg-gray-100 dark:bg-teal-900/30 text-teal-400' : 'bg-gray-100 dark:bg-purple-900/30 text-purple-400'}`}
                      >
                        {activity.type === 'user' && <Users size={16} />}
                        {activity.type === 'mission' && <Target size={16} />}
                        {activity.type === 'organization' && (
                            <Building2 size={16} />
                        )}
                        {activity.type === 'submission' && <FileText size={16} />}
                      </div>
                      <div>
                        <p className="text-sm">
                          <span className="font-medium">{activity.name}</span>
                          <span className="text-gray-400"> {activity.action}</span>
                        </p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <button className="w-full py-2 text-sm dark:text-gray-400 dark:hover:font-semibold text-black hover:text-white border border-gray-700 rounded-md hover:bg-black dark:hover:bg-[#1c2432] transition-colors">
                View All Activity
              </button>
            </CardFooter>
          </Card>
        </div>
      </div>

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
