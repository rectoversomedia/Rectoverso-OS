-- =====================================================
-- Rectoverso OS - Supabase Seed Data
-- =====================================================

-- =====================================================
-- USERS
-- =====================================================

INSERT INTO users (id, full_name, email, role, created_at) VALUES
('u1', 'Reza Mahendra', 'reza@rectoverso.id', 'founder', '2024-01-01 00:00:00+00'),
('u2', 'Dewi Lestari', 'dewi@rectoverso.id', 'campaign_manager', '2024-02-15 00:00:00+00'),
('u3', 'Ahmad Fauzi', 'ahmad@rectoverso.id', 'campaign_ops', '2024-03-01 00:00:00+00'),
('u4', 'Sari Wulandari', 'sari@rectoverso.id', 'finance', '2024-04-01 00:00:00+00'),
('u5', 'Budi Santoso', 'budi@rectoverso.id', 'sales', '2024-05-01 00:00:00+00'),
('u6', 'Rina Putri', 'rina@rectoverso.id', 'intern', '2024-06-01 00:00:00+00');

-- =====================================================
-- CLIENTS
-- =====================================================

INSERT INTO clients (id, name, industry, pic_name, pic_email, pic_whatsapp, notes, created_at) VALUES
('c1', 'Tunaiku by Amar Bank', 'Fintech / Pinjaman Online', 'Andi Wijaya', 'andi@tunaiku.com', '6281234567890', 'Prioritas tinggi, selalu butuh update harian', '2024-01-15 00:00:00+00'),
('c2', 'Prudential Indonesia', 'Asuransi Jiwa', 'Maya Sari', 'maya@prudential.co.id', '6289876543210', 'Campaign PRULady untuk wanita usia 25-45 tahun', '2024-02-01 00:00:00+00'),
('c3', 'FIFGROUP', 'Leasing / Pembiayaan', 'Hendra Kusuma', 'hendra@fifgroup.co.id', '6281112223334', 'Campaign Hajatan untuk cabang-cabang di Jawa', '2024-02-20 00:00:00+00'),
('c4', 'ANTV', 'Media / Entertainment', 'Rudi Hermawan', 'rudi@antv.co.id', '6285556667778', 'PitchFlow Enablement untuk program endorsement', '2024-03-10 00:00:00+00'),
('c5', 'GradePlus Education', 'EdTech / Pendidikan', 'Lisa Chen', 'lisa@gradeplus.id', '6287778889990', 'Social content untuk Instagram dan TikTok', '2024-04-05 00:00:00+00'),
('c6', 'Bank Neo Commerce', 'Fintech / Banking', 'Fajar Nugroho', 'fajar@bnc.co.id', '6289990001112', NULL, '2024-05-01 00:00:00+00');

-- =====================================================
-- CAMPAIGNS
-- =====================================================

INSERT INTO campaigns (id, client_id, name, type, objective, status, health_status, start_date, end_date, budget, kpi_type, kpi_target, kpi_current, tracking_link, utm_source, utm_medium, utm_campaign, pic_id, payment_status, notes, deliverables, created_at, updated_at) VALUES
('camp1', 'c1', 'Tunaiku App Download Q3 2024', 'app_download', 'Mendownload 50,000 pengguna baru aplikasi Tunaiku melalui campaign digital marketing', 'running', 'green', '2024-07-01', '2024-09-30', 750000000, 'downloads', 50000, 32450, 'https://tunaiku.app/download', 'facebook', 'cpc', 'tunaiku_q3_2024', 'u2', 'waiting_payment', 'Campaign berjalan lancar, CPC turun 15% dari bulan lalu', '["50,000 app downloads", "Daily performance report", "Weekly optimization report", "Final campaign report"]', '2024-06-15 00:00:00+00', '2024-07-08 10:00:00+00'),
('camp2', 'c2', 'Prudential PRULady VCBL Campaign', 'vcbl', 'Mengumpulkan 15,000 leads VCBL (Virtual Call Business Lead) untuk tim sales Prudential', 'running', 'yellow', '2024-06-15', '2024-08-15', 450000000, 'leads', 15000, 7850, 'https://pru.link/join', 'google', 'display', 'prulady_vcbl_jun24', 'u3', 'invoice_sent', 'Kualitas leads perlu di QC lebih detail, ada indikasi leads tidak qualified', '["15,000 qualified leads", "Lead quality report", "Daily updates", "Final presentation"]', '2024-06-01 00:00:00+00', '2024-07-07 15:30:00+00'),
('camp3', 'c3', 'FIFGROUP Hajatan Cabang Jawa Campaign', 'publisher_distribution', 'Mendistribusikan konten promotion Hajatan ke 50 cabang FIFGROUP di Pulau Jawa', 'problem', 'red', '2024-06-01', '2024-07-31', 200000000, 'views', 500000, 156000, '', 'publisher', 'content', 'fifgroup_hajatan_java', 'u2', 'not_invoiced', 'CRITICAL: Publisher utama tidak bisa deliver, perlu redirect ke publisher cadangan SEGERA', '["50 publisher posts", "500K total reach", "10K engagements", "Distribution report"]', '2024-05-20 00:00:00+00', '2024-07-08 08:00:00+00'),
('camp4', 'c4', 'ANTV PitchFlow Enablement Program', 'influencer_campaign', 'Mengenable 100 content creators untuk program endorsement ANTV', 'setup', 'green', '2024-07-15', '2024-09-15', 350000000, 'registrations', 100, 0, 'https://antv.co.id/pitchflow', 'instagram', 'influencer', 'pitchflow_enablement', 'u3', 'not_invoiced', 'Brief dari client baru diterima, perlu review dan prepare publisher brief', '["100 enabled creators", "Content brief template", "Onboarding session", "Performance report"]', '2024-07-01 00:00:00+00', '2024-07-06 12:00:00+00'),
('camp5', 'c5', 'GradePlus Social Content July 2024', 'social_amplification', 'Meningkatkan awareness GradePlus melalui social media content campaign', 'running', 'green', '2024-07-01', '2024-07-31', 85000000, 'clicks', 25000, 18340, 'https://gradeplus.id', 'instagram,tiktok,twitter', 'content', 'gradeplus_jul24', 'u6', 'paid', NULL, '["30 social posts", "50K impressions", "2.5K engagements", "Content report"]', '2024-06-25 00:00:00+00', '2024-07-08 09:00:00+00'),
('camp6', 'c6', 'BNC App Install Campaign', 'app_download', 'Mendownload 25,000 pengguna baru BNC Digital Banking', 'completed', 'green', '2024-05-01', '2024-06-30', 500000000, 'downloads', 25000, 27850, 'https://bnc.co.id/download', 'google,facebook', 'cpc', 'bnc_app_may24', 'u2', 'paid', NULL, '["25,000 downloads", "Final report", "Invoice"]', '2024-04-20 00:00:00+00', '2024-07-01 00:00:00+00'),
('camp7', 'c1', 'Tunaiku Lead Gen Juni 2024', 'lead_generation', 'Mengumpulkan 8,000 leads untuk tim sales Tunaiku', 'completed', 'green', '2024-06-01', '2024-06-30', 320000000, 'leads', 8000, 8450, 'https://tunaiku.com/apply', 'facebook,google', 'cpc', 'tunaiku_jun24', 'u3', 'overdue', 'Campaign selesai, invoice sudah dikirim tapi belum dibayar', '["8,000 leads", "Lead report", "Invoice"]', '2024-05-25 00:00:00+00', '2024-07-01 00:00:00+00'),
('camp8', 'c2', 'Prudential Media Placement July', 'media_placement', 'Media placement di 5 portal berita untuk campaign awareness Prudential', 'draft', 'green', '2024-08-01', '2024-08-31', 180000000, 'views', 300000, 0, NULL, NULL, NULL, NULL, 'u2', 'not_invoiced', NULL, '["5 media placements", "300K views", "Media report"]', '2024-07-05 00:00:00+00', '2024-07-05 00:00:00+00');

-- =====================================================
-- TASKS
-- =====================================================

INSERT INTO tasks (id, campaign_id, title, description, status, priority, owner_id, due_date, sop_id, created_at, updated_at, comment_count) VALUES
('t1', 'camp3', 'Redirect budget ke publisher cadangan', 'Publisher utama tidak bisa deliver, perlu redirect budget ke 3 publisher cadangan', 'in_progress', 'urgent', 'u2', '2024-07-09', 'sop1', '2024-07-08 08:00:00+00', '2024-07-08 10:00:00+00', 3),
('t2', 'camp2', 'QC 500 leads terakhir dari Google Display', 'Ada indikasi leads tidak qualified, perlu sampling QC 500 leads', 'todo', 'high', 'u3', '2024-07-09', 'sop4', '2024-07-08 09:00:00+00', '2024-07-08 09:00:00+00', 1),
('t3', 'camp1', 'Kirim update harian ke Tunaiku', 'Report performa campaign harian untuk client Tunaiku', 'todo', 'high', 'u2', '2024-07-09', NULL, '2024-07-08 07:00:00+00', '2024-07-08 07:00:00+00', 0),
('t4', 'camp4', 'Review brief dari ANTV', 'Brief baru diterima, perlu review dan konfirmasi dengan client', 'in_progress', 'medium', 'u3', '2024-07-10', NULL, '2024-07-06 12:00:00+00', '2024-07-08 11:00:00+00', 2),
('t5', 'camp7', 'Follow up invoice Tunaiku Juni', 'Invoice sudah dikirim sejak 5 Juli, belum ada konfirmasi pembayaran', 'todo', 'high', 'u4', '2024-07-09', 'sop7', '2024-07-08 08:30:00+00', '2024-07-08 08:30:00+00', 1),
('t6', NULL, 'Prepare report BNC App Campaign', 'Final report untuk campaign BNC yang sudah selesai', 'review', 'medium', 'u2', '2024-07-12', NULL, '2024-07-01 00:00:00+00', '2024-07-07 16:00:00+00', 4),
('t7', 'camp5', 'Upload konten GradePlus minggu ini', '8 konten untuk Instagram dan TikTok', 'in_progress', 'medium', 'u6', '2024-07-10', NULL, '2024-07-08 09:00:00+00', '2024-07-08 09:00:00+00', 0),
('t8', NULL, 'Update SOP Publisher Coordination', 'Update SOP karena ada perubahan workflow dengan publisher', 'blocked', 'low', 'u1', '2024-07-15', 'sop3', '2024-07-01 00:00:00+00', '2024-07-05 00:00:00+00', 2),
('t9', 'camp4', 'Prepare publisher brief untuk ANTV', 'Buat brief untuk outreach ke content creators', 'todo', 'high', 'u3', '2024-07-11', NULL, '2024-07-08 10:00:00+00', '2024-07-08 10:00:00+00', 0),
('t10', 'camp1', 'Optimasi targeting Facebook Ads', 'CPC mulai naik, perlu optimize audience dan creative', 'done', 'medium', 'u2', '2024-07-08', NULL, '2024-07-07 00:00:00+00', '2024-07-08 10:00:00+00', 1);

-- =====================================================
-- CAMPAIGN CHECKLISTS
-- =====================================================

INSERT INTO campaign_checklists (id, campaign_id, phase, title, status, owner_id, due_date, sop_id, notes) VALUES
-- FIFGROUP Hajatan - Preparation
('cl1', 'camp3', 'preparation', 'Brief received & understood', 'done', 'u2', '2024-06-02', 'sop1', NULL),
('cl2', 'camp3', 'preparation', 'Campaign objective confirmed', 'done', 'u2', '2024-06-03', NULL, NULL),
('cl3', 'camp3', 'preparation', 'KPI and payout confirmed', 'done', 'u2', '2024-06-04', NULL, NULL),
-- FIFGROUP Hajatan - Setup
('cl4', 'camp3', 'setup', 'Tracking link prepared', 'done', 'u3', '2024-06-05', 'sop2', NULL),
('cl5', 'camp3', 'setup', 'Publisher list approved', 'done', 'u2', '2024-06-10', NULL, NULL),
('cl6', 'camp3', 'setup', 'Creative materials received', 'done', 'u3', '2024-06-12', NULL, NULL),
('cl7', 'camp3', 'setup', 'Publisher brief distributed', 'done', 'u3', '2024-06-15', NULL, NULL),
-- FIFGROUP Hajatan - Execution
('cl8', 'camp3', 'execution', 'Campaign live', 'done', 'u3', '2024-06-16', NULL, NULL),
-- FIFGROUP Hajatan - Monitoring
('cl9', 'camp3', 'monitoring', 'Daily monitoring', 'in_progress', 'u3', '2024-07-31', NULL, NULL),
('cl10', 'camp3', 'monitoring', 'Quality check', 'todo', 'u2', '2024-07-10', 'sop4', NULL),
('cl11', 'camp3', 'monitoring', 'Client update sent', 'todo', 'u2', '2024-07-09', NULL, NULL),
-- FIFGROUP Hajatan - Reporting
('cl12', 'camp3', 'reporting', 'Final report generated', 'todo', 'u2', '2024-08-05', NULL, NULL),
-- FIFGROUP Hajatan - Finance
('cl13', 'camp3', 'finance', 'Invoice created', 'todo', 'u4', '2024-08-10', 'sop7', NULL),
('cl14', 'camp3', 'finance', 'Payment followed up', 'todo', 'u4', '2024-08-15', NULL, NULL),
-- ANTV PitchFlow - Preparation
('cl15', 'camp4', 'preparation', 'Brief received & understood', 'done', 'u3', '2024-07-02', NULL, NULL),
('cl16', 'camp4', 'preparation', 'Campaign objective confirmed', 'in_progress', 'u3', '2024-07-10', NULL, NULL),
('cl17', 'camp4', 'setup', 'Tracking link prepared', 'todo', 'u3', '2024-07-12', 'sop2', NULL),
('cl18', 'camp4', 'setup', 'Publisher/creator list compiled', 'todo', 'u3', '2024-07-14', NULL, NULL);

-- =====================================================
-- PUBLISHERS
-- =====================================================

INSERT INTO publishers (id, name, type, category, city, province, contact_person, whatsapp, email, rate, audience_size, quality_score, status, notes, created_at) VALUES
('p1', 'Otosport Media', 'media', 'Automotive', 'Jakarta', 'DKI Jakarta', 'Dedi Kurniawan', '6281312345678', 'dedi@otosport.id', 15000000, 2500000, 85, 'active', 'Sudah sering collaborate, kualitas content bagus', '2024-01-01 00:00:00+00'),
('p2', 'Komunitas Ibu Profesional', 'community', 'Women / Parenting', 'Jakarta', 'DKI Jakarta', 'Ika Fatmawati', '6281512345678', NULL, 8000000, 180000, 78, 'active', 'Members are professionals aged 25-45, great for fintech', '2024-01-01 00:00:00+00'),
('p3', 'BisnisUKM Blog', 'website', 'Business / SME', 'Bandung', 'Jawa Barat', 'Rizki Pratama', '6281712345678', 'rizki@bisnisukm.com', 5000000, 450000, 72, 'active', NULL, '2024-01-01 00:00:00+00'),
('p4', 'Campus Life Indonesia', 'community', 'Youth / Campus', 'Yogyakarta', 'DIY', 'Ario Wibowo', '6281912345678', NULL, 6000000, 320000, 80, 'active', 'Reach ke mahasiswa se-Jawa, bagus untuk app download', '2024-01-01 00:00:00+00'),
('p5', 'Finance Influencer - Riko', 'influencer', 'Personal Finance', 'Jakarta', 'DKI Jakarta', 'Riko Fernando', '6282112345678', NULL, 25000000, 890000, 88, 'active', 'Micro influencer, engagement rate tinggi', '2024-01-01 00:00:00+00'),
('p6', 'Komunitas Sepeda Motor Jawa', 'community', 'Automotive', 'Surabaya', 'Jawa Timur', 'Budi Santiko', '6282312345678', NULL, 7500000, 280000, 75, 'active', NULL, '2024-01-01 00:00:00+00'),
('p7', 'Media Nasional Jaya', 'media', 'News / Media', 'Jakarta', 'DKI Jakarta', 'Siti Nurhaliza', '6282512345678', 'siti@medianasional.com', 75000000, 15000000, 92, 'active', 'Premium media, untuk campaign awareness', '2024-01-01 00:00:00+00'),
('p8', 'WA Group Promo Bandung', 'whatsapp_group', 'Local Promo', 'Bandung', 'Jawa Barat', 'Group Admin', '6282712345678', NULL, 2000000, 50000, 65, 'testing', 'New channel, perlu test conversion rate', '2024-01-01 00:00:00+00'),
('p9', 'Telegram Coding Indonesia', 'telegram_group', 'Tech / Programming', 'Jakarta', 'DKI Jakarta', 'Admin Bot', '6282912345678', NULL, 3000000, 75000, 70, 'active', NULL, '2024-01-01 00:00:00+00'),
('p10', 'Local Influencer - Mbak Rini', 'local_contributor', 'Women / Lifestyle', 'Semarang', 'Jawa Tengah', 'Rini Amelia', '6283112345678', NULL, 3500000, 125000, 82, 'active', 'Micro influencer Semarang, engagement bagus', '2024-01-01 00:00:00+00'),
('p11', 'Viral Content ID', 'social_account', 'Entertainment', 'Jakarta', 'DKI Jakarta', 'Agus Setiawan', '6283312345678', NULL, 12000000, 1800000, 78, 'inactive', 'Sering deliver konten viral', '2024-01-01 00:00:00+00'),
('p12', 'Auto Community Hub', 'website', 'Automotive', 'Jakarta', 'DKI Jakarta', 'Toni Wijaya', '6283512345678', 'toni@autocommunity.id', 10000000, 890000, 76, 'blacklist', 'Pernah manipulate metrics, tidak bisa dipakai lagi', '2024-01-01 00:00:00+00');

-- =====================================================
-- CAMPAIGN PUBLISHERS
-- =====================================================

INSERT INTO campaign_publishers (id, campaign_id, publisher_id, deliverable, budget_allocation, status, notes, created_at) VALUES
('cp1', 'camp1', 'p1', '5 article placements', 75000000, 'running', NULL, '2024-06-15 00:00:00+00'),
('cp2', 'camp1', 'p2', '3 community posts', 24000000, 'running', NULL, '2024-06-15 00:00:00+00'),
('cp3', 'camp2', 'p2', '5 community posts', 40000000, 'running', NULL, '2024-06-01 00:00:00+00'),
('cp4', 'camp2', 'p5', '2 influencer posts', 50000000, 'running', NULL, '2024-06-01 00:00:00+00'),
('cp5', 'camp3', 'p6', '20 community posts', 150000000, 'problem', 'PROBLEM: Publisher tidak bisa deliver tepat waktu', '2024-05-20 00:00:00+00'),
('cp6', 'camp4', 'p5', '10 influencer posts', 250000000, 'setup', NULL, '2024-07-01 00:00:00+00'),
('cp7', 'camp5', 'p11', '30 social posts', 60000000, 'running', NULL, '2024-06-25 00:00:00+00');

-- =====================================================
-- PERFORMANCE ENTRIES
-- =====================================================

INSERT INTO performance_entries (id, campaign_id, date, leads, clicks, downloads, registrations, cost_spent, notes, created_at) VALUES
('perf1', 'camp1', '2024-07-08', 0, 8760, 1245, 0, 18500000, 'Hari yang bagus, CPC turun', '2024-07-08 00:00:00+00'),
('perf2', 'camp1', '2024-07-07', 0, 7230, 1089, 0, 17200000, NULL, '2024-07-07 00:00:00+00'),
('perf3', 'camp1', '2024-07-06', 0, 7890, 1156, 0, 16800000, NULL, '2024-07-06 00:00:00+00'),
('perf4', 'camp2', '2024-07-08', 320, 4500, 0, 0, 12500000, 'Lead quality perlu di QC', '2024-07-08 00:00:00+00'),
('perf5', 'camp2', '2024-07-07', 289, 4100, 0, 0, 11800000, NULL, '2024-07-07 00:00:00+00'),
('perf6', 'camp3', '2024-07-08', 0, 8900, 0, 0, 8500000, 'CRITICAL: Publisher utama tidak deliver', '2024-07-08 00:00:00+00'),
('perf7', 'camp5', '2024-07-08', 0, 2340, 0, 0, 2800000, NULL, '2024-07-08 00:00:00+00');

-- =====================================================
-- INVOICES
-- =====================================================

INSERT INTO invoices (id, client_id, campaign_id, invoice_number, amount, invoice_date, due_date, status, paid_date, notes, created_at) VALUES
('inv1', 'c1', 'camp7', 'INV-2024-006', 320000000, '2024-07-01', '2024-07-15', 'overdue', NULL, 'Sudah dikirim 5 Juli, belum ada konfirmasi', '2024-07-01 10:00:00+00'),
('inv2', 'c2', 'camp2', 'INV-2024-007', 150000000, '2024-07-05', '2024-07-20', 'invoice_sent', NULL, NULL, '2024-07-05 10:00:00+00'),
('inv3', 'c1', 'camp1', 'INV-2024-008', 250000000, '2024-07-10', '2024-07-25', 'waiting_payment', NULL, 'Progress payment 1', '2024-07-10 10:00:00+00'),
('inv4', 'c6', 'camp6', 'INV-2024-005', 500000000, '2024-07-01', '2024-07-15', 'paid', '2024-07-10', NULL, '2024-07-01 10:00:00+00'),
('inv5', 'c5', NULL, 'INV-2024-004', 85000000, '2024-07-01', '2024-07-15', 'paid', '2024-07-08', NULL, '2024-07-01 10:00:00+00'),
('inv6', 'c3', 'camp3', 'INV-2024-009', 100000000, '2024-07-08', '2024-07-23', 'not_invoiced', NULL, 'Invoice belum dibuat - campaign masih running', '2024-07-08 10:00:00+00');

-- =====================================================
-- SOPs
-- =====================================================

INSERT INTO sops (id, title, category, role, estimated_time, content, checklist, video_url, templates, updated_at) VALUES
('sop1', 'Campaign Setup dari Brief', 'Campaign Setup', 'campaign_ops', '2-3 jam', 'Panduan lengkap setup campaign dari brief client:

1. Baca brief dengan teliti
2. Identifikasi objective campaign
3. Konfirmasi KPI dan target dengan client
4. Set timeline campaign
5. Prepare tracking link
6. Setup UTM parameters
7. Select publishers/channels
8. Prepare publisher brief
9. Launch campaign
10. Monitor daily performance', '["Brief received", "Objective confirmed", "KPI confirmed", "Timeline set", "Tracking link ready", "UTM prepared", "Publishers selected", "Brief distributed", "Campaign live"]', '', '["Publisher Brief Template", "Campaign Tracking Template"]', '2024-06-15 00:00:00+00'),
('sop2', 'Setup Tracking Link & UTM', 'Campaign Setup', 'campaign_ops', '30 menit', 'Langkah setup tracking link dan UTM:

1. Dapatkan landing page URL dari client
2. Buat tracking link menggunakan Bitly atau similar
3. Setup UTM parameters
4. Test semua links
5. Share ke team dan client', '["Landing page URL received", "Tracking link created", "UTM parameters set", "All links tested", "Links shared to team"]', '', '["UTM Tracking Sheet"]', '2024-06-10 00:00:00+00'),
('sop3', 'Publisher Coordination', 'Publisher Coordination', 'campaign_ops', '1-2 jam per publisher', 'Workflow koordinasi dengan publisher:

1. Identifikasi publisher yang sesuai
2. Outreach via WhatsApp/Email
3. Negosiasi rate dan deliverable
4. Kirim brief dan creative materials
5. Confirm timeline
6. Monitor delivery
7. QC konten
8. Invoice dan payment follow up', '["Publisher identified", "Outreach sent", "Rate negotiated", "Brief sent", "Timeline confirmed", "Content received", "QC passed", "Report delivered"]', '', '["Publisher Brief Template", "Publisher Tracking Sheet"]', '2024-05-20 00:00:00+00'),
('sop4', 'Quality Control Leads', 'Quality Control', 'campaign_manager', '1-2 jam', 'Prosedur Quality Control untuk leads:

1. Export leads dari system
2. Sampling 10% dari total leads
3. Cek kelengkapan data
4. Verifikasi dengan random sampling call
5. Calculate conversion rate
6. Identifikasi pattern leads tidak qualified
7. Report ke client jika ada issues
8. Optimize targeting jika perlu', '["Leads exported", "10% sampled", "Data completeness checked", "Random call verification", "Conversion rate calculated", "Issues reported", "Optimization applied"]', '', '["Lead QC Report Template"]', '2024-06-05 00:00:00+00'),
('sop5', 'Daily Client Update', 'Client Reporting', 'campaign_manager', '30 menit', 'Template dan panduan daily update ke client:

1. Buka dashboard performance
2. Export yesterday''s data
3. Generate key metrics
4. Bandingkan dengan target
5. Identifikasi highlights/issues
6. Buat summary narrative
7. Kirim via WhatsApp/Email
8. Simpan record', '["Data exported", "Metrics generated", "Comparison done", "Issues identified", "Summary written", "Update sent", "Record saved"]', '', '["Daily Update Template"]', '2024-06-01 00:00:00+00'),
('sop6', 'Campaign Report Generation', 'Client Reporting', 'campaign_manager', '3-4 jam', 'Panduan membuat campaign report:

1. Kumpulkan semua performance data
2. Generate overall metrics
3. Breakdown by channel, publisher, time
4. Calculate ROI
5. Comparison vs KPI
6. Key learnings
7. Recommendations
8. Format report
9. Internal review
10. Submit to client', '["Data collected", "Overall metrics generated", "Breakdown analysis done", "ROI calculated", "KPI comparison done", "Learnings documented", "Recommendations written", "Report formatted", "Internal review done", "Submitted to client"]', '', '["Campaign Report Template"]', '2024-05-25 00:00:00+00'),
('sop7', 'Invoice & Payment Follow Up', 'Finance & Invoice', 'finance', '15 menit per follow up', 'Prosedur invoice dan payment follow up:

1. Generate invoice sesuai terms
2. Kirim invoice via email
3. Record di finance tracking
4. Set reminder 3 hari sebelum due date
5. Follow up 1 hari sebelum due
6. Follow up di hari due date
7. Follow up 3 hari after due
8. Escalate jika needed
9. Update payment status', '["Invoice generated", "Invoice sent", "Recorded in tracker", "Reminder set", "Follow up day -3", "Follow up day 0", "Follow up day +3", "Escalated if needed", "Status updated"]', '', '["Invoice Template", "Finance Tracking Sheet"]', '2024-06-20 00:00:00+00'),
('sop8', 'Influencer Campaign Setup', 'Influencer Campaign', 'campaign_ops', '4-6 jam', 'Panduan setup influencer campaign:

1. Define campaign objective
2. Identify target influencer profile
3. Research dan shortlist influencers
4. Outreach dan negotiation
5. Contract signing
6. Brief preparation
7. Creative guidelines
8. Content approval workflow
9. Publication schedule
10. Performance tracking
11. Report generation', '["Objective defined", "Influencer profile set", "List researched", "Outreach done", "Contract signed", "Brief prepared", "Guidelines sent", "Content approved", "Published", "Tracked", "Reported"]', '', '["Influencer Brief Template", "Influencer Contract Template"]', '2024-06-12 00:00:00+00'),
('sop9', 'App Download Campaign', 'App Download Campaign', 'campaign_manager', '2-3 jam', 'Panduan app download campaign:

1. Setup app tracking (AppsFlyer/Adjust)
2. Configure attribution
3. Setup tracking link
4. Create ad accounts access
5. Define target audience
6. Setup creatives
7. Configure events to track
8. Test install flow
9. Launch campaign
10. Monitor install rate
11. Optimize based on data
12. Report to client', '["App tracker setup", "Attribution configured", "Tracking link ready", "Ad accounts accessed", "Audience defined", "Creatives uploaded", "Events configured", "Install tested", "Campaign live", "Monitored", "Optimized", "Reported"]', '', '["App Campaign Tracking Template"]', '2024-06-18 00:00:00+00'),
('sop10', 'Media Placement', 'Media Placement', 'campaign_ops', '3-4 jam', 'Panduan media placement:

1. Identify target media
2. Request media kit
3. Negosiasi rate dan position
4. Define placement details
5. Create banner/creative
6. Submit creative for approval
7. Schedule publication
8. Monitor publication
9. Screenshot proof
10. Invoice handling
11. Report to client', '["Media identified", "Media kit requested", "Rate negotiated", "Details defined", "Creative created", "Approved by media", "Scheduled", "Published", "Proof collected", "Invoiced", "Reported"]', '', '["Media Placement Tracking"]', '2024-06-08 00:00:00+00');

-- =====================================================
-- CLIENT UPDATES
-- =====================================================

INSERT INTO client_updates (id, campaign_id, date, update_type, message, sent_by, status, created_at) VALUES
('cu1', 'camp1', '2024-07-08 09:00:00+00', 'daily', 'Hari ini: 1,245 downloads (target: 1,100). CPC turun 12% dari kemarin. Facebook performs best dengan CTR 3.2%. Rekomendasi: naikkan budget Facebook 20%.', 'u2', 'sent', '2024-07-08 09:00:00+00'),
('cu2', 'camp1', '2024-07-07 09:00:00+00', 'daily', 'Hari ini: 1,089 downloads. Total to date: 31,205 / 50,000 (62.4%). Progress on track.', 'u2', 'sent', '2024-07-07 09:00:00+00'),
('cu3', 'camp2', '2024-07-08 10:00:00+00', 'alert', 'ALERT: Quality leads dari Google Display perlu di QC. Ada indikasi 15% leads tidak respond saat di-follow up. Mohon konfirmasi apakah mau continue atau optimize targeting.', 'u3', 'sent', '2024-07-08 10:00:00+00'),
('cu4', 'camp3', '2024-07-08 08:00:00+00', 'alert', 'URGENT: Publisher utama tidak bisa deliver schedule. Mohon approval untuk redirect budget ke 3 publisher cadangan. Total reach akan tetap tercapai tapi dengan timeline berbeda.', 'u2', 'sent', '2024-07-08 08:00:00+00'),
('cu5', 'camp5', '2024-07-05 11:00:00+00', 'weekly', 'Weekly report: Total reach 45K, engagement 2.3K, click to profile 890. Best performing content: carousel education post. Rekomendasi untuk next week: focus on reels format.', 'u6', 'sent', '2024-07-05 11:00:00+00');

-- =====================================================
-- ACTIVITY LOGS
-- =====================================================

INSERT INTO activity_logs (id, entity_type, entity_id, action, description, user_id, created_at) VALUES
('al1', 'campaign', 'camp3', 'status_changed', 'Campaign status changed to Problem', 'u2', '2024-07-08 08:00:00+00'),
('al2', 'task', 't1', 'created', 'Task ''Redirect budget ke publisher cadangan'' created', 'u2', '2024-07-08 08:05:00+00'),
('al3', 'campaign', 'camp2', 'health_changed', 'Campaign health changed to Yellow', 'u3', '2024-07-07 15:30:00+00'),
('al4', 'invoice', 'inv1', 'created', 'Invoice INV-2024-006 created for Tunaiku Lead Gen Juni', 'u4', '2024-07-01 10:00:00+00'),
('al5', 'performance', 'perf1', 'updated', 'Daily performance recorded: 1,245 downloads', 'u2', '2024-07-08 23:59:00+00'),
('al6', 'campaign', 'camp4', 'status_changed', 'Campaign status changed to Setup', 'u3', '2024-07-06 12:00:00+00'),
('al7', 'client_update', 'cu3', 'sent', 'Alert sent to Prudential regarding lead quality issue', 'u3', '2024-07-08 10:00:00+00'),
('al8', 'task', 't10', 'completed', 'Task ''Optimasi targeting Facebook Ads'' marked as done', 'u2', '2024-07-08 10:00:00+00');

-- =====================================================
-- END OF SEED DATA
-- =====================================================
