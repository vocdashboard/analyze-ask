import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://nuumqvmselbuzinajbde.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51dW1xdm1zZWxidXppbmFqYmRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ1ODYwMDIsImV4cCI6MjA4MDE2MjAwMn0.6qCPdQGXMxgD80AKM1nJp377MthYl5UirwpOOVnqjqQ';

// External Supabase client - used for all data operations and authentication
export const supabaseExternal = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});
