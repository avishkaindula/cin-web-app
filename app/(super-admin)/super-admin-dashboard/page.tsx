import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Building, ClipboardCheck, Users, Activity, Clock, AlertTriangle } from "lucide-react"
import { mockOrganizationsExtended, mockTasks, mockPlatformUsers, mockActivityFeed } from "@/lib/mock-data"
import Link from "next/link"

export default function SuperAdminDashboard() {
  // Calculate statistics
  const totalOrgs = mockOrganizationsExtended.length
  const pendingOrgs = mockOrganizationsExtended.filter((org) => org.status === "pending").length
  const approvedOrgs = mockOrganizationsExtended.filter((org) => org.status === "approved").length
  const rejectedOrgs = mockOrganizationsExtended.filter((org) => org.status === "rejected").length

  const totalTasks = mockTasks.length
  const pendingTasks = mockTasks.filter((task) => task.status === "pending").length
  const approvedTasks = mockTasks.filter((task) => task.status === "approved").length
  const rejectedTasks = mockTasks.filter((task) => task.status === "rejected").length

  const totalUsers = mockPlatformUsers.length
  const bannedUsers = mockPlatformUsers.filter((user) => user.isBanned).length
  const activeUsers = totalUsers - bannedUsers

  const totalPendingApprovals = pendingOrgs + pendingTasks

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome back!</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Here's an overview of the Climate Intelligence Network platform.
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Organizations</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrgs}</div>
            <div className="flex items-center space-x-2 mt-2">
              <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                {approvedOrgs} approved
              </Badge>
              <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-700">
                {pendingOrgs} pending
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPendingApprovals}</div>
            <p className="text-xs text-muted-foreground">
              {pendingOrgs} orgs, {pendingTasks} tasks
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">{bannedUsers} banned users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">99.9%</div>
            <p className="text-xs text-muted-foreground">Uptime this month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity Feed */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest platform events and submissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockActivityFeed.slice(0, 5).map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    {activity.type === "organization_application" && (
                      <Building className="h-4 w-4 text-blue-500 mt-1" />
                    )}
                    {activity.type === "task_submission" && <ClipboardCheck className="h-4 w-4 text-green-500 mt-1" />}
                    {activity.type === "user_warning" && <AlertTriangle className="h-4 w-4 text-yellow-500 mt-1" />}
                    {activity.type === "system_event" && <Activity className="h-4 w-4 text-gray-500 mt-1" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.title}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{activity.description}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <p className="text-xs text-gray-400">{new Date(activity.timestamp).toLocaleString()}</p>
                      {activity.status && (
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            activity.status === "pending"
                              ? "text-yellow-600"
                              : activity.status === "approved"
                                ? "text-green-600"
                                : "text-red-600"
                          }`}
                        >
                          {activity.status}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              <Button asChild variant="outline" className="justify-start">
                <Link href="/organizations">
                  <Clock className="mr-2 h-4 w-4" />
                  Review Pending Organizations ({pendingOrgs})
                </Link>
              </Button>

              <Button asChild variant="outline" className="justify-start">
                <Link href="/task-manager">
                  <ClipboardCheck className="mr-2 h-4 w-4" />
                  Approve Pending Tasks ({pendingTasks})
                </Link>
              </Button>

              <Button asChild variant="outline" className="justify-start">
                <Link href="/users">
                  <Users className="mr-2 h-4 w-4" />
                  Manage Users
                </Link>
              </Button>

              <Button asChild variant="outline" className="justify-start">
                <Link href="/data-validation">
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Review Flagged Content
                </Link>
              </Button>
            </div>

            <div className="pt-4 border-t">
              <h4 className="text-sm font-medium mb-3">Platform Statistics</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Tasks Approved</span>
                  <span className="font-medium">{approvedTasks}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Organizations Active</span>
                  <span className="font-medium">{approvedOrgs}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Active Users</span>
                  <span className="font-medium">{activeUsers}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
