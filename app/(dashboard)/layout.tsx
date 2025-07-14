import type React from "react";
import { DashboardHeader } from "@/components/dashboard-header";
import { CapabilityAwareSidebar } from "@/components/capability-aware-sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <CapabilityAwareSidebar />
      <DashboardHeader
        title="Climate Intelligence Network"
        userName="Admin User"
        userEmail="admin@greentech.com"
      />
      <main className="md:ml-80 pt-20 p-6">{children}</main>
    </div>
  );
}
