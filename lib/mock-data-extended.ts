export interface FormField {
  id: string
  name: string
  label: string
  type: "text" | "number" | "date" | "dropdown" | "checkbox" | "file"
  required: boolean
  options?: string[]
  validation?: {
    min?: number
    max?: number
    pattern?: string
  }
}

export interface TaskFormData {
  basicInfo: {
    title: string
    description: string
    instructions: string
    category: string
    difficulty: "easy" | "medium" | "hard"
    pointsReward: number
  }
  settings: {
    maxSubmissionsPerUser: number
    cooldownPeriodDays: number
    locationRequired: boolean
    targetLocation?: string
    locationRadiusKm?: number
    fileUploadRequired: boolean
    allowedFileTypes: string[]
    maxFileSizeMB: number
    maxFilesPerSubmission: number
  }
  customFields: FormField[]
  validationRules: any
}

export interface Member {
  id: string
  userId: string
  fullName: string
  email: string
  avatarUrl?: string
  joinedAt: string
  pointsEarned: number
  submissionsCount: number
  badgesEarned: number
  status: "active" | "inactive"
  lastActivity: string
  location?: string
}

export interface JoinRequest {
  id: string
  userId: string
  userName: string
  userEmail: string
  requestDate: string
  message?: string
  status: "pending" | "approved" | "rejected"
  userProfile: {
    totalPoints: number
    badgeCount: number
    joinDate: string
    location?: string
  }
}

export interface Prize {
  id: string
  organizationId: string
  name: string
  description: string
  imageUrl?: string
  pointCost: number
  quantityAvailable: number
  quantityRedeemed: number
  prizeType: "physical" | "digital" | "voucher" | "experience"
  redemptionInstructions: string
  termsAndConditions: string
  expiresAt?: string
  status: "active" | "inactive" | "expired"
  createdAt: string
}

export interface PrizeRedemption {
  id: string
  prizeId: string
  prizeName: string
  userId: string
  userName: string
  userEmail: string
  pointsSpent: number
  redemptionCode?: string
  status: "pending" | "fulfilled" | "cancelled"
  requestedAt: string
  fulfilledAt?: string
  trackingInfo?: string
  notes?: string
}

export interface SubmissionReview {
  id: string
  taskId: string
  taskTitle: string
  taskType: string
  organizationName: string
  userId: string
  userName: string
  userEmail: string
  submissionData: any
  attachments: FileAttachment[]
  location?: { lat: number; lng: number; address?: string }
  submittedAt: string
  status: "pending" | "approved" | "rejected" | "flagged"
  reviewNotes?: string
  pointsAwarded?: number
  reviewedBy?: string
  reviewedAt?: string
  flagReason?: string
}

export interface FileAttachment {
  id: string
  filename: string
  fileType: string
  fileSize: number
  url: string
  thumbnailUrl?: string
}

export interface UserWarning {
  id: string
  userId: string
  userName: string
  warningType: "invalid_data" | "spam" | "inappropriate_content" | "location_mismatch"
  severity: "low" | "medium" | "high"
  reason: string
  submissionId?: string
  pointsReverted: number
  badgesRevoked: string[]
  issuedBy: string
  issuedAt: string
  autoEscalated: boolean
}

// Mock data for organization members
export const mockMembers: Member[] = [
  {
    id: "member1",
    userId: "user1",
    fullName: "John Doe",
    email: "john.doe@email.com",
    joinedAt: "2024-01-20T10:00:00Z",
    pointsEarned: 1250,
    submissionsCount: 45,
    badgesEarned: 8,
    status: "active",
    lastActivity: "2024-12-24T08:30:00Z",
    location: "Colombo, Sri Lanka",
  },
  {
    id: "member2",
    userId: "user2",
    fullName: "Jane Smith",
    email: "jane.smith@email.com",
    joinedAt: "2024-02-15T14:20:00Z",
    pointsEarned: 2100,
    submissionsCount: 78,
    badgesEarned: 12,
    status: "active",
    lastActivity: "2024-12-23T19:45:00Z",
    location: "Portland, OR",
  },
  {
    id: "member3",
    userId: "user5",
    fullName: "Alex Brown",
    email: "alex.brown@email.com",
    joinedAt: "2024-03-22T11:30:00Z",
    pointsEarned: 890,
    submissionsCount: 32,
    badgesEarned: 6,
    status: "active",
    lastActivity: "2024-12-24T07:15:00Z",
    location: "Miami, FL",
  },
  {
    id: "member4",
    userId: "user6",
    fullName: "Emily Chen",
    email: "emily.chen@email.com",
    joinedAt: "2024-04-10T09:15:00Z",
    pointsEarned: 1650,
    submissionsCount: 56,
    badgesEarned: 10,
    status: "active",
    lastActivity: "2024-12-22T16:20:00Z",
    location: "Seattle, WA",
  },
  {
    id: "member5",
    userId: "user7",
    fullName: "David Wilson",
    email: "david.wilson@email.com",
    joinedAt: "2024-05-05T13:45:00Z",
    pointsEarned: 420,
    submissionsCount: 18,
    badgesEarned: 3,
    status: "inactive",
    lastActivity: "2024-12-10T12:00:00Z",
    location: "Austin, TX",
  },
]

// Mock data for join requests
export const mockJoinRequests: JoinRequest[] = [
  {
    id: "req1",
    userId: "user8",
    userName: "Maria Garcia",
    userEmail: "maria.garcia@email.com",
    requestDate: "2024-12-23T14:30:00Z",
    message:
      "I'm passionate about renewable energy and would love to contribute to your solar panel documentation project.",
    status: "pending",
    userProfile: {
      totalPoints: 850,
      badgeCount: 5,
      joinDate: "2024-06-15T10:00:00Z",
      location: "Los Angeles, CA",
    },
  },
  {
    id: "req2",
    userId: "user9",
    userName: "Robert Kim",
    userEmail: "robert.kim@email.com",
    requestDate: "2024-12-22T09:15:00Z",
    message:
      "I have experience in environmental data collection and would like to help with your organization's mission.",
    status: "pending",
    userProfile: {
      totalPoints: 1200,
      badgeCount: 7,
      joinDate: "2024-07-20T14:30:00Z",
      location: "San Diego, CA",
    },
  },
  {
    id: "req3",
    userId: "user10",
    userName: "Lisa Thompson",
    userEmail: "lisa.thompson@email.com",
    requestDate: "2024-12-21T16:45:00Z",
    status: "pending",
    userProfile: {
      totalPoints: 650,
      badgeCount: 4,
      joinDate: "2024-08-10T11:20:00Z",
      location: "Phoenix, AZ",
    },
  },
]

// Mock data for prizes
export const mockPrizes: Prize[] = [
  {
    id: "prize1",
    organizationId: "org1",
    name: "Solar Panel Installation Consultation",
    description: "Free 1-hour consultation with our solar energy experts for your home or business",
    pointCost: 2000,
    quantityAvailable: 10,
    quantityRedeemed: 3,
    prizeType: "experience",
    redemptionInstructions:
      "Contact our team at solar@greentech.com with your redemption code to schedule your consultation.",
    termsAndConditions:
      "Valid for 6 months from redemption date. Consultation includes site assessment and energy savings estimate.",
    expiresAt: "2025-06-30T23:59:59Z",
    status: "active",
    createdAt: "2024-11-01T10:00:00Z",
  },
  {
    id: "prize2",
    organizationId: "org1",
    name: "Eco-Friendly Water Bottle",
    description: "Stainless steel water bottle with Green Tech Solutions logo",
    pointCost: 500,
    quantityAvailable: 50,
    quantityRedeemed: 12,
    prizeType: "physical",
    redemptionInstructions: "We'll ship your water bottle to your registered address within 5-7 business days.",
    termsAndConditions: "Free shipping within the US. International shipping charges may apply.",
    status: "active",
    createdAt: "2024-10-15T14:30:00Z",
  },
  {
    id: "prize3",
    organizationId: "org1",
    name: "Green Tech Digital Badge Pack",
    description: "Exclusive digital badges for your profile showcasing your environmental commitment",
    pointCost: 200,
    quantityAvailable: 100,
    quantityRedeemed: 25,
    prizeType: "digital",
    redemptionInstructions: "Digital badges will be automatically added to your profile within 24 hours.",
    termsAndConditions: "Badges are non-transferable and permanent additions to your profile.",
    status: "active",
    createdAt: "2024-09-20T09:15:00Z",
  },
]

// Mock data for prize redemptions
export const mockPrizeRedemptions: PrizeRedemption[] = [
  {
    id: "redemption1",
    prizeId: "prize1",
    prizeName: "Solar Panel Installation Consultation",
    userId: "user1",
    userName: "John Doe",
    userEmail: "john.doe@email.com",
    pointsSpent: 2000,
    redemptionCode: "SOLAR-2024-001",
    status: "pending",
    requestedAt: "2024-12-23T10:30:00Z",
  },
  {
    id: "redemption2",
    prizeId: "prize2",
    prizeName: "Eco-Friendly Water Bottle",
    userId: "user2",
    userName: "Jane Smith",
    userEmail: "jane.smith@email.com",
    pointsSpent: 500,
    redemptionCode: "BOTTLE-2024-002",
    status: "fulfilled",
    requestedAt: "2024-12-20T14:15:00Z",
    fulfilledAt: "2024-12-22T09:30:00Z",
    trackingInfo: "UPS: 1Z999AA1234567890",
    notes: "Shipped to registered address",
  },
  {
    id: "redemption3",
    prizeId: "prize3",
    prizeName: "Green Tech Digital Badge Pack",
    userId: "user5",
    userName: "Alex Brown",
    userEmail: "alex.brown@email.com",
    pointsSpent: 200,
    status: "fulfilled",
    requestedAt: "2024-12-21T16:45:00Z",
    fulfilledAt: "2024-12-21T17:00:00Z",
    notes: "Digital badges added to profile automatically",
  },
]

// Mock data for submission reviews
export const mockSubmissionReviews: SubmissionReview[] = [
  {
    id: "sub1",
    taskId: "task1",
    taskTitle: "Solar Panel Installation Documentation",
    taskType: "photo_submission",
    organizationName: "Green Tech Solutions",
    userId: "user1",
    userName: "John Doe",
    userEmail: "john.doe@email.com",
    submissionData: {
      panelCount: 24,
      installationType: "Rooftop",
      estimatedCapacity: 8.5,
      notes: "Large residential installation with optimal south-facing exposure",
    },
    attachments: [
      {
        id: "file1",
        filename: "solar_installation_1.jpg",
        fileType: "image/jpeg",
        fileSize: 2048576,
        url: "/placeholder.svg?height=400&width=600",
        thumbnailUrl: "/placeholder.svg?height=200&width=300",
      },
      {
        id: "file2",
        filename: "solar_installation_2.jpg",
        fileType: "image/jpeg",
        fileSize: 1856432,
        url: "/placeholder.svg?height=400&width=600",
        thumbnailUrl: "/placeholder.svg?height=200&width=300",
      },
    ],
    location: {
      lat: 6.9271,
      lng: 79.8612,
      address: "Colombo, Sri Lanka",
    },
    submittedAt: "2024-12-23T14:30:00Z",
    status: "pending",
  },
  {
    id: "sub2",
    taskId: "task2",
    taskTitle: "Beach Cleanup Data Collection",
    taskType: "data_collection",
    organizationName: "Ocean Guardians",
    userId: "user2",
    userName: "Jane Smith",
    userEmail: "jane.smith@email.com",
    submissionData: {
      plasticBottles: 45,
      cigaretteButts: 128,
      foodWrappers: 67,
      otherDebris: "Fishing nets, rope, plastic bags",
      cleanupDuration: 120,
    },
    attachments: [],
    location: {
      lat: 25.7617,
      lng: -80.1918,
      address: "Miami Beach, FL",
    },
    submittedAt: "2024-12-22T09:15:00Z",
    status: "flagged",
    flagReason: "Unusually high debris count requires verification",
  },
  {
    id: "sub3",
    taskId: "task4",
    taskTitle: "Urban Tree Health Assessment",
    taskType: "observation",
    organizationName: "Urban Forest Initiative",
    userId: "user5",
    userName: "Alex Brown",
    userEmail: "alex.brown@email.com",
    submissionData: {
      treeSpecies: "American Elm",
      healthRating: "Good",
      diseasePresent: false,
      estimatedAge: "Mature",
      surroundingConditions: "Well-maintained sidewalk area with adequate spacing",
    },
    attachments: [
      {
        id: "file3",
        filename: "tree_assessment.jpg",
        fileType: "image/jpeg",
        fileSize: 3145728,
        url: "/placeholder.svg?height=600&width=400",
        thumbnailUrl: "/placeholder.svg?height=300&width=200",
      },
    ],
    location: {
      lat: 40.7128,
      lng: -74.006,
      address: "Central Park, New York, NY",
    },
    submittedAt: "2024-12-21T11:45:00Z",
    status: "approved",
    pointsAwarded: 100,
    reviewedBy: "admin@climate.network",
    reviewedAt: "2024-12-22T08:30:00Z",
    reviewNotes: "Excellent documentation with clear photos and accurate assessment",
  },
]

// Mock data for user warnings
export const mockUserWarnings: UserWarning[] = [
  {
    id: "warn1",
    userId: "user3",
    userName: "Mike Wilson",
    warningType: "inappropriate_content",
    severity: "high",
    reason: "Submitted inappropriate images not related to the task requirements",
    submissionId: "sub_rejected_1",
    pointsReverted: 50,
    badgesRevoked: ["First Submission"],
    issuedBy: "admin@climate.network",
    issuedAt: "2024-12-20T16:30:00Z",
    autoEscalated: false,
  },
  {
    id: "warn2",
    userId: "user3",
    userName: "Mike Wilson",
    warningType: "spam",
    severity: "medium",
    reason: "Multiple duplicate submissions within short time period",
    submissionId: "sub_rejected_2",
    pointsReverted: 25,
    badgesRevoked: [],
    issuedBy: "admin@climate.network",
    issuedAt: "2024-12-18T10:15:00Z",
    autoEscalated: false,
  },
  {
    id: "warn3",
    userId: "user3",
    userName: "Mike Wilson",
    warningType: "invalid_data",
    severity: "medium",
    reason: "Provided clearly false data in submission form",
    submissionId: "sub_rejected_3",
    pointsReverted: 30,
    badgesRevoked: [],
    issuedBy: "admin@climate.network",
    issuedAt: "2024-12-15T14:45:00Z",
    autoEscalated: true,
  },
]

export const taskCategories = [
  "Wildlife Conservation",
  "Pollution Monitoring",
  "Weather & Climate",
  "Renewable Energy",
  "Urban Forestry",
  "Ocean Conservation",
  "Waste Management",
  "Transportation",
  "Energy Efficiency",
  "Biodiversity",
]

export const fileTypes = [
  { value: "jpg", label: "JPEG Images" },
  { value: "jpeg", label: "JPEG Images" },
  { value: "png", label: "PNG Images" },
  { value: "gif", label: "GIF Images" },
  { value: "mp4", label: "MP4 Videos" },
  { value: "mov", label: "MOV Videos" },
  { value: "pdf", label: "PDF Documents" },
  { value: "doc", label: "Word Documents" },
  { value: "docx", label: "Word Documents" },
  { value: "zip", label: "ZIP Archives" },
]
