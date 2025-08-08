export interface UserRole {
  role: 'admin' | 'agent';
  scope: 'global' | 'organization';
  organization_id?: string;
  organization_name?: string;
}

export interface UserPrivilege {
  type: 'mobilizing_partners' | 'mission_partners' | 'reward_partners' | 'cin_administrators';
  status: 'pending' | 'approved' | 'rejected';
}

export interface UserOrganization {
  id: string;
  name: string;
  membership_status: 'active' | 'pending' | 'inactive';
  privileges: UserPrivilege[];
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
  privileges: string[];
}
