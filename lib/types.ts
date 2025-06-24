export type UserRole = "SUPER_ADMIN" | "ORG_ADMIN" | "USER"

export type OrganizationStatus = "pending" | "approved" | "rejected"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  organizationId?: string
  organizationStatus?: OrganizationStatus
}

export interface Organization {
  id: string
  name: string
  description: string
  status: OrganizationStatus
  capabilities: {
    isPlayerOrg: boolean
    isTaskMaker: boolean
    isPrizeGiver: boolean
  }
  website?: string
  location?: string
  contactEmail: string
  adminName: string
  adminEmail: string
  adminPhone?: string
  rejectionReason?: string
}
