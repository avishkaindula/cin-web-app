import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Eye
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { DownloadEvidenceButton } from "@/components/download-evidence-button";

async function getSubmissions() {
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
        organization:organizations(
          id,
          name
        )
      )
    `)
    .in('status', ['completed', 'reviewed', 'rejected'])
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching submissions:', error);
    return [];
  }

  return submissions || [];
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'approved':
      return <CheckCircle className="h-4 w-4 text-green-600" />;
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
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    case 'rejected':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
  }
};

export default async function ReviewSubmissionsPage() {
  const submissions = await getSubmissions();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Review Submissions
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Review and approve submissions from organizations across the network
        </p>
      </div>

      {submissions.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-gray-500 dark:text-gray-400">
              No submissions to review at this time.
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
                        <span className="capitalize">{submission.status}</span>
                      </div>
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Type</span>
                      <p className="text-sm text-gray-900 dark:text-white">Mission Submission</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Organization</span>
                      <p className="text-sm text-gray-900 dark:text-white">{organization?.name || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Submitted By</span>
                      <p className="text-sm text-gray-900 dark:text-white">{agent?.full_name || 'Unknown'}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Submitted</span>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {new Date(submission.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  {submission.review_notes && (
                    <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Review Notes</span>
                      <p className="text-sm text-gray-900 dark:text-white mt-1">{submission.review_notes}</p>
                    </div>
                  )}

                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    <DownloadEvidenceButton 
                      submissionId={submission.id}
                      missionTitle={mission?.title || 'Mission'}
                    />
                    {submission.status === 'completed' && (
                      <>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approve
                        </Button>
                        <Button variant="destructive" size="sm">
                          <XCircle className="h-4 w-4 mr-2" />
                          Reject
                        </Button>
                      </>
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
