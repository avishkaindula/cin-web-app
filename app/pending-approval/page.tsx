import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Leaf, Clock, Mail, Phone } from "lucide-react"

export default function PendingApprovalPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Leaf className="h-8 w-8 text-green-600" />
            <span className="text-xl font-bold">Climate Intelligence Network</span>
          </div>
          <div className="bg-amber-100 dark:bg-amber-900 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Clock className="h-8 w-8 text-amber-600" />
          </div>
          <CardTitle>Application Under Review</CardTitle>
          <CardDescription>Your organization application is being reviewed by our team</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <AlertDescription>
              Thank you for submitting your organization application. Our team is currently reviewing your submission to
              ensure it aligns with our climate action mission.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <h3 className="font-semibold">Application Summary</h3>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-2">
              <p className="text-sm">
                <strong>Organization:</strong> Eco Warriors
              </p>
              <p className="text-sm">
                <strong>Contact Email:</strong> pending@ecoorg.com
              </p>
              <p className="text-sm">
                <strong>Submitted:</strong> December 24, 2024
              </p>
              <p className="text-sm">
                <strong>Status:</strong> Under Review
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">What's Next?</h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <li>• Review typically takes 2-5 business days</li>
              <li>• You'll receive an email notification with the decision</li>
              <li>• If approved, you'll gain access to your admin dashboard</li>
              <li>• If additional information is needed, we'll contact you</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Need Help?</h3>
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
            <Button variant="outline" asChild>
              <Link href="/sign-in">Check Status</Link>
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
