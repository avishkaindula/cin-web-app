"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Gift, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Star,
  User,
  Calendar,
  AlertCircle
} from "lucide-react";
import { getRedemptions, getRedemptionStats, reviewRedemption, RedemptionWithDetails } from "./actions";
import { useToast } from "@/hooks/use-toast";

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'approved':
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    case 'fulfilled':
      return <CheckCircle className="h-4 w-4 text-blue-600" />;
    case 'pending':
      return <Clock className="h-4 w-4 text-yellow-600" />;
    case 'rejected':
      return <XCircle className="h-4 w-4 text-red-600" />;
    default:
      return null;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'approved':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case 'fulfilled':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    case 'rejected':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
  }
};

export default function ReviewRedemptionsPage() {
  const { toast } = useToast();
  const [redemptions, setRedemptions] = useState<RedemptionWithDetails[]>([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0, fulfilled: 0 });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected" | "fulfilled">("pending");
  const [reviewingId, setReviewingId] = useState<string | null>(null);
  const [reviewNotes, setReviewNotes] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    loadData();
  }, [filter]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [redemptionsResult, statsResult] = await Promise.all([
        getRedemptions(filter === "all" ? undefined : filter),
        getRedemptionStats(),
      ]);

      if (redemptionsResult.error) {
        toast({
          title: "Error",
          description: redemptionsResult.error,
          variant: "destructive",
        });
      } else if (redemptionsResult.data) {
        setRedemptions(redemptionsResult.data);
      }

      setStats(statsResult);
    } catch (error) {
      console.error("Error loading data:", error);
      toast({
        title: "Error",
        description: "Failed to load redemptions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (redemptionId: string, action: "approve" | "reject") => {
    setReviewingId(redemptionId);
    try {
      const notes = reviewNotes[redemptionId] || undefined;
      const result = await reviewRedemption(redemptionId, action, notes);

      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: `Redemption ${action === "approve" ? "approved" : "rejected"} successfully`,
        });
        // Clear the notes for this redemption
        setReviewNotes(prev => {
          const newNotes = { ...prev };
          delete newNotes[redemptionId];
          return newNotes;
        });
        // Reload data
        loadData();
      }
    } catch (error) {
      console.error("Error reviewing redemption:", error);
      toast({
        title: "Error",
        description: "Failed to process review",
        variant: "destructive",
      });
    } finally {
      setReviewingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Review Reward Redemptions
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Manage and review reward redemption requests from users
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:bg-accent" onClick={() => setFilter("pending")}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:bg-accent" onClick={() => setFilter("approved")}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.approved}</div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:bg-accent" onClick={() => setFilter("fulfilled")}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fulfilled</CardTitle>
            <CheckCircle className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.fulfilled}</div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:bg-accent" onClick={() => setFilter("rejected")}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.rejected}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2">
        {(["all", "pending", "approved", "fulfilled", "rejected"] as const).map((status) => (
          <Button
            key={status}
            variant={filter === status ? "default" : "outline"}
            onClick={() => setFilter(status)}
            size="sm"
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Button>
        ))}
      </div>

      {/* Redemptions List */}
      {loading ? (
        <Card>
          <CardContent className="py-10">
            <div className="text-center text-gray-500">Loading redemptions...</div>
          </CardContent>
        </Card>
      ) : redemptions.length === 0 ? (
        <Card>
          <CardContent className="py-10">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No redemptions found for this filter</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {redemptions.map((redemption) => (
            <Card key={redemption.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center space-x-2">
                      <Gift className="h-5 w-5" />
                      <CardTitle>{redemption.rewards?.title || "Unknown Reward"}</CardTitle>
                      <Badge className={getStatusColor(redemption.status)}>
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(redemption.status)}
                          <span>{redemption.status.toUpperCase()}</span>
                        </div>
                      </Badge>
                    </div>
                    <CardDescription>
                      {redemption.rewards?.description || "No description available"}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Reward Details */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Type</p>
                    <p className="font-medium">
                      {redemption.rewards?.type?.replace("-", " ").toUpperCase() || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Category</p>
                    <p className="font-medium">
                      {redemption.rewards?.category?.toUpperCase() || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Value</p>
                    <p className="font-medium">{redemption.rewards?.value || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Points Cost</p>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-600" />
                      <p className="font-medium">{redemption.points_spent}</p>
                    </div>
                  </div>
                </div>

                {/* User & Date Info */}
                <div className="grid grid-cols-2 gap-4 text-sm border-t pt-4">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Requested By</p>
                      <p className="font-medium">{redemption.agent?.full_name || "Unknown"}</p>
                      {redemption.agent?.email && (
                        <p className="text-xs text-gray-500">{redemption.agent.email}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Requested</p>
                      <p className="font-medium">
                        {new Date(redemption.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* User Notes */}
                {redemption.redemption_notes && (
                  <div className="border-t pt-4">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      User Notes:
                    </p>
                    <p className="text-sm">{redemption.redemption_notes}</p>
                  </div>
                )}

                {/* Review Notes (if reviewed) */}
                {redemption.review_notes && (
                  <div className="border-t pt-4">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Review Notes:
                    </p>
                    <p className="text-sm">{redemption.review_notes}</p>
                    {redemption.reviewed_at && (
                      <p className="text-xs text-gray-500 mt-1">
                        Reviewed on {new Date(redemption.reviewed_at).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                )}

                {/* Review Actions (for pending only) */}
                {redemption.status === "pending" && (
                  <div className="border-t pt-4 space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                        Review Notes (Optional)
                      </label>
                      <Textarea
                        placeholder="Add notes about your decision..."
                        value={reviewNotes[redemption.id] || ""}
                        onChange={(e) =>
                          setReviewNotes((prev) => ({
                            ...prev,
                            [redemption.id]: e.target.value,
                          }))
                        }
                        rows={3}
                      />
                    </div>
                    <div className="flex space-x-3">
                      <Button
                        onClick={() => handleReview(redemption.id, "approve")}
                        disabled={reviewingId === redemption.id}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve
                      </Button>
                      <Button
                        onClick={() => handleReview(redemption.id, "reject")}
                        disabled={reviewingId === redemption.id}
                        variant="destructive"
                        className="flex-1"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
