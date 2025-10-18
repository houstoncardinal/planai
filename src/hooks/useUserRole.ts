import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type UserRole = 'admin' | 'customer';

interface UserRoleData {
  role: UserRole | null;
  isAdmin: boolean;
  isCustomer: boolean;
  loading: boolean;
  error: Error | null;
}

export const useUserRole = (): UserRoleData => {
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setRole(null);
          setLoading(false);
          return;
        }

        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (profileError) throw profileError;

        setRole(profile?.role as UserRole || 'customer');
        setError(null);
      } catch (err) {
        console.error('Error fetching user role:', err);
        setError(err as Error);
        setRole('customer'); // Default to customer on error
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      fetchUserRole();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    role,
    isAdmin: role === 'admin',
    isCustomer: role === 'customer',
    loading,
    error
  };
};

// Helper function to check if user has admin access
export const checkAdminAccess = async (): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    return profile?.role === 'admin';
  } catch (error) {
    console.error('Error checking admin access:', error);
    return false;
  }
};

// Helper function to log admin actions
export const logAdminAction = async (
  action: string,
  targetType?: string,
  targetId?: string,
  details?: Record<string, any>
): Promise<void> => {
  try {
    const isAdmin = await checkAdminAccess();
    if (!isAdmin) {
      console.warn('Attempted to log admin action without admin privileges');
      return;
    }

    await supabase.rpc('log_admin_action', {
      p_action: action,
      p_target_type: targetType || null,
      p_target_id: targetId || null,
      p_details: details || null
    });
  } catch (error) {
    console.error('Error logging admin action:', error);
  }
};
