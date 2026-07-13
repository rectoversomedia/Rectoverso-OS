-- =====================================================
-- Rectoverso OS - Enhanced Database Schema v2
-- Campaign Management & Task Tracking System
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- ENUMS
-- =====================================================

-- User Roles
CREATE TYPE user_role AS ENUM (
  'founder',
  'admin',
  'campaign_manager',
  'campaign_ops',
  'finance',
  'sales',
  'intern'
);

-- Campaign Status
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

-- Health Status
CREATE TYPE health_status AS ENUM (
  'green',
  'yellow',
  'red'
);

-- Campaign Types
CREATE TYPE campaign_type AS ENUM (
  'lead_generation',
  'app_download',
  'registration',
  'vcbl',
  'influencer_campaign',
  'publisher_distribution',
  'media_placement',
  'performance_campaign',
  'social_amplification',
  'content_creation',
  'social_media_management'
);

-- Payment Status
CREATE TYPE payment_status AS ENUM (
  'not_invoiced',
  'invoice_sent',
  'waiting_payment',
  'partially_paid',
  'paid',
  'overdue',
  'disputed'
);

-- Task Status
CREATE TYPE task_status AS ENUM (
  'todo',
  'in_progress',
  'review',
  'done',
  'blocked'
);

-- Task Priority
CREATE TYPE task_priority AS ENUM (
  'low',
  'medium',
  'high',
  'urgent'
);

-- Publisher Types
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

-- Publisher Status
CREATE TYPE publisher_status AS ENUM (
  'active',
  'inactive',
  'testing',
  'blacklist'
);

-- Checklist Phase
CREATE TYPE checklist_phase AS ENUM (
  'preparation',
  'setup',
  'execution',
  'monitoring',
  'reporting',
  'finance'
);

-- Checklist Status
CREATE TYPE checklist_status AS ENUM (
  'todo',
  'in_progress',
  'done',
  'blocked'
);

-- Issue Severity (NEW)
CREATE TYPE issue_severity AS ENUM (
  'low',
  'medium',
  'high',
  'critical'
);

-- Issue Status (NEW)
CREATE TYPE issue_status AS ENUM (
  'open',
  'in_progress',
  'waiting_external',
  'resolved',
  'closed'
);

-- Schedule Type (NEW)
CREATE TYPE schedule_type AS ENUM (
  'client_meeting',
  'internal_meeting',
  'deadline',
  'campaign_launch',
  'content_publish',
  'report_submission',
  'payment_due',
  'publisher_delivery',
  'other'
);

-- Location Type (NEW)
CREATE TYPE location_type AS ENUM (
  'offline',
  'online',
  'hybrid'
);

-- =====================================================
-- TABLES
-- =====================================================

-- Users / Profiles
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  role user_role NOT NULL DEFAULT 'intern',
  avatar_url TEXT,
  department TEXT,
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Clients
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  industry TEXT,
  website TEXT,
  logo_url TEXT,
  pic_name TEXT,
  pic_email TEXT,
  pic_phone TEXT,
  pic_whatsapp TEXT,
  address TEXT,
  notes TEXT,
  is_active BOOLEAN DEFAULT true,
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
  current_phase TEXT,
  next_action TEXT,
  next_action_due DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Campaign Issues (NEW - untuk tracking masalah)
CREATE TABLE campaign_issues (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  severity issue_severity NOT NULL DEFAULT 'medium',
  status issue_status NOT NULL DEFAULT 'open',
  reported_by UUID REFERENCES users(id) ON DELETE SET NULL,
  assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
  resolution TEXT,
  due_date DATE,
  resolved_at TIMESTAMPTZ,
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
  due_time TIME,
  estimated_hours INTEGER,
  actual_hours INTEGER,
  sop_id UUID,
  parent_task_id UUID,
  tags TEXT[],
  dependencies JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Daily Task Schedule (NEW - untuk daily task yang recurring)
CREATE TABLE daily_schedules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  task_id UUID REFERENCES tasks(id) ON DELETE SET NULL,
  date DATE NOT NULL,
  scheduled_time TIME,
  actual_start TIME,
  actual_end TIME,
  status task_status NOT NULL DEFAULT 'todo',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Team Schedules / Events (NEW - untuk meeting, deadline, dll)
CREATE TABLE team_schedules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id UUID REFERENCES campaigns(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  type schedule_type NOT NULL,
  location_type location_type NOT NULL DEFAULT 'online',
  location TEXT,
  meeting_link TEXT,
  start_datetime TIMESTAMPTZ NOT NULL,
  end_datetime TIMESTAMPTZ,
  all_day BOOLEAN DEFAULT false,
  reminder_minutes INTEGER DEFAULT 15,
  attendees UUID[],
  is_recurring BOOLEAN DEFAULT false,
  recurrence_rule TEXT,
  color TEXT DEFAULT '#06B6D4',
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
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
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Publishers
CREATE TABLE publishers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type publisher_type NOT NULL,
  category TEXT,
  platform TEXT,
  handle TEXT,
  city TEXT,
  province TEXT,
  contact_person TEXT,
  whatsapp TEXT,
  email TEXT,
  rate BIGINT,
  audience_size INTEGER,
  engagement_rate DECIMAL(5,2),
  quality_score INTEGER CHECK (quality_score >= 1 AND quality_score <= 100),
  status publisher_status NOT NULL DEFAULT 'active',
  notes TEXT,
  media_kit_url TEXT,
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
  delivery_date DATE,
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
  impressions INTEGER DEFAULT 0,
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
  tax BIGINT DEFAULT 0,
  invoice_date DATE,
  due_date DATE,
  status payment_status NOT NULL DEFAULT 'not_invoiced',
  paid_date DATE,
  paid_amount BIGINT DEFAULT 0,
  notes TEXT,
  file_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- SOPs
CREATE TABLE sops (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  subcategory TEXT,
  role user_role NOT NULL,
  estimated_time TEXT,
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
  content TEXT,
  checklist JSONB DEFAULT '[]',
  steps JSONB DEFAULT '[]',
  video_url TEXT,
  templates JSONB DEFAULT '[]',
  tags TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Client Updates
CREATE TABLE client_updates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  update_type TEXT CHECK (update_type IN ('email', 'whatsapp', 'meeting', 'call', 'report')),
  subject TEXT,
  message TEXT NOT NULL,
  sent_by UUID REFERENCES users(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'sent',
  attachments JSONB DEFAULT '[]',
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
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- INDEXES
-- =====================================================

-- Campaigns indexes
CREATE INDEX idx_campaigns_client_id ON campaigns(client_id);
CREATE INDEX idx_campaigns_status ON campaigns(status);
CREATE INDEX idx_campaigns_health ON campaigns(health_status);
CREATE INDEX idx_campaigns_pic ON campaigns(pic_id);
CREATE INDEX idx_campaigns_dates ON campaigns(start_date, end_date);
CREATE INDEX idx_campaigns_next_action ON campaigns(next_action_due) WHERE next_action_due IS NOT NULL;

-- Issues indexes (NEW)
CREATE INDEX idx_issues_campaign ON campaign_issues(campaign_id);
CREATE INDEX idx_issues_status ON campaign_issues(status);
CREATE INDEX idx_issues_severity ON campaign_issues(severity);
CREATE INDEX idx_issues_assigned ON campaign_issues(assigned_to);
CREATE INDEX idx_issues_due ON campaign_issues(due_date) WHERE due_date IS NOT NULL;

-- Tasks indexes
CREATE INDEX idx_tasks_campaign_id ON tasks(campaign_id);
CREATE INDEX idx_tasks_owner_id ON tasks(owner_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_tasks_priority ON tasks(priority);

-- Daily schedules indexes (NEW)
CREATE INDEX idx_daily_schedules_user_date ON daily_schedules(user_id, date);
CREATE INDEX idx_daily_schedules_date ON daily_schedules(date);

-- Team schedules indexes (NEW)
CREATE INDEX idx_team_schedules_campaign ON team_schedules(campaign_id);
CREATE INDEX idx_team_schedules_datetime ON team_schedules(start_datetime, end_datetime);
CREATE INDEX idx_team_schedules_type ON team_schedules(type);

-- Checklists indexes
CREATE INDEX idx_checklists_campaign ON campaign_checklists(campaign_id);
CREATE INDEX idx_checklists_phase ON campaign_checklists(phase);
CREATE INDEX idx_checklists_status ON campaign_checklists(status);

-- Publishers indexes
CREATE INDEX idx_publishers_type ON publishers(type);
CREATE INDEX idx_publishers_status ON publishers(status);
CREATE INDEX idx_publishers_province ON publishers(province);

-- Invoices indexes
CREATE INDEX idx_invoices_client_id ON invoices(client_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_due_date ON invoices(due_date);

-- Activity logs indexes
CREATE INDEX idx_activity_logs_entity ON activity_logs(entity_type, entity_id);
CREATE INDEX idx_activity_logs_user ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_created ON activity_logs(created_at DESC);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_checklists ENABLE ROW LEVEL SECURITY;
ALTER TABLE publishers ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_publishers ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE sops ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

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

-- USERS TABLE
CREATE POLICY "Users can view all authenticated users" ON users
  FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can manage users" ON users
  FOR ALL USING (is_admin() = true);

-- CLIENTS TABLE
CREATE POLICY "Authenticated users can view clients" ON clients
  FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Campaign managers+ can manage clients" ON clients
  FOR ALL USING (get_user_role() IN ('founder', 'admin', 'campaign_manager'));

-- CAMPAIGNS TABLE
CREATE POLICY "Authenticated users can view campaigns" ON campaigns
  FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Campaign managers+ can manage campaigns" ON campaigns
  FOR ALL USING (get_user_role() IN ('founder', 'admin', 'campaign_manager'));
CREATE POLICY "Campaign ops can update campaigns" ON campaigns
  FOR UPDATE USING (get_user_role() IN ('founder', 'admin', 'campaign_manager', 'campaign_ops'));

-- CAMPAIGN_ISSUES TABLE (NEW)
CREATE POLICY "Team can view issues" ON campaign_issues
  FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Team can manage issues" ON campaign_issues
  FOR ALL USING (get_user_role() IN ('founder', 'admin', 'campaign_manager', 'campaign_ops'));

-- TASKS TABLE
CREATE POLICY "Team can view tasks" ON tasks
  FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Team can manage tasks" ON tasks
  FOR ALL USING (get_user_role() IN ('founder', 'admin', 'campaign_manager', 'campaign_ops'));
CREATE POLICY "Users can update their own tasks" ON tasks
  FOR UPDATE USING (owner_id = auth.uid() OR get_user_role() IN ('founder', 'admin', 'campaign_manager', 'campaign_ops'));

-- DAILY_SCHEDULES TABLE (NEW)
CREATE POLICY "Users can view own schedules" ON daily_schedules
  FOR SELECT USING (user_id = auth.uid() OR auth.role() = 'authenticated');
CREATE POLICY "Users can manage own schedules" ON daily_schedules
  FOR ALL USING (user_id = auth.uid() OR is_admin() = true);

-- TEAM_SCHEDULES TABLE (NEW)
CREATE POLICY "Team can view schedules" ON team_schedules
  FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Managers can manage schedules" ON team_schedules
  FOR ALL USING (get_user_role() IN ('founder', 'admin', 'campaign_manager'));

-- CAMPAIGN_CHECKLISTS TABLE
CREATE POLICY "Team can view checklists" ON campaign_checklists
  FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Campaign ops+ can manage checklists" ON campaign_checklists
  FOR ALL USING (get_user_role() IN ('founder', 'admin', 'campaign_manager', 'campaign_ops'));

-- PUBLISHERS TABLE
CREATE POLICY "Team can view publishers" ON publishers
  FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Campaign managers+ can manage publishers" ON publishers
  FOR ALL USING (get_user_role() IN ('founder', 'admin', 'campaign_manager'));

-- CAMPAIGN_PUBLISHERS TABLE
CREATE POLICY "Team can view campaign_publishers" ON campaign_publishers
  FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Campaign ops+ can manage campaign_publishers" ON campaign_publishers
  FOR ALL USING (get_user_role() IN ('founder', 'admin', 'campaign_manager', 'campaign_ops'));

-- PERFORMANCE_ENTRIES TABLE
CREATE POLICY "Team can view performance" ON performance_entries
  FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Campaign ops+ can manage performance" ON performance_entries
  FOR ALL USING (get_user_role() IN ('founder', 'admin', 'campaign_manager', 'campaign_ops'));

-- INVOICES TABLE
CREATE POLICY "Team can view invoices" ON invoices
  FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Finance+ can manage invoices" ON invoices
  FOR ALL USING (get_user_role() IN ('founder', 'admin', 'finance'));

-- SOPS TABLE
CREATE POLICY "Team can view sops" ON sops
  FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can manage sops" ON sops
  FOR ALL USING (is_admin() = true);

-- CLIENT_UPDATES TABLE
CREATE POLICY "Team can view client_updates" ON client_updates
  FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Campaign ops+ can manage client_updates" ON client_updates
  FOR ALL USING (get_user_role() IN ('founder', 'admin', 'campaign_manager', 'campaign_ops'));

-- ACTIVITY_LOGS TABLE
CREATE POLICY "Team can view activity logs" ON activity_logs
  FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Service role can insert activity logs" ON activity_logs
  FOR INSERT WITH CHECK (auth.jwt() ->> 'role' = 'service_role');

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Auto-update updated_at
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
CREATE TRIGGER update_campaign_issues_updated_at BEFORE UPDATE ON campaign_issues
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_daily_schedules_updated_at BEFORE UPDATE ON daily_schedules
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_team_schedules_updated_at BEFORE UPDATE ON team_schedules
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

-- Log activity function
CREATE OR REPLACE FUNCTION log_activity(
  p_entity_type TEXT,
  p_entity_id UUID,
  p_action TEXT,
  p_description TEXT,
  p_user_id UUID,
  p_metadata JSONB DEFAULT '{}'
)
RETURNS UUID AS $$
DECLARE
  v_log_id UUID;
BEGIN
  INSERT INTO activity_logs (entity_type, entity_id, action, description, user_id, metadata)
  VALUES (p_entity_type, p_entity_id, p_action, p_description, p_user_id, p_metadata)
  RETURNING id INTO v_log_id;
  RETURN v_log_id;
END;
$$ LANGUAGE plpgsql;

-- Update campaign health based on issues
CREATE OR REPLACE FUNCTION update_campaign_health()
RETURNS TRIGGER AS $$
DECLARE
  v_has_critical boolean;
  v_has_high boolean;
BEGIN
  SELECT EXISTS(
    SELECT 1 FROM campaign_issues ci
    WHERE ci.campaign_id = NEW.campaign_id
    AND ci.status NOT IN ('resolved', 'closed')
    AND ci.severity IN ('critical', 'high')
  ) INTO v_has_critical;

  SELECT EXISTS(
    SELECT 1 FROM campaign_issues ci
    WHERE ci.campaign_id = NEW.campaign_id
    AND ci.status NOT IN ('resolved', 'closed')
    AND ci.severity = 'high'
  ) INTO v_has_high;

  UPDATE campaigns SET
    health_status = CASE
      WHEN v_has_critical THEN 'red'
      WHEN v_has_high THEN 'yellow'
      ELSE 'green'
    END
  WHERE id = NEW.campaign_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_campaign_health
AFTER INSERT OR UPDATE ON campaign_issues
FOR EACH ROW EXECUTE FUNCTION update_campaign_health();

-- =====================================================
-- VIEWS FOR DASHBOARD
-- =====================================================

-- Campaign Progress View
CREATE OR REPLACE VIEW v_campaign_progress AS
SELECT
  c.id,
  c.name,
  c.status,
  c.health_status,
  c.kpi_type,
  c.kpi_target,
  c.kpi_current,
  ROUND((c.kpi_current::DECIMAL / NULLIF(c.kpi_target, 0) * 100)::NUMERIC, 1) as progress_pct,
  c.start_date,
  c.end_date,
  c.budget,
  cl.name as client_name,
  u.full_name as pic_name,
  COUNT(DISTINCT t.id) FILTER (WHERE t.status != 'done') as open_tasks,
  COUNT(DISTINCT ci.id) FILTER (WHERE ci.status NOT IN ('resolved', 'closed')) as open_issues,
  c.next_action,
  c.next_action_due
FROM campaigns c
LEFT JOIN clients cl ON c.client_id = cl.id
LEFT JOIN users u ON c.pic_id = u.id
LEFT JOIN tasks t ON c.id = t.campaign_id
LEFT JOIN campaign_issues ci ON c.id = ci.campaign_id
GROUP BY c.id, cl.name, u.full_name;

-- Today's Tasks View
CREATE OR REPLACE VIEW v_today_tasks AS
SELECT
  t.id,
  t.title,
  t.description,
  t.status,
  t.priority,
  t.due_date,
  t.due_time,
  t.estimated_hours,
  t.campaign_id,
  c.name as campaign_name,
  c.client_id,
  cl.name as client_name,
  t.owner_id,
  u.full_name as owner_name,
  t.sop_id,
  s.title as sop_title
FROM tasks t
LEFT JOIN campaigns c ON t.campaign_id = c.id
LEFT JOIN clients cl ON c.client_id = cl.id
LEFT JOIN users u ON t.owner_id = u.id
LEFT JOIN sops s ON t.sop_id = s.id
WHERE t.due_date <= CURRENT_DATE + 7
AND t.status NOT IN ('done', 'blocked')
ORDER BY t.due_date, t.priority DESC;

-- Team Workload View
CREATE OR REPLACE VIEW v_team_workload AS
SELECT
  u.id,
  u.full_name,
  u.role,
  u.email,
  COUNT(DISTINCT t.id) FILTER (WHERE t.status NOT IN ('done')) as total_tasks,
  COUNT(DISTINCT t.id) FILTER (WHERE t.status = 'todo') as todo_tasks,
  COUNT(DISTINCT t.id) FILTER (WHERE t.status = 'in_progress') as in_progress_tasks,
  COUNT(DISTINCT t.id) FILTER (WHERE t.priority IN ('high', 'urgent') AND t.status NOT IN ('done')) as urgent_tasks,
  COUNT(DISTINCT c.id) FILTER (WHERE c.pic_id = u.id AND c.status = 'running') as active_campaigns
FROM users u
LEFT JOIN tasks t ON u.id = t.owner_id
LEFT JOIN campaigns c ON u.id = c.pic_id
WHERE u.is_active = true
GROUP BY u.id, u.full_name, u.role, u.email;

-- Upcoming Schedule View
CREATE OR REPLACE VIEW v_upcoming_schedule AS
SELECT
  ts.id,
  ts.title,
  ts.description,
  ts.type,
  ts.start_datetime,
  ts.end_datetime,
  ts.location_type,
  ts.location,
  ts.meeting_link,
  ts.campaign_id,
  c.name as campaign_name,
  ts.color,
  ts.is_recurring,
  ts.created_by,
  u.full_name as created_by_name
FROM team_schedules ts
LEFT JOIN campaigns c ON ts.campaign_id = c.id
LEFT JOIN users u ON ts.created_by = u.id
WHERE ts.start_datetime >= CURRENT_TIMESTAMP
AND ts.start_datetime <= CURRENT_TIMESTAMP + INTERVAL '7 days'
ORDER BY ts.start_datetime;

-- =====================================================
-- SEED DATA (Enhanced)
-- =====================================================

-- Users
INSERT INTO users (id, full_name, email, role, department) VALUES
('u1', 'Reza Mahendra', 'reza@rectoverso.id', 'founder', 'Leadership'),
('u2', 'Dewi Lestari', 'dewi@rectoverso.id', 'campaign_manager', 'Campaign'),
('u3', 'Ahmad Fauzi', 'ahmad@rectoverso.id', 'campaign_ops', 'Campaign'),
('u4', 'Sari Wulandari', 'sari@rectoverso.id', 'finance', 'Finance'),
('u5', 'Budi Santoso', 'budi@rectoverso.id', 'sales', 'Sales'),
('u6', 'Rina Putri', 'rina@rectoverso.id', 'intern', 'Campaign');

-- Clients
INSERT INTO clients (id, name, industry, website, pic_name, pic_email, pic_whatsapp) VALUES
('c1', 'Tunaiku by Amar Bank', 'Fintech', 'https://tunaiku.com', 'Andi Wijaya', 'andi@tunaiku.com', '6281234567890'),
('c2', 'Prudential Indonesia', 'Insurance', 'https://prudential.co.id', 'Maya Sari', 'maya@prudential.co.id', '6289876543210'),
('c3', 'FIFGROUP', 'Leasing', 'https://fifgroup.co.id', 'Hendra Kusuma', 'hendra@fifgroup.co.id', '6281112223334'),
('c4', 'ANTV', 'Media', 'https://antv.co.id', 'Rudi Hermawan', 'rudi@antv.co.id', '6285556667778'),
('c5', 'GradePlus Education', 'EdTech', 'https://gradeplus.id', 'Lisa Chen', 'lisa@gradeplus.id', '6287778889990'),
('c6', 'Bank Neo Commerce', 'Fintech', 'https://bnc.co.id', 'Fajar Nugroho', 'fajar@bnc.co.id', '6289990001112');

-- Campaigns
INSERT INTO campaigns (id, client_id, name, type, objective, status, health_status, start_date, end_date, budget, kpi_type, kpi_target, kpi_current, pic_id, payment_status, deliverables, current_phase, next_action, next_action_due) VALUES
('camp1', 'c5', 'GradePlus Social Media Management', 'social_media_management', 'Manage GradePlus social media presence dengan 3x weekly posting', 'running', 'green', '2024-07-01', '2024-12-31', 50000000, 'posts', 100, 45, 'u2', 'waiting_payment', '["30 posts/month", "Weekly analytics report", "Content calendar", "Monthly performance review"]', 'execution', 'Tunggu sertifikat ISP dari GradePlus', '2024-07-20'),
('camp2', 'c3', 'FIFGROUP Hajatan Cabin Jawa', 'publisher_distribution', 'Distribusi konten Hajatan ke 50 cabin FIFGROUP di Pulau Jawa', 'problem', 'red', '2024-06-01', '2024-07-31', 200000000, 'views', 500000, 156000, 'u2', 'not_invoiced', '["50 cabin posts", "500K reach", "10K engagements"]', 'monitoring', 'Redirect budget ke publisher cadangan - CRITICAL', '2024-07-09'),
('camp3', 'c1', 'Tunaiku App Download Q3', 'app_download', 'Download 50,000 pengguna baru aplikasi Tunaiku', 'running', 'green', '2024-07-01', '2024-09-30', 750000000, 'downloads', 50000, 32450, 'u2', 'waiting_payment', '["50K downloads", "Daily report", "Weekly optimization"]', 'monitoring', 'Kirim update harian ke Tunaiku', '2024-07-14'),
('camp4', 'c2', 'Prudential PRULady VCBL', 'vcbl', 'Kumpulkan 15,000 leads VCBL untuk tim sales Prudential', 'running', 'yellow', '2024-06-15', '2024-08-15', 450000000, 'leads', 15000, 7850, 'u3', 'invoice_sent', '["15K qualified leads", "Quality report", "Daily updates"]', 'monitoring', 'QC 500 leads terakhir - kualitas bermasalah', '2024-07-09'),
('camp5', 'c4', 'ANTV PitchFlow Enablement', 'influencer_campaign', 'Enable 100 content creators untuk program endorsement ANTV', 'setup', 'green', '2024-07-15', '2024-09-15', 350000000, 'registrations', 100, 0, 'u3', 'not_invoiced', '["100 enabled creators", "Brief template", "Onboarding session"]', 'preparation', 'Review brief dari ANTV', '2024-07-10');

-- Campaign Issues (NEW)
INSERT INTO campaign_issues (id, campaign_id, title, description, severity, status, reported_by, assigned_to, due_date) VALUES
('iss1', 'camp2', 'Publisher utama tidak bisa deliver', 'Otosport Media tidak bisa deliver konten tepat waktu, perlu redirect ke publisher cadangan', 'critical', 'in_progress', 'u2', 'u2', '2024-07-09'),
('iss2', 'camp2', 'Budget belum dialokasikan ke publisher cadangan', 'Perlu approval untuk redirect budget Rp 50jt ke 3 publisher cadangan', 'high', 'open', 'u3', 'u2', '2024-07-10'),
('iss3', 'camp4', 'Kualitas leads tidak qualified', 'Sampling 100 leads terakhir menunjukkan 40% tidak memenuhi criteria VCBL', 'high', 'in_progress', 'u3', 'u3', '2024-07-09'),
('iss4', 'camp1', 'Menunggu sertifikat ISP GradePlus', 'Sertifikat ISP belum keluar, belum bisa posting konten yang mengklaim sebagai ISP', 'medium', 'waiting_external', 'u2', 'u2', '2024-07-20');

-- Tasks (Enhanced)
INSERT INTO tasks (id, campaign_id, title, description, status, priority, owner_id, due_date, due_time, estimated_hours, sop_id) VALUES
('t1', 'camp2', 'Redirect budget ke publisher cadangan', 'Budget Rp 50jt dialokasikan ke: 1) Komunitas Ibu Profesional, 2) BisnisUKM Blog, 3) Campus Life', 'in_progress', 'urgent', 'u2', '2024-07-09', '10:00', 2, NULL),
('t2', 'camp4', 'QC 500 leads terakhir dari Google Display', 'Sampling dan analisis kualitas leads dari投放 Google Display 3-8 Juli', 'todo', 'high', 'u3', '2024-07-09', '14:00', 4, 'sop1'),
('t3', 'camp3', 'Kirim update harian ke Tunaiku', 'Report performa campaign harian - download rate, CPC, CTR', 'todo', 'high', 'u2', '2024-07-14', '09:00', 1, NULL),
('t4', 'camp5', 'Review brief ANTV PitchFlow', 'Review dan konfirmasi brief program PitchFlow Enablement', 'in_progress', 'medium', 'u3', '2024-07-10', '11:00', 2, NULL),
('t5', 'camp3', 'Optimasi targeting Facebook Ads', 'CPC mulai naik 15%, perlu optimize audience segmentation', 'done', 'medium', 'u2', '2024-07-08', NULL, 3, NULL),
('t6', 'camp1', 'Follow up sertifikat ISP GradePlus', 'Konfirmasi timeline sertifikat ISP ke tim GradePlus', 'todo', 'high', 'u2', '2024-07-15', '10:00', 1, NULL),
('t7', 'camp2', 'Brief publisher cadangan Hajatan', 'Siapkan brief untuk 3 publisher cadangan yang akan di-assign', 'todo', 'urgent', 'u3', '2024-07-09', '15:00', 2, NULL),
('t8', NULL, 'Prepare report BNC App Campaign', 'Final report untuk campaign BNC yang sudah completed', 'review', 'medium', 'u2', '2024-07-12', '17:00', 4, NULL);

-- Daily Schedules (NEW)
INSERT INTO daily_schedules (id, user_id, task_id, date, scheduled_time, status) VALUES
('ds1', 'u2', 't3', '2024-07-14', '09:00', 'todo'),
('ds2', 'u3', 't2', '2024-07-09', '14:00', 'todo'),
('ds3', 'u2', 't1', '2024-07-09', '10:00', 'in_progress');

-- Team Schedules (NEW)
INSERT INTO team_schedules (id, campaign_id, title, description, type, start_datetime, end_datetime, location_type, meeting_link, color, created_by) VALUES
('sch1', 'camp2', 'Emergency: Publisher Redirect Discussion', 'Discussion about redirecting budget to backup publishers due to main publisher failure', 'client_meeting', '2024-07-09 14:00:00+07', '2024-07-09 15:00:00+07', 'online', 'https://meet.google.com/abc-defg-hij', '#EF4444', 'u2'),
('sch2', 'camp4', 'Lead Quality Review', 'Review hasil QC leads VCBL dengan tim Prudential', 'internal_meeting', '2024-07-10 10:00:00+07', '2024-07-10 11:00:00+07', 'online', 'https://meet.google.com/xyz-uvwx-rst', '#F59E0B', 'u3'),
('sch3', 'camp5', 'Brief Review dengan ANTV', 'Review brief PitchFlow dan konfirmasi timeline dengan tim ANTV', 'client_meeting', '2024-07-10 15:00:00+07', '2024-07-10 16:00:00+07', 'offline', 'Kantor ANTV, Jakarta', '#10B981', 'u3'),
('sch4', 'camp1', 'GradePlus ISP Certificate Follow-up', 'Follow-up timeline sertifikat ISP ke GradePlus', 'other', '2024-07-15 10:00:00+07', NULL, 'online', 'https://wa.me/6287778889990', '#3B82F6', 'u2'),
('sch5', NULL, 'Weekly Team Sync', 'Weekly sync semua campaign manager dan ops', 'internal_meeting', '2024-07-15 09:00:00+07', '2024-07-15 10:00:00+07', 'online', 'https://meet.google.com/weekly-sync', '#06B6D4', 'u1');

-- Publishers
INSERT INTO publishers (id, name, type, category, city, province, contact_person, whatsapp, rate, audience_size, quality_score, status) VALUES
('p1', 'Otosport Media', 'media', 'Automotive', 'Jakarta', 'DKI Jakarta', 'Dedi Kurniawan', '6281312345678', 15000000, 2500000, 85, 'active'),
('p2', 'Komunitas Ibu Profesional', 'community', 'Women/Parenting', 'Jakarta', 'DKI Jakarta', 'Ika Fatmawati', '6281512345678', 8000000, 180000, 78, 'active'),
('p3', 'BisnisUKM Blog', 'website', 'Business/SME', 'Bandung', 'Jawa Barat', 'Rizki Pratama', '6281712345678', 5000000, 450000, 72, 'active'),
('p4', 'Campus Life Indonesia', 'community', 'Youth/Campus', 'Yogyakarta', 'DIY', 'Ario Wibowo', '6281912345678', 6000000, 320000, 80, 'active'),
('p5', 'Finance Influencer - Riko', 'influencer', 'Personal Finance', 'Jakarta', 'DKI Jakarta', 'Riko Fernando', '6282112345678', 25000000, 890000, 88, 'active'),
('p6', 'Komunitas Sepeda Motor Jawa', 'community', 'Automotive', 'Surabaya', 'Jawa Timur', 'Budi Santiko', '6282312345678', 7500000, 280000, 75, 'inactive');

-- SOPs
INSERT INTO sops (id, title, category, subcategory, role, estimated_time, difficulty, checklist) VALUES
('sop1', 'Lead Quality Check', 'Campaign Operations', 'Quality Control', 'campaign_ops', '30-60 menit', 'medium', '["Buka dashboard campaign", "Export leads data", "Random sampling 10%", "Cek criteria kelayakan", "Dokumentasi findings", "Escalate jika perlu"]'),
('sop2', 'Publisher Brief Preparation', 'Campaign Operations', 'Publisher Management', 'campaign_ops', '1-2 jam', 'easy', '["Identifikasi publisher", "Siapkan tracking link", "Buat brief document", "Include creative materials", "Set deadline delivery", "Share via email/wa"]'),
('sop3', 'Daily Client Update', 'Client Relations', 'Communication', 'campaign_manager', '15-30 menit', 'easy', '["Check overnight performance", "Generate report screenshot", "Prepare summary points", "Kirim via WhatsApp/Email", "Catat response"]'),
('sop4', 'Campaign Health Check', 'Campaign Operations', 'Monitoring', 'campaign_ops', '10-15 menit', 'easy', '["Check all running campaigns", "Review KPIs vs target", "Check for issues/alerts", "Update health status", "Escalate jika yellow/red"]');
