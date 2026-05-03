
-- Open access policies for admin dashboard (no auth required)

-- analytics_events
DROP POLICY IF EXISTS "Admins read events" ON public.analytics_events;
DROP POLICY IF EXISTS "Admins delete events" ON public.analytics_events;
CREATE POLICY "Public read events" ON public.analytics_events FOR SELECT USING (true);
CREATE POLICY "Public delete events" ON public.analytics_events FOR DELETE USING (true);

-- attendance
DROP POLICY IF EXISTS "Admin delete attendance" ON public.attendance;
DROP POLICY IF EXISTS "Staff insert own attendance" ON public.attendance;
DROP POLICY IF EXISTS "Staff update own open record, admin update all" ON public.attendance;
DROP POLICY IF EXISTS "Staff view own, admin view all" ON public.attendance;
CREATE POLICY "Public all attendance" ON public.attendance FOR ALL USING (true) WITH CHECK (true);

-- financial_records
DROP POLICY IF EXISTS "Admins manage financial" ON public.financial_records;
CREATE POLICY "Public manage financial" ON public.financial_records FOR ALL USING (true) WITH CHECK (true);

-- products
DROP POLICY IF EXISTS "Admins delete products" ON public.products;
DROP POLICY IF EXISTS "Public read active products" ON public.products;
DROP POLICY IF EXISTS "Staff insert products" ON public.products;
DROP POLICY IF EXISTS "Staff update products" ON public.products;
CREATE POLICY "Public all products" ON public.products FOR ALL USING (true) WITH CHECK (true);

-- site_content
DROP POLICY IF EXISTS "Admins manage content" ON public.site_content;
CREATE POLICY "Public manage content" ON public.site_content FOR ALL USING (true) WITH CHECK (true);

-- site_settings
DROP POLICY IF EXISTS "Admins manage settings" ON public.site_settings;
CREATE POLICY "Public manage settings" ON public.site_settings FOR ALL USING (true) WITH CHECK (true);

-- profiles
DROP POLICY IF EXISTS "Profiles select own or admin" ON public.profiles;
CREATE POLICY "Public read profiles" ON public.profiles FOR SELECT USING (true);

-- user_roles
DROP POLICY IF EXISTS "Admins manage roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users see own role" ON public.user_roles;
CREATE POLICY "Public manage roles" ON public.user_roles FOR ALL USING (true) WITH CHECK (true);
