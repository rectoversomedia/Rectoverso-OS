# Rectoverso OS

<div align="center">

![Rectoverso OS Logo](https://img.shields.io/badge/Rectoverso-OS-06B6D4?style=for-the-badge&logo=rectoverso&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white)

**Internal Operating System untuk Rectoverso Growth Technology Company**

_Mengubah pengetahuan founder menjadi workflow yang dapat diulang oleh seluruh tim_

</div>

---

## 📋 Overview

Rectoverso OS adalah platform internal berbasis workflow yang dirancang untuk menjawab pertanyaan:

> **"Apa yang harus dilakukan setiap orang hari ini, untuk campaign apa, dengan SOP apa, dan apa statusnya saat ini?"**

### Masalah yang Diselesaikan

- ❌ Terlalu banyak workflow bergantung pada satu founder
- ❌ Team harus bertanya berulang kali ke founder
- ❌ Tidak ada visibility terhadap status campaign
- ❌ SOP tidak terdokumentasi
- ✅ **Rectoverso OS menjadi sumber kebenaran untuk seluruh tim**

---

## ✨ Features

### Core Modules

| Module | Description |
|--------|-------------|
| **Dashboard** | Command center dengan overview operasional, KPI, dan AI-suggested actions |
| **Campaigns** | Manajemen campaign lengkap dengan health tracking, checklist, dan performance |
| **Clients** | Database client dengan campaign history dan financial tracking |
| **Tasks** | Task management dengan Kanban board dan SOP linking |
| **Team Calendar** | View deadline dan schedule task untuk seluruh tim |
| **Publishers** | Database publisher dengan quality scoring |
| **Finance** | Invoice tracking, payment follow-up, dan cashflow management |
| **SOP Library** | Standard Operating Procedures dengan step-by-step guides |
| **AI Assistant** | Mock AI untuk generate updates, briefs, dan risk analysis |
| **Settings** | Team management, roles, dan konfigurasi sistem |

### Key Features

- ✅ **Campaign Checklist** - Otomatis generate checklist berdasarkan campaign type
- ✅ **SOP Linking** - Setiap task/checklist bisa link ke SOP
- ✅ **Team Workload View** - Lihat siapa mengerjakan apa
- ✅ **Notification System** - Real-time notifications
- ✅ **Finance Alerts** - Overdue invoices dan payment tracking
- ✅ **Calendar View** - Deadline tracking dengan visual calendar

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 16** | React Framework with App Router |
| **TypeScript** | Type Safety |
| **Tailwind CSS** | Styling |
| **shadcn/ui** | UI Components (Radix UI) |
| **Supabase** | Database & Auth |
| **Lucide React** | Icons |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm atau yarn
- (Optional) Supabase account untuk database

### Installation

```bash
# Clone repository
git clone https://github.com/rectoversomedia/Rectoverso-OS.git
cd Rectoverso-OS

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

### Using Mock Data

App ini **bisa langsung digunakan** dengan mock data. Tidak perlu konfigurasi Supabase untuk development/demo.

Untuk menggunakan data real:
1. Buat Supabase project
2. Run schema dari `supabase/schema.sql`
3. Import seed data dari `supabase/seed.sql`
4. Tambahkan credentials ke `.env.local`

---

## 📁 Project Structure

```
rectoverso-os/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (auth)/            # Auth pages
│   │   ├── dashboard/         # Dashboard page
│   │   ├── campaigns/         # Campaign pages
│   │   │   ├── [id]/          # Campaign detail
│   │   │   └── new/           # Create campaign
│   │   ├── clients/           # Client pages
│   │   ├── tasks/             # Task management
│   │   ├── calendar/           # Team calendar
│   │   ├── publishers/         # Publisher database
│   │   ├── finance/            # Finance tracking
│   │   ├── sop/               # SOP Library
│   │   │   └── [id]/          # SOP detail
│   │   ├── ai/                 # AI Assistant
│   │   └── settings/           # Settings
│   ├── components/
│   │   ├── ui/                 # shadcn/ui components
│   │   └── layout/             # Layout components
│   ├── hooks/                  # React hooks
│   ├── lib/                    # Utilities
│   ├── types/                  # TypeScript types
│   └── data/                   # Mock data
├── supabase/
│   ├── schema.sql              # Database schema
│   └── seed.sql                # Seed data
└── public/                      # Static assets
```

---

## 🗄️ Database Schema

### Tables

| Table | Description |
|--------|-------------|
| `users` | Team members |
| `clients` | Client companies |
| `campaigns` | Marketing campaigns |
| `tasks` | Task assignments |
| `campaign_checklists` | Campaign workflow checklists |
| `publishers` | Publisher/partner database |
| `campaign_publishers` | Campaign-publisher assignments |
| `performance_entries` | Daily performance data |
| `invoices` | Financial invoices |
| `sops` | Standard Operating Procedures |
| `client_updates` | Client communication logs |
| `activity_logs` | System activity tracking |

### Supabase Setup

```bash
# 1. Create Supabase project
# 2. Get your project URL and anon key
# 3. Add to .env.local:
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# 4. Run schema in Supabase SQL Editor
# Copy contents from supabase/schema.sql

# 5. Import seed data
# Copy contents from supabase/seed.sql
```

---

## 🎨 Design System

### Colors

| Color | Hex | Usage |
|-------|-----|-------|
| Primary | `#06B6D4` | Buttons, links, highlights |
| Accent | `#0EA5E9` | Secondary accents |
| Background | `#F8FAFC` | Content area background |
| Sidebar | `#0A1628` | Dark navy sidebar |
| Card | `#FFFFFF` | Card backgrounds |

### Typography

- **Font**: Inter (with system fallback)
- **Heading**: Bold, slate-900
- **Body**: Regular, slate-700
- **Muted**: slate-500

### Components

- Cards dengan subtle shadow
- Status badges dengan color coding
- Progress bars dengan gradient
- Kanban boards untuk task management

---

## 📱 Pages

### Dashboard
- Greeting message dengan nama user
- Stats cards (Active Campaigns, Tasks, Outstanding Payment, Leads)
- Campaign Health table
- Today's Tasks
- Team Workload
- Finance Alerts
- Recent Activity
- Quick Actions

### Campaigns
- Campaign list dengan filters
- Status tabs (Draft, Setup, Running, Problem, etc.)
- Health indicators
- Campaign detail dengan tabs:
  - Overview
  - Checklist
  - Tasks
  - Publishers
  - Performance
  - Client Updates
  - Finance
  - Activity Log

### Tasks
- Kanban board view
- Table view
- Filters (Campaign, Owner, Priority, Status)
- SOP linking
- Comment counts

### Team Calendar
- Month view dengan task visualization
- List view untuk upcoming deadlines
- Overdue indicators
- Priority color coding

### Finance
- Invoice overview
- Outstanding payment tracking
- Overdue alerts
- AI-generated follow-up messages
- Payment status tracking

### SOP Library
- Categorized SOPs
- Step-by-step guides
- Checklists
- Template links
- Video placeholders

### AI Assistant
- Chat interface
- Suggested prompts
- Context selector
- Mock responses untuk MVP

---

## 🔄 Campaign Workflow

```
Preparation → Setup → Execution → Monitoring → Reporting → Finance
    ↓            ↓          ↓           ↓            ↓          ↓
Brief received  Tracking   Campaign    Daily        Final      Invoice
Objective      link       live       QC           report     created
KPI confirmed  Publishers  Publishers  Client       Client     Payment
                          selected    updates      approval   followed
```

---

## 🤖 AI Assistant (MVP)

Mock AI functionality untuk:
- Generate client updates
- Risk analysis
- Follow-up message generation
- Campaign checklist generation

**Note**: Untuk production, integrate dengan OpenAI atau Claude API.

---

## 🚢 Deployment

### Vercel (Recommended)

```bash
# 1. Push code ke GitHub
git push origin main

# 2. Connect repository ke Vercel
# 3. Add environment variables:
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY

# 4. Deploy!
```

### Manual Build

```bash
npm run build
npm start
```

---

## 📝 Documentation

- [Database Schema](supabase/schema.sql)
- [Seed Data](supabase/seed.sql)
- [Environment Variables](.env.example)

---

## 🤝 Contributing

1. Create feature branch
2. Make changes
3. Submit pull request

---

## 📄 License

Private - Rectoverso Growth Technology Company

---

## 👥 Team

- **Founder**: Reza Mahendra
- **Campaign Managers**: Dewi Lestari
- **Campaign Operations**: Ahmad Fauzi
- **Finance**: Sari Wulandari
- **Sales**: Budi Santoso
- **Intern**: Rina Putri

---

<div align="center">

**Built with ❤️ for the Rectoverso team**

_Transforming founder knowledge into repeatable workflows_

</div>
