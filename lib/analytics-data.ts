export interface AnalyticsMetrics {
  userMetrics: {
    totalUsers: number
    activeUsers: number
    newUsers: number
    retainedUsers: number
    churnRate: number
  }
  taskMetrics: {
    totalTasks: number
    completedTasks: number
    averageCompletionTime: number
    popularCategories: string[]
  }
  organizationMetrics: {
    totalOrganizations: number
    activeOrganizations: number
    averageTasksPerOrg: number
    topPerformingOrgs: any[]
  }
  pointMetrics: {
    totalPointsAwarded: number
    averagePointsPerUser: number
    pointDistributionByCategory: Record<string, number>
  }
}

export interface TimeSeriesData {
  date: string
  users: number
  tasks: number
  points: number
  organizations: number
}

export interface GeographicData {
  location: string
  lat: number
  lng: number
  users: number
  tasks: number
  points: number
}

export interface SystemHealth {
  status: "healthy" | "warning" | "critical"
  uptime: number
  responseTime: number
  errorRate: number
  activeConnections: number
  memoryUsage: number
  cpuUsage: number
}

export interface Badge {
  id: string
  name: string
  description: string
  iconUrl: string
  rarity: "common" | "rare" | "epic" | "legendary"
  pointThreshold: number
  criteria: string
  autoAward: boolean
  isActive: boolean
  createdAt: string
}

export interface SystemSettings {
  platform: {
    name: string
    description: string
    logoUrl: string
    primaryColor: string
    secondaryColor: string
  }
  points: {
    defaultTaskPoints: number
    bonusMultiplier: number
    dailyLoginBonus: number
    referralBonus: number
  }
  uploads: {
    maxFileSize: number
    allowedTypes: string[]
    maxFilesPerSubmission: number
  }
  location: {
    accuracyRequired: number
    radiusToleranceKm: number
  }
  cooldowns: {
    taskSubmissionHours: number
    prizeRedemptionHours: number
  }
}

// Mock analytics data
export const mockAnalyticsMetrics: AnalyticsMetrics = {
  userMetrics: {
    totalUsers: 15847,
    activeUsers: 8923,
    newUsers: 342,
    retainedUsers: 7234,
    churnRate: 12.5,
  },
  taskMetrics: {
    totalTasks: 2847,
    completedTasks: 18934,
    averageCompletionTime: 24.5,
    popularCategories: ["Wildlife Conservation", "Pollution Monitoring", "Renewable Energy"],
  },
  organizationMetrics: {
    totalOrganizations: 156,
    activeOrganizations: 134,
    averageTasksPerOrg: 18.2,
    topPerformingOrgs: [],
  },
  pointMetrics: {
    totalPointsAwarded: 2847392,
    averagePointsPerUser: 179.6,
    pointDistributionByCategory: {
      "Wildlife Conservation": 847392,
      "Pollution Monitoring": 623847,
      "Renewable Energy": 456234,
      "Urban Forestry": 334567,
      "Ocean Conservation": 285234,
      "Waste Management": 234567,
      Transportation: 65551,
    },
  },
}

export const mockTimeSeriesData: TimeSeriesData[] = [
  { date: "2024-11-01", users: 12450, tasks: 15234, points: 2234567, organizations: 142 },
  { date: "2024-11-08", users: 12789, tasks: 16123, points: 2345678, organizations: 145 },
  { date: "2024-11-15", users: 13234, tasks: 17456, points: 2456789, organizations: 148 },
  { date: "2024-11-22", users: 14567, tasks: 18234, points: 2567890, organizations: 151 },
  { date: "2024-11-29", users: 15234, tasks: 18567, points: 2678901, organizations: 153 },
  { date: "2024-12-06", users: 15456, tasks: 18789, points: 2789012, organizations: 155 },
  { date: "2024-12-13", users: 15678, tasks: 18923, points: 2834567, organizations: 156 },
  { date: "2024-12-20", users: 15847, tasks: 18934, points: 2847392, organizations: 156 },
]

export const mockGeographicData: GeographicData[] = [
  { location: "California", lat: 36.7783, lng: -119.4179, users: 2847, tasks: 4234, points: 567890 },
  { location: "New York", lat: 40.7128, lng: -74.006, users: 1923, tasks: 3456, points: 456789 },
  { location: "Texas", lat: 31.9686, lng: -99.9018, users: 1567, tasks: 2789, points: 345678 },
  { location: "Florida", lat: 27.7663, lng: -82.6404, users: 1234, tasks: 2345, points: 234567 },
  { location: "Washington", lat: 47.7511, lng: -120.7401, users: 1089, tasks: 1987, points: 198765 },
  { location: "Oregon", lat: 43.8041, lng: -120.5542, users: 876, tasks: 1654, points: 165432 },
  { location: "Colorado", lat: 39.0598, lng: -105.3111, users: 654, tasks: 1234, points: 123456 },
]

export const mockSystemHealth: SystemHealth = {
  status: "healthy",
  uptime: 99.97,
  responseTime: 245,
  errorRate: 0.03,
  activeConnections: 1247,
  memoryUsage: 68.5,
  cpuUsage: 23.7,
}

export const mockBadges: Badge[] = [
  {
    id: "badge1",
    name: "First Steps",
    description: "Complete your first climate action task",
    iconUrl: "/placeholder.svg?height=64&width=64",
    rarity: "common",
    pointThreshold: 10,
    criteria: "Complete 1 task",
    autoAward: true,
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "badge2",
    name: "Climate Champion",
    description: "Earn 1000 points contributing to climate action",
    iconUrl: "/placeholder.svg?height=64&width=64",
    rarity: "rare",
    pointThreshold: 1000,
    criteria: "Earn 1000 total points",
    autoAward: true,
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "badge3",
    name: "Data Guardian",
    description: "Submit 50 high-quality data submissions",
    iconUrl: "/placeholder.svg?height=64&width=64",
    rarity: "epic",
    pointThreshold: 2500,
    criteria: "50 approved submissions",
    autoAward: false,
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "badge4",
    name: "Planet Protector",
    description: "Legendary contributor to climate action",
    iconUrl: "/placeholder.svg?height=64&width=64",
    rarity: "legendary",
    pointThreshold: 10000,
    criteria: "10000 points + community impact",
    autoAward: false,
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
  },
]

export const mockSystemSettings: SystemSettings = {
  platform: {
    name: "Climate Intelligence Network",
    description: "Gamify Climate Action, Make Real Impact",
    logoUrl: "/placeholder.svg?height=64&width=64",
    primaryColor: "#10B981",
    secondaryColor: "#3B82F6",
  },
  points: {
    defaultTaskPoints: 100,
    bonusMultiplier: 1.5,
    dailyLoginBonus: 10,
    referralBonus: 500,
  },
  uploads: {
    maxFileSize: 10,
    allowedTypes: ["jpg", "jpeg", "png", "gif", "mp4", "pdf"],
    maxFilesPerSubmission: 5,
  },
  location: {
    accuracyRequired: 100,
    radiusToleranceKm: 1,
  },
  cooldowns: {
    taskSubmissionHours: 24,
    prizeRedemptionHours: 168,
  },
}
