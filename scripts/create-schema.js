const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://bgfhhlhoqtxgpmbetrvx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnZmhobGhvcXR4Z3BtYmV0cnZ4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MzU3OTA5NiwiZXhwIjoyMDk5MTU1MDk2fQ.4BEfG1ufUwLYDvLcEXWQ1KlzBHe2YOsrWTuW15WejSY';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createTables() {
  console.log('Starting schema creation...');

  // Create ENUMs
  const enums = [
    `DO $$ BEGIN
      CREATE TYPE user_role AS ENUM ('founder', 'admin', 'campaign_manager', 'campaign_ops', 'finance', 'sales', 'intern');
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;`,

    `DO $$ BEGIN
      CREATE TYPE campaign_status AS ENUM ('draft', 'waiting_brief', 'setup', 'running', 'reporting', 'completed', 'paused', 'problem');
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;`,

    `DO $$ BEGIN
      CREATE TYPE health_status AS ENUM ('green', 'yellow', 'red');
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;`,

    `DO $$ BEGIN
      CREATE TYPE campaign_type AS ENUM ('lead_generation', 'app_download', 'registration', 'vcbl', 'influencer_campaign', 'publisher_distribution', 'media_placement', 'performance_campaign', 'social_amplification');
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;`,

    `DO $$ BEGIN
      CREATE TYPE payment_status AS ENUM ('not_invoiced', 'invoice_sent', 'waiting_payment', 'partially_paid', 'paid', 'overdue', 'disputed');
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;`,

    `DO $$ BEGIN
      CREATE TYPE task_status AS ENUM ('todo', 'in_progress', 'review', 'done', 'blocked');
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;`,

    `DO $$ BEGIN
      CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high', 'urgent');
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;`,

    `DO $$ BEGIN
      CREATE TYPE publisher_type AS ENUM ('media', 'influencer', 'community', 'local_contributor', 'website', 'social_account', 'whatsapp_group', 'telegram_group');
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;`,

    `DO $$ BEGIN
      CREATE TYPE publisher_status AS ENUM ('active', 'inactive', 'testing', 'blacklist');
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;`,

    `DO $$ BEGIN
      CREATE TYPE checklist_phase AS ENUM ('preparation', 'setup', 'execution', 'monitoring', 'reporting', 'finance');
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;`,

    `DO $$ BEGIN
      CREATE TYPE checklist_status AS ENUM ('todo', 'in_progress', 'done', 'blocked');
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;`,
  ];

  for (const sql of enums) {
    const { error } = await supabase.rpc('exec', { sql });
    if (error && !error.message.includes('already exists')) {
      console.log('Enum error (may be ok):', error.message);
    }
  }

  console.log('ENUMs created/verified');

  // Create uuid_generate_v4 function
  const { error: uuidError } = await supabase.rpc('exec', {
    sql: `CREATE OR REPLACE FUNCTION uuid_generate_v4() RETURNS uuid AS $$ BEGIN RETURN gen_random_uuid(); END; $$ LANGUAGE plpgsql STRICT;`
  });
  if (uuidError) {
    console.log('uuid_generate_v4:', uuidError.message);
  } else {
    console.log('uuid_generate_v4 function created');
  }

  // Create tables
  const tables = [
    // Users table
    `CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      full_name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      role user_role NOT NULL DEFAULT 'intern',
      avatar_url TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );`,

    // Clients table
    `CREATE TABLE IF NOT EXISTS clients (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name TEXT NOT NULL,
      industry TEXT,
      pic_name TEXT,
      pic_email TEXT,
      pic_whatsapp TEXT,
      notes TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );`,

    // Campaigns table
    `CREATE TABLE IF NOT EXISTS campaigns (
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
    );`,

    // Tasks table
    `CREATE TABLE IF NOT EXISTS tasks (
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
    );`,

    // Campaign Checklists table
    `CREATE TABLE IF NOT EXISTS campaign_checklists (
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
    );`,

    // Publishers table
    `CREATE TABLE IF NOT EXISTS publishers (
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
    );`,

    // Campaign Publishers junction table
    `CREATE TABLE IF NOT EXISTS campaign_publishers (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
      publisher_id UUID REFERENCES publishers(id) ON DELETE SET NULL,
      deliverable TEXT,
      budget_allocation BIGINT DEFAULT 0,
      status TEXT DEFAULT 'pending',
      notes TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );`,

    // Performance Entries table
    `CREATE TABLE IF NOT EXISTS performance_entries (
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
    );`,

    // Invoices table
    `CREATE TABLE IF NOT EXISTS invoices (
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
    );`,

    // SOPs table
    `CREATE TABLE IF NOT EXISTS sops (
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
    );`,

    // Client Updates table
    `CREATE TABLE IF NOT EXISTS client_updates (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
      date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      update_type TEXT,
      message TEXT NOT NULL,
      sent_by UUID REFERENCES users(id) ON DELETE SET NULL,
      status TEXT DEFAULT 'sent',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );`,

    // Activity Logs table
    `CREATE TABLE IF NOT EXISTS activity_logs (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      entity_type TEXT NOT NULL,
      entity_id UUID NOT NULL,
      action TEXT NOT NULL,
      description TEXT NOT NULL,
      user_id UUID REFERENCES users(id) ON DELETE SET NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );`,
  ];

  for (const sql of tables) {
    const { error } = await supabase.rpc('exec', { sql });
    if (error) {
      console.log('Table creation error:', error.message);
    } else {
      console.log('Table created successfully');
    }
  }

  console.log('Schema creation complete!');
}

createTables().catch(console.error);
