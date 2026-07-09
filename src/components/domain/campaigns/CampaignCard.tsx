/**
 * Rectoverso OS - Campaign Card Component
 * Domain-specific campaign display card
 */

'use client'

import { memo } from 'react'
import Link from 'next/link'
import {
  Calendar,
  Users,
  TrendingUp,
  AlertTriangle,
  MoreHorizontal,
  ExternalLink,
  Clock,
} from 'lucide-react'
import { format, formatDistanceToNow, isPast, parseISO } from 'date-fns'
import { id } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

// ============================================
// Types
// ============================================

export interface CampaignCardProps {
  campaign: {
    id: string
    name: string
    type: string
    status: string
    health: 'green' | 'yellow' | 'red'
    client?: { id: string; name: string; logo_url?: string | null }
    pic?: { id: string; name: string; avatar_url?: string | null }
    start_date?: string | null
    end_date?: string | null
    budget?: number | null
    created_at: string
  }
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
  onViewDetails?: (id: string) => void
  showActions?: boolean
  showClient?: boolean
  showPIC?: boolean
  compact?: boolean
  className?: string
}

// ============================================
// Status Configuration
// ============================================

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  draft: { label: 'Draft', color: 'bg-slate-100 text-slate-700' },
  waiting_brief: { label: 'Menunggu Brief', color: 'bg-amber-100 text-amber-700' },
  setup: { label: 'Setup', color: 'bg-blue-100 text-blue-700' },
  running: { label: 'Berjalan', color: 'bg-green-100 text-green-700' },
  reporting: { label: 'Reporting', color: 'bg-purple-100 text-purple-700' },
  completed: { label: 'Selesai', color: 'bg-emerald-100 text-emerald-700' },
  paused: { label: 'Dijeda', color: 'bg-orange-100 text-orange-700' },
  problem: { label: 'Masalah', color: 'bg-red-100 text-red-700' },
}

const TYPE_CONFIG: Record<string, { label: string; icon: string }> = {
  lead_generation: { label: 'Lead Generation', icon: '🎯' },
  app_download: { label: 'App Download', icon: '📱' },
  registration: { label: 'Registration', icon: '📝' },
  vcbl: { label: 'VCBL', icon: '📺' },
  influencer_campaign: { label: 'Influencer', icon: '🌟' },
  publisher_distribution: { label: 'Publisher', icon: '📰' },
  media_placement: { label: 'Media Placement', icon: '🖥️' },
  performance_campaign: { label: 'Performance', icon: '📈' },
  social_amplification: { label: 'Social', icon: '📣' },
}

const HEALTH_CONFIG: Record<string, { label: string; color: string; icon: 'check' | 'alert' | 'x' }> = {
  green: { label: 'Sehat', color: 'text-green-600', icon: 'check' },
  yellow: { label: 'Waspada', color: 'text-amber-600', icon: 'alert' },
  red: { label: 'Kritis', color: 'text-red-600', icon: 'x' },
}

// ============================================
// Component
// ============================================

export const CampaignCard = memo(function CampaignCard({
  campaign,
  onEdit,
  onDelete,
  onViewDetails,
  showActions = true,
  showClient = true,
  showPIC = true,
  compact = false,
  className,
}: CampaignCardProps) {
  const statusConfig = STATUS_CONFIG[campaign.status] ?? { label: campaign.status, color: 'bg-gray-100 text-gray-700' }
  const typeConfig = TYPE_CONFIG[campaign.type] ?? { label: campaign.type, icon: '📋' }
  const healthConfig = HEALTH_CONFIG[campaign.health]

  const startDate = campaign.start_date ? parseISO(campaign.start_date) : null
  const endDate = campaign.end_date ? parseISO(campaign.end_date) : null
  const isOverdue = endDate ? isPast(endDate) && campaign.status === 'running' : false

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  if (compact) {
    return (
      <Link href={`/campaigns/${campaign.id}`}>
        <Card className={cn(
          'transition-all duration-200 hover:shadow-md hover:border-cyan-200',
          campaign.health === 'red' && 'border-red-200',
          campaign.health === 'yellow' && 'border-amber-200',
          className
        )}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-xl">{typeConfig.icon}</span>
                <div className="min-w-0">
                  <h3 className="font-medium text-sm truncate">{campaign.name}</h3>
                  {showClient && campaign.client && (
                    <p className="text-xs text-muted-foreground truncate">
                      {campaign.client.name}
                    </p>
                  )}
                </div>
              </div>
              <Badge variant="secondary" className={statusConfig.color}>
                {statusConfig.label}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </Link>
    )
  }

  return (
    <Card className={cn(
      'transition-all duration-200 hover:shadow-lg hover:border-cyan-200',
      campaign.health === 'red' && 'border-red-200',
      campaign.health === 'yellow' && 'border-amber-200',
      className
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">{typeConfig.icon}</span>
              <h3 className="font-semibold text-base truncate">{campaign.name}</h3>
            </div>
            {showClient && campaign.client && (
              <p className="text-sm text-muted-foreground truncate">
                {campaign.client.name}
              </p>
            )}
          </div>

          {showActions && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onViewDetails?.(campaign.id)}>
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Lihat Detail
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit?.(campaign.id)}>
                  Edit Campaign
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-600 focus:text-red-600"
                  onClick={() => onDelete?.(campaign.id)}
                >
                  Hapus Campaign
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        <div className="flex items-center gap-2 mt-3">
          <Badge variant="secondary" className={statusConfig.color}>
            {statusConfig.label}
          </Badge>
          <Badge variant="outline" className={cn('gap-1', healthConfig.color)}>
            {healthConfig.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Dates */}
        {(startDate || endDate) && (
          <div className="flex items-center gap-4 text-sm">
            {startDate && (
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                <span>
                  {format(startDate, 'dd MMM', { locale: id })}
                </span>
              </div>
            )}
            {endDate && (
              <div className={cn(
                'flex items-center gap-1.5',
                isOverdue && 'text-red-600'
              )}>
                <Clock className={cn('h-3.5 w-3.5', isOverdue && 'animate-pulse')} />
                <span className={isOverdue ? 'font-medium' : ''}>
                  {isOverdue ? 'Overdue! ' : ''}
                  {format(endDate, 'dd MMM yyyy', { locale: id })}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Budget */}
        {campaign.budget && (
          <div className="flex items-center gap-1.5 text-sm">
            <TrendingUp className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-muted-foreground">Budget:</span>
            <span className="font-medium">{formatCurrency(campaign.budget)}</span>
          </div>
        )}

        {/* PIC */}
        {showPIC && campaign.pic && (
          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={campaign.pic.avatar_url ?? undefined} />
                <AvatarFallback className="text-xs">
                  {campaign.pic.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm">{campaign.pic.name}</span>
            </div>
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(parseISO(campaign.created_at), { addSuffix: true, locale: id })}
            </span>
          </div>
        )}

        {/* Problem Warning */}
        {campaign.status === 'problem' && (
          <div className="flex items-center gap-2 p-2 rounded-lg bg-red-50 text-red-700 text-sm">
            <AlertTriangle className="h-4 w-4 flex-shrink-0" />
            <span>Campaign mengalami masalah. Segera cek detail.</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 pt-2">
          <Link href={`/campaigns/${campaign.id}`} className="flex-1">
            <Button variant="outline" className="w-full">
              Lihat Detail
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
})
