import type React from "react"
import { SuperAdminSidebar } from "@/components/super-admin-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <SuperAdminSidebar />
      <DashboardHeader title="Super Admin Dashboard" userName="Super Admin" userEmail="admin@climate.network" />
      <main className="md:ml-64 pt-20 p-6">{children}</main>
    </div>
  )
}
