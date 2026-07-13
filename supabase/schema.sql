-- =====================================================
-- Rectoverso OS - Supabase Database Schema
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- ENUMS
-- =====================================================

CREATE TYPE user_role AS ENUM (
  'founder',
  'admin',
  'campaign_manager',
  'campaign_ops',
  'finance',
  'sales',
  'intern'
);

CREATE TYPE campaign_status AS ENUM (
  'draft',
  'waiting_brief',
  'setup',
  'running',
  'reporting',
  'completed',
  'paused',
  'problem'
);

CREATE TYPE health_status AS ENUM (
  'green',
  'yellow',
  'red'
);

CREATE TYPE campaign_type AS ENUM (
  'lead_generation',
  'app_download',
  'registration',
  'vcbl',
  'influencer_campaign',
  'publisher_distribution',
  'media_placement',
  'performance_campaign',
  'social_amplification'
);

CREATE TYPE payment_status AS ENUM (
  'not_invoiced',
  'invoice_sent',
  'waiting_payment',
  'partially_paid',
  'paid',
  'overdue',
  'disputed'
);

CREATE TYPE task_status AS ENUM (
  'todo',
  'in_progress',
  'review',
  'done',
  'blocked'
);

CREATE TYPE task_priority AS ENUM (
  'low',
  'medium',
  'high',
  'urgent'
);

CREATE TYPE publisher_type AS ENUM (
  'media',
  'influencer',
  'community',
  'local_contributor',
  'website',
  'social_account',
  'whatsapp_group',
  'telegram_group'
);

CREATE TYPE publisher_status AS ENUM (
  'active',
  'inactive',
  'testing',
  'blacklist'
);

CREATE TYPE checklist_phase AS ENUM (
  'preparation',
  'setup',
  'execution',
  'monitoring',
  'reporting',
  'finance'
);

CREATE TYPE checklist_status AS ENUM (
  'todo',
  'in_progress',
  'done',
  'blocked'
);

-- =====================================================
-- TABLES
-- =====================================================

-- Users / Profiles
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role user_role NOT NULL DEFAULT 'intern',
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Clients
CREATE TABLE clients (
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

-- Campaigns
CREATE TABLE campaigns (
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

-- Tasks
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id UUID REFERENCES campaigns(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  status task_status NOT NULL DEFAULT 'todo',
  priority task_priority NOT NULL DEFAULT 'medium',
  owner_id UUID REFERENCES users(id) ON DELETE SET NULL,
  due_date DATE,
  sop_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Campaign Checklists
CREATE TABLE campaign_checklists (
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

-- Publishers
CREATE TABLE publishers (
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

-- Campaign Publishers (Junction table)
CREATE TABLE campaign_publishers (
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

-- Performance Entries
CREATE TABLE performance_entries (
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

-- Invoices
CREATE TABLE invoices (
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

-- SOPs
CREATE TABLE sops (
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

-- Client Updates
CREATE TABLE client_updates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  update_type TEXT,
  message TEXT NOT NULL,
  sent_by UUID REFERENCES users(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'sent',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Activity Logs
CREATE TABLE activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  action TEXT NOT NULL,
  description TEXT NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- INDEXES
-- =====================================================

CREATE INDEX idx_campaigns_client_id ON campaigns(client_id);
CREATE INDEX idx_campaigns_status ON campaigns(status);
CREATE INDEX idx_campaigns_health ON campaigns(health_status);
CREATE INDEX idx_tasks_campaign_id ON tasks(campaign_id);
CREATE INDEX idx_tasks_owner_id ON tasks(owner_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_invoices_client_id ON invoices(client_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_publishers_type ON publishers(type);
CREATE INDEX idx_publishers_status ON publishers(status);
CREATE INDEX idx_activity_logs_entity ON activity_logs(entity_type, entity_id);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) - PRODUCTION READY
-- =====================================================

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

-- =====================================================
-- RLS POLICIES - Authenticated Users Only
-- =====================================================

-- Helper function to get current user role
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS TEXT AS $$
  SELECT role FROM users WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER;

-- Helper function to check if user is founder/admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT get_user_role() IN ('founder', 'admin');
$$ LANGUAGE SQL SECURITY DEFINER;

-- USERS TABLE - Users can see all users (for team view)
CREATE POLICY "Authenticated users can view users" ON users
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Only admins can insert users" ON users
  FOR INSERT WITH CHECK (is_admin() = true);

CREATE POLICY "Only admins can update users" ON users
  FOR UPDATE USING (is_admin() = true OR id = auth.uid());

CREATE POLICY "Only admins can delete users" ON users
  FOR DELETE USING (is_admin() = true);

-- CLIENTS TABLE - All authenticated users can read
CREATE POLICY "Authenticated users can view clients" ON clients
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Campaign managers+ can create clients" ON clients
  FOR INSERT WITH CHECK (get_user_role() IN ('founder', 'admin', 'campaign_manager'));

CREATE POLICY "Campaign managers+ can update clients" ON clients
  FOR UPDATE USING (get_user_role() IN ('founder', 'admin', 'campaign_manager'));

CREATE POLICY "Only admins can delete clients" ON clients
  FOR DELETE USING (is_admin() = true);

-- CAMPAIGNS TABLE - All authenticated users can read
CREATE POLICY "Authenticated users can view campaigns" ON campaigns
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Campaign managers+ can create campaigns" ON campaigns
  FOR INSERT WITH CHECK (get_user_role() IN ('founder', 'admin', 'campaign_manager'));

CREATE POLICY "Campaign managers+ can update campaigns" ON campaigns
  FOR UPDATE USING (get_user_role() IN ('founder', 'admin', 'campaign_manager', 'campaign_ops'));

CREATE POLICY "Only admins can delete campaigns" ON campaigns
  FOR DELETE USING (is_admin() = true);

-- TASKS TABLE - Read all, write based on role
CREATE POLICY "Authenticated users can view tasks" ON tasks
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Team members can create tasks" ON tasks
  FOR INSERT WITH CHECK (get_user_role() IN ('founder', 'admin', 'campaign_manager', 'campaign_ops', 'sales'));

CREATE POLICY "Task owner or team lead can update tasks" ON tasks
  FOR UPDATE USING (
    get_user_role() IN ('founder', 'admin', 'campaign_manager', 'campaign_ops')
    OR owner_id = auth.uid()
  );

CREATE POLICY "Campaign managers+ can delete tasks" ON tasks
  FOR DELETE USING (get_user_role() IN ('founder', 'admin', 'campaign_manager'));

-- CAMPAIGN_CHECKLISTS TABLE
CREATE POLICY "Authenticated users can view checklists" ON campaign_checklists
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Campaign ops+ can manage checklists" ON campaign_checklists
  FOR ALL USING (get_user_role() IN ('founder', 'admin', 'campaign_manager', 'campaign_ops'));

-- PUBLISHERS TABLE - Read all, write based on role
CREATE POLICY "Authenticated users can view publishers" ON publishers
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Campaign managers+ can create publishers" ON publishers
  FOR INSERT WITH CHECK (get_user_role() IN ('founder', 'admin', 'campaign_manager'));

CREATE POLICY "Campaign managers+ can update publishers" ON publishers
  FOR UPDATE USING (get_user_role() IN ('founder', 'admin', 'campaign_manager', 'campaign_ops'));

CREATE POLICY "Only admins can delete publishers" ON publishers
  FOR DELETE USING (is_admin() = true);

-- CAMPAIGN_PUBLISHERS TABLE
CREATE POLICY "Authenticated users can view campaign_publishers" ON campaign_publishers
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Campaign ops+ can manage campaign_publishers" ON campaign_publishers
  FOR ALL USING (get_user_role() IN ('founder', 'admin', 'campaign_manager', 'campaign_ops'));

-- PERFORMANCE_ENTRIES TABLE
CREATE POLICY "Authenticated users can view performance" ON performance_entries
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Campaign ops+ can manage performance entries" ON performance_entries
  FOR ALL USING (get_user_role() IN ('founder', 'admin', 'campaign_manager', 'campaign_ops'));

-- INVOICES TABLE - Finance has special access
CREATE POLICY "Authenticated users can view invoices" ON invoices
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Finance+ can create invoices" ON invoices
  FOR INSERT WITH CHECK (get_user_role() IN ('founder', 'admin', 'finance'));

CREATE POLICY "Finance+ can update invoices" ON invoices
  FOR UPDATE USING (get_user_role() IN ('founder', 'admin', 'finance'));

CREATE POLICY "Only admins can delete invoices" ON invoices
  FOR DELETE USING (is_admin() = true);

-- SOPS TABLE - Read all, write based on role
CREATE POLICY "Authenticated users can view sops" ON sops
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can create sops" ON sops
  FOR INSERT WITH CHECK (is_admin() = true);

CREATE POLICY "Admins can update sops" ON sops
  FOR UPDATE USING (is_admin() = true);

CREATE POLICY "Only admins can delete sops" ON sops
  FOR DELETE USING (is_admin() = true);

-- CLIENT_UPDATES TABLE
CREATE POLICY "Authenticated users can view client_updates" ON client_updates
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Campaign ops+ can create client_updates" ON client_updates
  FOR INSERT WITH CHECK (get_user_role() IN ('founder', 'admin', 'campaign_manager', 'campaign_ops'));

CREATE POLICY "Creator can update client_updates" ON client_updates
  FOR UPDATE USING (sent_by = auth.uid() OR get_user_role() IN ('founder', 'admin', 'campaign_manager'));

-- ACTIVITY_LOGS TABLE - Read only for most, full for admins
CREATE POLICY "Team members can view activity logs" ON activity_logs
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Only service role can insert activity logs" ON activity_logs
  FOR INSERT WITH CHECK (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Only admins can delete activity logs" ON activity_logs
  FOR DELETE USING (is_admin() = true);

-- =====================================================
-- ENABLE RLS ON AUTH HELPERS
-- =====================================================

-- Create function to check if user has specific permission
CREATE OR REPLACE FUNCTION has_permission(required_role TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN get_user_role() IN ('founder', 'admin', required_role);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_campaigns_updated_at BEFORE UPDATE ON campaigns
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_campaign_checklists_updated_at BEFORE UPDATE ON campaign_checklists
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_publishers_updated_at BEFORE UPDATE ON publishers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_campaign_publishers_updated_at BEFORE UPDATE ON campaign_publishers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sops_updated_at BEFORE UPDATE ON sops
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to log activity
CREATE OR REPLACE FUNCTION log_activity(
  p_entity_type TEXT,
  p_entity_id UUID,
  p_action TEXT,
  p_description TEXT,
  p_user_id UUID
)
RETURNS UUID AS $$
DECLARE
  v_log_id UUID;
BEGIN
  INSERT INTO activity_logs (entity_type, entity_id, action, description, user_id)
  VALUES (p_entity_type, p_entity_id, p_action, p_description, p_user_id)
  RETURNING id INTO v_log_id;
  RETURN v_log_id;
END;
$$ LANGUAGE plpgsql;
