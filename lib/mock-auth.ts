import type { User, Organization } from "./types"

export const mockUsers: User[] = [
  {
    id: "1",
    email: "admin@climate.network",
    name: "Super Admin",
    role: "SUPER_ADMIN",
  },
  {
    id: "2",
    email: "org@greentech.com",
    name: "Green Tech Admin",
    role: "ORG_ADMIN",
    organizationId: "org1",
    organizationStatus: "approved",
  },
  {
    id: "3",
    email: "pending@ecoorg.com",
    name: "Eco Org Admin",
    role: "ORG_ADMIN",
    organizationId: "org2",
    organizationStatus: "pending",
  },
  {
    id: "4",
    email: "rejected@badorg.com",
    name: "Rejected Admin",
    role: "ORG_ADMIN",
    organizationId: "org3",
    organizationStatus: "rejected",
  },
]

export const mockOrganizations: Organization[] = [
  {
    id: "org1",
    name: "Green Tech Solutions",
    description: "Leading sustainable technology initiatives",
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
  },
  {
    id: "org2",
    name: "Eco Warriors",
    description: "Community-driven environmental action",
    status: "pending",
    capabilities: {
      isPlayerOrg: true,
      isTaskMaker: false,
      isPrizeGiver: false,
    },
    contactEmail: "contact@ecowarriors.org",
    adminName: "Eco Org Admin",
    adminEmail: "pending@ecoorg.com",
  },
  {
    id: "org3",
    name: "Bad Organization",
    description: "This organization was rejected",
    status: "rejected",
    capabilities: {
      isPlayerOrg: false,
      isTaskMaker: false,
      isPrizeGiver: false,
    },
    contactEmail: "contact@badorg.com",
    adminName: "Rejected Admin",
    adminEmail: "rejected@badorg.com",
    rejectionReason: "Organization does not meet our environmental standards and mission alignment requirements.",
  },
]

export async function mockSignIn(email: string, password: string): Promise<User | null> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const user = mockUsers.find((u) => u.email === email)
  if (user && password === "password") {
    return user
  }
  return null
}

export function getOrganizationById(id: string): Organization | undefined {
  return mockOrganizations.find((org) => org.id === id)
}
