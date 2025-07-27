import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Leaf, ArrowLeft, Users, Target, Gift } from "lucide-react";
import { signUpAction } from "@/app/auth";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";

export default async function OrganizationSignUpPage({
  searchParams,
}: {
  searchParams: Promise<Message>;
}) {
  const message = await searchParams;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="relative flex items-center justify-center mb-8 min-h-[40px]">
          <Link href="/" className="absolute left-0 flex items-center">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div className="flex items-center space-x-2">
            <Leaf className="h-8 w-8 text-green-600" />
            <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Mission 1.5°
            </span>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center mb-4">
              Join Mission 1.5° as an Organization
            </CardTitle>
            <CardDescription className="text-center">
              Register your organization to contribute to global climate action through Mission 1.5°. 
              Access powerful tools to create missions, engage communities, and drive meaningful environmental impact.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={signUpAction} className="space-y-6">
              {/* Organization Details Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Organization Information</h3>
                  
                  <div>
                    <Label htmlFor="organizationName">Organization Name</Label>
                    <Input id="organizationName" name="organizationName" required />
                  </div>
                  
                  <div>
                    <Label htmlFor="website">Link to Website / Social Media Profile</Label>
                    <Input 
                      id="website" 
                      name="website" 
                      type="url"
                      placeholder="https://www.example.com"
                      required 
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Administrator Details</h3>
                  
                  <div>
                    <Label htmlFor="adminName">Admin Name</Label>
                    <Input id="adminName" name="adminName" required />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Admin Email Address</Label>
                    <Input id="email" name="email" type="email" required />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Primary Contact Number</Label>
                    <Input 
                      id="phone" 
                      name="phone" 
                      type="tel"
                      placeholder="+94 (71) 123-4567"
                      required 
                    />
                  </div>
                </div>
              </div>
              
              {/* Account Security Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" name="password" type="password" required />
                </div>
                
                <div>
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                  />
                </div>
              </div>
              
              {/* Organization Description */}
              <div>
                <Label htmlFor="description">Organization Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe your organization's mission, focus areas, and how you plan to contribute to climate action through Mission 1.5°..."
                  className="min-h-[100px]"
                  required
                />
              </div>
              
              {/* Privileges Selection */}
              <div className="space-y-4">
                <div>
                  <Label className="text-base font-semibold">
                    Request Organization Privileges
                  </Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Select the privileges your organization needs. Mission 1.5° admins will review and approve these requests.
                  </p>
                </div>
                
                <div className="space-y-4">
                  {/* Mobilizing Partners Privilege */}
                  <div className="flex items-start space-x-3 p-4 border rounded-lg">
                    <Checkbox 
                      id="mobilizing_partners" 
                      name="privileges" 
                      value="mobilizing_partners"
                      defaultChecked
                    />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-blue-600" />
                        <Label htmlFor="mobilizing_partners" className="font-medium cursor-pointer">
                          Mobilizing Partners
                        </Label>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Allow users to join your organization and participate in climate missions. 
                        This is the basic privilege most organizations need.
                      </p>
                    </div>
                  </div>

                  {/* Mission Partners Privilege */}
                  <div className="flex items-start space-x-3 p-4 border rounded-lg">
                    <Checkbox 
                      id="mission_partners" 
                      name="privileges" 
                      value="mission_partners"
                    />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center space-x-2">
                        <Target className="h-4 w-4 text-green-600" />
                        <Label htmlFor="mission_partners" className="font-medium cursor-pointer">
                          Mission Partners
                        </Label>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Create and manage climate action missions for your organization and the network. 
                        Requires approval based on organization credibility.
                      </p>
                    </div>
                  </div>

                  {/* Reward Partners Privilege */}
                  <div className="flex items-start space-x-3 p-4 border rounded-lg">
                    <Checkbox 
                      id="reward_partners" 
                      name="privileges" 
                      value="reward_partners"
                    />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center space-x-2">
                        <Gift className="h-4 w-4 text-purple-600" />
                        <Label htmlFor="reward_partners" className="font-medium cursor-pointer">
                          Reward Partners
                        </Label>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Create and distribute rewards for mission completion. 
                        Requires approval and verification of reward fulfillment privileges.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>Note:</strong> Your organization will be in pending status until Mission 1.5° admins 
                    review and approve your requested privileges. You'll be notified via email once approved.
                  </p>
                </div>
              </div>
              
              {message && <FormMessage message={message} />}
              
              <div className="bg-yellow-50 dark:bg-yellow-950 p-4 rounded-lg mb-4">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  <strong>Important:</strong> By submitting this registration, you agree to Mission 1.5°'s terms of service 
                  and confirm that all provided information is accurate and verifiable.
                </p>
              </div>
              
              <SubmitButton pendingText="Creating Account..." className="w-full">
                Create Account
              </SubmitButton>
              
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Already have an account?{" "}
                  <Link
                    href="/sign-in"
                    className="text-green-600 hover:underline"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
