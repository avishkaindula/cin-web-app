import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Eye,
  Download 
} from "lucide-react";

// Mock data for submissions
const mockSubmissions = [
  {
    id: "1",
    type: "Mission Report",
    organization: "GreenTech Solutions", 
    submittedBy: "John Doe",
    submittedAt: "2025-01-10",
    status: "pending",
    title: "Q4 Carbon Reduction Initiative",
    description: "Comprehensive report on our carbon footprint reduction efforts"
  },
  {
    id: "2", 
    type: "Reward Proposal",
    organization: "Eco Alliance",
    submittedBy: "Jane Smith", 
    submittedAt: "2025-01-08",
    status: "pending",
    title: "Green Innovation Rewards Program",
    description: "Proposal for new rewards system for sustainable innovation"
  },
  {
    id: "3",
    type: "Mission Completion",
    organization: "Climate Warriors",
    submittedBy: "Bob Johnson",
    submittedAt: "2025-01-05", 
    status: "approved",
    title: "Urban Tree Planting Campaign",
    description: "Documentation of completed tree planting mission in downtown area"
  }
];

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

export default function ReviewSubmissionsPage() {
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

      <div className="grid gap-6">
        {mockSubmissions.map((submission) => (
          <Card key={submission.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="h-5 w-5" />
                    <span>{submission.title}</span>
                  </CardTitle>
                  <CardDescription>
                    {submission.description}
                  </CardDescription>
                </div>
                <Badge className={getStatusColor(submission.status)}>
                  <div className="flex items-center space-x-1">
                    {getStatusIcon(submission.status)}
                    <span>{submission.status}</span>
                  </div>
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Type</span>
                  <p className="text-sm text-gray-900 dark:text-white">{submission.type}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Organization</span>
                  <p className="text-sm text-gray-900 dark:text-white">{submission.organization}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Submitted By</span>
                  <p className="text-sm text-gray-900 dark:text-white">{submission.submittedBy}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Submitted</span>
                  <p className="text-sm text-gray-900 dark:text-white">{submission.submittedAt}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                {submission.status === 'pending' && (
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
        ))}
      </div>
    </div>
  );
}
