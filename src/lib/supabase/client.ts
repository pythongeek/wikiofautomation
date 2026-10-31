import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://slpmciqgzcwwnqebuhqe.supabase.co';
const supabaseAnonKey = import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_VB3MqoRid5mXYAbZ3wwRsw_fM1WjvtC';

export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
