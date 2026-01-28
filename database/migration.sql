-- ===============================================
-- Secret Valentines Database Migration
-- ===============================================
-- Run this SQL in your Supabase SQL Editor
-- ===============================================

-- Step 1: Create or update users table
CREATE TABLE IF NOT EXISTS public.user (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  user_name text NOT NULL DEFAULT ''::text,
  password text NOT NULL DEFAULT ''::text,
  "isAuthenticated" boolean NULL DEFAULT false,
  "isAdmin" boolean NULL DEFAULT false,
  CONSTRAINT user_pkey PRIMARY KEY (id),
  CONSTRAINT user_name_unique UNIQUE (user_name)
) TABLESPACE pg_default;

-- Step 2: Create gifts table
CREATE TABLE IF NOT EXISTS public.gifts (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  gift_description text NOT NULL,
  price decimal(10, 2) NOT NULL,
  gift_order integer NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT gifts_pkey PRIMARY KEY (id),
  CONSTRAINT gifts_user_id_fkey FOREIGN KEY (user_id) 
    REFERENCES public.user(id) ON DELETE CASCADE,
  CONSTRAINT gifts_order_valid CHECK (gift_order >= 1 AND gift_order <= 5),
  CONSTRAINT gifts_price_valid CHECK (price > 0),
  CONSTRAINT unique_user_order UNIQUE (user_id, gift_order)
) TABLESPACE pg_default;

-- Step 3: Create secret valentines table
CREATE TABLE IF NOT EXISTS public.secret_valentines (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  from_user_id uuid NOT NULL,
  to_user_id uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT secret_valentines_pkey PRIMARY KEY (id),
  CONSTRAINT secret_valentines_from_fkey FOREIGN KEY (from_user_id) 
    REFERENCES public.user(id) ON DELETE CASCADE,
  CONSTRAINT secret_valentines_to_fkey FOREIGN KEY (to_user_id) 
    REFERENCES public.user(id) ON DELETE CASCADE,
  CONSTRAINT unique_from_user UNIQUE (from_user_id)
) TABLESPACE pg_default;

-- Step 4: Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_gifts_user_id ON public.gifts(user_id);
CREATE INDEX IF NOT EXISTS idx_secret_valentines_from ON public.secret_valentines(from_user_id);
CREATE INDEX IF NOT EXISTS idx_secret_valentines_to ON public.secret_valentines(to_user_id);
CREATE INDEX IF NOT EXISTS idx_user_auth ON public.user(isAuthenticated);
CREATE INDEX IF NOT EXISTS idx_user_admin ON public.user(isAdmin);

-- Step 5: Create first admin user (CHANGE PASSWORD AFTER FIRST LOGIN!)
INSERT INTO public.user (user_name, password, isAuthenticated, isAdmin)
VALUES ('Admin', 'admin123', true, true)
ON CONFLICT (user_name) DO NOTHING;

-- ===============================================
-- Step 6: Enable Row Level Security (RLS)
-- ===============================================

-- Enable RLS on all tables
ALTER TABLE public.user ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.secret_valentines ENABLE ROW LEVEL SECURITY;

-- ===============================================
-- Step 7: Create Permissive RLS Policies
-- ===============================================

-- User table - allow all access
DROP POLICY IF EXISTS "Service role has full access to users" ON public.user;
DROP POLICY IF EXISTS "Backend has full access to users" ON public.user;

CREATE POLICY "Allow all to user"
ON public.user
FOR ALL
USING (true)
WITH CHECK (true);

-- Gifts table - allow all access
DROP POLICY IF EXISTS "Service role has full access to gifts" ON public.gifts;
DROP POLICY IF EXISTS "Backend has full access to gifts" ON public.gifts;

CREATE POLICY "Allow all to gifts"
ON public.gifts
FOR ALL
USING (true)
WITH CHECK (true);

-- Secret valentines table - allow all access
DROP POLICY IF EXISTS "Service role has full access to secret_valentines" ON public.secret_valentines;
DROP POLICY IF EXISTS "Backend has full access to secret_valentines" ON public.secret_valentines;

CREATE POLICY "Allow all to secret_valentines"
ON public.secret_valentines
FOR ALL
USING (true)
WITH CHECK (true);

-- ===============================================
-- Migration Complete!
-- ===============================================
-- ✅ Tables created with foreign keys and constraints
-- ✅ Indexes added for performance
-- ✅ RLS enabled with permissive policies
-- ✅ Admin user created
--
-- Next steps:
-- 1. Update the admin password immediately
-- 2. Configure your .env file with Supabase credentials
-- 3. Run: npm start
-- ===============================================
