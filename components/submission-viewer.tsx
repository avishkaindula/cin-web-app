"use client"

import type React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import type { SubmissionReview } from "@/lib/mock-data-extended"

interface SubmissionViewerProps {
  submission: SubmissionReview | null
  isOpen: boolean
  onClose: () => void
  onApprove?: (id: string, points: number, notes?: string) => void
  onReject?: (id: string, reason: string) => void
  onFlag?: (id: string, reason: string) => void
}

const SubmissionViewer: React.FC<SubmissionViewerProps> = ({
  submission,
  isOpen,
  onClose,
  onApprove,
  onReject,
  onFlag,
}) => {
  const [points, setPoints] = useState(100)
  const [notes, setNotes] = useState("")
  const [rejectReason, setRejectReason] = useState("")
  const [flagReason, setFlagReason] = useState("")
  const [action, setAction] = useState<"view" | "approve" | "reject" | "flag">("view")

  if (!submission) {
    return null
  }

  const handleApprove = () => {
    if (onApprove) {
      onApprove(submission.id, points, notes)
      onClose()
    }
  }

  const handleReject = () => {
    if (onReject && rejectReason.trim()) {
      onReject(submission.id, rejectReason)
      onClose()
    }
  }

  const handleFlag = () => {
    if (onFlag && flagReason.trim()) {
      onFlag(submission.id, flagReason)
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Submission Review - {submission.taskTitle}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Submission Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Task Information</h3>
              <p><strong>Task:</strong> {submission.taskTitle}</p>
              <p><strong>Organization:</strong> {submission.organizationName}</p>
              <p><strong>Type:</strong> {submission.taskType}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">User Information</h3>
              <p><strong>User:</strong> {submission.userName}</p>
              <p><strong>Email:</strong> {submission.userEmail}</p>
              <p><strong>Submitted:</strong> {new Date(submission.submittedAt).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Submission Data */}
          <div>
            <h3 className="font-semibold mb-2">Submission Data</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <pre className="whitespace-pre-wrap text-sm">
                {JSON.stringify(submission.submissionData, null, 2)}
              </pre>
            </div>
          </div>

          {/* Attachments */}
          {submission.attachments && submission.attachments.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Attachments</h3>
              <div className="grid grid-cols-2 gap-4">
                {submission.attachments.map((file) => (
                  <div key={file.id} className="border p-3 rounded-lg">
                    <p className="font-medium">{file.filename}</p>
                    <p className="text-sm text-gray-500">{file.fileType} - {(file.fileSize / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Location */}
          {submission.location && (
            <div>
              <h3 className="font-semibold mb-2">Location</h3>
              <p>Lat: {submission.location.lat}, Lng: {submission.location.lng}</p>
              {submission.location.address && <p>Address: {submission.location.address}</p>}
            </div>
          )}

          {/* Actions */}
          {submission.status === "pending" && (
            <div className="space-y-4">
              <div className="flex gap-2">
                <Button 
                  onClick={() => setAction("approve")} 
                  variant={action === "approve" ? "default" : "outline"}
                >
                  Approve
                </Button>
                <Button 
                  onClick={() => setAction("reject")} 
                  variant={action === "reject" ? "destructive" : "outline"}
                >
                  Reject
                </Button>
                <Button 
                  onClick={() => setAction("flag")} 
                  variant={action === "flag" ? "secondary" : "outline"}
                >
                  Flag
                </Button>
              </div>

              {action === "approve" && (
                <div className="space-y-4 p-4 border rounded-lg">
                  <div>
                    <Label htmlFor="points">Points to Award</Label>
                    <Input
                      id="points"
                      type="number"
                      value={points}
                      onChange={(e) => setPoints(Number(e.target.value))}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="notes">Review Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Add any notes for the user..."
                      className="mt-1"
                    />
                  </div>
                  <Button onClick={handleApprove} className="w-full">
                    Approve Submission
                  </Button>
                </div>
              )}

              {action === "reject" && (
                <div className="space-y-4 p-4 border rounded-lg">
                  <div>
                    <Label htmlFor="rejectReason">Rejection Reason</Label>
                    <Textarea
                      id="rejectReason"
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      placeholder="Explain why this submission is being rejected..."
                      className="mt-1"
                      required
                    />
                  </div>
                  <Button onClick={handleReject} variant="destructive" className="w-full">
                    Reject Submission
                  </Button>
                </div>
              )}

              {action === "flag" && (
                <div className="space-y-4 p-4 border rounded-lg">
                  <div>
                    <Label htmlFor="flagReason">Flag Reason</Label>
                    <Textarea
                      id="flagReason"
                      value={flagReason}
                      onChange={(e) => setFlagReason(e.target.value)}
                      placeholder="Explain why this submission is being flagged..."
                      className="mt-1"
                      required
                    />
                  </div>
                  <Button onClick={handleFlag} variant="secondary" className="w-full">
                    Flag Submission
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Current Status */}
          {submission.status !== "pending" && (
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Review Status</h3>
              <div className="flex items-center gap-2 mb-2">
                <span>Status:</span>
                <Badge variant={submission.status === "approved" ? "default" : "destructive"}>
                  {submission.status}
                </Badge>
              </div>
              {submission.reviewNotes && (
                <p><strong>Notes:</strong> {submission.reviewNotes}</p>
              )}
              {submission.pointsAwarded && (
                <p><strong>Points Awarded:</strong> {submission.pointsAwarded}</p>
              )}
              {submission.reviewedBy && (
                <p><strong>Reviewed By:</strong> {submission.reviewedBy}</p>
              )}
              {submission.reviewedAt && (
                <p><strong>Reviewed At:</strong> {new Date(submission.reviewedAt).toLocaleString()}</p>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default SubmissionViewer
