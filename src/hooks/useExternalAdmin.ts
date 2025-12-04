import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface ExternalUser {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  email_confirmed_at: string | null;
  user_metadata: Record<string, unknown>;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: string;
  created_at: string;
}

export interface SchemaInfo {
  schema_name: string;
}

export interface TableInfo {
  table_name: string;
  table_type: string;
}

export interface ColumnInfo {
  column_name: string;
  data_type: string;
  is_nullable: string;
  column_default: string | null;
}

export interface SchemaOverview {
  schema: string;
  tables: { name: string; type: string }[];
}

export function useExternalAdmin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const callAdminFunction = async (action: string, body?: Record<string, unknown>, queryParams?: Record<string, string>) => {
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
      
      // Add additional query parameters
      if (queryParams) {
        Object.entries(queryParams).forEach(([key, value]) => {
          url.searchParams.set(key, value);
        });
      }

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

  // User management
  const listUsers = async (): Promise<ExternalUser[]> => {
    const result = await callAdminFunction('list-users');
    return result.users || [];
  };

  // Schema scanning
  const listSchemas = async (): Promise<SchemaInfo[]> => {
    const result = await callAdminFunction('list-schemas');
    return result.schemas || [];
  };

  const getSchemaTables = async (schema: string = 'public'): Promise<TableInfo[]> => {
    const result = await callAdminFunction('schema-tables', undefined, { schema });
    return result.tables || [];
  };

  const getTableColumns = async (schema: string, table: string): Promise<ColumnInfo[]> => {
    const result = await callAdminFunction('table-columns', undefined, { schema, table });
    return result.columns || [];
  };

  const getFullSchemaOverview = async (): Promise<SchemaOverview[]> => {
    const result = await callAdminFunction('full-overview');
    return result.overview || [];
  };

  // Role management
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
    // User management
    listUsers,
    // Schema scanning
    listSchemas,
    getSchemaTables,
    getTableColumns,
    getFullSchemaOverview,
    // Role management
    getUserRoles,
    addUserRole,
    removeUserRole,
  };
}
