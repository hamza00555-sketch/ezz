-- Atomic family group creation: INSERT group + UPDATE profile in one tx
-- SECURITY DEFINER runs as postgres (bypasses RLS entirely)
CREATE OR REPLACE FUNCTION create_family_group(p_name TEXT, p_emoji TEXT)
RETURNS UUID AS $$
DECLARE
  v_group_id UUID;
  v_user_id  UUID := auth.uid();
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  INSERT INTO public.family_groups (name, emoji, created_by)
  VALUES (p_name, p_emoji, v_user_id)
  RETURNING id INTO v_group_id;

  UPDATE public.profiles
  SET family_group_id      = v_group_id,
      role                 = 'family_admin',
      can_manage_tasks     = true,
      can_manage_home      = true,
      can_manage_finance   = true,
      can_invite_members   = true
  WHERE id = v_user_id;

  RETURN v_group_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Atomic family group join: lookup by invite_code + UPDATE profile in one tx
CREATE OR REPLACE FUNCTION join_family_group(p_invite_code TEXT)
RETURNS UUID AS $$
DECLARE
  v_group_id UUID;
  v_user_id  UUID := auth.uid();
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  SELECT id INTO v_group_id
  FROM public.family_groups
  WHERE invite_code = upper(trim(p_invite_code));

  IF v_group_id IS NULL THEN
    RAISE EXCEPTION 'Invalid invite code';
  END IF;

  UPDATE public.profiles
  SET family_group_id = v_group_id,
      role            = 'adult'
  WHERE id = v_user_id;

  RETURN v_group_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
