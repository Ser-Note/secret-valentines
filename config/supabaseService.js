const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  const missingVars = [];
  if (!supabaseUrl) missingVars.push('SUPABASE_URL');
  if (!supabaseServiceKey) missingVars.push('SUPABASE_SERVICE_ROLE_KEY');

  console.error('❌ Missing required environment variables:', missingVars.join(', '));
  throw new Error(`Missing environment variables: ${missingVars.join(', ')}`);
}

try {
  new URL(supabaseUrl);
} catch (error) {
  console.error('❌ Invalid SUPABASE_URL format:', supabaseUrl);
  console.error('URL must be a valid HTTP/HTTPS URL like: https://your-project.supabase.co');
  throw new Error(`Invalid SUPABASE_URL format: ${supabaseUrl}`);
}

const supabaseService = createClient(supabaseUrl, supabaseServiceKey);

module.exports = supabaseService;
