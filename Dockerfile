# ================================
# Rectoverso OS - Production Dockerfile
# Multi-stage build for optimized production image
# ================================

# ---- Dependencies Stage ----
FROM node:20-alpine AS deps
LABEL maintainer="Rectoverso Tech Team"
LABEL org.opencontainers.image.title="Rectoverso OS"
LABEL org.opencontainers.image.description="100% Production Ready Internal Operating System"

# Install dependencies for native modules
RUN apk add --no-cache \
    libc6-compat \
    python3 \
    make \
    g++ \
    curl \
    ca-certificates \
    openssl

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml* ./

# Install dependencies using pnpm
RUN corepack enable && corepack prepare pnpm@9.15.4 --activate
RUN pnpm install --frozen-lockfile --prod=false

# ---- Builder Stage ----
FROM deps AS builder

WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set environment variables for build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV NEXT_PUBLIC_APP_VERSION=$npm_package_version

# Build the application
RUN pnpm build

# ---- Runner Stage ----
FROM node:20-alpine AS runner

LABEL maintainer="Rectoverso Tech Team"

# Set environment variables
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Install production dependencies
RUN apk upgrade --no-cache && \
    apk add dumb-init ca-certificates tzdata

# Set working directory
WORKDIR /app

# Copy built application
COPY --from=builder /app/public ./public

# Set permissions for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Copy built Next.js output
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

# Use dumb-init to handle PID 1 responsibilities
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["node", "server.js"]
