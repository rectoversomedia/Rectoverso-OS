# Rectoverso OS

Internal Operating System for Rectoverso Growth Technology Company. Manage campaigns, clients, tasks, publishers, finance, SOPs, and AI-assisted operations.

![Rectoverso OS](https://via.placeholder.com/1200x600/07111F/06B6D4?text=Rectoverso+OS)

## Overview

Rectoverso OS is a comprehensive internal workflow-based platform designed to convert founder knowledge into repeatable workflows. The app answers: "What should each person do today, for which campaign, with what SOP, and what is the current status?"

## Features

- **Dashboard** - Command center with operational overview, KPIs, and AI-suggested actions
- **Campaigns** - Full campaign management with health tracking, checklists, and performance
- **Clients** - Client database with campaign history and financial tracking
- **Tasks** - Kanban-style task management with SOP linking
- **Publishers** - Publisher/partner database with quality scoring
- **Finance** - Invoice tracking, payment follow-ups, and cashflow management
- **SOP Library** - Standard Operating Procedures with step-by-step guides
- **AI Assistant** - Mock AI for generating updates, briefs, and risk analysis
- **Settings** - Team management, roles, and system configuration

## Tech Stack

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Database**: Supabase (PostgreSQL)
- **Icons**: Lucide React
- **Charts**: Recharts

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- (Optional) Supabase account for database

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd rectoverso-os
```

2. Install dependencies:
```bash
npm install
```

3. Copy environment variables:
```bash
cp .env.example .env.local
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Using Mock Data

The app works out-of-the-box with mock data. No Supabase configuration required for development/demo.

To use real data:
1. Create a Supabase project
2. Run the schema from `supabase/schema.sql`
3. Import seed data from `supabase/seed.sql`
4. Add your Supabase credentials to `.env.local`

## Project Structure

```
rectoverso-os/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (auth)/            # Auth pages
│   │   ├── dashboard/         # Dashboard page
│   │   ├── campaigns/         # Campaigns pages
│   │   ├── clients/          # Clients pages
│   │   ├── tasks/            # Tasks pages
│   │   ├── publishers/        # Publishers pages
│   │   ├── finance/          # Finance pages
│   │   ├── sop/              # SOP Library pages
│   │   ├── ai/               # AI Assistant page
│   │   └── settings/         # Settings page
│   ├── components/
│   │   ├── ui/               # shadcn/ui components
│   │   ├── layout/           # Layout components
│   │   └── dashboard/        # Dashboard-specific components
│   ├── lib/                   # Utilities
│   ├── types/                 # TypeScript types
│   └── data/                  # Mock data
├── supabase/
│   ├── schema.sql            # Database schema
│   └── seed.sql              # Seed data
└── public/                    # Static assets
```

## Database Schema

The database includes the following tables:
- `users` - Team members
- `clients` - Client companies
- `campaigns` - Marketing campaigns
- `tasks` - Task assignments
- `campaign_checklists` - Campaign workflow checklists
- `publishers` - Publisher/partner database
- `campaign_publishers` - Campaign-publisher assignments
- `performance_entries` - Daily performance data
- `invoices` - Financial invoices
- `sops` - Standard Operating Procedures
- `client_updates` - Client communication logs
- `activity_logs` - System activity tracking

## Design System

### Colors
- **Background**: #07111F (Deep Navy)
- **Primary**: #06B6D4 (Cyan)
- **Accent**: #0EA5E9 (Electric Blue)
- **Cards**: Slate gradient backgrounds

### Typography
- Font: Inter (system fallback)
- Dark navy theme with light text

### Components
- Cards with subtle gradients
- Status badges with color coding
- Progress bars with cyan gradient
- Kanban boards for task management

## Campaign Workflow

1. **Preparation** → Brief received, objective confirmed
2. **Setup** → Tracking link, publishers selected
3. **Execution** → Campaign live
4. **Monitoring** → Daily checks, quality control
5. **Reporting** → Final report generation
6. **Finance** → Invoice creation, payment follow-up

## SOP Library

Every task and checklist item can link to an SOP, ensuring:
- Consistent processes across team members
- Reduced dependency on founder knowledge
- Training materials for new team members

## AI Assistant (MVP)

Mock AI functionality for:
- Generating client updates
- Risk analysis
- Follow-up message generation
- Campaign checklist generation

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Connect to Vercel
3. Deploy automatically

### Manual Build

```bash
npm run build
npm start
```

## Contributing

1. Create a feature branch
2. Make changes
3. Submit a pull request

## License

Private - Rectoverso Growth Technology Company

## Support

For internal use only. Contact the Rectoverso team for access.

---

Built with ❤️ for the Rectoverso team
