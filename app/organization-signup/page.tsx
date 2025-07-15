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
      <div className="w-full max-w-md">
        <div className="relative flex items-center justify-center mb-8 min-h-[40px]">
          <Link href="/" className="absolute left-0 flex items-center">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div className="flex items-center space-x-2">
            <Leaf className="h-8 w-8 text-green-600" />
            <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Climate Intelligence Network
            </span>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center mb-4">
              Sign Up as Organization
            </CardTitle>
            <CardDescription className="text-center">
              Register your organization to join Climate Intelligence Network and contribute to environmental data collection.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={signUpAction} className="space-y-4">
              <div>
                <Label htmlFor="adminName">Admin Full Name</Label>
                <Input id="adminName" name="adminName" required />
              </div>
              
              <div>
                <Label htmlFor="organizationName">Organization Name</Label>
                <Input id="organizationName" name="organizationName" required />
              </div>
              
              <div>
                <Label htmlFor="email">Admin Email</Label>
                <Input id="email" name="email" type="email" required />
              </div>
              
              <div>
                <Label htmlFor="phone">Contact Number</Label>
                <Input 
                  id="phone" 
                  name="phone" 
                  type="tel"
                  placeholder="+94 (71) 123-4567"
                  required 
                />
              </div>
              
              <div>
                <Label htmlFor="address">Organization Address</Label>
                <Textarea id="address" name="address" required />
              </div>
              
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
              
              {/* Capability Selection */}
              <div className="space-y-4">
                <div>
                  <Label className="text-base font-semibold">
                    Request Organization Capabilities
                  </Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Select the capabilities your organization needs. CIN admins will review and approve these requests.
                  </p>
                </div>
                
                <div className="space-y-4">
                  {/* Player Organization Capability */}
                  <div className="flex items-start space-x-3 p-4 border rounded-lg">
                    <Checkbox 
                      id="player_org" 
                      name="capabilities" 
                      value="player_org"
                      defaultChecked
                    />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-blue-600" />
                        <Label htmlFor="player_org" className="font-medium cursor-pointer">
                          Player Organization
                        </Label>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Allow users to join your organization and participate in climate missions. 
                        This is the basic capability most organizations need.
                      </p>
                    </div>
                  </div>

                  {/* Mission Creator Capability */}
                  <div className="flex items-start space-x-3 p-4 border rounded-lg">
                    <Checkbox 
                      id="mission_creator" 
                      name="capabilities" 
                      value="mission_creator"
                    />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center space-x-2">
                        <Target className="h-4 w-4 text-green-600" />
                        <Label htmlFor="mission_creator" className="font-medium cursor-pointer">
                          Mission Creator
                        </Label>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Create and manage climate action missions for your organization and the network. 
                        Requires approval based on organization credibility.
                      </p>
                    </div>
                  </div>

                  {/* Reward Creator Capability */}
                  <div className="flex items-start space-x-3 p-4 border rounded-lg">
                    <Checkbox 
                      id="reward_creator" 
                      name="capabilities" 
                      value="reward_creator"
                    />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center space-x-2">
                        <Gift className="h-4 w-4 text-purple-600" />
                        <Label htmlFor="reward_creator" className="font-medium cursor-pointer">
                          Reward Creator
                        </Label>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Create and distribute rewards for mission completion. 
                        Requires approval and verification of reward fulfillment capability.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>Note:</strong> Your organization will be in pending status until CIN admins 
                    review and approve your requested capabilities. You'll be notified via email once approved.
                  </p>
                </div>
              </div>
              
              {message && <FormMessage message={message} />}
              
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
