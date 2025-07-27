import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  User, 
  Mail, 
  Building, 
  Calendar,
  Search,
  Eye,
  UserX,
  Shield
} from "lucide-react";

// Mock data for users
const mockUsers = [
  {
    id: "1",
    name: "John Doe",
    email: "john@greentech.com",
    role: "org_admin",
    organization: "GreenTech Solutions",
    joinedDate: "2024-03-15",
    lastActive: "2025-01-14",
    status: "active",
    privileges: ["mobilizing_partners", "mission_partners"]
  },
  {
    id: "2",
    name: "Jane Smith", 
    email: "jane@ecoalliance.org",
    role: "org_admin",
    organization: "Eco Alliance",
    joinedDate: "2024-12-20",
    lastActive: "2025-01-13",
    status: "pending",
    privileges: []
  },
  {
    id: "3",
    name: "CIN Administrator",
    email: "cinadmin1@climateintel.org", 
    role: "cin_admin",
    organization: "The Climate Intelligence Network",
    joinedDate: "2024-01-01",
    lastActive: "2025-01-14",
    status: "active",
    privileges: ["mobilizing_partners", "mission_partners", "reward_partners"]
  },
  {
    id: "4",
    name: "Bob Johnson",
    email: "bob@climatewarriors.net",
    role: "org_admin", 
    organization: "Climate Warriors",
    joinedDate: "2024-02-10",
    lastActive: "2025-01-12",
    status: "active",
    privileges: ["mobilizing_partners", "reward_partners"]
  },
  {
    id: "5",
    name: "Alice Cooper",
    email: "alice@individual.com",
    role: "player",
    organization: null,
    joinedDate: "2024-11-05",
    lastActive: "2025-01-14", 
    status: "active",
    privileges: []
  },
  {
    id: "6",
    name: "Mike Wilson",
    email: "mike@greentech.com",
    role: "player",
    organization: "GreenTech Solutions", 
    joinedDate: "2024-04-20",
    lastActive: "2025-01-11",
    status: "active",
    privileges: []
  }
];

const getRoleColor = (role: string) => {
  switch (role) {
    case 'cin_admin':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
    case 'org_admin':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    case 'player':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    case 'suspended':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
  }
};

const getRoleIcon = (role: string) => {
  switch (role) {
    case 'cin_admin':
      return <Shield className="h-4 w-4" />;
    case 'org_admin':
      return <Building className="h-4 w-4" />;
    case 'player':
      return <User className="h-4 w-4" />;
    default:
      return <User className="h-4 w-4" />;
  }
};

export default function ViewAllUsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          All Users
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Manage and overview all users in the Climate Intelligence Network
        </p>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search users by name, email, or organization..." 
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              Filter by Role
            </Button>
            <Button variant="outline">
              Filter by Status
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Users Grid */}
      <div className="grid gap-4">
        {mockUsers.map((user) => (
          <Card key={user.id}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {user.name}
                    </h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                      <Mail className="h-4 w-4" />
                      <span>{user.email}</span>
                    </div>
                    {user.organization && (
                      <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                        <Building className="h-4 w-4" />
                        <span>{user.organization}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                      <Calendar className="h-4 w-4" />
                      <span>Joined {user.joinedDate}</span>
                      <span>•</span>
                      <span>Last active {user.lastActive}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col items-end space-y-2">
                  <div className="flex items-center space-x-2">
                    <Badge className={getRoleColor(user.role)}>
                      <div className="flex items-center space-x-1">
                        {getRoleIcon(user.role)}
                        <span className="capitalize">{user.role.replace('_', ' ')}</span>
                      </div>
                    </Badge>
                    <Badge className={getStatusColor(user.status)}>
                      {user.status}
                    </Badge>
                  </div>
                  
                  {user.privileges.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {user.privileges.map((privilege) => (
                        <Badge key={privilege} variant="outline" className="text-xs">
                          {privilege.replace('_', ' ')}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-end space-x-2 mt-4 pt-4 border-t">
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  View Profile
                </Button>
                <Button variant="outline" size="sm">
                  <Mail className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
                {user.role !== 'cin_admin' && (
                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                    <UserX className="h-4 w-4 mr-2" />
                    Suspend
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {mockUsers.length}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Total Users
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {mockUsers.filter(u => u.role === 'cin_admin').length}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                CIN Admins
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {mockUsers.filter(u => u.role === 'org_admin').length}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Org Admins
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {mockUsers.filter(u => u.role === 'player').length}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Players
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
