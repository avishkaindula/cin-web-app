export interface UserRole {
  role: 'cin_admin' | 'org_admin';
  scope: 'global' | 'organization';
  organization_id?: string;
}

export interface UserCapability {
  capability: 'player_org' | 'mission_creator' | 'reward_creator';
  status: 'pending' | 'approved' | 'rejected';
  organization_id?: string;
}

export interface UserOrganization {
  organization_id: string;
  organization_name: string;
  role: string;
}

export interface JWTPayload {
  user_roles: UserRole[];
  user_capabilities: UserCapability[];
  user_organizations: UserOrganization[];
  // ... other JWT fields
}

export interface RoutePermission {
  roles: string[];
  capabilities: string[];
}
