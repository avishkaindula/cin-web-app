import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  XCircle,
  Clock,
  Building,
  Eye,
  Mail,
  Phone,
} from "lucide-react";

export default function OrganizationApprovalPage() {
  // Mock data - in real app this would come from API/database
  const pendingOrganizations = [
    {
      id: "1",
      name: "EcoTech Solutions",
      adminName: "Sarah Johnson",
      adminEmail: "sarah@ecotech.com",
      adminPhone: "+94 71 234-5678",
      address: "123 Green Street, Colombo 03, Sri Lanka",
      website: "https://ecotech.lk",
      submittedAt: "2024-07-10",
      requestedPrivileges: [
        { type: "player_org", status: "pending" },
        { type: "mission_creator", status: "pending" },
      ],
    },
    {
      id: "2",
      name: "Climate Action Network",
      adminName: "Pradeep Silva",
      adminEmail: "pradeep@can.lk",
      adminPhone: "+94 77 345-6789",
      address: "456 Environment Lane, Kandy, Sri Lanka",
      website: "https://climateaction.lk",
      submittedAt: "2024-07-12",
      requestedPrivileges: [
        { type: "player_org", status: "pending" },
        { type: "mission_creator", status: "pending" },
        { type: "reward_creator", status: "pending" },
      ],
    },
  ];

  const getPrivilegeColor = (type: string) => {
    switch (type) {
      case "player_org":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "mission_creator":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "reward_creator":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const getPrivilegeName = (type: string) => {
    switch (type) {
      case "player_org":
        return "Player Organization";
      case "mission_creator":
        return "Mission Creator";
      case "reward_creator":
        return "Reward Creator";
      default:
        return type;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Organization Requests
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Review and approve new organization registration requests and their
          requested privileges
        </p>
        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>Approval Process:</strong> Organizations can request
            different privileges during signup. You can approve or reject each
            privilege individually based on the organization's needs and
            credibility. Organizations need at least one approved privilege to
            become active.
          </p>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {pendingOrganizations.length}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Pending Approvals
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  42
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Approved This Month
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Building className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  186
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Total Organizations
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Organizations */}
      <div className="space-y-4">
        {pendingOrganizations.map((org) => (
          <Card key={org.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <Building className="h-5 w-5" />
                    <span>{org.name}</span>
                  </CardTitle>
                  <CardDescription>
                    Submitted on {org.submittedAt} by {org.adminName}
                  </CardDescription>
                </div>
                <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                  Pending Review
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Admin Contact & Organization Info */}
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                      Admin Contact & Organization Info
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <span className="h-4 w-4 text-gray-400">👤</span>
                        <span>{org.adminName}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span>{org.adminEmail}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span>{org.adminPhone}</span>
                      </div>
                      {org.website && (
                        <div className="flex items-center space-x-2">
                          <span className="h-4 w-4 text-gray-400">🌐</span>
                          <a
                            href={org.website}
                            className="text-blue-600 hover:underline"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {org.website}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Requested Privileges */}
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                      Requested Privileges
                    </h4>
                    <div className="space-y-2">
                      {org.requestedPrivileges.map((privilege, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div className="flex items-center space-x-2">
                            <Badge
                              className={getPrivilegeColor(privilege.type)}
                            >
                              {getPrivilegeName(privilege.type)}
                            </Badge>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-green-600 border-green-600 hover:bg-green-50 dark:hover:bg-green-950"
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 border-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3 pt-4 border-t">
                    <Button className="flex-1">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve All
                    </Button>
                    <Button variant="destructive" className="flex-1">
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject All
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {pendingOrganizations.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              All Caught Up!
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              There are no pending organization approvals at this time.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
