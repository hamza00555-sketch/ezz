-- ──────────────────────────────────────────────────────────────────────────
-- عز — Initial Schema
-- ──────────────────────────────────────────────────────────────────────────

-- FAMILY GROUPS
CREATE TABLE family_groups (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  emoji         TEXT DEFAULT '🏡',
  color         TEXT DEFAULT '#C8922A',
  invite_code   TEXT UNIQUE NOT NULL DEFAULT upper(substr(md5(random()::text), 1, 8)),
  created_by    UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

-- PROFILES (extends auth.users)
CREATE TABLE profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  family_group_id UUID REFERENCES family_groups(id) ON DELETE SET NULL,
  display_name  TEXT NOT NULL,
  avatar_url    TEXT,
  role          TEXT NOT NULL DEFAULT 'adult'
                CHECK (role IN ('family_admin','guardian','adult','teen','child','guest')),
  generation    INTEGER DEFAULT 2,
  can_manage_tasks    BOOLEAN DEFAULT false,
  can_manage_home     BOOLEAN DEFAULT false,
  can_manage_finance  BOOLEAN DEFAULT false,
  can_invite_members  BOOLEAN DEFAULT false,
  is_active     BOOLEAN DEFAULT true,
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

-- TASK CATEGORIES (seeded)
CREATE TABLE task_categories (
  id     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug   TEXT UNIQUE NOT NULL,
  name_ar TEXT NOT NULL,
  icon   TEXT NOT NULL,
  color  TEXT NOT NULL
);

-- TASKS
CREATE TABLE tasks (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_group_id UUID NOT NULL REFERENCES family_groups(id) ON DELETE CASCADE,
  category_slug   TEXT DEFAULT 'other',
  title           TEXT NOT NULL,
  description     TEXT,
  status          TEXT NOT NULL DEFAULT 'new'
                  CHECK (status IN ('new','pending_acceptance','accepted','in_progress','done','rejected','postponed','cancelled')),
  priority        TEXT NOT NULL DEFAULT 'medium'
                  CHECK (priority IN ('low','medium','high','urgent')),
  assigned_to     UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_by      UUID NOT NULL REFERENCES profiles(id),
  due_date        TIMESTAMPTZ,
  is_recurring    BOOLEAN DEFAULT false,
  recurrence      JSONB,
  completed_at    TIMESTAMPTZ,
  deleted_at      TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

-- REQUESTS
CREATE TABLE requests (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_group_id UUID NOT NULL REFERENCES family_groups(id) ON DELETE CASCADE,
  title           TEXT NOT NULL,
  description     TEXT,
  type            TEXT NOT NULL DEFAULT 'other'
                  CHECK (type IN ('purchase','help','errand','maintenance','follow_up','other')),
  from_user       UUID NOT NULL REFERENCES profiles(id),
  to_user         UUID NOT NULL REFERENCES profiles(id),
  status          TEXT NOT NULL DEFAULT 'pending'
                  CHECK (status IN ('pending','accepted','rejected','converted')),
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

-- HOME ITEMS
CREATE TABLE home_items (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_group_id UUID NOT NULL REFERENCES family_groups(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  category        TEXT DEFAULT 'other',
  location        TEXT,
  image_url       TEXT,
  purchase_date   DATE,
  price           NUMERIC,
  warranty_expiry DATE,
  notes           TEXT,
  created_by      UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

-- DOCUMENTS
CREATE TABLE documents (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_group_id UUID NOT NULL REFERENCES family_groups(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  type            TEXT NOT NULL DEFAULT 'other'
                  CHECK (type IN ('contract','warranty','invoice','insurance','form','other')),
  file_url        TEXT,
  linked_item_id  UUID REFERENCES home_items(id) ON DELETE SET NULL,
  expiry_date     DATE,
  reminder_days   INTEGER DEFAULT 30,
  visibility      TEXT DEFAULT 'all',
  notes           TEXT,
  created_by      UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

-- MAINTENANCE
CREATE TABLE maintenance_records (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_group_id UUID NOT NULL REFERENCES family_groups(id) ON DELETE CASCADE,
  linked_item_id  UUID REFERENCES home_items(id) ON DELETE SET NULL,
  type            TEXT NOT NULL,
  date            DATE NOT NULL,
  cost            NUMERIC,
  performed_by    TEXT,
  next_reminder   DATE,
  status          TEXT DEFAULT 'done' CHECK (status IN ('scheduled','done')),
  notes           TEXT,
  created_by      UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

-- KITCHEN SHORTAGES
CREATE TABLE kitchen_shortages (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_group_id UUID NOT NULL REFERENCES family_groups(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  category        TEXT DEFAULT 'other',
  quantity        TEXT,
  priority        TEXT NOT NULL DEFAULT 'medium'
                  CHECK (priority IN ('low','medium','high','urgent')),
  status          TEXT NOT NULL DEFAULT 'missing'
                  CHECK (status IN ('missing','provided')),
  added_by        UUID REFERENCES profiles(id) ON DELETE SET NULL,
  notes           TEXT,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

-- RECIPES
CREATE TABLE recipes (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_group_id UUID NOT NULL REFERENCES family_groups(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  image_url       TEXT,
  ingredients     TEXT[] DEFAULT '{}',
  steps           TEXT[] DEFAULT '{}',
  prep_time       INTEGER,
  meal_time       TEXT[] DEFAULT '{}',
  favorited_by    UUID[] DEFAULT '{}',
  notes           TEXT,
  created_by      UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

-- MEAL PLANS
CREATE TABLE meal_plans (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_group_id UUID NOT NULL REFERENCES family_groups(id) ON DELETE CASCADE,
  date            DATE NOT NULL,
  breakfast       TEXT,
  lunch           TEXT,
  dinner          TEXT,
  created_by      UUID REFERENCES profiles(id) ON DELETE SET NULL,
  updated_at      TIMESTAMPTZ DEFAULT now(),
  UNIQUE(family_group_id, date)
);

-- WISH ITEMS
CREATE TABLE wish_items (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_group_id UUID NOT NULL REFERENCES family_groups(id) ON DELETE CASCADE,
  title           TEXT NOT NULL,
  description     TEXT,
  type            TEXT DEFAULT 'idea' CHECK (type IN ('idea','need','link','fix')),
  link            TEXT,
  image_url       TEXT,
  location        TEXT,
  priority        TEXT DEFAULT 'medium' CHECK (priority IN ('low','medium','high','urgent')),
  status          TEXT DEFAULT 'idea'
                  CHECK (status IN ('idea','studying','approved','done','postponed','cancelled')),
  created_by      UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

-- WALLETS
CREATE TABLE wallets (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_group_id UUID NOT NULL REFERENCES family_groups(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  monthly_budget  NUMERIC DEFAULT 0,
  spent           NUMERIC DEFAULT 0,
  visibility      TEXT DEFAULT 'all',
  can_add         TEXT DEFAULT 'all',
  can_edit        TEXT DEFAULT 'all',
  created_by      UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

-- EXPENSES
CREATE TABLE expenses (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_group_id UUID NOT NULL REFERENCES family_groups(id) ON DELETE CASCADE,
  wallet_id       UUID NOT NULL REFERENCES wallets(id) ON DELETE CASCADE,
  amount          NUMERIC NOT NULL,
  category        TEXT,
  date            DATE NOT NULL DEFAULT CURRENT_DATE,
  added_by        UUID REFERENCES profiles(id) ON DELETE SET NULL,
  notes           TEXT,
  receipt_url     TEXT,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

-- ANNOUNCEMENTS
CREATE TABLE announcements (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_group_id       UUID NOT NULL REFERENCES family_groups(id) ON DELETE CASCADE,
  title                 TEXT NOT NULL,
  message               TEXT NOT NULL,
  published_by          UUID REFERENCES profiles(id) ON DELETE SET NULL,
  audience              TEXT DEFAULT 'all',
  expires_at            TIMESTAMPTZ,
  requires_confirmation BOOLEAN DEFAULT false,
  confirmed_by          UUID[] DEFAULT '{}',
  status                TEXT DEFAULT 'active' CHECK (status IN ('active','expired')),
  is_pinned             BOOLEAN DEFAULT false,
  created_at            TIMESTAMPTZ DEFAULT now(),
  updated_at            TIMESTAMPTZ DEFAULT now()
);

-- ──────────────────────────────────────────────────────────────────────────
-- Triggers
-- ──────────────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at BEFORE UPDATE ON family_groups   FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON profiles        FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON tasks           FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON requests        FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON home_items      FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON documents       FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON kitchen_shortages FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON recipes         FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON wish_items      FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON wallets         FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON expenses        FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON announcements   FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, display_name, role, can_manage_tasks, can_manage_home, can_manage_finance, can_invite_members)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
    'family_admin',
    true, true, true, true
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION handle_new_user();
