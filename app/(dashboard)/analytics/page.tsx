"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { MetricCard } from "@/components/ui/metric-card"
import { AnalyticsChart } from "@/components/ui/analytics-chart"
import { TrendingUp, Users, Target, Award, Download, Calendar, BarChart3, PieChart, Activity } from "lucide-react"
import { mockAnalyticsMetrics, mockTimeSeriesData } from "@/lib/analytics-data"
import { addDays } from "date-fns"
import type { DateRange } from "react-day-picker"

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: addDays(new Date(), -30),
    to: new Date(),
  })
  const [selectedMetric, setSelectedMetric] = useState("users")

  const handleExportReport = () => {
    // Simulate report export
    const blob = new Blob(["Sample analytics report data"], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `analytics-report-${new Date().toISOString().split("T")[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Transform point distribution data for pie chart
  const pointDistributionData = Object.entries(mockAnalyticsMetrics.pointMetrics.pointDistributionByCategory).map(
    ([category, points]) => ({
      name: category,
      value: points,
      points: points,
    }),
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Organization Analytics</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Detailed insights and performance metrics for your organization
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <DatePickerWithRange date={dateRange} onDateChange={setDateRange} />
          <Button onClick={handleExportReport}>
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          title="Total Members"
          value="134"
          change={{ value: 12.5, type: "increase" }}
          icon={Users}
          description="Active organization members"
        />
        <MetricCard
          title="Tasks Completed"
          value="2,847"
          change={{ value: 8.3, type: "increase" }}
          icon={Target}
          description="This month"
        />
        <MetricCard
          title="Points Awarded"
          value="284,739"
          change={{ value: 15.2, type: "increase" }}
          icon={Award}
          description="Total points distributed"
        />
        <MetricCard
          title="Avg. Completion Rate"
          value="87.3%"
          change={{ value: 3.1, type: "increase" }}
          icon={TrendingUp}
          description="Task completion rate"
        />
      </div>

      {/* Analytics Dashboard */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Performance Analytics</span>
              </CardTitle>
              <CardDescription>Track your organization's performance over time</CardDescription>
            </div>
            <Select value={selectedMetric} onValueChange={setSelectedMetric}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select metric" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="users">Active Members</SelectItem>
                <SelectItem value="tasks">Tasks Completed</SelectItem>
                <SelectItem value="points">Points Awarded</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <AnalyticsChart
            data={mockTimeSeriesData}
            type="line"
            dataKey={selectedMetric}
            xAxisKey="date"
            title={selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1)}
            color="#10B981"
            height={400}
          />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Task Category Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <PieChart className="h-5 w-5" />
              <span>Points by Category</span>
            </CardTitle>
            <CardDescription>Distribution of points across task categories</CardDescription>
          </CardHeader>
          <CardContent>
            <AnalyticsChart
              data={pointDistributionData}
              type="pie"
              dataKey="value"
              title="Points Distribution"
              height={300}
            />
          </CardContent>
        </Card>

        {/* Member Engagement */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>Member Engagement</span>
            </CardTitle>
            <CardDescription>Member activity and participation trends</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Highly Active (50+ tasks)</span>
                <span className="text-sm text-gray-600">23 members</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: "17%" }}></div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Moderately Active (10-49 tasks)</span>
                <span className="text-sm text-gray-600">67 members</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: "50%" }}></div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Low Activity (1-9 tasks)</span>
                <span className="text-sm text-gray-600">34 members</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: "25%" }}></div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Inactive (0 tasks)</span>
                <span className="text-sm text-gray-600">10 members</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-red-500 h-2 rounded-full" style={{ width: "8%" }}></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Custom Reports</CardTitle>
          <CardDescription>Generate detailed reports for specific time periods and metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="summary" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="summary">Summary Report</TabsTrigger>
              <TabsTrigger value="detailed">Detailed Analysis</TabsTrigger>
              <TabsTrigger value="predictions">Predictions</TabsTrigger>
            </TabsList>

            <TabsContent value="summary" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold text-lg">Task Performance</h4>
                  <p className="text-2xl font-bold text-green-600">87.3%</p>
                  <p className="text-sm text-gray-600">Average completion rate</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold text-lg">Member Growth</h4>
                  <p className="text-2xl font-bold text-blue-600">+12.5%</p>
                  <p className="text-sm text-gray-600">This month</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold text-lg">Point Efficiency</h4>
                  <p className="text-2xl font-bold text-purple-600">2.3x</p>
                  <p className="text-sm text-gray-600">Points per task ratio</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="detailed" className="space-y-4">
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Detailed Analysis</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Comprehensive analysis with member-level insights, task performance breakdowns, and engagement
                  patterns.
                </p>
                <Button className="mt-4">Generate Detailed Report</Button>
              </div>
            </TabsContent>

            <TabsContent value="predictions" className="space-y-4">
              <div className="text-center py-8">
                <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Predictive Analytics</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  AI-powered predictions for member churn, task success rates, and optimal point pricing.
                </p>
                <Button className="mt-4">View Predictions</Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
