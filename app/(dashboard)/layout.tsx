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
      
      {/* Main content area with proper sidebar offset */}
      <div className="md:ml-80">
        <DashboardHeader />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
