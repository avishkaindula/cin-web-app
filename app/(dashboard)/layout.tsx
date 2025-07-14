import type React from "react";
import { DashboardHeader } from "@/components/dashboard-header";
import { DashboardSidebar } from "@/components/dashboard-sidebar";

export default function OrgAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <DashboardSidebar />
      <DashboardHeader
        title="Organization Dashboard"
        userName="Green Tech Admin"
        userEmail="org@greentech.com"
      />
      <main className="md:ml-64 pt-20 p-6">{children}</main>
    </div>
  );
}
