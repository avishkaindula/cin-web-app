"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { StatusBadge } from "@/components/ui/status-badge"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Eye, MoreHorizontal, User, Award, AlertTriangle, Ban, RotateCcw } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { mockPlatformUsers } from "@/lib/mock-data"
import type { PlatformUser } from "@/lib/mock-data"
import { useToast } from "@/hooks/use-toast"

export default function UsersPage() {
  const [users, setUsers] = useState<PlatformUser[]>(mockPlatformUsers)
  const [selectedUser, setSelectedUser] = useState<PlatformUser | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { toast } = useToast()

  const handleBanUser = async (id: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setUsers((prev) =>
      prev.map((user) =>
        user.id === id
          ? { ...user, isBanned: true, banExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() }
          : user,
      ),
    )

    toast({
      title: "User Banned",
      description: "The user has been banned for 30 days.",
      variant: "destructive",
    })
  }

  const handleUnbanUser = async (id: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setUsers((prev) =>
      prev.map((user) => (user.id === id ? { ...user, isBanned: false, banExpiresAt: undefined } : user)),
    )

    toast({
      title: "User Unbanned",
      description: "The user has been unbanned and can access the platform again.",
    })
  }

  const handleResetWarnings = async (id: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setUsers((prev) => prev.map((user) => (user.id === id ? { ...user, warningCount: 0 } : user)))

    toast({
      title: "Warnings Reset",
      description: "The user's warning count has been reset to zero.",
    })
  }

  const columns: ColumnDef<PlatformUser>[] = [
    {
      accessorKey: "fullName",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const user = row.original
        return (
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4 text-gray-500" />
            <div>
              <div className="font-medium">{user.fullName}</div>
              <div className="text-sm text-gray-500">@{user.username}</div>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => {
        return <span className="text-sm">{row.getValue("email")}</span>
      },
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {
        const role = row.getValue("role") as string
        const roleColors = {
          USER: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
          ORG_ADMIN: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
          SUPER_ADMIN: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
        }
        return <Badge className={roleColors[role as keyof typeof roleColors]}>{role.replace("_", " ")}</Badge>
      },
    },
    {
      accessorKey: "totalPoints",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Points
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        return (
          <div className="flex items-center space-x-1">
            <Award className="h-4 w-4 text-yellow-500" />
            <span className="font-medium">{row.getValue("totalPoints")}</span>
          </div>
        )
      },
    },
    {
      accessorKey: "warningCount",
      header: "Warnings",
      cell: ({ row }) => {
        const warnings = row.getValue("warningCount") as number
        return (
          <div className="flex items-center space-x-1">
            <AlertTriangle className={`h-4 w-4 ${warnings > 0 ? "text-yellow-500" : "text-gray-400"}`} />
            <span className={warnings > 2 ? "text-red-600 font-medium" : ""}>{warnings}</span>
          </div>
        )
      },
    },
    {
      accessorKey: "isBanned",
      header: "Status",
      cell: ({ row }) => {
        const isBanned = row.getValue("isBanned") as boolean
        return <StatusBadge status={isBanned ? "banned" : "active"} />
      },
    },
    {
      accessorKey: "joinedAt",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Join Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const date = row.getValue("joinedAt") as string
        return <span className="text-sm">{new Date(date).toLocaleDateString()}</span>
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const user = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => {
                  setSelectedUser(user)
                  setIsModalOpen(true)
                }}
              >
                <Eye className="mr-2 h-4 w-4" />
                View Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {user.isBanned ? (
                <DropdownMenuItem onClick={() => handleUnbanUser(user.id)}>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Unban User
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem onClick={() => handleBanUser(user.id)}>
                  <Ban className="mr-2 h-4 w-4" />
                  Ban User
                </DropdownMenuItem>
              )}
              {user.warningCount > 0 && (
                <DropdownMenuItem onClick={() => handleResetWarnings(user.id)}>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Reset Warnings
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const totalUsers = users.length
  const bannedUsers = users.filter((user) => user.isBanned).length
  const activeUsers = totalUsers - bannedUsers
  const usersWithWarnings = users.filter((user) => user.warningCount > 0).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">User Management</h2>
          <p className="text-gray-600 dark:text-gray-400">Manage platform users and their activities</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeUsers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Banned Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{bannedUsers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Users with Warnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{usersWithWarnings}</div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>View and manage all platform users</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={users} searchKey="fullName" searchPlaceholder="Search users..." />
        </CardContent>
      </Card>

      {/* User Profile Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>User Profile</DialogTitle>
            <DialogDescription>Detailed user information and activity</DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold">Basic Information</h3>
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm font-medium">Full Name</p>
                      <p className="text-sm text-gray-600">{selectedUser.fullName}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Username</p>
                      <p className="text-sm text-gray-600">@{selectedUser.username}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Email</p>
                      <p className="text-sm text-gray-600">{selectedUser.email}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Location</p>
                      <p className="text-sm text-gray-600">{selectedUser.location || "Not specified"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Role</p>
                      <Badge className="mt-1">{selectedUser.role.replace("_", " ")}</Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-lg font-semibold">Activity & Points</h3>
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm font-medium">Total Points</p>
                      <p className="text-sm text-gray-600">{selectedUser.totalPoints}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Redeemable Points</p>
                      <p className="text-sm text-gray-600">{selectedUser.redeemablePoints}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Leaderboard Points</p>
                      <p className="text-sm text-gray-600">{selectedUser.leaderboardPoints}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Badge Count</p>
                      <p className="text-sm text-gray-600">{selectedUser.badgeCount}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Warning Count</p>
                      <p className={`text-sm ${selectedUser.warningCount > 2 ? "text-red-600" : "text-gray-600"}`}>
                        {selectedUser.warningCount}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Account Status</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Status</p>
                    <StatusBadge status={selectedUser.isBanned ? "banned" : "active"} />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Joined</p>
                    <p className="text-sm text-gray-600">{new Date(selectedUser.joinedAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Last Active</p>
                    <p className="text-sm text-gray-600">{new Date(selectedUser.lastActive).toLocaleDateString()}</p>
                  </div>
                  {selectedUser.banExpiresAt && (
                    <div>
                      <p className="text-sm font-medium">Ban Expires</p>
                      <p className="text-sm text-red-600">{new Date(selectedUser.banExpiresAt).toLocaleDateString()}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                {selectedUser.isBanned ? (
                  <Button onClick={() => handleUnbanUser(selectedUser.id)}>Unban User</Button>
                ) : (
                  <Button variant="destructive" onClick={() => handleBanUser(selectedUser.id)}>
                    Ban User
                  </Button>
                )}
                {selectedUser.warningCount > 0 && (
                  <Button variant="outline" onClick={() => handleResetWarnings(selectedUser.id)}>
                    Reset Warnings
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
