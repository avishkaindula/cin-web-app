"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { JWTPayload, UserOrganization, UserRole } from '@/lib/types/auth';
import type { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  jwtPayload: JWTPayload | null;
  isLoading: boolean;
  isCinAdmin: boolean;
  isOrgAdmin: boolean;
  activeOrganization: UserOrganization | null;
  hasRole: (role: 'cin_admin' | 'org_admin') => boolean;
  hasCapability: (capability: 'player_org' | 'mission_creator' | 'reward_creator') => boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [jwtPayload, setJwtPayload] = useState<JWTPayload | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        
        // Parse JWT payload
        if (session.access_token) {
          try {
            const payload = JSON.parse(
              atob(session.access_token.split('.')[1])
            ) as JWTPayload;
            setJwtPayload(payload);
          } catch (error) {
            console.error('Error parsing JWT payload:', error);
          }
        }
      }
      setIsLoading(false);
    };

    getSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
        
        // Parse JWT payload
        if (session.access_token) {
          try {
            const payload = JSON.parse(
              atob(session.access_token.split('.')[1])
            ) as JWTPayload;
            setJwtPayload(payload);
          } catch (error) {
            console.error('Error parsing JWT payload:', error);
            setJwtPayload(null);
          }
        }
      } else {
        setUser(null);
        setJwtPayload(null);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  // Helper functions
  const isCinAdmin = jwtPayload?.user_roles?.some(role => role.role === 'cin_admin') ?? false;
  const isOrgAdmin = jwtPayload?.user_roles?.some(role => role.role === 'org_admin') ?? false;

  const activeOrganization = jwtPayload?.active_organization_id 
    ? jwtPayload.user_organizations?.find(org => org.id === jwtPayload.active_organization_id) || null
    : jwtPayload?.user_organizations?.[0] || null;

  const hasRole = (role: 'cin_admin' | 'org_admin'): boolean => {
    return jwtPayload?.user_roles?.some(userRole => userRole.role === role) ?? false;
  };

  const hasCapability = (capability: 'player_org' | 'mission_creator' | 'reward_creator'): boolean => {
    if (!activeOrganization) return false;
    return activeOrganization.capabilities?.some(
      cap => cap.type === capability && cap.status === 'approved'
    ) ?? false;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value: AuthContextType = {
    user,
    jwtPayload,
    isLoading,
    isCinAdmin,
    isOrgAdmin,
    activeOrganization,
    hasRole,
    hasCapability,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
