-- Atomic announcement confirmation — avoids lost-update race condition
CREATE OR REPLACE FUNCTION append_announcement_confirmation(ann_id UUID, user_id UUID)
RETURNS void AS $$
  UPDATE announcements
  SET confirmed_by = array_append(confirmed_by, user_id),
      updated_at   = now()
  WHERE id = ann_id
    AND NOT (user_id = ANY(confirmed_by));
$$ LANGUAGE sql SECURITY DEFINER;
