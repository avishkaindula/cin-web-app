"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DataTable } from "@/components/ui/data-table"
import { StatusBadge } from "@/components/ui/status-badge"
import SubmissionViewer from "@/components/submission-viewer"
import { Badge } from "@/components/ui/badge"
import type { ColumnDef } from "@tanstack/react-table"
import {
  ArrowUpDown,
  Eye,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Flag,
  AlertTriangle,
  FileImage,
  Target,
  Users,
  Calendar,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { mockSubmissionReviews, mockUserWarnings } from "@/lib/mock-data-extended"
import type { SubmissionReview, UserWarning } from "@/lib/mock-data-extended"
import { useToast } from "@/hooks/use-toast"

export default function DataValidationPage() {
  const [submissions, setSubmissions] = useState<SubmissionReview[]>(mockSubmissionReviews)
  const [warnings, setWarnings] = useState<UserWarning[]>(mockUserWarnings)
  const [selectedSubmission, setSelectedSubmission] = useState<SubmissionReview | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { toast } = useToast()

  const handleApproveSubmission = async (id: string, points: number, notes?: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setSubmissions((prev) =>
      prev.map((sub) =>
        sub.id === id
          ? {
              ...sub,
              status: "approved" as const,
              pointsAwarded: points,
              reviewNotes: notes,
              reviewedBy: "admin@climate.network",
              reviewedAt: new Date().toISOString(),
            }
          : sub,
      ),
    )

    toast({
      title: "Submission Approved",
      description: `Submission approved and ${points} points awarded to user.`,
    })
  }

  const handleRejectSubmission = async (id: string, reason: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setSubmissions((prev) =>
      prev.map((sub) =>
        sub.id === id
          ? {
              ...sub,
              status: "rejected" as const,
              reviewNotes: reason,
              reviewedBy: "admin@climate.network",
              reviewedAt: new Date().toISOString(),
            }
          : sub,
      ),
    )

    toast({
      title: "Submission Rejected",
      description: "Submission has been rejected and user has been notified.",
      variant: "destructive",
    })
  }

  const handleFlagSubmission = async (id: string, reason: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setSubmissions((prev) =>
      prev.map((sub) =>
        sub.id === id
          ? {
              ...sub,
              status: "flagged" as const,
              flagReason: reason,
              reviewedBy: "admin@climate.network",
              reviewedAt: new Date().toISOString(),
            }
          : sub,
      ),
    )

    toast({
      title: "Submission Flagged",
      description: "Submission has been flagged for further review.",
    })
  }

  const getTaskTypeIcon = (type: string) => {
    switch (type) {
      case "photo_submission":
        return <FileImage className="h-4 w-4 text-blue-500" />
      case "data_collection":
        return <Target className="h-4 w-4 text-green-500" />
      case "survey":
        return <Users className="h-4 w-4 text-purple-500" />
      case "observation":
        return <AlertTriangle className="h-4 w-4 text-orange-500" />
      default:
        return <Target className="h-4 w-4 text-gray-500" />
    }
  }

  const submissionColumns: ColumnDef<SubmissionReview>[] = [
    {
      accessorKey: "taskTitle",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Task
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const submission = row.original
        return (
          <div className="flex items-center space-x-2">
            {getTaskTypeIcon(submission.taskType)}
            <div>
              <div className="font-medium">{submission.taskTitle}</div>
              <div className="text-sm text-gray-500">{submission.organizationName}</div>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "userName",
      header: "User",
      cell: ({ row }) => {
        const submission = row.original
        return (
          <div>
            <div className="font-medium">{submission.userName}</div>
            <div className="text-sm text-gray-500">{submission.userEmail}</div>
          </div>
        )
      },
    },
    {
      accessorKey: "submittedAt",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Submitted
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const date = row.getValue("submittedAt") as string
        return (
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-sm">{new Date(date).toLocaleDateString()}</span>
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
      accessorKey: "attachments",
      header: "Files",
      cell: ({ row }) => {
        const attachments = row.getValue("attachments") as SubmissionReview["attachments"]
        return attachments.length > 0 ? (
          <Badge variant="outline">{attachments.length} files</Badge>
        ) : (
          <span className="text-gray-400 text-sm">No files</span>
        )
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const submission = row.original

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
                  setSelectedSubmission(submission)
                  setIsModalOpen(true)
                }}
              >
                <Eye className="mr-2 h-4 w-4" />
                Review Submission
              </DropdownMenuItem>
              {submission.status === "pending" && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => {
                      setSelectedSubmission(submission)
                      setIsModalOpen(true)
                    }}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Approve
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setSelectedSubmission(submission)
                      setIsModalOpen(true)
                    }}
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Reject
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setSelectedSubmission(submission)
                      setIsModalOpen(true)
                    }}
                  >
                    <Flag className="mr-2 h-4 w-4" />
                    Flag
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const warningColumns: ColumnDef<UserWarning>[] = [
    {
      accessorKey: "userName",
      header: "User",
      cell: ({ row }) => {
        return <span className="font-medium">{row.getValue("userName")}</span>
      },
    },
    {
      accessorKey: "warningType",
      header: "Type",
      cell: ({ row }) => {
        const type = row.getValue("warningType") as string
        const typeColors = {
          invalid_data: "bg-yellow-100 text-yellow-800",
          spam: "bg-red-100 text-red-800",
          inappropriate_content: "bg-purple-100 text-purple-800",
          location_mismatch: "bg-blue-100 text-blue-800",
        }
        return (
          <Badge className={typeColors[type as keyof typeof typeColors]}>
            {type.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
          </Badge>
        )
      },
    },
    {
      accessorKey: "severity",
      header: "Severity",
      cell: ({ row }) => {
        const severity = row.getValue("severity") as string
        const severityColors = {
          low: "bg-green-100 text-green-800",
          medium: "bg-yellow-100 text-yellow-800",
          high: "bg-red-100 text-red-800",
        }
        return (
          <Badge className={severityColors[severity as keyof typeof severityColors]}>
            {severity.charAt(0).toUpperCase() + severity.slice(1)}
          </Badge>
        )
      },
    },
    {
      accessorKey: "reason",
      header: "Reason",
      cell: ({ row }) => {
        const reason = row.getValue("reason") as string
        return (
          <div className="max-w-xs truncate text-sm" title={reason}>
            {reason}
          </div>
        )
      },
    },
    {
      accessorKey: "issuedAt",
      header: "Issued",
      cell: ({ row }) => {
        const date = row.getValue("issuedAt") as string
        return <span className="text-sm">{new Date(date).toLocaleDateString()}</span>
      },
    },
    {
      accessorKey: "pointsReverted",
      header: "Points Reverted",
      cell: ({ row }) => {
        return <span className="font-medium">{row.getValue("pointsReverted")}</span>
      },
    },
  ]

  const pendingSubmissions = submissions.filter((sub) => sub.status === "pending")
  const flaggedSubmissions = submissions.filter((sub) => sub.status === "flagged")
  const approvedSubmissions = submissions.filter((sub) => sub.status === "approved")
  const rejectedSubmissions = submissions.filter((sub) => sub.status === "rejected")

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Data Validation</h2>
        <p className="text-gray-600 dark:text-gray-400">Review and validate climate data submissions from users</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingSubmissions.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Flagged Content</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{flaggedSubmissions.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Approved Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{approvedSubmissions.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Warnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{warnings.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Data Validation Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Data Validation Dashboard</CardTitle>
          <CardDescription>Review submissions and manage data quality</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pending" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="pending">Pending ({pendingSubmissions.length})</TabsTrigger>
              <TabsTrigger value="flagged">Flagged ({flaggedSubmissions.length})</TabsTrigger>
              <TabsTrigger value="approved">Approved ({approvedSubmissions.length})</TabsTrigger>
              <TabsTrigger value="warnings">Warnings ({warnings.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="pending">
              <DataTable columns={submissionColumns} data={pendingSubmissions} />
            </TabsContent>
            <TabsContent value="flagged">
              <DataTable columns={submissionColumns} data={flaggedSubmissions} />
            </TabsContent>
            <TabsContent value="approved">
              <DataTable columns={submissionColumns} data={approvedSubmissions} />
            </TabsContent>
            <TabsContent value="warnings">
              <DataTable columns={warningColumns} data={warnings} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Submission Viewer Modal */}
      <SubmissionViewer
        submission={selectedSubmission}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onApprove={handleApproveSubmission}
        onReject={handleRejectSubmission}
        onFlag={handleFlagSubmission}
      />
    </div>
  )
}
