import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Eye,
  Play,
  FileCheck
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { DownloadEvidenceButton } from "@/components/download-evidence-button";

async function getAllSubmissions() {
  const supabase = await createClient();
  
  const { data: submissions, error } = await supabase
    .from('mission_submissions')
    .select(`
      id,
      created_at,
      completed_at,
      status,
      review_notes,
      review_score,
      agent:agents(
        id,
        full_name,
        email
      ),
      mission:missions(
        id,
        title,
        description,
        points_awarded,
        energy_awarded,
        organization:organizations(
          id,
          name
        )
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching submissions:', error);
    return [];
  }

  return submissions || [];
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'reviewed':
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    case 'completed':
      return <FileCheck className="h-4 w-4 text-blue-600" />;
    case 'in_progress':
    case 'started':
      return <Play className="h-4 w-4 text-yellow-600" />;
    case 'rejected':
      return <XCircle className="h-4 w-4 text-red-600" />;
    default:
      return <Clock className="h-4 w-4 text-gray-600" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'reviewed':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case 'completed':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    case 'in_progress':
    case 'started':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    case 'rejected':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'in_progress':
      return 'In Progress';
    case 'started':
      return 'Started';
    default:
      return status.charAt(0).toUpperCase() + status.slice(1);
  }
};

export default async function SubmissionLogPage() {
  const submissions = await getAllSubmissions();

  // Group submissions by status
  const groupedSubmissions = {
    in_progress: submissions.filter(s => s.status === 'in_progress' || s.status === 'started'),
    completed: submissions.filter(s => s.status === 'completed'),
    reviewed: submissions.filter(s => s.status === 'reviewed'),
    rejected: submissions.filter(s => s.status === 'rejected'),
  };

  const totalSubmissions = submissions.length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Submission Log
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Complete history of all mission submissions across the network
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Total Submissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSubmissions}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
              In Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{groupedSubmissions.in_progress.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Awaiting Review
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{groupedSubmissions.completed.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Reviewed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{groupedSubmissions.reviewed.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* All Submissions */}
      {submissions.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-gray-500 dark:text-gray-400">
              No submissions found.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {submissions.map((submission) => {
            const agent = submission.agent as any;
            const mission = submission.mission as any;
            const organization = mission?.organization;
            
            return (
              <Card key={submission.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="flex items-center space-x-2">
                        <FileText className="h-5 w-5" />
                        <span>{mission?.title || 'Untitled Mission'}</span>
                      </CardTitle>
                      <CardDescription>
                        {mission?.description || 'No description available'}
                      </CardDescription>
                    </div>
                    <Badge className={getStatusColor(submission.status)}>
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(submission.status)}
                        <span>{getStatusLabel(submission.status)}</span>
                      </div>
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                    <div>
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Organization</span>
                      <p className="text-sm text-gray-900 dark:text-white">{organization?.name || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Agent</span>
                      <p className="text-sm text-gray-900 dark:text-white">{agent?.full_name || 'Unknown'}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Points</span>
                      <p className="text-sm text-gray-900 dark:text-white font-semibold">+{mission?.points_awarded || 0}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Energy</span>
                      <p className="text-sm text-gray-900 dark:text-white font-semibold">+{mission?.energy_awarded || 0}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Submitted</span>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {new Date(submission.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  {submission.completed_at && (
                    <div className="mb-4">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Completed</span>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {new Date(submission.completed_at).toLocaleDateString()} at {new Date(submission.completed_at).toLocaleTimeString()}
                      </p>
                    </div>
                  )}
                  
                  {submission.review_notes && (
                    <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Review Notes</span>
                      <p className="text-sm text-gray-900 dark:text-white mt-1">{submission.review_notes}</p>
                      {submission.review_score !== null && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          Score: {submission.review_score}/100
                        </p>
                      )}
                    </div>
                  )}

                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    {(submission.status === 'completed' || submission.status === 'reviewed' || submission.status === 'rejected') && (
                      <DownloadEvidenceButton 
                        submissionId={submission.id}
                        missionTitle={mission?.title || 'Mission'}
                      />
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}