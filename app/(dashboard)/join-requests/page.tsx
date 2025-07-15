"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { StatusBadge } from "@/components/ui/status-badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Eye, MoreHorizontal, User, Award, Calendar, CheckCircle, XCircle } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"

interface JoinRequest {
  id: string
  userId: string
  userName: string
  userEmail: string
  requestDate: string
  message?: string
  status: "pending" | "approved" | "rejected"
  userProfile: {
    totalPoints: number
    badgeCount: number
    joinDate: string
    location?: string
  }
}

// Mock data for join requests
const mockJoinRequests: JoinRequest[] = [
  {
    id: "1",
    userId: "user_001",
    userName: "Sarah Johnson",
    userEmail: "sarah.johnson@email.com",
    requestDate: "2025-01-12T10:30:00Z",
    status: "pending",
    message: "I am passionate about combating climate change and would love to contribute to your organization's mission. I have 5 years of experience in climate research and environmental science.",
    userProfile: {
      totalPoints: 1250,
      badgeCount: 8,
      joinDate: "2024-06-15T00:00:00Z",
      location: "San Francisco, CA"
    }
  },
  {
    id: "2", 
    userId: "user_002",
    userName: "Michael Chen",
    userEmail: "michael.chen@email.com",
    requestDate: "2025-01-11T15:45:00Z",
    status: "pending",
    message: "As a software engineer, I want to use my technical skills to help solve the climate crisis. I specialize in full-stack development and have experience with IoT and data visualization.",
    userProfile: {
      totalPoints: 890,
      badgeCount: 5,
      joinDate: "2024-09-20T00:00:00Z",
      location: "Austin, TX"
    }
  }
];

export default function JoinRequestsPage() {
  const [requests, setRequests] = useState<JoinRequest[]>(mockJoinRequests)
  const [selectedRequest, setSelectedRequest] = useState<JoinRequest | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [responseMessage, setResponseMessage] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const { toast } = useToast()

  const handleApproveRequest = async (id: string, message?: string) => {
    setIsProcessing(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setRequests((prev) => prev.map((req) => (req.id === id ? { ...req, status: "approved" as const } : req)))

    toast({
      title: "Request Approved",
      description: "The user has been added to your organization and notified.",
    })

    setIsProcessing(false)
    setIsModalOpen(false)
    setResponseMessage("")
  }

  const handleRejectRequest = async (id: string, message?: string) => {
    setIsProcessing(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setRequests((prev) => prev.map((req) => (req.id === id ? { ...req, status: "rejected" as const } : req)))

    toast({
      title: "Request Rejected",
      description: "The user has been notified that their request was not approved.",
      variant: "destructive",
    })

    setIsProcessing(false)
    setIsModalOpen(false)
    setResponseMessage("")
  }

  const columns: ColumnDef<JoinRequest>[] = [
    {
      accessorKey: "userName",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            User Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const request = row.original
        return (
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4 text-gray-500" />
            <div>
              <div className="font-medium">{request.userName}</div>
              <div className="text-sm text-gray-500">{request.userEmail}</div>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "requestDate",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Request Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const date = row.getValue("requestDate") as string
        return (
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-sm">{new Date(date).toLocaleDateString()}</span>
          </div>
        )
      },
    },
    {
      accessorKey: "userProfile",
      header: "User Stats",
      cell: ({ row }) => {
        const profile = row.getValue("userProfile") as JoinRequest["userProfile"]
        return (
          <div className="space-y-1">
            <div className="flex items-center space-x-1">
              <Award className="h-3 w-3 text-yellow-500" />
              <span className="text-sm">{profile.totalPoints} points</span>
            </div>
            <div className="text-xs text-gray-500">{profile.badgeCount} badges</div>
          </div>
        )
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        return <StatusBadge status={row.getValue("status")} />
      },
    },
    {
      accessorKey: "message",
      header: "Message",
      cell: ({ row }) => {
        const message = row.getValue("message") as string
        return message ? (
          <div className="max-w-xs truncate text-sm" title={message}>
            {message}
          </div>
        ) : (
          <span className="text-gray-400 text-sm">No message</span>
        )
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const request = row.original

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
                  setSelectedRequest(request)
                  setIsModalOpen(true)
                }}
              >
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              {request.status === "pending" && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleApproveRequest(request.id)}>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Approve Request
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleRejectRequest(request.id)}>
                    <XCircle className="mr-2 h-4 w-4" />
                    Reject Request
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const pendingRequests = requests.filter((req) => req.status === "pending")
  const approvedRequests = requests.filter((req) => req.status === "approved")
  const rejectedRequests = requests.filter((req) => req.status === "rejected")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Join Requests</h2>
          <p className="text-gray-600 dark:text-gray-400">Review and approve member join requests</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{requests.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingRequests.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{approvedRequests.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{rejectedRequests.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Join Requests Table */}
      <Card>
        <CardHeader>
          <CardTitle>Join Requests</CardTitle>
          <CardDescription>Review requests from users wanting to join your organization</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={requests} searchKey="userName" searchPlaceholder="Search requests..." />
        </CardContent>
      </Card>

      {/* Request Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Join Request Details</DialogTitle>
            <DialogDescription>Review user information and approve or reject the request</DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold">User Information</h3>
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm font-medium">Name</p>
                      <p className="text-sm text-gray-600">{selectedRequest.userName}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Email</p>
                      <p className="text-sm text-gray-600">{selectedRequest.userEmail}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Location</p>
                      <p className="text-sm text-gray-600">{selectedRequest.userProfile.location || "Not specified"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Request Date</p>
                      <p className="text-sm text-gray-600">
                        {new Date(selectedRequest.requestDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-lg font-semibold">User Activity</h3>
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm font-medium">Total Points</p>
                      <p className="text-sm text-gray-600">{selectedRequest.userProfile.totalPoints}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Badges Earned</p>
                      <p className="text-sm text-gray-600">{selectedRequest.userProfile.badgeCount}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Platform Member Since</p>
                      <p className="text-sm text-gray-600">
                        {new Date(selectedRequest.userProfile.joinDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Status</p>
                      <StatusBadge status={selectedRequest.status} />
                    </div>
                  </div>
                </div>
              </div>

              {selectedRequest.message && (
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Request Message</h3>
                  <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-sm text-gray-700 dark:text-gray-300">{selectedRequest.message}</p>
                  </div>
                </div>
              )}

              {selectedRequest.status === "pending" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="response">Response Message (Optional)</Label>
                    <Textarea
                      id="response"
                      placeholder="Add a message to include with your decision..."
                      value={responseMessage}
                      onChange={(e) => setResponseMessage(e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="destructive"
                      onClick={() => handleRejectRequest(selectedRequest.id, responseMessage)}
                      disabled={isProcessing}
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Reject Request
                    </Button>
                    <Button
                      onClick={() => handleApproveRequest(selectedRequest.id, responseMessage)}
                      disabled={isProcessing}
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Approve Request
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
