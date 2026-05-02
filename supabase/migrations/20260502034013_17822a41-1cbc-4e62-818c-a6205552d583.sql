
-- 1) Fix function search_path
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER LANGUAGE PLPGSQL
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

-- 2) Restrict EXECUTE on SECURITY DEFINER helper functions
REVOKE EXECUTE ON FUNCTION public.has_role(UUID, app_role) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.is_admin_or_staff(UUID) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(UUID, app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin_or_staff(UUID) TO authenticated;

-- 3) Tighten storage SELECT policies (still public-readable via signed/public URL,
-- but disallow listing the whole bucket)
DROP POLICY IF EXISTS "Public read product images" ON storage.objects;
DROP POLICY IF EXISTS "Public read site images" ON storage.objects;

-- public-read buckets: serving via public URL still works; listing is blocked
CREATE POLICY "Anyone read product images by name" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'product-images' AND name IS NOT NULL);

CREATE POLICY "Anyone read site images by name" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'site-images' AND name IS NOT NULL);
