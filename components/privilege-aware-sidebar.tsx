"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard,
  Target,
  Users,
  Gift,
  UserPlus,
  Menu,
  X,
  Building,
  CheckCircle,
  Calendar,
  Settings,
  FileText,
  Trophy,
  ChevronDown,
  ChevronRight,
  Crown,
  UserCog,
  ShieldCheck,
  Building2,
  FileCheck,
  FileClock,
  UserSearch,
  CalendarPlus,
  ScanLine,
  CalendarClock,
  CirclePlus,
  SquareMousePointer,
} from "lucide-react";
import React, { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import type { UserOrganization } from "@/lib/types/auth";

interface NavigationItem {
  name: string;
  href?: string;
  icon: any;
  show: boolean;
  badge?: string;
  badgeColor?: string;
  children?: NavigationItem[];
}

const getDashboardNavigation = (
  isCinAdmin: boolean,
  activeOrganization: UserOrganization | null
): NavigationItem[] => {
  // Get approved privileges
  const approvedPrivileges =
    activeOrganization?.privileges?.filter(
      (priv) => priv.status === "approved"
    ) || [];
  const hasMobilizingPartners = approvedPrivileges.some(
    (priv) => priv.type === "mobilizing_partners"
  );
  const hasMissionPartners = approvedPrivileges.some(
    (priv) => priv.type === "mission_partners"
  );
  const hasRewardPartners = approvedPrivileges.some(
    (priv) => priv.type === "reward_partners"
  );

  return [
    // Main Dashboard - Always visible
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      show: true,
    },

    {
      name: "Leaderboard",
      href: "/leaderboard",
      icon: Trophy,
      show: true,
    },

    // Common Admin Routes - Accessible by both CIN admins and org admins
    {
      name: "My Organization",
      icon: Building,
      show: true,
      children: [
        {
          name: "Organization Admins",
          href: "/add-organization-admins",
          icon: Crown,
          show: true,
        },
        {
          name: "Settings",
          href: "/settings",
          icon: Settings,
          show: true,
        },
      ],
    },

    // CIN Admin Specific Routes - Show at top for CIN admins
    {
      name: "App Management",
      icon: UserCog,
      show: isCinAdmin,
      children: [
        {
          name: "Organization Requests",
          href: "/organization-requests",
          icon: ShieldCheck,
          show: isCinAdmin,
        },
        {
          name: "Organizations",
          href: "/view-all-organizations",
          icon: Building2,
          show: isCinAdmin,
        },
        {
          name: "All Users",
          href: "/view-all-users",
          icon: Users,
          show: isCinAdmin,
        },
      ],
    },
    {
      name: "Mission Submissions",
      icon: FileText,
      show: isCinAdmin,
      children: [
        {
          name: "Review Submissions",
          href: "/review-submissions",
          icon: FileCheck,
          show: isCinAdmin,
        },
        {
          name: "Submission History",
          href: "/submission-log",
          icon: FileClock,
          show: isCinAdmin,
        },
        {
          name: "Mission Approvals",
          href: "/mission-approvals",
          icon: Target,
          show: isCinAdmin,
        },
        {
          name: "Review Redemptions",
          href: "/review-redemptions",
          icon: Gift,
          show: isCinAdmin,
        },
      ],
    },

    // Player Organization Specific Routes
    {
      name: "Members",
      icon: Users,
      show: hasMobilizingPartners,
      children: [
        {
          name: "Join Requests",
          href: "/join-requests",
          icon: UserPlus,
          show: hasMobilizingPartners,
        },
        {
          name: "View All Members",
          href: "/view-members",
          icon: UserSearch,
          show: hasMobilizingPartners,
        },
      ],
    },
    {
      name: "Events",
      icon: Calendar,
      show: hasMobilizingPartners,
      children: [
        {
          name: "Create Events",
          href: "/create-events",
          icon: CalendarPlus,
          show: hasMobilizingPartners,
        },
        {
          name: "Scan QR",
          href: "/scan-event-qr",
          icon: ScanLine,
          show: hasMobilizingPartners,
        },
        {
          name: "Event History",
          href: "/events-history",
          icon: CalendarClock,
          show: hasMobilizingPartners,
        },
      ],
    },

    // Mission Creator Specific Routes
    {
      name: "Missions",
      icon: Target,
      show: hasMissionPartners,
      children: [
        {
          name: "Create Missions",
          href: "/create-missions",
          icon: CirclePlus,
          show: hasMissionPartners,
        },
        {
          name: "Manage Missions",
          href: "/manage-missions",
          icon: SquareMousePointer,
          show: hasMissionPartners,
        },
      ],
    },

    // Reward Creator Specific Routes
    {
      name: "Rewards",
      icon: Gift,
      show: hasRewardPartners,
      children: [
        {
          name: "Create Rewards",
          href: "/create-rewards",
          icon: Gift,
          show: hasRewardPartners,
        },
        {
          name: "Manage Rewards",
          href: "/manage-rewards",
          icon: Settings,
          show: hasRewardPartners,
        },
      ],
    },
  ];
};

export function PrivilegeAwareSidebar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const { isCinAdmin, activeOrganization, isLoading } = useAuth();

  // Show loading state while auth is being determined
  if (isLoading) {
    return (
      <div className="fixed left-0 top-0 z-40 h-full w-80 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-center h-full">
          <div className="text-gray-500">Loading...</div>
        </div>
      </div>
    );
  }

  // If no active organization and not a CIN admin, show no organization state
  if (!activeOrganization && !isCinAdmin) {
    return (
      <div className="fixed left-0 top-0 z-40 h-full w-80 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-center h-full p-6 text-center">
          <div className="text-gray-500">No organization assigned</div>
        </div>
      </div>
    );
  }

  const navigation = getDashboardNavigation(
    isCinAdmin,
    activeOrganization
  ).filter((item) => item.show);

  const toggleGroup = (name: string) =>
    setOpenGroups((prev) => ({ ...prev, [name]: !prev[name] }));

  return (
    <>
      {/* Mobile menu button - positioned in header area but only visible on mobile */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden fixed top-4 left-4 z-40 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
        onClick={() => setIsMobileMenuOpen(true)}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed left-0 top-0 z-40 h-full w-80 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-200 ease-in-out md:translate-x-0",
          isMobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            {/* Header with close button for mobile */}
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Mission 1.5°
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {activeOrganization?.name || "Organization Admin"}
                </p>
              </div>

              {/* Close button - only visible on mobile */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = item.href && pathname === item.href;

              if (item.children && item.children.length > 0) {
                const isGroupOpen = openGroups[item.name] ?? false;
                const isGroupActive = item.children.some(
                  (c) => c.href === pathname
                );

                return (
                  <div key={item.name}>
                    <button
                      className={cn(
                        "flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm font-semibold transition-colors",
                        isGroupActive
                          ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                          : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                      )}
                      onClick={() => toggleGroup(item.name)}
                    >
                      <div className="flex items-center space-x-2">
                        <item.icon className="h-5 w-5" />
                        <span>{item.name}</span>
                      </div>
                      {isGroupOpen ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </button>
                    {isGroupOpen && (
                      <div className="ml-4 mt-1 space-y-1">
                        {item.children.map((child) => {
                          if (!child.show) return null;
                          const isChildActive = child.href === pathname;
                          return (
                            <Link
                              key={child.name}
                              href={child.href!}
                              className={cn(
                                "flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors",
                                isChildActive
                                  ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                                  : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                              )}
                            >
                              <div className="flex items-center space-x-2">
                                <child.icon className="h-4 w-4" />
                                <span>{child.name}</span>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={item.name}
                  href={item.href!}
                  className={cn(
                    "flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                      : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                  )}
                >
                  <div className="flex items-center space-x-2">
                    <item.icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <Badge className={cn("text-xs px-1 py-0", item.badgeColor)}>
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Pending Privileges Notice */}
          {activeOrganization?.privileges?.some(
            (priv) => priv.status === "pending"
          ) && (
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-yellow-600" />
                  <span className="text-xs font-medium text-yellow-800 dark:text-yellow-200">
                    Pending Approvals
                  </span>
                </div>
                <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                  Some privileges are pending CIN admin approval
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
