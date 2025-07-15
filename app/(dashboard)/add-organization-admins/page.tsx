"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { UserPlus, Mail, Shield, Trash2, AlertTriangle } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";

export default function AddAdminsPage() {
  const { isCinAdmin, activeOrganization } = useAuth();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Add Organization Admins
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          {isCinAdmin
            ? `Invite new organization administrators to ${
                activeOrganization?.name || "the Climate Intelligence Network"
              }`
            : "Invite new administrators to your organization"}
        </p>
      </div>

      {/* Warning for CIN Admins */}
      {isCinAdmin && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Important:</strong> You're about to add an Organization Admin for{" "}
            <strong>{activeOrganization?.name || "this organization"}</strong>.
            
            <div className="mt-2 text-sm space-y-2">
              <p className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>This person <strong>will be able to</strong> manage this specific organization's activities (like overseeing players, creating missions, and managing prizes).</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-red-600 mt-0.5">✗</span>
                <span>They <strong>will NOT have access to</strong> CIN Admin specific capabilities or other organizations.</span>
              </p>
              <p className="mt-3 text-xs border-t pt-2">
                <strong>Need to create a CIN Admin instead?</strong> Please contact your system administrator.
              </p>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Add New Admin Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <UserPlus className="h-5 w-5" />
            <span>Invite New Organization Admin</span>
          </CardTitle>
          <CardDescription>
            Send an invitation to a new organization administrator
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  required
                />
              </div>
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" type="text" placeholder="John Doe" required />
              </div>
            </div>
            <div>
              <Label htmlFor="role">Admin Role</Label>
              <select
                id="role"
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:border-gray-700 dark:bg-gray-800"
              >
                <option value="org_admin">Organization Admin</option>
                <option value="org_moderator">Organization Moderator</option>
              </select>
            </div>
            <Button className="w-full md:w-auto">
              <Mail className="h-4 w-4 mr-2" />
              Send Invitation
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Current Admins */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Current Organization Administrators</span>
          </CardTitle>
          <CardDescription>
            Manage existing organization administrators
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Example admin entries */}
            {[
              {
                name: "John Doe",
                email: "john@greentech.com",
                role: "org_admin",
                status: "active",
                joinedAt: "2024-01-15",
              },
              {
                name: "Jane Smith",
                email: "jane@greentech.com",
                role: "org_moderator",
                status: "pending",
                joinedAt: "2024-02-01",
              },
            ].map((admin, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                    <span className="text-green-600 dark:text-green-300 font-semibold">
                      {admin.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {admin.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {admin.email}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      Joined {admin.joinedAt}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge
                    className={
                      admin.role === "org_admin"
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                        : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
                    }
                  >
                    {admin.role === "org_admin" ? "Admin" : "Moderator"}
                  </Badge>
                  <Badge
                    className={
                      admin.status === "active"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                    }
                  >
                    {admin.status}
                  </Badge>
                  <Button variant="outline" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
