"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { StatusBadge } from "@/components/ui/status-badge"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, MapPin, Award, Users, Clock, FileImage, Target, Building, AlertCircle } from "lucide-react"
import type { Task } from "@/lib/mock-data"

interface TaskDetailsModalProps {
  task: Task | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onApprove?: (id: string, notes?: string) => void
  onReject?: (id: string, reason: string) => void
}

export function TaskDetailsModal({ task, open, onOpenChange, onApprove, onReject }: TaskDetailsModalProps) {
  const [notes, setNotes] = useState("")
  const [rejectionReason, setRejectionReason] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  if (!task) return null

  const handleApprove = async () => {
    if (!onApprove) return
    setIsProcessing(true)
    await onApprove(task.id, notes)
    setIsProcessing(false)
    onOpenChange(false)
  }

  const handleReject = async () => {
    if (!onReject || !rejectionReason.trim()) return
    setIsProcessing(true)
    await onReject(task.id, rejectionReason)
    setIsProcessing(false)
    onOpenChange(false)
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

  const getTaskTypeIcon = (type: string) => {
    switch (type) {
      case "photo_submission":
        return <FileImage className="h-4 w-4" />
      case "data_collection":
        return <Target className="h-4 w-4" />
      case "survey":
        return <Users className="h-4 w-4" />
      case "observation":
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Target className="h-4 w-4" />
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {getTaskTypeIcon(task.taskType)}
              <span>{task.title}</span>
            </div>
            <StatusBadge status={task.status} />
          </DialogTitle>
          <DialogDescription>Task details and approval management</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Basic Information */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Task Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Building className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium">{task.organizationName}</span>
                  </div>
                  <Badge variant="outline">{task.category}</Badge>
                  <Badge className={getDifficultyColor(task.difficultyLevel)}>{task.difficultyLevel}</Badge>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2">Description</h4>
                  <p className="text-sm text-gray-600 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">{task.description}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2">Instructions</h4>
                  <p className="text-sm text-gray-600 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                    {task.instructions}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Required Data Fields */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Required Data Fields</CardTitle>
                <CardDescription>Fields that users must complete when submitting this task</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {Object.entries(task.requiredDataFields).map(([field, type]) => (
                    <div key={field} className="flex items-center justify-between p-2 border rounded">
                      <span className="text-sm font-medium">{field}</span>
                      <Badge variant="outline" className="text-xs">
                        {type as string}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Validation Rules */}
            {Object.keys(task.validationRules).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Validation Rules</CardTitle>
                  <CardDescription>Rules for validating user submissions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {Object.entries(task.validationRules).map(([field, rules]) => (
                      <div key={field} className="text-sm">
                        <span className="font-medium">{field}:</span>{" "}
                        <span className="text-gray-600">{JSON.stringify(rules)}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Task Settings */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Task Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Award className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">Points Reward</p>
                    <p className="text-sm text-gray-600">{task.pointsReward} points</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">Max Submissions</p>
                    <p className="text-sm text-gray-600">{task.maxSubmissionsPerUser} per user</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">Cooldown Period</p>
                    <p className="text-sm text-gray-600">{task.cooldownPeriodDays} days</p>
                  </div>
                </div>

                {task.locationRequired && (
                  <div className="flex items-start space-x-2">
                    <MapPin className="h-4 w-4 mt-1 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Location Required</p>
                      {task.targetLocation && <p className="text-sm text-gray-600">{task.targetLocation}</p>}
                      {task.locationRadiusKm && (
                        <p className="text-xs text-gray-500">Within {task.locationRadiusKm}km radius</p>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex items-start space-x-2">
                  <Calendar className="h-4 w-4 mt-1 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">Created</p>
                    <p className="text-sm text-gray-600">{new Date(task.createdAt).toLocaleDateString()}</p>
                    <p className="text-xs text-gray-500">by {task.createdBy}</p>
                  </div>
                </div>

                {task.expiresAt && (
                  <div className="flex items-start space-x-2">
                    <Calendar className="h-4 w-4 mt-1 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Expires</p>
                      <p className="text-sm text-gray-600">{new Date(task.expiresAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* File Upload Settings */}
            {task.fileUploadRequired && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">File Upload Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm font-medium">Allowed File Types</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {task.allowedFileTypes.map((type) => (
                        <Badge key={type} variant="outline" className="text-xs">
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium">Max File Size</p>
                    <p className="text-sm text-gray-600">{task.maxFileSizeMB} MB</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium">Max Files</p>
                    <p className="text-sm text-gray-600">{task.maxFilesPerSubmission} per submission</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Rejection Reason (if rejected) */}
        {task.status === "rejected" && task.rejectionReason && (
          <div className="space-y-2">
            <Label className="text-sm font-medium text-red-600">Rejection Reason</Label>
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-700 dark:text-red-300">{task.rejectionReason}</p>
            </div>
          </div>
        )}

        {/* Actions for Pending Tasks */}
        {task.status === "pending" && (
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
                  placeholder="Explain why this task is being rejected..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows={3}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="destructive" onClick={handleReject} disabled={!rejectionReason.trim() || isProcessing}>
                Reject Task
              </Button>
              <Button onClick={handleApprove} disabled={isProcessing}>
                Approve Task
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
