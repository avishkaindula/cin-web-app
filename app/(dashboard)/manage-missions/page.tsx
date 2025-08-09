"use client";

import React, { useState, useEffect, useTransition } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Target, 
  Calendar, 
  Users,
  Award,
  Clock,
  Edit,
  Trash2,
  Play,
  Pause,
  Eye,
  Zap,
  X
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/auth-context";
import { getMissionThumbnailUrl } from "@/lib/supabase/storage";
import {
  getMissionStats,
  getOrganizationMissions,
  updateMissionStatus,
  deleteMission,
  type MissionWithStats,
  type MissionStats
} from "./actions";

// Utility functions for styling
const getStatusColor = (status: string) => {
  switch (status) {
    case 'published':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case 'draft':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    case 'completed':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    case 'paused':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'published':
      return <Play className="h-4 w-4" />;
    case 'paused':
      return <Pause className="h-4 w-4" />;
    case 'completed':
      return <Award className="h-4 w-4" />;
    case 'draft':
      return <Edit className="h-4 w-4" />;
    default:
      return <Clock className="h-4 w-4" />;
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Mission Details Modal Component
function MissionDetailsModal({ mission }: { mission: MissionWithStats }) {
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(false);

  useEffect(() => {
    async function loadThumbnail() {
      if (mission.thumbnail_path) {
        setImageLoading(true);
        try {
          const signedUrl = await getMissionThumbnailUrl(mission.thumbnail_path);
          setThumbnailUrl(signedUrl);
        } catch (error) {
          console.error('Error loading thumbnail:', error);
        } finally {
          setImageLoading(false);
        }
      }
    }

    loadThumbnail();
  }, [mission.thumbnail_path]);

  return (
    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center space-x-2">
          <Target className="h-5 w-5" />
          <span>{mission.title}</span>
        </DialogTitle>
        <DialogDescription>
          Mission Details and Statistics
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-6">
        {/* Mission Thumbnail */}
        {mission.thumbnail_path && (
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Mission Thumbnail</h3>
            {imageLoading ? (
              <div className="w-full h-48 bg-gray-200 animate-pulse rounded-lg flex items-center justify-center">
                <span className="text-gray-500">Loading image...</span>
              </div>
            ) : thumbnailUrl ? (
              <img 
                src={thumbnailUrl} 
                alt={mission.title}
                className="w-full h-48 object-cover rounded-lg"
              />
            ) : (
              <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-gray-500">No image available</span>
              </div>
            )}
          </div>
        )}

        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Basic Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium">Status:</span>
                  <Badge className={getStatusColor(mission.status)}>
                    {mission.status}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Points Awarded:</span>
                  <span>{mission.points_awarded}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Energy Awarded:</span>
                  <span>{mission.energy_awarded}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Featured:</span>
                  <span>{mission.is_featured ? 'Yes' : 'No'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Created:</span>
                  <span>{formatDate(mission.created_at)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Last Updated:</span>
                  <span>{formatDate(mission.updated_at)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Participation Stats</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium">Total Participants:</span>
                  <span>{mission.participants_count}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Total Submissions:</span>
                  <span>{mission.submissions_count}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Completed Submissions:</span>
                  <span>{mission.completed_submissions_count}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Completion Rate:</span>
                  <span>
                    {mission.participants_count > 0 
                      ? Math.round((mission.completed_submissions_count / mission.participants_count) * 100)
                      : 0}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Description</h3>
          <p className="text-gray-600 dark:text-gray-400">{mission.description}</p>
        </div>

        {/* Instructions */}
        {mission.instructions && Array.isArray(mission.instructions) && mission.instructions.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Instructions</h3>
            <div className="space-y-2">
              {(mission.instructions as any[]).map((instruction: any, index: number) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-xs font-medium text-blue-600 dark:text-blue-300">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-medium">{instruction.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{instruction.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Guidance Steps */}
        {mission.guidance_steps && Array.isArray(mission.guidance_steps) && mission.guidance_steps.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Guidance Steps</h3>
            <div className="space-y-2">
              {(mission.guidance_steps as any[]).map((step: any, index: number) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-green-50 dark:bg-green-900 rounded-lg">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center text-xs font-medium text-green-600 dark:text-green-300">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{step.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{step.description}</p>
                    {step.evidenceType && (
                      <div className="text-xs text-gray-500">
                        Evidence Required: <span className="font-medium">{step.evidenceType}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DialogContent>
  );
}

export default function ManageMissionsPage() {
  const { user } = useAuth();
  const [isPending, startTransition] = useTransition();
  
  // State management
  const [missions, setMissions] = useState<MissionWithStats[]>([]);
  const [stats, setStats] = useState<MissionStats | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Load data on component mount
  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  // Reload data when filters change
  useEffect(() => {
    if (user && !loading) {
      loadMissions();
    }
  }, [searchQuery, statusFilter]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load all data in parallel
      const [statsResult, missionsResult] = await Promise.all([
        getMissionStats(),
        getOrganizationMissions(searchQuery, statusFilter),
      ]);

      if (statsResult.error) {
        toast.error(statsResult.error);
      } else {
        setStats(statsResult.data);
      }

      if (missionsResult.error) {
        toast.error(missionsResult.error);
      } else {
        setMissions(missionsResult.data || []);
      }
    } catch (error) {
      toast.error("Failed to load mission data");
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadMissions = async () => {
    try {
      const result = await getOrganizationMissions(searchQuery, statusFilter);
      
      if (result.error) {
        toast.error(result.error);
      } else {
        setMissions(result.data || []);
      }
    } catch (error) {
      toast.error("Failed to load missions");
      console.error("Error loading missions:", error);
    }
  };

  const handleStatusUpdate = async (missionId: string, newStatus: string) => {
    startTransition(async () => {
      try {
        const result = await updateMissionStatus(missionId, newStatus);
        
        if (result.error) {
          toast.error(result.error);
        } else {
          toast.success(`Mission ${newStatus} successfully`);
          // Reload data to reflect changes
          loadData();
        }
      } catch (error) {
        toast.error("Failed to update mission status");
        console.error("Error updating mission:", error);
      }
    });
  };

  const handleDeleteMission = async (missionId: string) => {
    if (!confirm("Are you sure you want to delete this mission? This action cannot be undone.")) {
      return;
    }

    startTransition(async () => {
      try {
        const result = await deleteMission(missionId);
        
        if (result.error) {
          toast.error(result.error);
        } else {
          toast.success("Mission deleted successfully");
          // Reload data to reflect changes
          loadData();
        }
      } catch (error) {
        toast.error("Failed to delete mission");
        console.error("Error deleting mission:", error);
      }
    });
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Please sign in to manage missions.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Loading missions...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Manage Missions
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Monitor and manage your climate action missions
          </p>
        </div>
      </div>

      {/* Mission Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Play className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats?.active_missions || 0}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Active Missions
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats?.completed_missions || 0}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Completed
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Edit className="h-5 w-5 text-gray-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats?.draft_missions || 0}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Drafts
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-purple-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats?.total_participants || 0}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Total Participants
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <Input 
              placeholder="Search missions..." 
              className="max-w-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <select 
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="published">Published</option>
              <option value="completed">Completed</option>
              <option value="paused">Paused</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Missions List */}
      <div className="grid gap-4">
        {missions.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <Target className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  No missions found. {searchQuery || statusFilter ? "Try adjusting your filters." : "Create your first mission to get started."}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          missions.map((mission) => (
            <Card key={mission.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="flex items-center space-x-2">
                      <Target className="h-5 w-5" />
                      <span>{mission.title}</span>
                    </CardTitle>
                    <CardDescription>{mission.description}</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(mission.status)}>
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(mission.status)}
                        <span>{mission.status}</span>
                      </div>
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <Award className="h-4 w-4" />
                    <span>{mission.points_awarded} points</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <Zap className="h-4 w-4" />
                    <span>{mission.energy_awarded} energy</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <Users className="h-4 w-4" />
                    <span>{mission.participants_count} participants</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <Target className="h-4 w-4" />
                    <span>{mission.completed_submissions_count} completed</span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Updated {formatDate(mission.updated_at)}
                  </div>
                </div>

                {/* Progress Bar */}
                {mission.participants_count > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                      <span>Completion Rate</span>
                      <span>{mission.participants_count > 0 ? Math.round((mission.completed_submissions_count / mission.participants_count) * 100) : 0}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ 
                          width: `${mission.participants_count > 0 ? (mission.completed_submissions_count / mission.participants_count) * 100 : 0}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center space-x-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </DialogTrigger>
                    <MissionDetailsModal mission={mission} />
                  </Dialog>
                  
                  {mission.status === 'published' && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleStatusUpdate(mission.id, 'paused')}
                      disabled={isPending}
                    >
                      <Pause className="h-4 w-4 mr-2" />
                      Pause
                    </Button>
                  )}
                  
                  {mission.status === 'paused' && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-green-600 hover:text-green-700"
                      onClick={() => handleStatusUpdate(mission.id, 'published')}
                      disabled={isPending}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Resume
                    </Button>
                  )}
                  
                  {mission.status === 'draft' && (
                    <>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-green-600 hover:text-green-700"
                        onClick={() => handleStatusUpdate(mission.id, 'published')}
                        disabled={isPending}
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Publish
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDeleteMission(mission.id)}
                        disabled={isPending}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
