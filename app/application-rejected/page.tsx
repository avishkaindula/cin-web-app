import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Leaf, XCircle, Mail, Phone, AlertTriangle } from "lucide-react"

export default function ApplicationRejectedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950 dark:to-orange-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Leaf className="h-8 w-8 text-green-600" />
            <span className="text-xl font-bold">Climate Intelligence Network</span>
          </div>
          <div className="bg-red-100 dark:bg-red-900 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle>Application Not Approved</CardTitle>
          <CardDescription>Unfortunately, your organization application was not approved at this time</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Your application has been reviewed and does not meet our current requirements for platform participation.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <h3 className="font-semibold">Reason for Rejection</h3>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Organization does not meet our environmental standards and mission alignment requirements.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">What You Can Do</h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <li>• Review our organization guidelines and requirements</li>
              <li>• Address the concerns mentioned in the rejection reason</li>
              <li>• Submit a new application with updated information</li>
              <li>• Contact our support team for clarification</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Appeal Process</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              If you believe this decision was made in error, you can contact our support team to discuss your
              application or submit an appeal.
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
                <span>+1 (555) 123-4567</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Button asChild>
              <Link href="/organization-signup">Submit New Application</Link>
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
