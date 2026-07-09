# Rectoverso OS - Deployment Runbook

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Development](#local-development)
3. [Deployment](#deployment)
4. [Database Operations](#database-operations)
5. [Monitoring & Alerts](#monitoring--alerts)
6. [Troubleshooting](#troubleshooting)
7. [Rollback Procedures](#rollback-procedures)

---

## Prerequisites

### Required Tools

- Node.js 20+
- pnpm 9+
- Docker Desktop
- Git
- Supabase CLI (optional)

### Environment Variables

Copy `.env.example` to `.env.local` and fill in the values:

```bash
cp .env.example .env.local
```

Required variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# App
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_APP_NAME="Rectoverso OS"

# Auth
AUTH_SECRET=generate-with-openssl-rand-base64-32

# Optional
SENTRY_DSN=https://...
NEXT_PUBLIC_POSTHOG_KEY=phc_...
OPENAI_API_KEY=sk-...
```

---

## Local Development

### Quick Start

```bash
# Clone repository
git clone https://github.com/rectoversomedia/Rectoverso-OS.git
cd Rectoverso-OS

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

### With Docker (Full Stack)

```bash
# Start all services (PostgreSQL, Redis, App)
docker-compose --profile dev up -d

# View logs
docker-compose logs -f app
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm typecheck` | Run TypeScript check |
| `pnpm test` | Run unit tests |
| `pnpm test:e2e` | Run E2E tests |
| `pnpm db:migrate` | Run database migrations |
| `pnpm db:seed` | Seed database |
| `pnpm db:studio` | Open Drizzle Studio |

---

## Deployment

### Vercel (Recommended)

#### 1. Connect Repository

1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Configure environment variables in Vercel dashboard

#### 2. Set Environment Variables

In Vercel dashboard → Settings → Environment Variables:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_POSTHOG_KEY=phc_...
SENTRY_DSN=https://...
```

#### 3. Deploy

```bash
# Push to main branch triggers deployment
git push origin main

# Or manually deploy
vercel --prod
```

### Docker (Self-Hosted)

#### 1. Build Image

```bash
# Build production image
docker build -t rectoverso-os:latest -f Dockerfile .

# Or use docker-compose
docker-compose -f docker-compose.prod.yml build
```

#### 2. Run Container

```bash
# Run container
docker run -d \
  --name rectoverso-os \
  -p 3000:3000 \
  -e NEXT_PUBLIC_SUPABASE_URL=... \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY=... \
  -e SUPABASE_SERVICE_ROLE_KEY=... \
  rectoverso-os:latest

# Or use docker-compose
docker-compose --profile production up -d
```

#### 3. Setup Nginx (Production)

```bash
# Copy nginx config
cp docker/nginx.conf /etc/nginx/nginx.conf

# Test configuration
nginx -t

# Reload nginx
nginx -s reload
```

### AWS (ECS)

See [AWS deployment guide](./guides/aws-deployment.md) for detailed instructions.

---

## Database Operations

### Run Migrations

```bash
# Using Drizzle
pnpm db:push

# Or apply SQL directly
psql $DATABASE_URL < supabase/schema.sql
```

### Seed Database

```bash
pnpm db:seed
```

### Backup Database

```bash
# PostgreSQL backup
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d).sql

# With compression
pg_dump $DATABASE_URL | gzip > backup-$(date +%Y%m%d).sql.gz
```

### Restore Database

```bash
# Restore from backup
psql $DATABASE_URL < backup-20240101.sql

# With decompression
gunzip < backup-20240101.sql.gz | psql $DATABASE_URL
```

### Database Schema Updates

```bash
# Generate migration from schema changes
pnpm db:generate

# Push changes (development)
pnpm db:push

# For production, create migration file:
# supabase/migrations/YYYYMMDDHHMMSS_description.sql
```

---

## Monitoring & Alerts

### Health Check

```bash
curl https://your-domain.com/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "version": "1.0.0"
}
```

### View Logs

#### Docker

```bash
# View all logs
docker-compose logs -f

# View specific service
docker-compose logs -f app
docker-compose logs -f db
```

#### Vercel

View logs in Vercel dashboard or CLI:

```bash
vercel logs your-deployment-url
```

### Metrics

Key metrics to monitor:

| Metric | Warning | Critical |
|--------|---------|----------|
| Response Time | > 500ms | > 1000ms |
| Error Rate | > 1% | > 5% |
| CPU Usage | > 70% | > 90% |
| Memory Usage | > 80% | > 95% |
| Disk Usage | > 80% | > 95% |

### Alert Channels

Configure alerts in:

- **Sentry**: Error tracking and alerts
- **PostHog**: User analytics and product metrics
- **Vercel Analytics**: Performance monitoring
- **UptimeRobot**: Uptime monitoring

---

## Troubleshooting

### Common Issues

#### 1. "Module not found" errors

```bash
# Clear node_modules and reinstall
rm -rf node_modules
pnpm install

# Clear Next.js cache
rm -rf .next
pnpm build
```

#### 2. Database connection errors

Check environment variables:
```bash
echo $DATABASE_URL
```

Test connection:
```bash
psql $DATABASE_URL -c "SELECT 1"
```

#### 3. Auth issues

Clear browser cookies and localStorage, then login again.

Check Supabase configuration:
```bash
# Verify URL and anon key match
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY
```

#### 4. Build failures

```bash
# TypeScript errors
pnpm typecheck

# ESLint errors
pnpm lint

# Clear cache and rebuild
rm -rf .next node_modules
pnpm install
pnpm build
```

#### 5. Docker issues

```bash
# Rebuild image
docker-compose build --no-cache

# Remove volumes and restart
docker-compose down -v
docker-compose up -d

# View container logs
docker-compose logs -f app
```

### Performance Issues

```bash
# Analyze bundle size
pnpm build:analyze

# Check database queries
# Enable query logging in Supabase

# Check Redis cache
redis-cli INFO stats
```

---

## Rollback Procedures

### Vercel

1. Go to Vercel Dashboard → Deployments
2. Find the last working deployment
3. Click "..." menu → "Promote to Production"

### Docker

```bash
# Find previous image tag
docker images rectoverso-os

# Rollback to previous version
docker stop rectoverso-os
docker rm rectoverso-os
docker run -d \
  --name rectoverso-os \
  -p 3000:3000 \
  rectoverso-os:previous-tag

# Or use docker-compose
git checkout previous-commit
docker-compose up -d
```

### Database Rollback

```bash
# Restore from backup
psql $DATABASE_URL < backup-YYYYMMDD.sql
```

### Rollback Checklist

- [ ] Verify application is running
- [ ] Check health endpoint
- [ ] Verify critical features work
- [ ] Check error rates
- [ ] Notify team of rollback
- [ ] Document incident

---

## Emergency Contacts

| Role | Contact |
|------|---------|
| Tech Lead | tech-lead@rectoverso.com |
| On-call | oncall@rectoverso.com |
| Supabase Support | support@supabase.io |
| Vercel Support | support@vercel.com |

---

## Documentation

- [API Documentation](../api/openapi.yaml)
- [Architecture](../architecture/)
- [Contributing Guide](../guides/CONTRIBUTING.md)
- [User Guide](../guides/user-guide.md)
