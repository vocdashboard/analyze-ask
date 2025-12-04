import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// External Supabase configuration
const EXTERNAL_SUPABASE_URL = 'https://nuumqvmselbuzinajbde.supabase.co';
const EXTERNAL_SERVICE_ROLE_KEY = Deno.env.get('EXTERNAL_SUPABASE_SERVICE_ROLE_KEY');

// Lovable Cloud Supabase for auth verification
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify caller is authenticated via Lovable Cloud
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('No authorization header provided');
      return new Response(
        JSON.stringify({ error: 'Unauthorized - No auth header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create Lovable Cloud client to verify the user
    const lovableSupabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);
    
    // Extract token and verify
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await lovableSupabase.auth.getUser(token);
    
    if (authError || !user) {
      console.error('Auth verification failed:', authError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized - Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('User authenticated:', user.id);

    // Create external Supabase admin client
    const externalSupabase = createClient(EXTERNAL_SUPABASE_URL, EXTERNAL_SERVICE_ROLE_KEY!, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // Parse URL to get action
    const url = new URL(req.url);
    const action = url.searchParams.get('action');

    console.log('Action requested:', action);

    switch (action) {
      case 'list-users': {
        const { data, error } = await externalSupabase.auth.admin.listUsers();
        if (error) {
          console.error('Error listing users:', error);
          return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        return new Response(
          JSON.stringify({ users: data.users }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'list-schemas': {
        // Use RPC function to list all schemas
        const { data, error } = await externalSupabase.rpc('get_all_schemas');
        if (error) {
          console.error('Error listing schemas:', error);
          return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        return new Response(
          JSON.stringify({ schemas: data }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'schema-tables': {
        const schema = url.searchParams.get('schema') || 'public';
        const { data, error } = await externalSupabase.rpc('get_schema_tables', { p_schema: schema });
        if (error) {
          console.error('Error listing schema tables:', error);
          return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        return new Response(
          JSON.stringify({ tables: data }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'table-columns': {
        const schema = url.searchParams.get('schema') || 'public';
        const table = url.searchParams.get('table');
        if (!table) {
          return new Response(
            JSON.stringify({ error: 'table parameter is required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        const { data, error } = await externalSupabase.rpc('get_table_columns', { 
          p_schema: schema, 
          p_table: table 
        });
        if (error) {
          console.error('Error listing table columns:', error);
          return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        return new Response(
          JSON.stringify({ columns: data }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'full-overview': {
        const { data, error } = await externalSupabase.rpc('get_full_schema_overview');
        if (error) {
          console.error('Error getting full overview:', error);
          return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        return new Response(
          JSON.stringify({ overview: data }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'get-user-roles': {
        const { data, error } = await externalSupabase
          .from('user_roles')
          .select('*');
        
        if (error) {
          console.error('Error getting user roles:', error);
          return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        
        return new Response(
          JSON.stringify({ roles: data }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'add-user-role': {
        const body = await req.json();
        const { user_id, role } = body;

        if (!user_id || !role) {
          return new Response(
            JSON.stringify({ error: 'user_id and role are required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const { data, error } = await externalSupabase
          .from('user_roles')
          .insert({ user_id, role })
          .select()
          .single();
        
        if (error) {
          console.error('Error adding role:', error);
          return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        
        return new Response(
          JSON.stringify({ success: true, role: data }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'remove-user-role': {
        const body = await req.json();
        const { user_id, role } = body;

        if (!user_id || !role) {
          return new Response(
            JSON.stringify({ error: 'user_id and role are required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const { error } = await externalSupabase
          .from('user_roles')
          .delete()
          .eq('user_id', user_id)
          .eq('role', role);
        
        if (error) {
          console.error('Error removing role:', error);
          return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        
        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      default:
        return new Response(
          JSON.stringify({ 
            error: 'Invalid action',
            available_actions: ['list-users', 'list-schemas', 'schema-tables', 'table-columns', 'full-overview', 'get-user-roles', 'add-user-role', 'remove-user-role']
          }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
