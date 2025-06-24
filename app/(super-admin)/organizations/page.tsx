"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DataTable } from "@/components/ui/data-table"
import { StatusBadge } from "@/components/ui/status-badge"
import { OrganizationDetailsModal } from "@/components/organization-details-modal"
import { Badge } from "@/components/ui/badge"
import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Eye, MoreHorizontal, Building, Users, Calendar } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { mockOrganizationsExtended } from "@/lib/mock-data"
import type { Organization } from "@/lib/types"
import type { AdminUser } from "@/lib/mock-data"
import { useToast } from "@/hooks/use-toast"

type ExtendedOrganization = Organization & { adminUsers: AdminUser[] }

export default function OrganizationsPage() {
  const [organizations, setOrganizations] = useState<ExtendedOrganization[]>(mockOrganizationsExtended)
  const [selectedOrganization, setSelectedOrganization] = useState<ExtendedOrganization | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { toast } = useToast()

  const handleApproveOrganization = async (id: string, capabilities: Organization["capabilities"], notes?: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setOrganizations((prev) =>
      prev.map((org) => (org.id === id ? { ...org, status: "approved" as const, capabilities } : org)),
    )

    toast({
      title: "Organization Approved",
      description: "The organization has been successfully approved and can now access the platform.",
    })
  }

  const handleRejectOrganization = async (id: string, reason: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setOrganizations((prev) =>
      prev.map((org) => (org.id === id ? { ...org, status: "rejected" as const, rejectionReason: reason } : org)),
    )

    toast({
      title: "Organization Rejected",
      description: "The organization application has been rejected.",
      variant: "destructive",
    })
  }

  const columns: ColumnDef<ExtendedOrganization>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Organization Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const org = row.original
        return (
          <div className="flex items-center space-x-2">
            <Building className="h-4 w-4 text-gray-500" />
            <div>
              <div className="font-medium">{org.name}</div>
              <div className="text-sm text-gray-500">{org.location}</div>
            </div>
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
      accessorKey: "adminUsers",
      header: "Admin Count",
      cell: ({ row }) => {
        const adminUsers = row.getValue("adminUsers") as AdminUser[]
        return (
          <div className="flex items-center space-x-1">
            <Users className="h-4 w-4 text-gray-500" />
            <span>{adminUsers.length}</span>
          </div>
        )
      },
    },
    {
      accessorKey: "capabilities",
      header: "Capabilities",
      cell: ({ row }) => {
        const capabilities = row.getValue("capabilities") as Organization["capabilities"]
        const activeCapabilities = []
        if (capabilities.isPlayerOrg) activeCapabilities.push("Player")
        if (capabilities.isTaskMaker) activeCapabilities.push("Tasks")
        if (capabilities.isPrizeGiver) activeCapabilities.push("Prizes")

        return (
          <div className="flex flex-wrap gap-1">
            {activeCapabilities.map((cap) => (
              <Badge key={cap} variant="outline" className="text-xs">
                {cap}
              </Badge>
            ))}
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
            <span>{new Date(date || Date.now()).toLocaleDateString()}</span>
          </div>
        )
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const organization = row.original

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
                  setSelectedOrganization(organization)
                  setIsModalOpen(true)
                }}
              >
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {organization.status === "pending" && (
                <>
                  <DropdownMenuItem
                    onClick={() => {
                      setSelectedOrganization(organization)
                      setIsModalOpen(true)
                    }}
                  >
                    Approve Organization
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setSelectedOrganization(organization)
                      setIsModalOpen(true)
                    }}
                  >
                    Reject Application
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const pendingOrgs = organizations.filter((org) => org.status === "pending")
  const approvedOrgs = organizations.filter((org) => org.status === "approved")
  const rejectedOrgs = organizations.filter((org) => org.status === "rejected")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Organizations</h2>
          <p className="text-gray-600 dark:text-gray-400">Manage and approve organization applications</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Organizations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{organizations.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingOrgs.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{approvedOrgs.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{rejectedOrgs.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Organizations Table with Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Organization Management</CardTitle>
          <CardDescription>View and manage organization applications by status</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All ({organizations.length})</TabsTrigger>
              <TabsTrigger value="pending">Pending ({pendingOrgs.length})</TabsTrigger>
              <TabsTrigger value="approved">Approved ({approvedOrgs.length})</TabsTrigger>
              <TabsTrigger value="rejected">Rejected ({rejectedOrgs.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              <DataTable
                columns={columns}
                data={organizations}
                searchKey="name"
                searchPlaceholder="Search organizations..."
              />
            </TabsContent>

            <TabsContent value="pending" className="mt-6">
              <DataTable
                columns={columns}
                data={pendingOrgs}
                searchKey="name"
                searchPlaceholder="Search pending organizations..."
              />
            </TabsContent>

            <TabsContent value="approved" className="mt-6">
              <DataTable
                columns={columns}
                data={approvedOrgs}
                searchKey="name"
                searchPlaceholder="Search approved organizations..."
              />
            </TabsContent>

            <TabsContent value="rejected" className="mt-6">
              <DataTable
                columns={columns}
                data={rejectedOrgs}
                searchKey="name"
                searchPlaceholder="Search rejected organizations..."
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Organization Details Modal */}
      <OrganizationDetailsModal
        organization={selectedOrganization}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onApprove={handleApproveOrganization}
        onReject={handleRejectOrganization}
      />
    </div>
  )
}
