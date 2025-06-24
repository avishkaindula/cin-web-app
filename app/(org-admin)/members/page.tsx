"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/ui/data-table"
import { StatusBadge } from "@/components/ui/status-badge"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Eye, MoreHorizontal, User, Award, Calendar, Activity } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { mockMembers } from "@/lib/mock-data-extended"
import type { Member } from "@/lib/mock-data-extended"
import { useToast } from "@/hooks/use-toast"

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>(mockMembers)
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { toast } = useToast()

  const handleRemoveMember = async (id: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setMembers((prev) => prev.filter((member) => member.id !== id))

    toast({
      title: "Member Removed",
      description: "The member has been removed from your organization.",
      variant: "destructive",
    })
  }

  const columns: ColumnDef<Member>[] = [
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
        const member = row.original
        return (
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4 text-gray-500" />
            <div>
              <div className="font-medium">{member.fullName}</div>
              <div className="text-sm text-gray-500">{member.email}</div>
            </div>
          </div>
        )
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
        return (
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-sm">{new Date(date).toLocaleDateString()}</span>
          </div>
        )
      },
    },
    {
      accessorKey: "pointsEarned",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Points Earned
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        return (
          <div className="flex items-center space-x-1">
            <Award className="h-4 w-4 text-yellow-500" />
            <span className="font-medium">{row.getValue("pointsEarned")}</span>
          </div>
        )
      },
    },
    {
      accessorKey: "submissionsCount",
      header: "Submissions",
      cell: ({ row }) => {
        return <span className="font-medium">{row.getValue("submissionsCount")}</span>
      },
    },
    {
      accessorKey: "badgesEarned",
      header: "Badges",
      cell: ({ row }) => {
        return <Badge variant="outline">{row.getValue("badgesEarned")}</Badge>
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string
        return <StatusBadge status={status === "active" ? "active" : "banned"} />
      },
    },
    {
      accessorKey: "lastActivity",
      header: "Last Active",
      cell: ({ row }) => {
        const date = row.getValue("lastActivity") as string
        return <span className="text-sm">{new Date(date).toLocaleDateString()}</span>
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const member = row.original

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
                  setSelectedMember(member)
                  setIsModalOpen(true)
                }}
              >
                <Eye className="mr-2 h-4 w-4" />
                View Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleRemoveMember(member.id)} className="text-red-600">
                Remove Member
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const totalMembers = members.length
  const activeMembers = members.filter((member) => member.status === "active").length
  const totalPoints = members.reduce((sum, member) => sum + member.pointsEarned, 0)
  const totalSubmissions = members.reduce((sum, member) => sum + member.submissionsCount, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Members</h2>
          <p className="text-gray-600 dark:text-gray-400">Manage your organization's members and their activities</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMembers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeMembers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Points</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{totalPoints.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{totalSubmissions}</div>
          </CardContent>
        </Card>
      </div>

      {/* Members Table */}
      <Card>
        <CardHeader>
          <CardTitle>Organization Members</CardTitle>
          <CardDescription>View and manage all members of your organization</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={members} searchKey="fullName" searchPlaceholder="Search members..." />
        </CardContent>
      </Card>

      {/* Member Profile Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Member Profile</DialogTitle>
            <DialogDescription>Detailed member information and activity</DialogDescription>
          </DialogHeader>

          {selectedMember && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold">Basic Information</h3>
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm font-medium">Full Name</p>
                      <p className="text-sm text-gray-600">{selectedMember.fullName}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Email</p>
                      <p className="text-sm text-gray-600">{selectedMember.email}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Location</p>
                      <p className="text-sm text-gray-600">{selectedMember.location || "Not specified"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Status</p>
                      <StatusBadge status={selectedMember.status === "active" ? "active" : "banned"} />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-lg font-semibold">Activity & Performance</h3>
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm font-medium">Points Earned</p>
                      <p className="text-sm text-gray-600">{selectedMember.pointsEarned}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Submissions</p>
                      <p className="text-sm text-gray-600">{selectedMember.submissionsCount}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Badges Earned</p>
                      <p className="text-sm text-gray-600">{selectedMember.badgesEarned}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Joined</p>
                      <p className="text-sm text-gray-600">{new Date(selectedMember.joinedAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Last Active</p>
                      <p className="text-sm text-gray-600">
                        {new Date(selectedMember.lastActivity).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Recent Activity</h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3 p-3 border rounded-lg">
                    <Activity className="h-4 w-4 text-green-500 mt-1" />
                    <div>
                      <p className="text-sm font-medium">Completed Solar Panel Documentation</p>
                      <p className="text-xs text-gray-500">Earned 50 points • 2 days ago</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 border rounded-lg">
                    <Award className="h-4 w-4 text-yellow-500 mt-1" />
                    <div>
                      <p className="text-sm font-medium">Earned "Environmental Champion" badge</p>
                      <p className="text-xs text-gray-500">1 week ago</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 border rounded-lg">
                    <User className="h-4 w-4 text-blue-500 mt-1" />
                    <div>
                      <p className="text-sm font-medium">Joined organization</p>
                      <p className="text-xs text-gray-500">{new Date(selectedMember.joinedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="destructive" onClick={() => handleRemoveMember(selectedMember.id)}>
                  Remove Member
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
