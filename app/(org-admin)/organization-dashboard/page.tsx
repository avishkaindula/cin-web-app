import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ClipboardList, Users, Award, Activity, Plus, TrendingUp, Target } from "lucide-react"
import { mockMembers, mockPrizes } from "@/lib/mock-data-extended"
import Link from "next/link"

export default function OrgAdminDashboard() {
  // Calculate statistics
  const totalMembers = mockMembers.length
  const activeMembers = mockMembers.filter((member) => member.status === "active").length
  const totalPointsDistributed = mockMembers.reduce((sum, member) => sum + member.pointsEarned, 0)
  const totalSubmissions = mockMembers.reduce((sum, member) => sum + member.submissionsCount, 0)
  const activePrizes = mockPrizes.filter((prize) => prize.status === "active").length
  const recentJoins = mockMembers.filter(
    (member) => new Date(member.joinedAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
  ).length

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome back!</h2>
        <p className="text-gray-600 dark:text-gray-400">Here's an overview of your organization's activity.</p>
      </div>

      {/* Organization Profile Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Green Tech Solutions
            <Badge variant="secondary" className="bg-green-100 text-green-700">
              Approved
            </Badge>
          </CardTitle>
          <CardDescription>Leading sustainable technology initiatives</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <Badge variant="outline">Player Organization</Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline">Task Maker</Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline">Prize Giver</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMembers}</div>
            <p className="text-xs text-muted-foreground">+{recentJoins} this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tasks</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">2 pending approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Points Distributed</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPointsDistributed.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{totalSubmissions} submissions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Prizes</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activePrizes}</div>
            <p className="text-xs text-muted-foreground">Available for redemption</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks for your organization</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild className="w-full justify-start">
              <Link href="/tasks/create">
                <Plus className="mr-2 h-4 w-4" />
                Create New Task
              </Link>
            </Button>

            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/join-requests">
                <Users className="mr-2 h-4 w-4" />
                Review Join Requests (2)
              </Link>
            </Button>

            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/prizes/create">
                <Award className="mr-2 h-4 w-4" />
                Create New Prize
              </Link>
            </Button>

            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/members">
                <TrendingUp className="mr-2 h-4 w-4" />
                View Member Analytics
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest events in your organization</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <Users className="h-4 w-4 text-blue-500 mt-1" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">New member joined</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Emily Chen joined your organization</p>
                  <p className="text-xs text-gray-400">2 hours ago</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <ClipboardList className="h-4 w-4 text-green-500 mt-1" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Task submission received</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    John Doe submitted Solar Panel Documentation
                  </p>
                  <p className="text-xs text-gray-400">4 hours ago</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <Award className="h-4 w-4 text-yellow-500 mt-1" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Prize redeemed</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Jane Smith redeemed Eco-Friendly Water Bottle
                  </p>
                  <p className="text-xs text-gray-400">1 day ago</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <Target className="h-4 w-4 text-purple-500 mt-1" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Task approved</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Solar Panel Installation Documentation was approved
                  </p>
                  <p className="text-xs text-gray-400">2 days ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Members */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Members</CardTitle>
          <CardDescription>Members with the highest points this month</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockMembers
              .sort((a, b) => b.pointsEarned - a.pointsEarned)
              .slice(0, 5)
              .map((member, index) => (
                <div key={member.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium">{index + 1}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{member.fullName}</p>
                      <p className="text-xs text-gray-500">{member.submissionsCount} submissions</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{member.pointsEarned} points</p>
                    <p className="text-xs text-gray-500">{member.badgesEarned} badges</p>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
