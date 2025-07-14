import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Admins</h2>
        <p className="text-gray-600 dark:text-gray-400">Manage organization administrators and permissions</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Admin Management</CardTitle>
          <CardDescription>This feature will be implemented in the next update</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-gray-600 dark:text-gray-400">Admin management tools coming soon...</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
