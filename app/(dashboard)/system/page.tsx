"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { DataTable } from "@/components/ui/data-table"
import { SystemHealthMonitor } from "@/components/system-health-monitor"
import { NotificationCenter } from "@/components/notification-center"
import { MetricCard } from "@/components/ui/metric-card"
import { AnalyticsChart } from "@/components/ui/analytics-chart"
import { Settings, Award, Trophy, Users, Database, Activity, TrendingUp, Globe } from "lucide-react"
import { mockSystemSettings, mockBadges, mockAnalyticsMetrics, mockTimeSeriesData } from "@/lib/analytics-data"
import type { Badge as BadgeType, SystemSettings } from "@/lib/analytics-data"
import type { ColumnDef } from "@tanstack/react-table"
import { useToast } from "@/hooks/use-toast"

export default function SystemPage() {
  const [settings, setSettings] = useState<SystemSettings>(mockSystemSettings)
  const [badges, setBadges] = useState<BadgeType[]>(mockBadges)
  const { toast } = useToast()

  const handleSaveSettings = async () => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast({
      title: "Settings Saved",
      description: "System settings have been updated successfully.",
    })
  }

  const badgeColumns: ColumnDef<BadgeType>[] = [
    {
      accessorKey: "name",
      header: "Badge",
      cell: ({ row }) => {
        const badge = row.original
        return (
          <div className="flex items-center space-x-3">
            <img src={badge.iconUrl || "/placeholder.svg"} alt={badge.name} className="w-8 h-8 rounded" />
            <div>
              <div className="font-medium">{badge.name}</div>
              <div className="text-sm text-gray-500">{badge.description}</div>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "rarity",
      header: "Rarity",
      cell: ({ row }) => {
        const rarity = row.getValue("rarity") as string
        const rarityColors = {
          common: "bg-gray-100 text-gray-800",
          rare: "bg-blue-100 text-blue-800",
          epic: "bg-purple-100 text-purple-800",
          legendary: "bg-yellow-100 text-yellow-800",
        }
        return (
          <Badge className={rarityColors[rarity as keyof typeof rarityColors]}>
            {rarity.charAt(0).toUpperCase() + rarity.slice(1)}
          </Badge>
        )
      },
    },
    {
      accessorKey: "pointThreshold",
      header: "Points Required",
      cell: ({ row }) => {
        return <span className="font-medium">{row.getValue("pointThreshold")}</span>
      },
    },
    {
      accessorKey: "autoAward",
      header: "Auto Award",
      cell: ({ row }) => {
        return row.getValue("autoAward") ? (
          <Badge className="bg-green-100 text-green-800">Yes</Badge>
        ) : (
          <Badge className="bg-gray-100 text-gray-800">No</Badge>
        )
      },
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => {
        return row.getValue("isActive") ? (
          <Badge className="bg-green-100 text-green-800">Active</Badge>
        ) : (
          <Badge className="bg-red-100 text-red-800">Inactive</Badge>
        )
      },
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">System Management</h2>
        <p className="text-gray-600 dark:text-gray-400">Configure platform settings and monitor system health</p>
      </div>

      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          title="Total Users"
          value={mockAnalyticsMetrics.userMetrics.totalUsers.toLocaleString()}
          change={{ value: 8.2, type: "increase" }}
          icon={Users}
        />
        <MetricCard
          title="Active Organizations"
          value={mockAnalyticsMetrics.organizationMetrics.activeOrganizations}
          change={{ value: 3.1, type: "increase" }}
          icon={Globe}
        />
        <MetricCard
          title="Total Points Awarded"
          value={`${(mockAnalyticsMetrics.pointMetrics.totalPointsAwarded / 1000000).toFixed(1)}M`}
          change={{ value: 12.5, type: "increase" }}
          icon={Trophy}
        />
        <MetricCard title="System Uptime" value="99.97%" change={{ value: 0.1, type: "increase" }} icon={Activity} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SystemHealthMonitor />
        <NotificationCenter />
      </div>

      {/* Platform Analytics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Platform Growth</span>
          </CardTitle>
          <CardDescription>User and activity growth over time</CardDescription>
        </CardHeader>
        <CardContent>
          <AnalyticsChart
            data={mockTimeSeriesData}
            type="area"
            dataKey="users"
            xAxisKey="date"
            title="Users"
            color="#10B981"
            height={300}
          />
        </CardContent>
      </Card>

      {/* System Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>System Configuration</span>
          </CardTitle>
          <CardDescription>Configure platform settings and parameters</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="points">Points</TabsTrigger>
              <TabsTrigger value="uploads">Uploads</TabsTrigger>
              <TabsTrigger value="badges">Badges</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="platform-name">Platform Name</Label>
                  <Input
                    id="platform-name"
                    value={settings.platform.name}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        platform: { ...prev.platform, name: e.target.value },
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="primary-color">Primary Color</Label>
                  <Input
                    id="primary-color"
                    type="color"
                    value={settings.platform.primaryColor}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        platform: { ...prev.platform, primaryColor: e.target.value },
                      }))
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="platform-description">Platform Description</Label>
                <Textarea
                  id="platform-description"
                  value={settings.platform.description}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      platform: { ...prev.platform, description: e.target.value },
                    }))
                  }
                />
              </div>
            </TabsContent>

            <TabsContent value="points" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="default-points">Default Task Points</Label>
                  <Input
                    id="default-points"
                    type="number"
                    value={settings.points.defaultTaskPoints}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        points: { ...prev.points, defaultTaskPoints: Number.parseInt(e.target.value) },
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bonus-multiplier">Bonus Multiplier</Label>
                  <Input
                    id="bonus-multiplier"
                    type="number"
                    step="0.1"
                    value={settings.points.bonusMultiplier}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        points: { ...prev.points, bonusMultiplier: Number.parseFloat(e.target.value) },
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="daily-bonus">Daily Login Bonus</Label>
                  <Input
                    id="daily-bonus"
                    type="number"
                    value={settings.points.dailyLoginBonus}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        points: { ...prev.points, dailyLoginBonus: Number.parseInt(e.target.value) },
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="referral-bonus">Referral Bonus</Label>
                  <Input
                    id="referral-bonus"
                    type="number"
                    value={settings.points.referralBonus}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        points: { ...prev.points, referralBonus: Number.parseInt(e.target.value) },
                      }))
                    }
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="uploads" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="max-file-size">Max File Size (MB)</Label>
                  <Input
                    id="max-file-size"
                    type="number"
                    value={settings.uploads.maxFileSize}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        uploads: { ...prev.uploads, maxFileSize: Number.parseInt(e.target.value) },
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max-files">Max Files Per Submission</Label>
                  <Input
                    id="max-files"
                    type="number"
                    value={settings.uploads.maxFilesPerSubmission}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        uploads: { ...prev.uploads, maxFilesPerSubmission: Number.parseInt(e.target.value) },
                      }))
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Allowed File Types</Label>
                <div className="flex flex-wrap gap-2">
                  {settings.uploads.allowedTypes.map((type) => (
                    <Badge key={type} variant="outline">
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="badges" className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">Badge Management</h3>
                  <p className="text-sm text-gray-600">Create and manage achievement badges</p>
                </div>
                <Button>
                  <Award className="mr-2 h-4 w-4" />
                  Create Badge
                </Button>
              </div>
              <DataTable columns={badgeColumns} data={badges} />
            </TabsContent>
          </Tabs>

          <div className="flex justify-end pt-4">
            <Button onClick={handleSaveSettings}>
              <Database className="mr-2 h-4 w-4" />
              Save Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
