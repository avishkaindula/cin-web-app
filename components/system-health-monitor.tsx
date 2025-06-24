"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Activity, Server, Zap, Users, AlertTriangle, CheckCircle } from "lucide-react"
import { mockSystemHealth } from "@/lib/analytics-data"
import type { SystemHealth } from "@/lib/analytics-data"

interface SystemHealthMonitorProps {
  data?: SystemHealth
}

export function SystemHealthMonitor({ data = mockSystemHealth }: SystemHealthMonitorProps) {
  const getStatusColor = (status: SystemHealth["status"]) => {
    switch (status) {
      case "healthy":
        return "bg-green-100 text-green-800"
      case "warning":
        return "bg-yellow-100 text-yellow-800"
      case "critical":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: SystemHealth["status"]) => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="h-4 w-4" />
      case "warning":
      case "critical":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Server className="h-5 w-5" />
          <span>System Health</span>
        </CardTitle>
        <CardDescription>Real-time platform performance metrics</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getStatusIcon(data.status)}
            <span className="font-medium">System Status</span>
          </div>
          <Badge className={getStatusColor(data.status)}>
            {data.status.charAt(0).toUpperCase() + data.status.slice(1)}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Uptime</span>
              <span className="font-medium">{data.uptime}%</span>
            </div>
            <Progress value={data.uptime} className="h-2" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Response Time</span>
              <span className="font-medium">{data.responseTime}ms</span>
            </div>
            <Progress value={Math.min((1000 - data.responseTime) / 10, 100)} className="h-2" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Memory Usage</span>
              <span className="font-medium">{data.memoryUsage}%</span>
            </div>
            <Progress value={data.memoryUsage} className="h-2" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>CPU Usage</span>
              <span className="font-medium">{data.cpuUsage}%</span>
            </div>
            <Progress value={data.cpuUsage} className="h-2" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-blue-500" />
            <div>
              <p className="text-sm font-medium">{data.activeConnections}</p>
              <p className="text-xs text-muted-foreground">Active Connections</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Zap className="h-4 w-4 text-yellow-500" />
            <div>
              <p className="text-sm font-medium">{data.errorRate}%</p>
              <p className="text-xs text-muted-foreground">Error Rate</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
