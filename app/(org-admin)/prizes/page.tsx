"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DataTable } from "@/components/ui/data-table"
import { StatusBadge } from "@/components/ui/status-badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Eye, MoreHorizontal, Plus, Gift, CheckCircle } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { mockPrizes, mockPrizeRedemptions } from "@/lib/mock-data-extended"
import type { Prize, PrizeRedemption } from "@/lib/mock-data-extended"
import { useToast } from "@/hooks/use-toast"

export default function PrizesPage() {
  const [prizes, setPrizes] = useState<Prize[]>(mockPrizes)
  const [redemptions, setRedemptions] = useState<PrizeRedemption[]>(mockPrizeRedemptions)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [selectedRedemption, setSelectedRedemption] = useState<PrizeRedemption | null>(null)
  const [isRedemptionModalOpen, setIsRedemptionModalOpen] = useState(false)
  const { toast } = useToast()

  const handleCreatePrize = async (prizeData: Partial<Prize>) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const newPrize: Prize = {
      id: `prize${prizes.length + 1}`,
      organizationId: "org1",
      name: prizeData.name || "",
      description: prizeData.description || "",
      pointCost: prizeData.pointCost || 0,
      quantityAvailable: prizeData.quantityAvailable || 0,
      quantityRedeemed: 0,
      prizeType: prizeData.prizeType || "physical",
      redemptionInstructions: prizeData.redemptionInstructions || "",
      termsAndConditions: prizeData.termsAndConditions || "",
      status: "active",
      createdAt: new Date().toISOString(),
    }

    setPrizes((prev) => [...prev, newPrize])
    setIsCreateModalOpen(false)

    toast({
      title: "Prize Created",
      description: "New prize has been added to your catalog.",
    })
  }

  const handleFulfillRedemption = async (id: string, trackingInfo?: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setRedemptions((prev) =>
      prev.map((redemption) =>
        redemption.id === id
          ? {
              ...redemption,
              status: "fulfilled" as const,
              fulfilledAt: new Date().toISOString(),
              trackingInfo,
            }
          : redemption,
      ),
    )

    toast({
      title: "Redemption Fulfilled",
      description: "Prize redemption has been marked as fulfilled.",
    })
  }

  const prizeColumns: ColumnDef<Prize>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Prize
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const prize = row.original
        return (
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <Gift className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <div className="font-medium">{prize.name}</div>
              <div className="text-sm text-gray-500">{prize.prizeType}</div>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "pointCost",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Point Cost
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        return <span className="font-medium">{row.getValue("pointCost")}</span>
      },
    },
    {
      accessorKey: "quantityAvailable",
      header: "Available",
      cell: ({ row }) => {
        const available = row.getValue("quantityAvailable") as number
        const redeemed = row.original.quantityRedeemed
        return (
          <div className="text-sm">
            <div className="font-medium">{available - redeemed} left</div>
            <div className="text-gray-500">{available} total</div>
          </div>
        )
      },
    },
    {
      accessorKey: "quantityRedeemed",
      header: "Redeemed",
      cell: ({ row }) => {
        return <span className="font-medium">{row.getValue("quantityRedeemed")}</span>
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
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const prize = row.original

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
              <DropdownMenuItem>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Edit Prize</DropdownMenuItem>
              <DropdownMenuItem>{prize.status === "active" ? "Deactivate" : "Activate"}</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const redemptionColumns: ColumnDef<PrizeRedemption>[] = [
    {
      accessorKey: "prizeName",
      header: "Prize",
      cell: ({ row }) => {
        return <span className="font-medium">{row.getValue("prizeName")}</span>
      },
    },
    {
      accessorKey: "userName",
      header: "User",
      cell: ({ row }) => {
        const redemption = row.original
        return (
          <div>
            <div className="font-medium">{redemption.userName}</div>
            <div className="text-sm text-gray-500">{redemption.userEmail}</div>
          </div>
        )
      },
    },
    {
      accessorKey: "pointsSpent",
      header: "Points",
      cell: ({ row }) => {
        return <span className="font-medium">{row.getValue("pointsSpent")}</span>
      },
    },
    {
      accessorKey: "requestedAt",
      header: "Requested",
      cell: ({ row }) => {
        const date = row.getValue("requestedAt") as string
        return <span className="text-sm">{new Date(date).toLocaleDateString()}</span>
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
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const redemption = row.original

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
                  setSelectedRedemption(redemption)
                  setIsRedemptionModalOpen(true)
                }}
              >
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              {redemption.status === "pending" && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleFulfillRedemption(redemption.id)}>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Mark Fulfilled
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const totalPrizes = prizes.length
  const activePrizes = prizes.filter((p) => p.status === "active").length
  const totalRedemptions = redemptions.length
  const pendingRedemptions = redemptions.filter((r) => r.status === "pending").length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Prize Management</h2>
          <p className="text-gray-600 dark:text-gray-400">Manage prizes and handle redemption requests</p>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Prize
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Prize</DialogTitle>
              <DialogDescription>Add a new prize to your organization's catalog</DialogDescription>
            </DialogHeader>
            <CreatePrizeForm onSubmit={handleCreatePrize} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Prizes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPrizes}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Prizes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activePrizes}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Redemptions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRedemptions}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Fulfillment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingRedemptions}</div>
          </CardContent>
        </Card>
      </div>

      {/* Prize Management Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Prize Management</CardTitle>
          <CardDescription>Manage your prize catalog and redemption requests</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="prizes" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="prizes">Prize Catalog ({totalPrizes})</TabsTrigger>
              <TabsTrigger value="redemptions">Redemptions ({totalRedemptions})</TabsTrigger>
            </TabsList>

            <TabsContent value="prizes">
              <DataTable columns={prizeColumns} data={prizes} searchKey="name" searchPlaceholder="Search prizes..." />
            </TabsContent>
            <TabsContent value="redemptions">
              <DataTable
                columns={redemptionColumns}
                data={redemptions}
                searchKey="prizeName"
                searchPlaceholder="Search redemptions..."
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Redemption Details Modal */}
      <Dialog open={isRedemptionModalOpen} onOpenChange={setIsRedemptionModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Redemption Details</DialogTitle>
            <DialogDescription>Manage prize redemption request</DialogDescription>
          </DialogHeader>

          {selectedRedemption && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold">Prize Information</h3>
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm font-medium">Prize Name</p>
                      <p className="text-sm text-gray-600">{selectedRedemption.prizeName}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Points Spent</p>
                      <p className="text-sm text-gray-600">{selectedRedemption.pointsSpent}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Redemption Code</p>
                      <p className="text-sm text-gray-600 font-mono">{selectedRedemption.redemptionCode || "N/A"}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-lg font-semibold">User Information</h3>
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm font-medium">Name</p>
                      <p className="text-sm text-gray-600">{selectedRedemption.userName}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Email</p>
                      <p className="text-sm text-gray-600">{selectedRedemption.userEmail}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Status</p>
                      <StatusBadge status={selectedRedemption.status} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Fulfillment Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Requested</p>
                    <p className="text-sm text-gray-600">
                      {new Date(selectedRedemption.requestedAt).toLocaleDateString()}
                    </p>
                  </div>
                  {selectedRedemption.fulfilledAt && (
                    <div>
                      <p className="text-sm font-medium">Fulfilled</p>
                      <p className="text-sm text-gray-600">
                        {new Date(selectedRedemption.fulfilledAt).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                  {selectedRedemption.trackingInfo && (
                    <div className="md:col-span-2">
                      <p className="text-sm font-medium">Tracking Information</p>
                      <p className="text-sm text-gray-600 font-mono">{selectedRedemption.trackingInfo}</p>
                    </div>
                  )}
                  {selectedRedemption.notes && (
                    <div className="md:col-span-2">
                      <p className="text-sm font-medium">Notes</p>
                      <p className="text-sm text-gray-600">{selectedRedemption.notes}</p>
                    </div>
                  )}
                </div>
              </div>

              {selectedRedemption.status === "pending" && (
                <div className="flex justify-end space-x-2">
                  <Button onClick={() => handleFulfillRedemption(selectedRedemption.id, "Manual fulfillment")}>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Mark as Fulfilled
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

function CreatePrizeForm({ onSubmit }: { onSubmit: (data: Partial<Prize>) => void }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    pointCost: 0,
    quantityAvailable: 0,
    prizeType: "physical" as Prize["prizeType"],
    redemptionInstructions: "",
    termsAndConditions: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Prize Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="prizeType">Prize Type</Label>
          <Select
            value={formData.prizeType}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, prizeType: value as Prize["prizeType"] }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="physical">Physical Item</SelectItem>
              <SelectItem value="digital">Digital Reward</SelectItem>
              <SelectItem value="voucher">Voucher/Coupon</SelectItem>
              <SelectItem value="experience">Experience</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="pointCost">Point Cost</Label>
          <Input
            id="pointCost"
            type="number"
            value={formData.pointCost}
            onChange={(e) => setFormData((prev) => ({ ...prev, pointCost: Number.parseInt(e.target.value) }))}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="quantity">Quantity Available</Label>
          <Input
            id="quantity"
            type="number"
            value={formData.quantityAvailable}
            onChange={(e) => setFormData((prev) => ({ ...prev, quantityAvailable: Number.parseInt(e.target.value) }))}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="instructions">Redemption Instructions</Label>
        <Textarea
          id="instructions"
          value={formData.redemptionInstructions}
          onChange={(e) => setFormData((prev) => ({ ...prev, redemptionInstructions: e.target.value }))}
          placeholder="How users can redeem this prize..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="terms">Terms and Conditions</Label>
        <Textarea
          id="terms"
          value={formData.termsAndConditions}
          onChange={(e) => setFormData((prev) => ({ ...prev, termsAndConditions: e.target.value }))}
          placeholder="Terms and conditions for this prize..."
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="submit">
          <Gift className="mr-2 h-4 w-4" />
          Create Prize
        </Button>
      </div>
    </form>
  )
}
