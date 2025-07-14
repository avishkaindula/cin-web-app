import type React from "react"
import { OrgAdminSidebar } from "@/components/org-admin-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"

export default function OrgAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <OrgAdminSidebar />
      <DashboardHeader title="Organization Dashboard" userName="Green Tech Admin" userEmail="org@greentech.com" />
      <main className="md:ml-64 pt-20 p-6">{children}</main>
    </div>
  )
}
