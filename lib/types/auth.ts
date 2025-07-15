export interface UserRole {
  role: 'cin_admin' | 'org_admin';
  scope: 'global' | 'organization';
  organization_id?: string;
  organization_name?: string;
}

export interface UserCapability {
  type: 'player_org' | 'mission_creator' | 'reward_creator';
  status: 'pending' | 'approved' | 'rejected';
}

export interface UserOrganization {
  id: string;
  name: string;
  membership_status: 'active' | 'pending' | 'inactive';
  capabilities: UserCapability[];
}

export interface JWTPayload {
  aud: string;
  exp: number;
  iat: number;
  iss: string;
  sub: string;
  email: string;
  user_roles: UserRole[];
  user_organizations: UserOrganization[];
  active_organization_id?: string;
}

export interface RoutePermission {
  roles: string[];
  capabilities: string[];
}
