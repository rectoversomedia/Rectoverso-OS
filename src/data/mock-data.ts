import {
  User,
  Client,
  Campaign,
  Task,
  CampaignChecklist,
  Publisher,
  CampaignPublisher,
  PerformanceEntry,
  Invoice,
  SOP,
  ClientUpdate,
  ActivityLog,
  DashboardStats,
} from "@/types"

// Users
export const users: User[] = [
  {
    id: "u1",
    full_name: "Reza Mahendra",
    email: "reza@rectoverso.id",
    role: "founder",
    avatar_url: undefined,
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "u2",
    full_name: "Dewi Lestari",
    email: "dewi@rectoverso.id",
    role: "campaign_manager",
    avatar_url: undefined,
    created_at: "2024-02-15T00:00:00Z",
  },
  {
    id: "u3",
    full_name: "Ahmad Fauzi",
    email: "ahmad@rectoverso.id",
    role: "campaign_ops",
    avatar_url: undefined,
    created_at: "2024-03-01T00:00:00Z",
  },
  {
    id: "u4",
    full_name: "Sari Wulandari",
    email: "sari@rectoverso.id",
    role: "finance",
    avatar_url: undefined,
    created_at: "2024-04-01T00:00:00Z",
  },
  {
    id: "u5",
    full_name: "Budi Santoso",
    email: "budi@rectoverso.id",
    role: "sales",
    avatar_url: undefined,
    created_at: "2024-05-01T00:00:00Z",
  },
  {
    id: "u6",
    full_name: "Rina Putri",
    email: "rina@rectoverso.id",
    role: "intern",
    avatar_url: undefined,
    created_at: "2024-06-01T00:00:00Z",
  },
]

// Clients
export const clients: Client[] = [
  {
    id: "c1",
    name: "Tunaiku by Amar Bank",
    industry: "Fintech / Pinjaman Online",
    pic_name: "Andi Wijaya",
    pic_email: "andi@tunaiku.com",
    pic_whatsapp: "6281234567890",
    notes: "Prioritas tinggi, selalu butuh update harian",
    created_at: "2024-01-15T00:00:00Z",
  },
  {
    id: "c2",
    name: "Prudential Indonesia",
    industry: "Asuransi Jiwa",
    pic_name: "Maya Sari",
    pic_email: "maya@prudential.co.id",
    pic_whatsapp: "6289876543210",
    notes: "Campaign PRULady untuk wanita usia 25-45 tahun",
    created_at: "2024-02-01T00:00:00Z",
  },
  {
    id: "c3",
    name: "FIFGROUP",
    industry: "Leasing / Pembiayaan",
    pic_name: "Hendra Kusuma",
    pic_email: "hendra@fifgroup.co.id",
    pic_whatsapp: "6281112223334",
    notes: "Campaign Hajatan untuk cabang-cabang di Jawa",
    created_at: "2024-02-20T00:00:00Z",
  },
  {
    id: "c4",
    name: "ANTV",
    industry: "Media / Entertainment",
    pic_name: "Rudi Hermawan",
    pic_email: "rudi@antv.co.id",
    pic_whatsapp: "6285556667778",
    notes: "PitchFlow Enablement untuk program endorsement",
    created_at: "2024-03-10T00:00:00Z",
  },
  {
    id: "c5",
    name: "GradePlus Education",
    industry: "EdTech / Pendidikan",
    pic_name: "Lisa Chen",
    pic_email: "lisa@gradeplus.id",
    pic_whatsapp: "6287778889990",
    notes: "Social content untuk Instagram dan TikTok",
    created_at: "2024-04-05T00:00:00Z",
  },
  {
    id: "c6",
    name: "Bank Neo Commerce",
    industry: "Fintech / Banking",
    pic_name: "Fajar Nugroho",
    pic_email: "fajar@bnc.co.id",
    pic_whatsapp: "6289990001112",
    created_at: "2024-05-01T00:00:00Z",
  },
]

// Campaigns
export const campaigns: Campaign[] = [
  {
    id: "camp1",
    client_id: "c1",
    name: "Tunaiku App Download Q3 2024",
    type: "app_download",
    objective: "Mendownload 50,000 pengguna baru aplikasi Tunaiku melalui campaign digital marketing",
    status: "running",
    health_status: "green",
    start_date: "2024-07-01",
    end_date: "2024-09-30",
    budget: 750000000,
    kpi_type: "downloads",
    kpi_target: 50000,
    kpi_current: 32450,
    tracking_link: "https://tunaiku.app/download",
    utm_source: "facebook",
    utm_medium: "cpc",
    utm_campaign: "tunaiku_q3_2024",
    pic_id: "u2",
    payment_status: "waiting_payment",
    notes: "Campaign berjalan lancar, CPC turun 15% dari bulan lalu",
    deliverables: ["50,000 app downloads", "Daily performance report", "Weekly optimization report", "Final campaign report"],
    created_at: "2024-06-15T00:00:00Z",
    updated_at: "2024-07-08T10:00:00Z",
  },
  {
    id: "camp2",
    client_id: "c2",
    name: "Prudential PRULady VCBL Campaign",
    type: "vcbl",
    objective: "Mengumpulkan 15,000 leads VCBL (Virtual Call Business Lead) untuk tim sales Prudential",
    status: "running",
    health_status: "yellow",
    start_date: "2024-06-15",
    end_date: "2024-08-15",
    budget: 450000000,
    kpi_type: "leads",
    kpi_target: 15000,
    kpi_current: 7850,
    tracking_link: "https://pru.link/join",
    utm_source: "google",
    utm_medium: "display",
    utm_campaign: "prulady_vcbl_jun24",
    pic_id: "u3",
    payment_status: "invoice_sent",
    notes: "Kualitas leads perlu di QC lebih detail, ada indikasi leads tidak qualified",
    deliverables: ["15,000 qualified leads", "Lead quality report", "Daily updates", "Final presentation"],
    created_at: "2024-06-01T00:00:00Z",
    updated_at: "2024-07-07T15:30:00Z",
  },
  {
    id: "camp3",
    client_id: "c3",
    name: "FIFGROUP Hajatan Cabang Jawa Campaign",
    type: "publisher_distribution",
    objective: "Mendistribusikan konten promotion Hajatan ke 50 cabang FIFGROUP di Pulau Jawa",
    status: "problem",
    health_status: "red",
    start_date: "2024-06-01",
    end_date: "2024-07-31",
    budget: 200000000,
    kpi_type: "views",
    kpi_target: 500000,
    kpi_current: 156000,
    tracking_link: "",
    utm_source: "publisher",
    utm_medium: "content",
    utm_campaign: "fifgroup_hajatan_java",
    pic_id: "u2",
    payment_status: "not_invoiced",
    notes: "CRITICAL: Publisher utama tidak bisa deliver, perlu redirect ke publisher cadangan SEGERA",
    deliverables: ["50 publisher posts", "500K total reach", "10K engagements", "Distribution report"],
    created_at: "2024-05-20T00:00:00Z",
    updated_at: "2024-07-08T08:00:00Z",
  },
  {
    id: "camp4",
    client_id: "c4",
    name: "ANTV PitchFlow Enablement Program",
    type: "influencer_campaign",
    objective: "Mengenable 100 content creators untuk program endorsement ANTV",
    status: "setup",
    health_status: "green",
    start_date: "2024-07-15",
    end_date: "2024-09-15",
    budget: 350000000,
    kpi_type: "registrations",
    kpi_target: 100,
    kpi_current: 0,
    tracking_link: "https://antv.co.id/pitchflow",
    utm_source: "instagram",
    utm_medium: "influencer",
    utm_campaign: "pitchflow_enablement",
    pic_id: "u3",
    payment_status: "not_invoiced",
    notes: "Brief dari client baru diterima, perlu review dan prepare publisher brief",
    deliverables: ["100 enabled creators", "Content brief template", "Onboarding session", "Performance report"],
    created_at: "2024-07-01T00:00:00Z",
    updated_at: "2024-07-06T12:00:00Z",
  },
  {
    id: "camp5",
    client_id: "c5",
    name: "GradePlus Social Content July 2024",
    type: "social_amplification",
    objective: "Meningkatkan awareness GradePlus melalui social media content campaign",
    status: "running",
    health_status: "green",
    start_date: "2024-07-01",
    end_date: "2024-07-31",
    budget: 85000000,
    kpi_type: "clicks",
    kpi_target: 25000,
    kpi_current: 18340,
    tracking_link: "https://gradeplus.id",
    utm_source: "instagram,tiktok,twitter",
    utm_medium: "content",
    utm_campaign: "gradeplus_jul24",
    pic_id: "u6",
    payment_status: "paid",
    deliverables: ["30 social posts", "50K impressions", "2.5K engagements", "Content report"],
    created_at: "2024-06-25T00:00:00Z",
    updated_at: "2024-07-08T09:00:00Z",
  },
  {
    id: "camp6",
    client_id: "c6",
    name: "BNC App Install Campaign",
    type: "app_download",
    objective: "Mendownload 25,000 pengguna baru BNC Digital Banking",
    status: "completed",
    health_status: "green",
    start_date: "2024-05-01",
    end_date: "2024-06-30",
    budget: 500000000,
    kpi_type: "downloads",
    kpi_target: 25000,
    kpi_current: 27850,
    tracking_link: "https://bnc.co.id/download",
    utm_source: "google,facebook",
    utm_medium: "cpc",
    utm_campaign: "bnc_app_may24",
    pic_id: "u2",
    payment_status: "paid",
    deliverables: ["25,000 downloads", "Final report", "Invoice"],
    created_at: "2024-04-20T00:00:00Z",
    updated_at: "2024-07-01T00:00:00Z",
  },
  {
    id: "camp7",
    client_id: "c1",
    name: "Tunaiku Lead Gen Juni 2024",
    type: "lead_generation",
    objective: "Mengumpulkan 8,000 leads untuk tim sales Tunaiku",
    status: "completed",
    health_status: "green",
    start_date: "2024-06-01",
    end_date: "2024-06-30",
    budget: 320000000,
    kpi_type: "leads",
    kpi_target: 8000,
    kpi_current: 8450,
    tracking_link: "https://tunaiku.com/apply",
    utm_source: "facebook,google",
    utm_medium: "cpc",
    utm_campaign: "tunaiku_jun24",
    pic_id: "u3",
    payment_status: "overdue",
    notes: "Campaign selesai, invoice sudah dikirim tapi belum dibayar",
    deliverables: ["8,000 leads", "Lead report", "Invoice"],
    created_at: "2024-05-25T00:00:00Z",
    updated_at: "2024-07-01T00:00:00Z",
  },
  {
    id: "camp8",
    client_id: "c2",
    name: "Prudential Media Placement July",
    type: "media_placement",
    objective: "Media placement di 5 portal berita untuk campaign awareness Prudential",
    status: "draft",
    health_status: "green",
    start_date: "2024-08-01",
    end_date: "2024-08-31",
    budget: 180000000,
    kpi_type: "views",
    kpi_target: 300000,
    kpi_current: 0,
    pic_id: "u2",
    payment_status: "not_invoiced",
    deliverables: ["5 media placements", "300K views", "Media report"],
    created_at: "2024-07-05T00:00:00Z",
    updated_at: "2024-07-05T00:00:00Z",
  },
]

// Tasks
export const tasks: Task[] = [
  {
    id: "t1",
    campaign_id: "camp3",
    title: "Redirect budget ke publisher cadangan",
    description: "Publisher utama tidak bisa deliver, perlu redirect budget ke 3 publisher cadangan",
    status: "in_progress",
    priority: "urgent",
    owner_id: "u2",
    due_date: "2024-07-09",
    sop_id: "sop1",
    created_at: "2024-07-08T08:00:00Z",
    updated_at: "2024-07-08T10:00:00Z",
    comment_count: 3,
  },
  {
    id: "t2",
    campaign_id: "camp2",
    title: "QC 500 leads terakhir dari Google Display",
    description: "Ada indikasi leads tidak qualified, perlu sampling QC 500 leads",
    status: "todo",
    priority: "high",
    owner_id: "u3",
    due_date: "2024-07-09",
    sop_id: "sop4",
    created_at: "2024-07-08T09:00:00Z",
    updated_at: "2024-07-08T09:00:00Z",
    comment_count: 1,
  },
  {
    id: "t3",
    campaign_id: "camp1",
    title: "Kirim update harian ke Tunaiku",
    description: "Report performa campaign harian untuk client Tunaiku",
    status: "todo",
    priority: "high",
    owner_id: "u2",
    due_date: "2024-07-09",
    created_at: "2024-07-08T07:00:00Z",
    updated_at: "2024-07-08T07:00:00Z",
    comment_count: 0,
  },
  {
    id: "t4",
    campaign_id: "camp4",
    title: "Review brief dari ANTV",
    description: "Brief baru diterima, perlu review dan konfirmasi dengan client",
    status: "in_progress",
    priority: "medium",
    owner_id: "u3",
    due_date: "2024-07-10",
    created_at: "2024-07-06T12:00:00Z",
    updated_at: "2024-07-08T11:00:00Z",
    comment_count: 2,
  },
  {
    id: "t5",
    campaign_id: "camp7",
    title: "Follow up invoice Tunaiku Juni",
    description: "Invoice sudah dikirim sejak 5 Juli, belum ada konfirmasi pembayaran",
    status: "todo",
    priority: "high",
    owner_id: "u4",
    due_date: "2024-07-09",
    sop_id: "sop7",
    created_at: "2024-07-08T08:30:00Z",
    updated_at: "2024-07-08T08:30:00Z",
    comment_count: 1,
  },
  {
    id: "t6",
    title: "Prepare report BNC App Campaign",
    description: "Final report untuk campaign BNC yang sudah selesai",
    status: "review",
    priority: "medium",
    owner_id: "u2",
    due_date: "2024-07-12",
    created_at: "2024-07-01T00:00:00Z",
    updated_at: "2024-07-07T16:00:00Z",
    comment_count: 4,
  },
  {
    id: "t7",
    campaign_id: "camp5",
    title: "Upload konten GradePlus minggu ini",
    description: "8 konten untuk Instagram dan TikTok",
    status: "in_progress",
    priority: "medium",
    owner_id: "u6",
    due_date: "2024-07-10",
    created_at: "2024-07-08T09:00:00Z",
    updated_at: "2024-07-08T09:00:00Z",
    comment_count: 0,
  },
  {
    id: "t8",
    title: "Update SOP Publisher Coordination",
    description: "Update SOP karena ada perubahan workflow dengan publisher",
    status: "blocked",
    priority: "low",
    owner_id: "u1",
    due_date: "2024-07-15",
    sop_id: "sop3",
    created_at: "2024-07-01T00:00:00Z",
    updated_at: "2024-07-05T00:00:00Z",
    comment_count: 2,
  },
  {
    id: "t9",
    campaign_id: "camp4",
    title: "Prepare publisher brief untuk ANTV",
    description: "Buat brief untuk outreach ke content creators",
    status: "todo",
    priority: "high",
    owner_id: "u3",
    due_date: "2024-07-11",
    created_at: "2024-07-08T10:00:00Z",
    updated_at: "2024-07-08T10:00:00Z",
    comment_count: 0,
  },
  {
    id: "t10",
    campaign_id: "camp1",
    title: "Optimasi targeting Facebook Ads",
    description: "CPC mulai naik, perlu optimize audience dan creative",
    status: "done",
    priority: "medium",
    owner_id: "u2",
    due_date: "2024-07-08",
    created_at: "2024-07-07T00:00:00Z",
    updated_at: "2024-07-08T10:00:00Z",
    comment_count: 1,
  },
]

// Campaign Checklists
export const campaignChecklists: CampaignChecklist[] = [
  // FIFGROUP Hajatan - Preparation
  {
    id: "cl1",
    campaign_id: "camp3",
    phase: "preparation",
    title: "Brief received & understood",
    status: "done",
    owner_id: "u2",
    due_date: "2024-06-02",
    sop_id: "sop1",
  },
  {
    id: "cl2",
    campaign_id: "camp3",
    phase: "preparation",
    title: "Campaign objective confirmed",
    status: "done",
    owner_id: "u2",
    due_date: "2024-06-03",
  },
  {
    id: "cl3",
    campaign_id: "camp3",
    phase: "preparation",
    title: "KPI and payout confirmed",
    status: "done",
    owner_id: "u2",
    due_date: "2024-06-04",
  },
  // FIFGROUP Hajatan - Setup
  {
    id: "cl4",
    campaign_id: "camp3",
    phase: "setup",
    title: "Tracking link prepared",
    status: "done",
    owner_id: "u3",
    due_date: "2024-06-05",
    sop_id: "sop2",
  },
  {
    id: "cl5",
    campaign_id: "camp3",
    phase: "setup",
    title: "Publisher list approved",
    status: "done",
    owner_id: "u2",
    due_date: "2024-06-10",
  },
  {
    id: "cl6",
    campaign_id: "camp3",
    phase: "setup",
    title: "Creative materials received",
    status: "done",
    owner_id: "u3",
    due_date: "2024-06-12",
  },
  {
    id: "cl7",
    campaign_id: "camp3",
    phase: "setup",
    title: "Publisher brief distributed",
    status: "done",
    owner_id: "u3",
    due_date: "2024-06-15",
  },
  // FIFGROUP Hajatan - Execution
  {
    id: "cl8",
    campaign_id: "camp3",
    phase: "execution",
    title: "Campaign live",
    status: "done",
    owner_id: "u3",
    due_date: "2024-06-16",
  },
  // FIFGROUP Hajatan - Monitoring
  {
    id: "cl9",
    campaign_id: "camp3",
    phase: "monitoring",
    title: "Daily monitoring",
    status: "in_progress",
    owner_id: "u3",
    due_date: "2024-07-31",
  },
  {
    id: "cl10",
    campaign_id: "camp3",
    phase: "monitoring",
    title: "Quality check",
    status: "todo",
    owner_id: "u2",
    due_date: "2024-07-10",
    sop_id: "sop4",
  },
  {
    id: "cl11",
    campaign_id: "camp3",
    phase: "monitoring",
    title: "Client update sent",
    status: "todo",
    owner_id: "u2",
    due_date: "2024-07-09",
  },
  // FIFGROUP Hajatan - Reporting
  {
    id: "cl12",
    campaign_id: "camp3",
    phase: "reporting",
    title: "Final report generated",
    status: "todo",
    owner_id: "u2",
    due_date: "2024-08-05",
  },
  // FIFGROUP Hajatan - Finance
  {
    id: "cl13",
    campaign_id: "camp3",
    phase: "finance",
    title: "Invoice created",
    status: "todo",
    owner_id: "u4",
    due_date: "2024-08-10",
    sop_id: "sop7",
  },
  {
    id: "cl14",
    campaign_id: "camp3",
    phase: "finance",
    title: "Payment followed up",
    status: "todo",
    owner_id: "u4",
    due_date: "2024-08-15",
  },
  // ANTV PitchFlow - Preparation
  {
    id: "cl15",
    campaign_id: "camp4",
    phase: "preparation",
    title: "Brief received & understood",
    status: "done",
    owner_id: "u3",
    due_date: "2024-07-02",
  },
  {
    id: "cl16",
    campaign_id: "camp4",
    phase: "preparation",
    title: "Campaign objective confirmed",
    status: "in_progress",
    owner_id: "u3",
    due_date: "2024-07-10",
  },
  {
    id: "cl17",
    campaign_id: "camp4",
    phase: "setup",
    title: "Tracking link prepared",
    status: "todo",
    owner_id: "u3",
    due_date: "2024-07-12",
    sop_id: "sop2",
  },
  {
    id: "cl18",
    campaign_id: "camp4",
    phase: "setup",
    title: "Publisher/creator list compiled",
    status: "todo",
    owner_id: "u3",
    due_date: "2024-07-14",
  },
]

// Publishers
export const publishers: Publisher[] = [
  {
    id: "p1",
    name: "Otosport Media",
    type: "media",
    category: "Automotive",
    city: "Jakarta",
    province: "DKI Jakarta",
    contact_person: "Dedi Kurniawan",
    whatsapp: "6281312345678",
    email: "dedi@otosport.id",
    rate: 15000000,
    audience_size: 2500000,
    quality_score: 85,
    status: "active",
    notes: "Sudah sering collaborate, kualitas content bagus",
  },
  {
    id: "p2",
    name: "Komunitas Ibu Profesional",
    type: "community",
    category: "Women / Parenting",
    city: "Jakarta",
    province: "DKI Jakarta",
    contact_person: "Ika Fatmawati",
    whatsapp: "6281512345678",
    rate: 8000000,
    audience_size: 180000,
    quality_score: 78,
    status: "active",
    notes: "Members are professionals aged 25-45, great for fintech",
  },
  {
    id: "p3",
    name: "BisnisUKM Blog",
    type: "website",
    category: "Business / SME",
    city: "Bandung",
    province: "Jawa Barat",
    contact_person: "Rizki Pratama",
    whatsapp: "6281712345678",
    email: "rizki@bisnisukm.com",
    rate: 5000000,
    audience_size: 450000,
    quality_score: 72,
    status: "active",
  },
  {
    id: "p4",
    name: "Campus Life Indonesia",
    type: "community",
    category: "Youth / Campus",
    city: "Yogyakarta",
    province: "DIY",
    contact_person: "Ario Wibowo",
    whatsapp: "6281912345678",
    rate: 6000000,
    audience_size: 320000,
    quality_score: 80,
    status: "active",
    notes: "Reach ke mahasiswa se-Jawa, bagus untuk app download",
  },
  {
    id: "p5",
    name: "Finance Influencer - Riko",
    type: "influencer",
    category: "Personal Finance",
    city: "Jakarta",
    province: "DKI Jakarta",
    contact_person: "Riko Fernando",
    whatsapp: "6282112345678",
    rate: 25000000,
    audience_size: 890000,
    quality_score: 88,
    status: "active",
    notes: "Micro influencer, engagement rate tinggi",
  },
  {
    id: "p6",
    name: "Komunitas Sepeda Motor Jawa",
    type: "community",
    category: "Automotive",
    city: "Surabaya",
    province: "Jawa Timur",
    contact_person: "Budi Santiko",
    whatsapp: "6282312345678",
    rate: 7500000,
    audience_size: 280000,
    quality_score: 75,
    status: "active",
  },
  {
    id: "p7",
    name: "Media Nasional Jaya",
    type: "media",
    category: "News / Media",
    city: "Jakarta",
    province: "DKI Jakarta",
    contact_person: "Siti Nurhaliza",
    whatsapp: "6282512345678",
    email: "siti@medianasional.com",
    rate: 75000000,
    audience_size: 15000000,
    quality_score: 92,
    status: "active",
    notes: "Premium media, untuk campaign awareness",
  },
  {
    id: "p8",
    name: "WA Group Promo Bandung",
    type: "whatsapp_group",
    category: "Local Promo",
    city: "Bandung",
    province: "Jawa Barat",
    contact_person: "Group Admin",
    whatsapp: "6282712345678",
    rate: 2000000,
    audience_size: 50000,
    quality_score: 65,
    status: "testing",
    notes: "New channel, perlu test conversion rate",
  },
  {
    id: "p9",
    name: "Telegram Coding Indonesia",
    type: "telegram_group",
    category: "Tech / Programming",
    city: "Jakarta",
    province: "DKI Jakarta",
    contact_person: "Admin Bot",
    whatsapp: "6282912345678",
    rate: 3000000,
    audience_size: 75000,
    quality_score: 70,
    status: "active",
  },
  {
    id: "p10",
    name: "Local Influencer - Mbak Rini",
    type: "local_contributor",
    category: "Women / Lifestyle",
    city: "Semarang",
    province: "Jawa Tengah",
    contact_person: "Rini Amelia",
    whatsapp: "6283112345678",
    rate: 3500000,
    audience_size: 125000,
    quality_score: 82,
    status: "active",
    notes: "Micro influencer Semarang, engagement bagus",
  },
  {
    id: "p11",
    name: "Viral Content ID",
    type: "social_account",
    category: "Entertainment",
    city: "Jakarta",
    province: "DKI Jakarta",
    contact_person: "Agus Setiawan",
    whatsapp: "6283312345678",
    rate: 12000000,
    audience_size: 1800000,
    quality_score: 78,
    status: "inactive",
    notes: "Sering deliver konten viral",
  },
  {
    id: "p12",
    name: "Auto Community Hub",
    type: "website",
    category: "Automotive",
    city: "Jakarta",
    province: "DKI Jakarta",
    contact_person: " Toni Wijaya",
    whatsapp: "6283512345678",
    email: "toni@autocommunity.id",
    rate: 10000000,
    audience_size: 890000,
    quality_score: 76,
    status: "blacklist",
    notes: " pernah manipulate metrics, tidak bisa dipakai lagi",
  },
]

// Campaign Publishers
export const campaignPublishers: CampaignPublisher[] = [
  {
    id: "cp1",
    campaign_id: "camp1",
    publisher_id: "p1",
    deliverable: "5 article placements",
    budget_allocation: 75000000,
    status: "running",
  },
  {
    id: "cp2",
    campaign_id: "camp1",
    publisher_id: "p2",
    deliverable: "3 community posts",
    budget_allocation: 24000000,
    status: "running",
  },
  {
    id: "cp3",
    campaign_id: "camp2",
    publisher_id: "p2",
    deliverable: "5 community posts",
    budget_allocation: 40000000,
    status: "running",
  },
  {
    id: "cp4",
    campaign_id: "camp2",
    publisher_id: "p5",
    deliverable: "2 influencer posts",
    budget_allocation: 50000000,
    status: "running",
  },
  {
    id: "cp5",
    campaign_id: "camp3",
    publisher_id: "p6",
    deliverable: "20 community posts",
    budget_allocation: 150000000,
    status: "problem",
    notes: "PROBLEM: Publisher tidak bisa deliver tepat waktu",
  },
  {
    id: "cp6",
    campaign_id: "camp4",
    publisher_id: "p5",
    deliverable: "10 influencer posts",
    budget_allocation: 250000000,
    status: "setup",
  },
  {
    id: "cp7",
    campaign_id: "camp5",
    publisher_id: "p11",
    deliverable: "30 social posts",
    budget_allocation: 60000000,
    status: "running",
  },
]

// Performance Entries
export const performanceEntries: PerformanceEntry[] = [
  {
    id: "perf1",
    campaign_id: "camp1",
    date: "2024-07-08",
    downloads: 1245,
    clicks: 8760,
    cost_spent: 18500000,
    notes: "Hari yang bagus, CPC turun",
  },
  {
    id: "perf2",
    campaign_id: "camp1",
    date: "2024-07-07",
    downloads: 1089,
    clicks: 7230,
    cost_spent: 17200000,
  },
  {
    id: "perf3",
    campaign_id: "camp1",
    date: "2024-07-06",
    downloads: 1156,
    clicks: 7890,
    cost_spent: 16800000,
  },
  {
    id: "perf4",
    campaign_id: "camp2",
    date: "2024-07-08",
    leads: 320,
    clicks: 4500,
    cost_spent: 12500000,
    notes: "Lead quality perlu di QC",
  },
  {
    id: "perf5",
    campaign_id: "camp2",
    date: "2024-07-07",
    leads: 289,
    clicks: 4100,
    cost_spent: 11800000,
  },
  {
    id: "perf6",
    campaign_id: "camp3",
    date: "2024-07-08",
    clicks: 8900,
    cost_spent: 8500000,
    notes: "CRITICAL: Publisher utama tidak deliver",
  },
  {
    id: "perf7",
    campaign_id: "camp5",
    date: "2024-07-08",
    clicks: 2340,
    cost_spent: 2800000,
  },
]

// Invoices
export const invoices: Invoice[] = [
  {
    id: "inv1",
    client_id: "c1",
    campaign_id: "camp7",
    invoice_number: "INV-2024-006",
    amount: 320000000,
    invoice_date: "2024-07-01",
    due_date: "2024-07-15",
    status: "overdue",
    notes: "Sudah dikirim 5 Juli, belum ada konfirmasi",
  },
  {
    id: "inv2",
    client_id: "c2",
    campaign_id: "camp2",
    invoice_number: "INV-2024-007",
    amount: 150000000,
    invoice_date: "2024-07-05",
    due_date: "2024-07-20",
    status: "invoice_sent",
  },
  {
    id: "inv3",
    client_id: "c1",
    campaign_id: "camp1",
    invoice_number: "INV-2024-008",
    amount: 250000000,
    invoice_date: "2024-07-10",
    due_date: "2024-07-25",
    status: "waiting_payment",
    notes: "Progress payment 1",
  },
  {
    id: "inv4",
    client_id: "c6",
    campaign_id: "camp6",
    invoice_number: "INV-2024-005",
    amount: 500000000,
    invoice_date: "2024-07-01",
    due_date: "2024-07-15",
    status: "paid",
    paid_date: "2024-07-10",
  },
  {
    id: "inv5",
    client_id: "c5",
    invoice_number: "INV-2024-004",
    amount: 85000000,
    invoice_date: "2024-07-01",
    due_date: "2024-07-15",
    status: "paid",
    paid_date: "2024-07-08",
  },
  {
    id: "inv6",
    client_id: "c3",
    campaign_id: "camp3",
    invoice_number: "INV-2024-009",
    amount: 100000000,
    invoice_date: "2024-07-08",
    due_date: "2024-07-23",
    status: "not_invoiced",
    notes: "Invoice belum dibuat - campaign masih running",
  },
]

// SOPs
export const sops: SOP[] = [
  {
    id: "sop1",
    title: "Campaign Setup dari Brief",
    category: "Campaign Setup",
    role: "campaign_ops",
    estimated_time: "2-3 jam",
    content: `Panduan lengkap setup campaign dari brief client:

1. Baca brief dengan teliti
2. Identifikasi objective campaign
3. Konfirmasi KPI dan target dengan client
4. Set timeline campaign
5. Prepare tracking link
6. Setup UTM parameters
7. Select publishers/channels
8. Prepare publisher brief
9. Launch campaign
10. Monitor daily performance`,
    checklist: ["Brief received", "Objective confirmed", "KPI confirmed", "Timeline set", "Tracking link ready", "UTM prepared", "Publishers selected", "Brief distributed", "Campaign live"],
    video_url: "",
    templates: ["Publisher Brief Template", "Campaign Tracking Template"],
    updated_at: "2024-06-15T00:00:00Z",
  },
  {
    id: "sop2",
    title: "Setup Tracking Link & UTM",
    category: "Campaign Setup",
    role: "campaign_ops",
    estimated_time: "30 menit",
    content: `Langkah setup tracking link dan UTM:

1. Dapatkan landing page URL dari client
2. Buat tracking link menggunakan Bitly atau similar
3. Setup UTM parameters:
   - utm_source: platform/channel
   - utm_medium: tipo di media (cpc, content, etc)
   - utm_campaign: nama campaign
   - utm_content: variant (optional)
   - utm_term: keyword (optional)
4. Test semua links
5. Share ke team dan client`,
    checklist: ["Landing page URL received", "Tracking link created", "UTM parameters set", "All links tested", "Links shared to team"],
    video_url: "",
    templates: ["UTM Tracking Sheet"],
    updated_at: "2024-06-10T00:00:00Z",
  },
  {
    id: "sop3",
    title: "Publisher Coordination",
    category: "Publisher Coordination",
    role: "campaign_ops",
    estimated_time: "1-2 jam per publisher",
    content: `Workflow koordinasi dengan publisher:

1. Identifikasi publisher yang sesuai dengan target audience
2. Outreach via WhatsApp/Email
3. Negosiasi rate dan deliverable
4. Kirim brief dan creative materials
5. Confirm timeline
6. Monitor delivery
7. QC konten
8. Invoice dan payment follow up`,
    checklist: ["Publisher identified", "Outreach sent", "Rate negotiated", "Brief sent", "Timeline confirmed", "Content received", "QC passed", "Report delivered"],
    video_url: "",
    templates: ["Publisher Brief Template", "Publisher Tracking Sheet"],
    updated_at: "2024-05-20T00:00:00Z",
  },
  {
    id: "sop4",
    title: "Quality Control Leads",
    category: "Quality Control",
    role: "campaign_manager",
    estimated_time: "1-2 jam",
    content: `Prosedur Quality Control untuk leads:

1. Export leads dari system
2. Sampling 10% dari total leads
3. Cek kelengkapan data (nama, no HP, dll)
4. Verifikasi dengan random sampling call (minimal 10)
5. Hitung conversion rate
6. Identifikasi pattern leads tidak qualified
7. Report ke client jika ada issues
8. Optimize targeting jika perlu`,
    checklist: ["Leads exported", "10% sampled", "Data completeness checked", "Random call verification", "Conversion rate calculated", "Issues reported", "Optimization applied"],
    video_url: "",
    templates: ["Lead QC Report Template"],
    updated_at: "2024-06-05T00:00:00Z",
  },
  {
    id: "sop5",
    title: "Daily Client Update",
    category: "Client Reporting",
    role: "campaign_manager",
    estimated_time: "30 menit",
    content: `Template dan panduan daily update ke client:

1. Buka dashboard performance
2. Export yesterday's data
3. Generate key metrics:
   - Impressions/Reach
   - Clicks
   - Conversions
   - CTR, CPC, CPL
   - Spend
4. Bandingkan dengan target
5. Identifikasi highlights/issues
6. Buat summary narrative
7. Kirim via WhatsApp/Email
8. Simpan record`,
    checklist: ["Data exported", "Metrics generated", "Comparison done", "Issues identified", "Summary written", "Update sent", "Record saved"],
    templates: ["Daily Update Template"],
    updated_at: "2024-06-01T00:00:00Z",
  },
  {
    id: "sop6",
    title: "Campaign Report Generation",
    category: "Client Reporting",
    role: "campaign_manager",
    estimated_time: "3-4 jam",
    content: `Panduan membuat campaign report:

1. Kumpulkan semua performance data
2. Generate overall metrics
3. Breakdown by:
   - Channel/Platform
   - Publisher
   - Time period
   - Creative
4. Calculate ROI
5. Comparison vs KPI
6. Key learnings
7. Recommendations
8. Format report (PDF/PPT)
9. Internal review
10. Submit to client`,
    checklist: ["Data collected", "Overall metrics generated", "Breakdown analysis done", "ROI calculated", "KPI comparison done", "Learnings documented", "Recommendations written", "Report formatted", "Internal review done", "Submitted to client"],
    video_url: "",
    templates: ["Campaign Report Template"],
    updated_at: "2024-05-25T00:00:00Z",
  },
  {
    id: "sop7",
    title: "Invoice & Payment Follow Up",
    category: "Finance & Invoice",
    role: "finance",
    estimated_time: "15 menit per follow up",
    content: `Prosedur invoice dan payment follow up:

1. Generate invoice sesuai terms
2. Kirim invoice via email
3. Record di finance tracking
4. Set reminder 3 hari sebelum due date
5. Follow up 1 hari sebelum due
6. Follow up di hari due date
7. Follow up 3 hari after due
8. Escalate jika needed
9. Update payment status`,
    checklist: ["Invoice generated", "Invoice sent", "Recorded in tracker", "Reminder set", "Follow up day -3", "Follow up day 0", "Follow up day +3", "Escalated if needed", "Status updated"],
    templates: ["Invoice Template", "Finance Tracking Sheet"],
    updated_at: "2024-06-20T00:00:00Z",
  },
  {
    id: "sop8",
    title: "Influencer Campaign Setup",
    category: "Influencer Campaign",
    role: "campaign_ops",
    estimated_time: "4-6 jam",
    content: `Panduan setup influencer campaign:

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
11. Report generation`,
    checklist: ["Objective defined", "Influencer profile set", "List researched", "Outreach done", "Contract signed", "Brief prepared", "Guidelines sent", "Content approved", "Published", "Tracked", "Reported"],
    video_url: "",
    templates: ["Influencer Brief Template", "Influencer Contract Template"],
    updated_at: "2024-06-12T00:00:00Z",
  },
  {
    id: "sop9",
    title: "App Download Campaign",
    category: "App Download Campaign",
    role: "campaign_manager",
    estimated_time: "2-3 jam",
    content: `Panduan app download campaign:

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
12. Report to client`,
    checklist: ["App tracker setup", "Attribution configured", "Tracking link ready", "Ad accounts accessed", "Audience defined", "Creatives uploaded", "Events configured", "Install tested", "Campaign live", "Monitored", "Optimized", "Reported"],
    templates: ["App Campaign Tracking Template"],
    updated_at: "2024-06-18T00:00:00Z",
  },
  {
    id: "sop10",
    title: "Media Placement",
    category: "Media Placement",
    role: "campaign_ops",
    estimated_time: "3-4 jam",
    content: `Panduan media placement:

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
11. Report to client`,
    checklist: ["Media identified", "Media kit requested", "Rate negotiated", "Details defined", "Creative created", "Approved by media", "Scheduled", "Published", "Proof collected", "Invoiced", "Reported"],
    templates: ["Media Placement Tracking"],
    updated_at: "2024-06-08T00:00:00Z",
  },
]

// Client Updates
export const clientUpdates: ClientUpdate[] = [
  {
    id: "cu1",
    campaign_id: "camp1",
    date: "2024-07-08T09:00:00Z",
    update_type: "daily",
    message: "Hari ini: 1,245 downloads (target: 1,100). CPC turun 12% dari kemarin. Facebook performs best dengan CTR 3.2%. Rekomendasi: naikkan budget Facebook 20%.",
    sent_by: "u2",
    status: "sent",
    created_at: "2024-07-08T09:00:00Z",
  },
  {
    id: "cu2",
    campaign_id: "camp1",
    date: "2024-07-07T09:00:00Z",
    update_type: "daily",
    message: "Hari ini: 1,089 downloads. Total to date: 31,205 / 50,000 (62.4%). Progress on track.",
    sent_by: "u2",
    status: "sent",
    created_at: "2024-07-07T09:00:00Z",
  },
  {
    id: "cu3",
    campaign_id: "camp2",
    date: "2024-07-08T10:00:00Z",
    update_type: "alert",
    message: "ALERT: Quality leads dari Google Display perlu di QC. Ada indikasi 15% leads tidak respond saat di-follow up. Mohon konfirmasi apakah mau continue atau optimize targeting.",
    sent_by: "u3",
    status: "sent",
    created_at: "2024-07-08T10:00:00Z",
  },
  {
    id: "cu4",
    campaign_id: "camp3",
    date: "2024-07-08T08:00:00Z",
    update_type: "alert",
    message: "URGENT: Publisher utama tidak bisa deliver schedule. Mohon approval untuk redirect budget ke 3 publisher cadangan. Total reach akan tetap tercapai tapi dengan timeline berbeda.",
    sent_by: "u2",
    status: "sent",
    created_at: "2024-07-08T08:00:00Z",
  },
  {
    id: "cu5",
    campaign_id: "camp5",
    date: "2024-07-05T11:00:00Z",
    update_type: "weekly",
    message: "Weekly report: Total reach 45K, engagement 2.3K, click to profile 890. Best performing content: carousel education post. Rekomendasi untuk next week: focus on reels format.",
    sent_by: "u6",
    status: "sent",
    created_at: "2024-07-05T11:00:00Z",
  },
]

// Activity Logs
export const activityLogs: ActivityLog[] = [
  {
    id: "al1",
    entity_type: "campaign",
    entity_id: "camp3",
    action: "status_changed",
    description: "Campaign status changed to Problem",
    user_id: "u2",
    created_at: "2024-07-08T08:00:00Z",
  },
  {
    id: "al2",
    entity_type: "task",
    entity_id: "t1",
    action: "created",
    description: "Task 'Redirect budget ke publisher cadangan' created",
    user_id: "u2",
    created_at: "2024-07-08T08:05:00Z",
  },
  {
    id: "al3",
    entity_type: "campaign",
    entity_id: "camp2",
    action: "health_changed",
    description: "Campaign health changed to Yellow",
    user_id: "u3",
    created_at: "2024-07-07T15:30:00Z",
  },
  {
    id: "al4",
    entity_type: "invoice",
    entity_id: "inv1",
    action: "created",
    description: "Invoice INV-2024-006 created for Tunaiku Lead Gen Juni",
    user_id: "u4",
    created_at: "2024-07-01T10:00:00Z",
  },
  {
    id: "al5",
    entity_type: "performance",
    entity_id: "perf1",
    action: "updated",
    description: "Daily performance recorded: 1,245 downloads",
    user_id: "u2",
    created_at: "2024-07-08T23:59:00Z",
  },
  {
    id: "al6",
    entity_type: "campaign",
    entity_id: "camp4",
    action: "status_changed",
    description: "Campaign status changed to Setup",
    user_id: "u3",
    created_at: "2024-07-06T12:00:00Z",
  },
  {
    id: "al7",
    entity_type: "client_update",
    entity_id: "cu3",
    action: "sent",
    description: "Alert sent to Prudential regarding lead quality issue",
    user_id: "u3",
    created_at: "2024-07-08T10:00:00Z",
  },
  {
    id: "al8",
    entity_type: "task",
    entity_id: "t10",
    action: "completed",
    description: "Task 'Optimasi targeting Facebook Ads' marked as done",
    user_id: "u2",
    created_at: "2024-07-08T10:00:00Z",
  },
]

// Dashboard Stats
export const dashboardStats: DashboardStats = {
  activeCampaigns: 5,
  atRiskCampaigns: 2,
  tasksDueToday: 14,
  overdueInvoices: 3,
  outstandingPayment: 485000000,
  activeClients: 6,
  activePublishers: 9,
  leadsThisMonth: 12450,
}

// Helper functions
export function getCampaignsWithRelations() {
  return campaigns.map((campaign) => ({
    ...campaign,
    client: clients.find((c) => c.id === campaign.client_id),
    pic: users.find((u) => u.id === campaign.pic_id),
  }))
}

export function getTasksWithRelations() {
  return tasks.map((task) => ({
    ...task,
    campaign: campaigns.find((c) => c.id === task.campaign_id),
    owner: users.find((u) => u.id === task.owner_id),
    sop: task.sop_id ? sops.find((s) => s.id === task.sop_id) : undefined,
  }))
}

export function getChecklistsByCampaign(campaignId: string) {
  return campaignChecklists
    .filter((cl) => cl.campaign_id === campaignId)
    .map((cl) => ({
      ...cl,
      owner: users.find((u) => u.id === cl.owner_id),
      sop: cl.sop_id ? sops.find((s) => s.id === cl.sop_id) : undefined,
    }))
}

export function getInvoicesWithRelations() {
  return invoices.map((inv) => ({
    ...inv,
    client: clients.find((c) => c.id === inv.client_id),
    campaign: inv.campaign_id ? campaigns.find((c) => c.id === inv.campaign_id) : undefined,
  }))
}

export function getRecentActivity(limit = 10) {
  return activityLogs
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, limit)
    .map((log) => ({
      ...log,
      user: users.find((u) => u.id === log.user_id),
    }))
}
