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
  CalendarPlus, ScanLine, CalendarClock, CirclePlus, SquareMousePointer
} from "lucide-react";
import React, {useState} from "react";
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
  // Get approved capabilities
  const approvedCapabilities =
    activeOrganization?.capabilities?.filter(
      (cap) => cap.status === "approved"
    ) || [];
  const hasPlayerOrg = approvedCapabilities.some(
    (cap) => cap.type === "player_org"
  );
  const hasMissionCreator = approvedCapabilities.some(
    (cap) => cap.type === "mission_creator"
  );
  const hasRewardCreator = approvedCapabilities.some(
    (cap) => cap.type === "reward_creator"
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
      children:[
        {
          name: "Organization Admins",
          href: "/add-organization-admins",
          icon: Crown,
          show: true,
        },
        {
          name: "Profile",
          href: "/edit-organization",
          icon: Settings,
          show: true,
        },
      ]
    },

    // CIN Admin Specific Routes - Show at top for CIN admins
    {
      name: "Stakeholder Management",
      icon: UserCog,
      show: isCinAdmin,
      children:[
        {
          name: "Role Approvals",
          href: "/role-approvals",
          icon: ShieldCheck,
          show: isCinAdmin,
        },
        {
          name: "Organizations",
          href: "/view-all-organizations",
          icon: Building2,
          show: isCinAdmin,
        },{
          name: "Users",
          href: "/view-all-users",
          icon: Users,
          show: isCinAdmin,
        },
      ]
    },
    {
      name: "Mission Submissions",
      icon: FileText,
      show: isCinAdmin,
      children:[
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
      ]
    },

    // Player Organization Specific Routes
    {
      name: "Members",
      icon: Users,
      show: hasPlayerOrg,
      children:[
        {
          name: "Join Requests",
          href: "/join-requests",
          icon: UserPlus,
          show: hasPlayerOrg,
        },
        {
          name: "View All Members",
          href: "/view-members",
          icon: UserSearch,
          show: hasPlayerOrg,
        },

      ]
    },
    {
      name: "Events",
      icon: Calendar,
      show: hasPlayerOrg,
      children:[
        {
          name: "Create Events",
          href: "/create-events",
          icon: CalendarPlus,
          show: hasPlayerOrg,
        },{
          name: "Scan QR",
          href: "/scan-event-qr",
          icon: ScanLine,
          show: hasPlayerOrg,
        },
        {
          name: "Event History",
          href: "/events-history",
          icon: CalendarClock,
          show: hasPlayerOrg,
        },
      ]
    },

    // Mission Creator Specific Routes
    {
      name: "Missions",
      icon: Target,
      show: hasMissionCreator,
      children:[
        {
          name: "Create Missions",
          href: "/create-missions",
          icon: CirclePlus,
          show: hasMissionCreator,
        },{
          name: "Manage Missions",
          href: "/manage-missions",
          icon: SquareMousePointer,
          show: hasMissionCreator,
        },
      ]
    },

    // Reward Creator Specific Routes
    {
      name: "Rewards",
      icon: Gift,
      show: hasRewardCreator,
      children:[
        {
          name: "Create Rewards",
          href: "/create-rewards",
          icon: Gift,
          show: hasRewardCreator,
        },{
          name: "Manage Rewards",
          href: "/manage-rewards",
          icon: Settings,
          show: hasRewardCreator,
        },
      ]
    },
  ];
};

export function CapabilityAwareSidebar(){
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const { isCinAdmin, isOrgAdmin, activeOrganization, isLoading } = useAuth();

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
                  {activeOrganization?.name || "CIN Admin"}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {isCinAdmin ? "CIN Administrator" : "Organization Admin"}
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
                const isGroupActive = item.children.some((c) => c.href === pathname);

                return (
                    <div key={item.name}>
                      <button
                          className={cn(
                              'flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm font-semibold transition-colors',
                              isGroupActive
                                  ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
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
                                          'flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors',
                                          isChildActive
                                              ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                                              : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
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
                          'flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                          isActive
                              ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                              : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                      )}
                  >
                    <div className="flex items-center space-x-2">
                      <item.icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </div>
                    {item.badge && (
                        <Badge className={cn('text-xs px-1 py-0', item.badgeColor)}>
                          {item.badge}
                        </Badge>
                    )}
                  </Link>
              );
            })}
          </nav>

          {/* Pending Capabilities Notice */}
          {activeOrganization?.capabilities?.some(
            (cap) => cap.status === "pending"
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
                  Some capabilities are pending CIN admin approval
                </p>
              </div>
            </div>
          )}
          <div className={'px-4 py-4 border-t w-full border-t-gray-200 dark:border-t-gray-700'}>
            {activeOrganization?.capabilities && (
                <div className="mt-3 space-y-3">
                  {activeOrganization.capabilities.map((capability) => (
                      <div
                          key={capability.type}
                          className="flex items-center justify-between text-xs"
                      >
                    <span className="capitalize text-gray-600 dark:text-gray-400">
                      {capability.type.replace("_", " ")}
                    </span>
                        <Badge
                            className={cn(
                                "text-xs px-1 py-0",
                                capability.status === "approved" &&
                                "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
                                capability.status === "pending" &&
                                "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
                                capability.status === "rejected" &&
                                "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                            )}
                        >
                          {capability.status}
                        </Badge>
                      </div>
                  ))}
                </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
