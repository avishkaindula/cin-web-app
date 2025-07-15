import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Building, 
  Users, 
  CheckCircle, 
  Clock, 
  XCircle,
  Search,
  Eye,
  Settings
} from "lucide-react";

// Mock data for organizations
const mockOrganizations = [
  {
    id: "1",
    name: "The Climate Intelligence Network",
    type: "CIN Organization",
    memberCount: 15,
    status: "active",
    joinedDate: "2024-01-01",
    website: "https://climateintelligence.network",
    contact: "contact@climateintelligence.network",
    capabilities: [
      { type: "player_org", status: "approved" },
      { type: "mission_creator", status: "approved" },
      { type: "reward_creator", status: "approved" }
    ]
  },
  {
    id: "2", 
    name: "GreenTech Solutions",
    type: "Partner Organization",
    memberCount: 28,
    status: "active",
    joinedDate: "2024-03-15",
    website: "https://greentech.example.com",
    contact: "admin@greentech.example.com", 
    capabilities: [
      { type: "player_org", status: "approved" },
      { type: "mission_creator", status: "approved" },
      { type: "reward_creator", status: "pending" }
    ]
  },
  {
    id: "3",
    name: "Eco Alliance",
    type: "Partner Organization", 
    memberCount: 12,
    status: "pending",
    joinedDate: "2024-12-20",
    website: "https://ecoalliance.org",
    contact: "info@ecoalliance.org",
    capabilities: [
      { type: "player_org", status: "pending" },
      { type: "mission_creator", status: "pending" },
      { type: "reward_creator", status: "rejected" }
    ]
  },
  {
    id: "4",
    name: "Climate Warriors",
    type: "Partner Organization",
    memberCount: 45,
    status: "active", 
    joinedDate: "2024-02-10",
    website: "https://climatewarriors.net",
    contact: "admin@climatewarriors.net",
    capabilities: [
      { type: "player_org", status: "approved" },
      { type: "mission_creator", status: "rejected" },
      { type: "reward_creator", status: "approved" }
    ]
  }
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'approved':
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    case 'active':
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
    case 'active':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    case 'rejected':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
  }
};

export default function ViewAllOrganizationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          All Organizations
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Manage and overview all organizations in the Climate Intelligence Network
        </p>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search organizations..." 
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Organizations Grid */}
      <div className="grid gap-6">
        {mockOrganizations.map((org) => (
          <Card key={org.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="flex items-center space-x-2">
                    <Building className="h-5 w-5" />
                    <span>{org.name}</span>
                  </CardTitle>
                  <CardDescription>
                    {org.type} • Joined {org.joinedDate}
                  </CardDescription>
                </div>
                <Badge className={getStatusColor(org.status)}>
                  <div className="flex items-center space-x-1">
                    {getStatusIcon(org.status)}
                    <span>{org.status}</span>
                  </div>
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Members</span>
                  <p className="text-sm text-gray-900 dark:text-white flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    {org.memberCount}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Website</span>
                  <p className="text-sm text-blue-600 dark:text-blue-400">{org.website}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Contact</span>
                  <p className="text-sm text-gray-900 dark:text-white">{org.contact}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Capabilities</span>
                  <div className="flex space-x-1">
                    {org.capabilities.map((cap) => (
                      <div key={cap.type} className="flex items-center">
                        {getStatusIcon(cap.status)}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Capabilities Detail */}
              <div className="mb-4">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 block">
                  Capability Status
                </span>
                <div className="flex flex-wrap gap-2">
                  {org.capabilities.map((cap) => (
                    <Badge key={cap.type} variant="outline" className={getStatusColor(cap.status)}>
                      <span className="capitalize">
                        {cap.type.replace('_', ' ')}
                      </span>
                      <span className="mx-1">•</span>
                      <span>{cap.status}</span>
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Button>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Manage
                </Button>
                <Button variant="outline" size="sm">
                  <Users className="h-4 w-4 mr-2" />
                  View Members
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
