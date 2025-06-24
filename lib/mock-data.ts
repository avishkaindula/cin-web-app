import type { Organization } from "./types"

export interface AdminUser {
  id: string
  email: string
  fullName: string
  role: string
  joinedAt: string
}

export interface Task {
  id: string
  organizationId: string
  organizationName: string
  title: string
  description: string
  instructions: string
  taskType: "data_collection" | "photo_submission" | "survey" | "observation"
  category: string
  difficultyLevel: "easy" | "medium" | "hard"
  pointsReward: number
  maxSubmissionsPerUser: number
  cooldownPeriodDays: number
  locationRequired: boolean
  targetLocation?: string
  locationRadiusKm?: number
  fileUploadRequired: boolean
  allowedFileTypes: string[]
  maxFileSizeMB: number
  maxFilesPerSubmission: number
  requiredDataFields: any
  validationRules: any
  expiresAt?: string
  status: "pending" | "approved" | "rejected" | "active"
  createdAt: string
  createdBy: string
  rejectionReason?: string
}

export interface PlatformUser {
  id: string
  email: string
  fullName: string
  username: string
  avatarUrl?: string
  role: "USER" | "ORG_ADMIN" | "SUPER_ADMIN"
  totalPoints: number
  redeemablePoints: number
  leaderboardPoints: number
  badgeCount: number
  warningCount: number
  isBanned: boolean
  banExpiresAt?: string
  joinedAt: string
  lastActive: string
  location?: string
}

export const mockOrganizationsExtended: (Organization & { adminUsers: AdminUser[] })[] = [
  {
    id: "org1",
    name: "Green Tech Solutions",
    description: "Leading sustainable technology initiatives across urban environments",
    status: "approved",
    capabilities: {
      isPlayerOrg: true,
      isTaskMaker: true,
      isPrizeGiver: true,
    },
    website: "https://greentech.com",
    location: "Colombo, Sri Lanka",
    contactEmail: "contact@greentech.com",
    adminName: "Green Tech Admin",
    adminEmail: "org@greentech.com",
    adminPhone: "+94-71-555-0123",
    adminUsers: [
      {
        id: "admin1",
        email: "org@greentech.com",
        fullName: "Sarah Johnson",
        role: "Primary Admin",
        joinedAt: "2024-01-15T10:00:00Z",
      },
      {
        id: "admin2",
        email: "admin2@greentech.com",
        fullName: "Mike Chen",
        role: "Secondary Admin",
        joinedAt: "2024-02-01T14:30:00Z",
      },
    ],
  },
  {
    id: "org2",
    name: "Eco Warriors",
    description: "Community-driven environmental action focused on local conservation efforts",
    status: "pending",
    capabilities: {
      isPlayerOrg: true,
      isTaskMaker: false,
      isPrizeGiver: false,
    },
    contactEmail: "contact@ecowarriors.org",
    adminName: "Eco Org Admin",
    adminEmail: "pending@ecoorg.com",
    location: "Portland, OR",
    adminUsers: [
      {
        id: "admin3",
        email: "pending@ecoorg.com",
        fullName: "Emma Rodriguez",
        role: "Primary Admin",
        joinedAt: "2024-12-20T09:15:00Z",
      },
    ],
  },
  {
    id: "org3",
    name: "Bad Organization",
    description: "This organization was rejected due to policy violations",
    status: "rejected",
    capabilities: {
      isPlayerOrg: false,
      isTaskMaker: false,
      isPrizeGiver: false,
    },
    contactEmail: "contact@badorg.com",
    adminName: "Rejected Admin",
    adminEmail: "rejected@badorg.com",
    location: "Unknown",
    rejectionReason: "Organization does not meet our environmental standards and mission alignment requirements.",
    adminUsers: [
      {
        id: "admin4",
        email: "rejected@badorg.com",
        fullName: "John Smith",
        role: "Primary Admin",
        joinedAt: "2024-11-10T16:45:00Z",
      },
    ],
  },
  {
    id: "org4",
    name: "Ocean Guardians",
    description: "Marine conservation and ocean cleanup initiatives",
    status: "approved",
    capabilities: {
      isPlayerOrg: true,
      isTaskMaker: true,
      isPrizeGiver: false,
    },
    website: "https://oceanguardians.org",
    location: "Miami, FL",
    contactEmail: "info@oceanguardians.org",
    adminName: "Ocean Admin",
    adminEmail: "admin@oceanguardians.org",
    adminUsers: [
      {
        id: "admin5",
        email: "admin@oceanguardians.org",
        fullName: "Maria Santos",
        role: "Primary Admin",
        joinedAt: "2024-03-10T11:20:00Z",
      },
    ],
  },
  {
    id: "org5",
    name: "Urban Forest Initiative",
    description: "Promoting urban forestry and green spaces in metropolitan areas",
    status: "pending",
    capabilities: {
      isPlayerOrg: false,
      isTaskMaker: true,
      isPrizeGiver: true,
    },
    website: "https://urbanforest.org",
    location: "New York, NY",
    contactEmail: "contact@urbanforest.org",
    adminName: "Forest Admin",
    adminEmail: "admin@urbanforest.org",
    adminUsers: [
      {
        id: "admin6",
        email: "admin@urbanforest.org",
        fullName: "David Kim",
        role: "Primary Admin",
        joinedAt: "2024-12-18T13:45:00Z",
      },
    ],
  },
]

export const mockTasks: Task[] = [
  {
    id: "task1",
    organizationId: "org1",
    organizationName: "Green Tech Solutions",
    title: "Solar Panel Installation Documentation",
    description: "Document solar panel installations in residential areas to track renewable energy adoption",
    instructions: "Take photos of solar panel installations, record location, and estimate panel count",
    taskType: "photo_submission",
    category: "Renewable Energy",
    difficultyLevel: "easy",
    pointsReward: 50,
    maxSubmissionsPerUser: 5,
    cooldownPeriodDays: 1,
    locationRequired: true,
    targetLocation: "Colombo Metropolitan Area",
    locationRadiusKm: 50,
    fileUploadRequired: true,
    allowedFileTypes: ["jpg", "jpeg", "png"],
    maxFileSizeMB: 10,
    maxFilesPerSubmission: 3,
    requiredDataFields: {
      panelCount: "number",
      installationType: "select",
      estimatedCapacity: "number",
    },
    validationRules: {
      panelCount: { min: 1, max: 100 },
      estimatedCapacity: { min: 1, max: 50 },
    },
    status: "approved",
    createdAt: "2024-12-01T10:00:00Z",
    createdBy: "org@greentech.com",
  },
  {
    id: "task2",
    organizationId: "org4",
    organizationName: "Ocean Guardians",
    title: "Beach Cleanup Data Collection",
    description: "Collect data on beach pollution and cleanup efforts to track ocean health",
    instructions: "Record types and quantities of debris found during beach cleanups",
    taskType: "data_collection",
    category: "Ocean Conservation",
    difficultyLevel: "medium",
    pointsReward: 75,
    maxSubmissionsPerUser: 3,
    cooldownPeriodDays: 7,
    locationRequired: true,
    targetLocation: "Florida Coastline",
    locationRadiusKm: 100,
    fileUploadRequired: false,
    allowedFileTypes: [],
    maxFileSizeMB: 0,
    maxFilesPerSubmission: 0,
    requiredDataFields: {
      plasticBottles: "number",
      cigaretteButts: "number",
      foodWrappers: "number",
      otherDebris: "text",
      cleanupDuration: "number",
    },
    validationRules: {
      cleanupDuration: { min: 15, max: 480 },
    },
    status: "pending",
    createdAt: "2024-12-20T14:30:00Z",
    createdBy: "admin@oceanguardians.org",
  },
  {
    id: "task3",
    organizationId: "org1",
    organizationName: "Green Tech Solutions",
    title: "Electric Vehicle Charging Station Survey",
    description: "Survey public EV charging stations to assess accessibility and usage",
    instructions: "Visit EV charging stations and complete survey about availability and condition",
    taskType: "survey",
    category: "Transportation",
    difficultyLevel: "easy",
    pointsReward: 40,
    maxSubmissionsPerUser: 10,
    cooldownPeriodDays: 0,
    locationRequired: false,
    fileUploadRequired: true,
    allowedFileTypes: ["jpg", "jpeg", "png"],
    maxFileSizeMB: 5,
    maxFilesPerSubmission: 2,
    requiredDataFields: {
      stationBrand: "text",
      chargingSpeed: "select",
      availablePorts: "number",
      condition: "select",
      accessibility: "boolean",
    },
    validationRules: {
      availablePorts: { min: 1, max: 20 },
    },
    status: "rejected",
    createdAt: "2024-11-15T09:20:00Z",
    createdBy: "org@greentech.com",
    rejectionReason: "Survey questions need to be more specific and include standardized condition ratings.",
  },
  {
    id: "task4",
    organizationId: "org5",
    organizationName: "Urban Forest Initiative",
    title: "Urban Tree Health Assessment",
    description: "Assess the health and condition of trees in urban environments",
    instructions: "Examine trees in designated urban areas and record health indicators",
    taskType: "observation",
    category: "Urban Forestry",
    difficultyLevel: "hard",
    pointsReward: 100,
    maxSubmissionsPerUser: 2,
    cooldownPeriodDays: 14,
    locationRequired: true,
    targetLocation: "Manhattan, NYC",
    locationRadiusKm: 25,
    fileUploadRequired: true,
    allowedFileTypes: ["jpg", "jpeg", "png"],
    maxFileSizeMB: 15,
    maxFilesPerSubmission: 5,
    requiredDataFields: {
      treeSpecies: "text",
      healthRating: "select",
      diseasePresent: "boolean",
      estimatedAge: "select",
      surroundingConditions: "text",
    },
    validationRules: {
      healthRating: { options: ["Excellent", "Good", "Fair", "Poor", "Critical"] },
      estimatedAge: { options: ["Young", "Mature", "Old", "Ancient"] },
    },
    status: "pending",
    createdAt: "2024-12-19T16:15:00Z",
    createdBy: "admin@urbanforest.org",
  },
]

export const mockPlatformUsers: PlatformUser[] = [
  {
    id: "user1",
    email: "john.doe@email.com",
    fullName: "John Doe",
    username: "johndoe",
    role: "USER",
    totalPoints: 1250,
    redeemablePoints: 850,
    leaderboardPoints: 1250,
    badgeCount: 8,
    warningCount: 0,
    isBanned: false,
    joinedAt: "2024-01-20T10:00:00Z",
    lastActive: "2024-12-24T08:30:00Z",
    location: "Colombo, Sri Lanka",
  },
  {
    id: "user2",
    email: "jane.smith@email.com",
    fullName: "Jane Smith",
    username: "janesmith",
    role: "USER",
    totalPoints: 2100,
    redeemablePoints: 1200,
    leaderboardPoints: 2100,
    badgeCount: 12,
    warningCount: 1,
    isBanned: false,
    joinedAt: "2024-02-15T14:20:00Z",
    lastActive: "2024-12-23T19:45:00Z",
    location: "Portland, OR",
  },
  {
    id: "user3",
    email: "mike.wilson@email.com",
    fullName: "Mike Wilson",
    username: "mikewilson",
    role: "USER",
    totalPoints: 450,
    redeemablePoints: 0,
    leaderboardPoints: 450,
    badgeCount: 3,
    warningCount: 3,
    isBanned: true,
    banExpiresAt: "2025-01-15T00:00:00Z",
    joinedAt: "2024-06-10T09:15:00Z",
    lastActive: "2024-12-10T12:00:00Z",
    location: "Austin, TX",
  },
  {
    id: "user4",
    email: "sarah.johnson@email.com",
    fullName: "Sarah Johnson",
    username: "sarahj",
    role: "ORG_ADMIN",
    totalPoints: 3200,
    redeemablePoints: 2100,
    leaderboardPoints: 3200,
    badgeCount: 15,
    warningCount: 0,
    isBanned: false,
    joinedAt: "2024-01-15T10:00:00Z",
    lastActive: "2024-12-24T09:00:00Z",
    location: "Colombo, Sri Lanka",
  },
  {
    id: "user5",
    email: "alex.brown@email.com",
    fullName: "Alex Brown",
    username: "alexbrown",
    role: "USER",
    totalPoints: 890,
    redeemablePoints: 650,
    leaderboardPoints: 890,
    badgeCount: 6,
    warningCount: 0,
    isBanned: false,
    joinedAt: "2024-03-22T11:30:00Z",
    lastActive: "2024-12-24T07:15:00Z",
    location: "Miami, FL",
  },
]

// Activity feed data
export interface ActivityItem {
  id: string
  type: "organization_application" | "task_submission" | "user_warning" | "system_event"
  title: string
  description: string
  timestamp: string
  status?: "pending" | "approved" | "rejected"
  organizationName?: string
  userName?: string
}

export const mockActivityFeed: ActivityItem[] = [
  {
    id: "activity1",
    type: "organization_application",
    title: "New Organization Application",
    description: "Urban Forest Initiative applied to join the platform",
    timestamp: "2024-12-24T08:15:00Z",
    status: "pending",
    organizationName: "Urban Forest Initiative",
  },
  {
    id: "activity2",
    type: "task_submission",
    title: "Task Approval Needed",
    description: "Beach Cleanup Data Collection task submitted for review",
    timestamp: "2024-12-24T07:30:00Z",
    status: "pending",
    organizationName: "Ocean Guardians",
  },
  {
    id: "activity3",
    type: "user_warning",
    title: "User Warning Issued",
    description: "Warning issued to Mike Wilson for inappropriate submission",
    timestamp: "2024-12-23T16:45:00Z",
    userName: "Mike Wilson",
  },
  {
    id: "activity4",
    type: "organization_application",
    title: "Organization Approved",
    description: "Green Tech Solutions has been approved and activated",
    timestamp: "2024-12-23T14:20:00Z",
    status: "approved",
    organizationName: "Green Tech Solutions",
  },
  {
    id: "activity5",
    type: "system_event",
    title: "System Maintenance",
    description: "Scheduled maintenance completed successfully",
    timestamp: "2024-12-23T02:00:00Z",
  },
]
