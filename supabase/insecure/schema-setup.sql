-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/bgfhhlhoqtxgpmbetrvx/sql/new

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create uuid_generate_v4 if not exists
CREATE OR REPLACE FUNCTION uuid_generate_v4() RETURNS uuid AS $$
BEGIN
  RETURN gen_random_uuid();
END;
$$ LANGUAGE plpgsql STRICT;

-- ENUMs
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('founder', 'admin', 'campaign_manager', 'campaign_ops', 'finance', 'sales', 'intern');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE campaign_status AS ENUM ('draft', 'waiting_brief', 'setup', 'running', 'reporting', 'completed', 'paused', 'problem');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE health_status AS ENUM ('green', 'yellow', 'red');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE campaign_type AS ENUM ('lead_generation', 'app_download', 'registration', 'vcbl', 'influencer_campaign', 'publisher_distribution', 'media_placement', 'performance_campaign', 'social_amplification');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE payment_status AS ENUM ('not_invoiced', 'invoice_sent', 'waiting_payment', 'partially_paid', 'paid', 'overdue', 'disputed');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE task_status AS ENUM ('todo', 'in_progress', 'review', 'done', 'blocked');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high', 'urgent');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE publisher_type AS ENUM ('media', 'influencer', 'community', 'local_contributor', 'website', 'social_account', 'whatsapp_group', 'telegram_group');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE publisher_status AS ENUM ('active', 'inactive', 'testing', 'blacklist');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE checklist_phase AS ENUM ('preparation', 'setup', 'execution', 'monitoring', 'reporting', 'finance');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE checklist_status AS ENUM ('todo', 'in_progress', 'done', 'blocked');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- Tables
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role user_role NOT NULL DEFAULT 'intern',
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  industry TEXT,
  pic_name TEXT,
  pic_email TEXT,
  pic_whatsapp TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  type campaign_type NOT NULL,
  objective TEXT,
  status campaign_status NOT NULL DEFAULT 'draft',
  health_status health_status NOT NULL DEFAULT 'green',
  start_date DATE,
  end_date DATE,
  budget BIGINT DEFAULT 0,
  kpi_type TEXT,
  kpi_target INTEGER DEFAULT 0,
  kpi_current INTEGER DEFAULT 0,
  tracking_link TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  pic_id UUID REFERENCES users(id) ON DELETE SET NULL,
  payment_status payment_status NOT NULL DEFAULT 'not_invoiced',
  notes TEXT,
  deliverables JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id UUID REFERENCES campaigns(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  status task_status NOT NULL DEFAULT 'todo',
  priority task_priority NOT NULL DEFAULT 'medium',
  owner_id UUID REFERENCES users(id) ON DELETE SET NULL,
  due_date DATE,
  sop_id UUID,
  comment_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS campaign_checklists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  phase checklist_phase NOT NULL,
  title TEXT NOT NULL,
  status checklist_status NOT NULL DEFAULT 'todo',
  owner_id UUID REFERENCES users(id) ON DELETE SET NULL,
  due_date DATE,
  sop_id UUID,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS publishers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type publisher_type NOT NULL,
  category TEXT,
  city TEXT,
  province TEXT,
  contact_person TEXT,
  whatsapp TEXT,
  email TEXT,
  rate BIGINT,
  audience_size INTEGER,
  quality_score INTEGER,
  status publisher_status NOT NULL DEFAULT 'active',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS campaign_publishers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  publisher_id UUID REFERENCES publishers(id) ON DELETE SET NULL,
  deliverable TEXT,
  budget_allocation BIGINT DEFAULT 0,
  status TEXT DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS performance_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  leads INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  downloads INTEGER DEFAULT 0,
  registrations INTEGER DEFAULT 0,
  cost_spent BIGINT DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE SET NULL,
  invoice_number TEXT UNIQUE NOT NULL,
  amount BIGINT NOT NULL,
  invoice_date DATE,
  due_date DATE,
  status payment_status NOT NULL DEFAULT 'not_invoiced',
  paid_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sops (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  role user_role NOT NULL,
  estimated_time TEXT,
  content TEXT,
  checklist JSONB DEFAULT '[]',
  video_url TEXT,
  templates JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS client_updates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  update_type TEXT,
  message TEXT NOT NULL,
  sent_by UUID REFERENCES users(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'sent',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  action TEXT NOT NULL,
  description TEXT NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_checklists ENABLE ROW LEVEL SECURITY;
ALTER TABLE publishers ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_publishers ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE sops ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies (public access for MVP)
CREATE POLICY "Allow public read" ON users FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON users FOR UPDATE USING (true);

CREATE POLICY "Allow public read" ON clients FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON clients FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON clients FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON clients FOR DELETE USING (true);

CREATE POLICY "Allow public read" ON campaigns FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON campaigns FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON campaigns FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON campaigns FOR DELETE USING (true);

CREATE POLICY "Allow public read" ON tasks FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON tasks FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON tasks FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON tasks FOR DELETE USING (true);

CREATE POLICY "Allow public read" ON campaign_checklists FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON campaign_checklists FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON campaign_checklists FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON campaign_checklists FOR DELETE USING (true);

CREATE POLICY "Allow public read" ON publishers FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON publishers FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON publishers FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON publishers FOR DELETE USING (true);

CREATE POLICY "Allow public read" ON campaign_publishers FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON campaign_publishers FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON campaign_publishers FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON campaign_publishers FOR DELETE USING (true);

CREATE POLICY "Allow public read" ON performance_entries FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON performance_entries FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON performance_entries FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON performance_entries FOR DELETE USING (true);

CREATE POLICY "Allow public read" ON invoices FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON invoices FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON invoices FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON invoices FOR DELETE USING (true);

CREATE POLICY "Allow public read" ON sops FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON sops FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON sops FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON sops FOR DELETE USING (true);

CREATE POLICY "Allow public read" ON client_updates FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON client_updates FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON client_updates FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON client_updates FOR DELETE USING (true);

CREATE POLICY "Allow public read" ON activity_logs FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON activity_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON activity_logs FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON activity_logs FOR DELETE USING (true);

-- Triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_campaigns_updated_at BEFORE UPDATE ON campaigns FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_campaign_checklists_updated_at BEFORE UPDATE ON campaign_checklists FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_publishers_updated_at BEFORE UPDATE ON publishers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_campaign_publishers_updated_at BEFORE UPDATE ON campaign_publishers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sops_updated_at BEFORE UPDATE ON sops FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
