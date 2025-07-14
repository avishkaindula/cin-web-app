"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DataTable } from "@/components/ui/data-table"
import { StatusBadge } from "@/components/ui/status-badge"
import { TaskDetailsModal } from "@/components/task-details-modal"
import { Badge } from "@/components/ui/badge"
import type { ColumnDef } from "@tanstack/react-table"
import {
  ArrowUpDown,
  Eye,
  MoreHorizontal,
  Award,
  Calendar,
  Building,
  FileImage,
  Target,
  Users,
  AlertCircle,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { mockTasks } from "@/lib/mock-data"
import type { Task } from "@/lib/mock-data"
import { useToast } from "@/hooks/use-toast"

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { toast } = useToast()

  const handleApproveTask = async (id: string, notes?: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, status: "approved" as const } : task)))

    toast({
      title: "Task Approved",
      description: "The task has been successfully approved and is now available to users.",
    })
  }

  const handleRejectTask = async (id: string, reason: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, status: "rejected" as const, rejectionReason: reason } : task)),
    )

    toast({
      title: "Task Rejected",
      description: "The task has been rejected and the organization has been notified.",
      variant: "destructive",
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
        return <AlertCircle className="h-4 w-4 text-orange-500" />
      default:
        return <Target className="h-4 w-4 text-gray-500" />
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "hard":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const columns: ColumnDef<Task>[] = [
    {
      accessorKey: "title",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Task Title
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const task = row.original
        return (
          <div className="flex items-center space-x-2">
            {getTaskTypeIcon(task.taskType)}
            <div>
              <div className="font-medium">{task.title}</div>
              <div className="text-sm text-gray-500">{task.category}</div>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "organizationName",
      header: "Organization",
      cell: ({ row }) => {
        return (
          <div className="flex items-center space-x-1">
            <Building className="h-4 w-4 text-gray-500" />
            <span className="text-sm">{row.getValue("organizationName")}</span>
          </div>
        )
      },
    },
    {
      accessorKey: "taskType",
      header: "Type",
      cell: ({ row }) => {
        const type = row.getValue("taskType") as string
        return (
          <Badge variant="outline" className="text-xs">
            {type.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
          </Badge>
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
      accessorKey: "difficultyLevel",
      header: "Difficulty",
      cell: ({ row }) => {
        const difficulty = row.getValue("difficultyLevel") as string
        return (
          <Badge className={getDifficultyColor(difficulty)}>
            {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
          </Badge>
        )
      },
    },
    {
      accessorKey: "pointsReward",
      header: "Points",
      cell: ({ row }) => {
        return (
          <div className="flex items-center space-x-1">
            <Award className="h-4 w-4 text-yellow-500" />
            <span className="font-medium">{row.getValue("pointsReward")}</span>
          </div>
        )
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Created Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const date = row.getValue("createdAt") as string
        return (
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span>{new Date(date).toLocaleDateString()}</span>
          </div>
        )
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const task = row.original

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
                  setSelectedTask(task)
                  setIsModalOpen(true)
                }}
              >
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {task.status === "pending" && (
                <>
                  <DropdownMenuItem
                    onClick={() => {
                      setSelectedTask(task)
                      setIsModalOpen(true)
                    }}
                  >
                    Approve Task
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setSelectedTask(task)
                      setIsModalOpen(true)
                    }}
                  >
                    Reject Task
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const pendingTasks = tasks.filter((task) => task.status === "pending")
  const approvedTasks = tasks.filter((task) => task.status === "approved")
  const rejectedTasks = tasks.filter((task) => task.status === "rejected")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Task Management</h2>
          <p className="text-gray-600 dark:text-gray-400">Review and approve climate tasks created by organizations</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tasks.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingTasks.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{approvedTasks.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{rejectedTasks.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Tasks Table with Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Task Management</CardTitle>
          <CardDescription>Review and approve tasks submitted by organizations</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All ({tasks.length})</TabsTrigger>
              <TabsTrigger value="pending">Pending ({pendingTasks.length})</TabsTrigger>
              <TabsTrigger value="approved">Approved ({approvedTasks.length})</TabsTrigger>
              <TabsTrigger value="rejected">Rejected ({rejectedTasks.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              <DataTable columns={columns} data={tasks} searchKey="title" searchPlaceholder="Search tasks..." />
            </TabsContent>

            <TabsContent value="pending" className="mt-6">
              <DataTable
                columns={columns}
                data={pendingTasks}
                searchKey="title"
                searchPlaceholder="Search pending tasks..."
              />
            </TabsContent>

            <TabsContent value="approved" className="mt-6">
              <DataTable
                columns={columns}
                data={approvedTasks}
                searchKey="title"
                searchPlaceholder="Search approved tasks..."
              />
            </TabsContent>

            <TabsContent value="rejected" className="mt-6">
              <DataTable
                columns={columns}
                data={rejectedTasks}
                searchKey="title"
                searchPlaceholder="Search rejected tasks..."
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Task Details Modal */}
      <TaskDetailsModal
        task={selectedTask}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onApprove={handleApproveTask}
        onReject={handleRejectTask}
      />
    </div>
  )
}
