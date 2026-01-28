-- ===============================================
-- DISABLE RLS for Development (Quick Fix)
-- ===============================================
-- Use this if you're getting 403 errors
-- Your Express app handles authorization via sessions
-- ===============================================

-- Disable RLS on all tables
ALTER TABLE public.user DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.gifts DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.secret_valentines DISABLE ROW LEVEL SECURITY;

-- ===============================================
-- RLS Disabled - Backend will now have full access
-- ===============================================
