import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Leaf, XCircle, Mail, Phone, AlertTriangle } from "lucide-react"

export default function AccountSuspendedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Leaf className="h-8 w-8 text-green-600" />
            <span className="text-xl font-bold">Climate Intelligence Network</span>
          </div>
          <div className="bg-orange-100 dark:bg-orange-900 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <XCircle className="h-8 w-8 text-orange-600" />
          </div>
          <CardTitle>Account Suspended</CardTitle>
          <CardDescription>Your account has been temporarily suspended</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Your account has been suspended due to violations of our community guidelines or terms of service.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <h3 className="font-semibold">Reason for Suspension</h3>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Multiple reports of inappropriate behavior and failure to comply with community standards.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">What You Can Do</h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <li>• Review our community guidelines and terms of service</li>
              <li>• Contact our support team to discuss the suspension</li>
              <li>• Submit an appeal if you believe this was made in error</li>
              <li>• Wait for the suspension period to expire (if applicable)</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Appeal Process</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              If you believe your account was suspended in error, you can submit an appeal by contacting our support team. Appeals are typically reviewed within 3-5 business days.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Contact Support</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm">
                <Mail className="h-4 w-4 text-gray-500" />
                <span>support@climate.network</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Phone className="h-4 w-4 text-gray-500" />
                <span>+94 (71) 123-4567</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Button asChild>
              <Link href="mailto:support@climate.network?subject=Account Suspension Appeal">Submit Appeal</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="mailto:support@climate.network">Contact Support</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/">Return to Home</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
