"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { StatusBadge } from "@/components/ui/status-badge"
import { Separator } from "@/components/ui/separator"
import { Calendar, Globe, Mail, MapPin, User } from "lucide-react"
import type { Organization } from "@/lib/types"
import type { AdminUser } from "@/lib/mock-data"

interface OrganizationDetailsModalProps {
  organization: (Organization & { adminUsers: AdminUser[] }) | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onApprove?: (id: string, capabilities: Organization["capabilities"], notes?: string) => void
  onReject?: (id: string, reason: string) => void
}

export function OrganizationDetailsModal({
  organization,
  open,
  onOpenChange,
  onApprove,
  onReject,
}: OrganizationDetailsModalProps) {
  const [capabilities, setCapabilities] = useState(
    organization?.capabilities || {
      isPlayerOrg: false,
      isTaskMaker: false,
      isPrizeGiver: false,
    },
  )
  const [notes, setNotes] = useState("")
  const [rejectionReason, setRejectionReason] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  if (!organization) return null

  const handleApprove = async () => {
    if (!onApprove) return
    setIsProcessing(true)
    await onApprove(organization.id, capabilities, notes)
    setIsProcessing(false)
    onOpenChange(false)
  }

  const handleReject = async () => {
    if (!onReject || !rejectionReason.trim()) return
    setIsProcessing(true)
    await onReject(organization.id, rejectionReason)
    setIsProcessing(false)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            {organization.name}
            <StatusBadge status={organization.status} />
          </DialogTitle>
          <DialogDescription>Organization application details and management</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Organization Information</h3>

            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <Mail className="h-4 w-4 mt-1 text-gray-500" />
                <div>
                  <p className="text-sm font-medium">Contact Email</p>
                  <p className="text-sm text-gray-600">{organization.contactEmail}</p>
                </div>
              </div>

              {organization.website && (
                <div className="flex items-start space-x-2">
                  <Globe className="h-4 w-4 mt-1 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">Website</p>
                    <p className="text-sm text-gray-600">{organization.website}</p>
                  </div>
                </div>
              )}

              {organization.location && (
                <div className="flex items-start space-x-2">
                  <MapPin className="h-4 w-4 mt-1 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">Location</p>
                    <p className="text-sm text-gray-600">{organization.location}</p>
                  </div>
                </div>
              )}

              <div className="flex items-start space-x-2">
                <Calendar className="h-4 w-4 mt-1 text-gray-500" />
                <div>
                  <p className="text-sm font-medium">Applied</p>
                  <p className="text-sm text-gray-600">
                    {new Date(organization.createdAt || Date.now()).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium mb-2">Description</p>
              <p className="text-sm text-gray-600 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                {organization.description}
              </p>
            </div>
          </div>

          {/* Admin Users */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Administrator Users</h3>

            <div className="space-y-3">
              {organization.adminUsers.map((admin) => (
                <div key={admin.id} className="border rounded-lg p-3">
                  <div className="flex items-start space-x-2">
                    <User className="h-4 w-4 mt-1 text-gray-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{admin.fullName}</p>
                      <p className="text-sm text-gray-600">{admin.email}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {admin.role}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          Joined {new Date(admin.joinedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Separator />

        {/* Capabilities */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Organization Capabilities</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between space-x-2 p-3 border rounded-lg">
              <div>
                <Label htmlFor="playerOrg" className="text-sm font-medium">
                  Player Organization
                </Label>
                <p className="text-xs text-gray-500">Recruit and manage members</p>
              </div>
              <Switch
                id="playerOrg"
                checked={capabilities.isPlayerOrg}
                onCheckedChange={(checked) => setCapabilities((prev) => ({ ...prev, isPlayerOrg: checked }))}
                disabled={organization.status !== "pending"}
              />
            </div>

            <div className="flex items-center justify-between space-x-2 p-3 border rounded-lg">
              <div>
                <Label htmlFor="taskMaker" className="text-sm font-medium">
                  Task Maker
                </Label>
                <p className="text-xs text-gray-500">Create climate tasks</p>
              </div>
              <Switch
                id="taskMaker"
                checked={capabilities.isTaskMaker}
                onCheckedChange={(checked) => setCapabilities((prev) => ({ ...prev, isTaskMaker: checked }))}
                disabled={organization.status !== "pending"}
              />
            </div>

            <div className="flex items-center justify-between space-x-2 p-3 border rounded-lg">
              <div>
                <Label htmlFor="prizeGiver" className="text-sm font-medium">
                  Prize Giver
                </Label>
                <p className="text-xs text-gray-500">Offer rewards</p>
              </div>
              <Switch
                id="prizeGiver"
                checked={capabilities.isPrizeGiver}
                onCheckedChange={(checked) => setCapabilities((prev) => ({ ...prev, isPrizeGiver: checked }))}
                disabled={organization.status !== "pending"}
              />
            </div>
          </div>
        </div>

        {/* Rejection Reason (if rejected) */}
        {organization.status === "rejected" && organization.rejectionReason && (
          <div className="space-y-2">
            <Label className="text-sm font-medium text-red-600">Rejection Reason</Label>
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-700 dark:text-red-300">{organization.rejectionReason}</p>
            </div>
          </div>
        )}

        {/* Actions for Pending Organizations */}
        {organization.status === "pending" && (
          <div className="space-y-4">
            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="notes">Approval Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Add any notes for the organization..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rejection">Rejection Reason</Label>
                <Textarea
                  id="rejection"
                  placeholder="Explain why this application is being rejected..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows={3}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="destructive" onClick={handleReject} disabled={!rejectionReason.trim() || isProcessing}>
                Reject Application
              </Button>
              <Button onClick={handleApprove} disabled={isProcessing}>
                Approve Organization
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
