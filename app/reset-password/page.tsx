import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Leaf, ArrowLeft } from "lucide-react";
import { resetPasswordAction } from "@/app/auth";

interface Message {
  message?: string;
  error?: string;
  success?: string;
}

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<Message>;
}) {
  const message = await searchParams;

  if (message?.message) {
    return (
      <div className="w-full flex-1 flex items-center h-screen sm:max-w-md justify-center gap-2 p-4">
        <div className="p-3 rounded-md bg-green-50 border border-green-200 text-green-800 text-sm">
          {message.message}
        </div>
      </div>
    );
  }

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
              Mission 1.5°
            </span>
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Reset your password</CardTitle>
            <CardDescription>
              Please enter your new password below.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={resetPasswordAction} className="space-y-4">
              {message?.error && (
                <div className="p-3 rounded-md bg-red-50 border border-red-200 text-red-800 text-sm">
                  {message.error}
                </div>
              )}
              {message?.success && (
                <div className="p-3 rounded-md bg-green-50 border border-green-200 text-green-800 text-sm">
                  {message.success}
                </div>
              )}
              <div>
                <Label htmlFor="password">New password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="New password"
                  required
                />
              </div>
              <div>
                <Label htmlFor="confirmPassword">Confirm password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm password"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Reset password
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
