import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ExternalUser {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  email_confirmed_at: string | null;
  user_metadata: Record<string, unknown>;
}

interface UserRole {
  id: string;
  user_id: string;
  role: string;
  created_at: string;
}

export function useExternalAdmin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const callAdminFunction = async (action: string, body?: Record<string, unknown>) => {
    setLoading(true);
    setError(null);

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;

      if (!token) {
        throw new Error('Not authenticated');
      }

      const url = new URL(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/external-supabase-admin`);
      url.searchParams.set('action', action);

      const response = await fetch(url.toString(), {
        method: body ? 'POST' : 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Request failed');
      }

      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const listUsers = async (): Promise<ExternalUser[]> => {
    const result = await callAdminFunction('list-users');
    return result.users || [];
  };

  const listSchemas = async () => {
    const result = await callAdminFunction('list-schemas');
    return result.schemas || [];
  };

  const listTables = async (schema: string = 'public') => {
    const url = new URL(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/external-supabase-admin`);
    url.searchParams.set('action', 'list-tables');
    url.searchParams.set('schema', schema);
    
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;

    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();
    return result.tables || [];
  };

  const getUserRoles = async (): Promise<UserRole[]> => {
    const result = await callAdminFunction('get-user-roles');
    return result.roles || [];
  };

  const addUserRole = async (userId: string, role: string) => {
    return callAdminFunction('add-user-role', { user_id: userId, role });
  };

  const removeUserRole = async (userId: string, role: string) => {
    return callAdminFunction('remove-user-role', { user_id: userId, role });
  };

  return {
    loading,
    error,
    listUsers,
    listSchemas,
    listTables,
    getUserRoles,
    addUserRole,
    removeUserRole,
  };
}
