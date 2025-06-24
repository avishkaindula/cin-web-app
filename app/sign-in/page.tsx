"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Leaf, Loader2 } from "lucide-react"
import { mockSignIn } from "@/lib/mock-auth"

export default function SignInPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const user = await mockSignIn(email, password)

      if (!user) {
        setError("Invalid email or password")
        return
      }

      // Role-based routing
      if (user.role === "SUPER_ADMIN") {
        router.push("/super-admin-dashboard")
      } else if (user.role === "ORG_ADMIN") {
        switch (user.organizationStatus) {
          case "pending":
            router.push("/pending-approval")
            break
          case "rejected":
            router.push("/application-rejected")
            break
          case "approved":
            router.push("/organization-dashboard")
            break
          default:
            router.push("/pending-approval")
        }
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Leaf className="h-8 w-8 text-green-600" />
            <span className="text-xl font-bold">Climate Intelligence Network</span>
          </div>
          <CardTitle>Sign In</CardTitle>
          <CardDescription>Enter your credentials to access your dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign In
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">{"Don't have an organization account?"}</p>
            <Button variant="link" asChild>
              <Link href="/organization-signup">Sign up as an organization</Link>
            </Button>
          </div>

          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Demo Accounts:</p>
            <div className="space-y-1 text-xs">
              <p>
                <strong>Super Admin:</strong> admin@climate.network
              </p>
              <p>
                <strong>Approved Org:</strong> org@greentech.com
              </p>
              <p>
                <strong>Pending Org:</strong> pending@ecoorg.com
              </p>
              <p>
                <strong>Rejected Org:</strong> rejected@badorg.com
              </p>
              <p>
                <strong>Password:</strong> password
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
