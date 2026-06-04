-- ──────────────────────────────────────────────────────────────────────────
-- Row Level Security Policies
-- ──────────────────────────────────────────────────────────────────────────

ALTER TABLE family_groups       ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles            ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks               ENABLE ROW LEVEL SECURITY;
ALTER TABLE requests            ENABLE ROW LEVEL SECURITY;
ALTER TABLE home_items          ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents           ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE kitchen_shortages   ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipes             ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_plans          ENABLE ROW LEVEL SECURITY;
ALTER TABLE wish_items          ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallets             ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses            ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements       ENABLE ROW LEVEL SECURITY;

-- Helper: get caller's family group ID
CREATE OR REPLACE FUNCTION my_family_group_id()
RETURNS UUID AS $$
  SELECT family_group_id FROM profiles WHERE id = auth.uid()
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Helper: is caller an admin?
CREATE OR REPLACE FUNCTION is_family_admin()
RETURNS BOOLEAN AS $$
  SELECT role = 'family_admin' FROM profiles WHERE id = auth.uid()
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- FAMILY GROUPS
CREATE POLICY "members_select_own_group"  ON family_groups FOR SELECT USING (id = my_family_group_id());
CREATE POLICY "admin_update_group"        ON family_groups FOR UPDATE USING (id = my_family_group_id() AND is_family_admin());
CREATE POLICY "anyone_create_group"       ON family_groups FOR INSERT WITH CHECK (true);

-- PROFILES
CREATE POLICY "members_select_profiles"  ON profiles FOR SELECT USING (family_group_id = my_family_group_id() OR id = auth.uid());
CREATE POLICY "users_update_own_profile" ON profiles FOR UPDATE USING (id = auth.uid());
CREATE POLICY "system_insert_profile"    ON profiles FOR INSERT WITH CHECK (id = auth.uid());

-- Generic family-scoped helper macro used for remaining tables:
-- "member of same family can do everything"

CREATE POLICY "family_all_tasks"      ON tasks               FOR ALL USING (family_group_id = my_family_group_id());
CREATE POLICY "family_all_requests"   ON requests            FOR ALL USING (family_group_id = my_family_group_id());
CREATE POLICY "family_all_items"      ON home_items          FOR ALL USING (family_group_id = my_family_group_id());
CREATE POLICY "family_all_docs"       ON documents           FOR ALL USING (family_group_id = my_family_group_id());
CREATE POLICY "family_all_maint"      ON maintenance_records FOR ALL USING (family_group_id = my_family_group_id());
CREATE POLICY "family_all_shortages"  ON kitchen_shortages   FOR ALL USING (family_group_id = my_family_group_id());
CREATE POLICY "family_all_recipes"    ON recipes             FOR ALL USING (family_group_id = my_family_group_id());
CREATE POLICY "family_all_meal_plans" ON meal_plans          FOR ALL USING (family_group_id = my_family_group_id());
CREATE POLICY "family_all_wishes"     ON wish_items          FOR ALL USING (family_group_id = my_family_group_id());
CREATE POLICY "family_all_wallets"    ON wallets             FOR ALL USING (family_group_id = my_family_group_id());
CREATE POLICY "family_all_expenses"   ON expenses            FOR ALL USING (family_group_id = my_family_group_id());
CREATE POLICY "family_all_ann"        ON announcements       FOR ALL USING (family_group_id = my_family_group_id());
