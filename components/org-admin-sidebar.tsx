"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, ClipboardList, Users, Gift, UserPlus, Crown, BarChart3, Menu, X } from "lucide-react"
import { useState } from "react"

// Mock organization capabilities - in real app, this would come from context/props
const orgCapabilities = {
  isPlayerOrg: true,
  isTaskMaker: true,
  isPrizeGiver: true,
}

const getNavigation = (capabilities: typeof orgCapabilities) => [
  { name: "Dashboard", href: "/organization-dashboard", icon: LayoutDashboard, show: true },
  { name: "Tasks", href: "/tasks", icon: ClipboardList, show: capabilities.isTaskMaker },
  { name: "Members", href: "/members", icon: Users, show: capabilities.isPlayerOrg },
  { name: "Prizes", href: "/prizes", icon: Gift, show: capabilities.isPrizeGiver },
  { name: "Join Requests", href: "/join-requests", icon: UserPlus, show: capabilities.isPlayerOrg },
  { name: "Admins", href: "/admins", icon: Crown, show: true },
  { name: "Analytics", href: "/analytics", icon: BarChart3, show: true },
]

export function OrgAdminSidebar() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const navigation = getNavigation(orgCapabilities).filter((item) => item.show)

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden fixed top-4 left-4 z-50"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
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
          "fixed left-0 top-0 z-40 h-full w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-200 ease-in-out md:translate-x-0",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        )}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Green Tech Solutions</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Organization Admin</p>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                      : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800",
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>
        </div>
      </div>
    </>
  )
}
