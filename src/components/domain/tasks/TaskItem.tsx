/**
 * Rectoverso OS - Task Item Component
 * Domain-specific task display component
 */

'use client'

import { memo } from 'react'
import Link from 'next/link'
import {
  CheckCircle2,
  Circle,
  Clock,
  AlertCircle,
  GripVertical,
  Calendar,
  MessageSquare,
  MoreHorizontal,
  Trash2,
  Edit,
  User as UserIcon,
} from 'lucide-react'
import { format, formatDistanceToNow, isPast, parseISO } from 'date-fns'
import { id } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { Task, TaskStatus, TaskPriority } from '@/types/database'

// ============================================
// Types
// ============================================

export interface TaskItemProps {
  task: Task & {
    owner?: { id: string; name: string; avatar_url?: string | null } | null
    campaign?: { id: string; name: string } | null
  }
  onStatusChange?: (id: string, status: TaskStatus) => void
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
  onClick?: (id: string) => void
  showCampaign?: boolean
  showOwner?: boolean
  draggable?: boolean
  isDragging?: boolean
  compact?: boolean
  className?: string
}

// ============================================
// Status Configuration
// ============================================

const STATUS_CONFIG: Record<TaskStatus, { label: string; icon: typeof Circle; color: string; bgColor: string }> = {
  todo: { label: 'To Do', icon: Circle, color: 'text-slate-400', bgColor: 'bg-slate-100' },
  in_progress: { label: 'In Progress', icon: Clock, color: 'text-blue-500', bgColor: 'bg-blue-100' },
  review: { label: 'Review', icon: AlertCircle, color: 'text-amber-500', bgColor: 'bg-amber-100' },
  done: { label: 'Done', icon: CheckCircle2, color: 'text-green-500', bgColor: 'bg-green-100' },
  blocked: { label: 'Blocked', icon: AlertCircle, color: 'text-red-500', bgColor: 'bg-red-100' },
}

const PRIORITY_CONFIG: Record<TaskPriority, { label: string; color: string }> = {
  low: { label: 'Rendah', color: 'bg-slate-100 text-slate-600' },
  medium: { label: 'Sedang', color: 'bg-blue-100 text-blue-600' },
  high: { label: 'Tinggi', color: 'bg-orange-100 text-orange-600' },
  urgent: { label: 'Urgent', color: 'bg-red-100 text-red-600' },
}

// ============================================
// Component
// ============================================

export const TaskItem = memo(function TaskItem({
  task,
  onStatusChange,
  onEdit,
  onDelete,
  onClick,
  showCampaign = true,
  showOwner = true,
  draggable = false,
  isDragging = false,
  compact = false,
  className,
}: TaskItemProps) {
  const statusConfig = STATUS_CONFIG[task.status]
  const priorityConfig = PRIORITY_CONFIG[task.priority]
  const dueDate = task.due_date ? parseISO(task.due_date) : null
  const isOverdue = dueDate ? isPast(dueDate) && task.status !== 'done' : false

  const handleStatusToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!onStatusChange) return

    // Toggle between todo and done
    const newStatus: TaskStatus = task.status === 'done' ? 'todo' : 'done'
    onStatusChange(task.id, newStatus)
  }

  if (compact) {
    return (
      <div
        className={cn(
          'flex items-center gap-2 p-2 rounded-lg transition-all',
          isDragging && 'opacity-50 shadow-lg',
          className
        )}
        onClick={() => onClick?.(task.id)}
      >
        {draggable && (
          <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
        )}

        <button
          onClick={handleStatusToggle}
          className={cn('flex-shrink-0', statusConfig.color)}
        >
          <statusConfig.icon className="h-4 w-4" />
        </button>

        <span className={cn(
          'flex-1 text-sm truncate',
          task.status === 'done' && 'line-through text-muted-foreground'
        )}>
          {task.title}
        </span>

        {dueDate && (
          <span className={cn(
            'text-xs',
            isOverdue ? 'text-red-500 font-medium' : 'text-muted-foreground'
          )}>
            {format(dueDate, 'dd MMM', { locale: id })}
          </span>
        )}
      </div>
    )
  }

  return (
    <div
      className={cn(
        'group bg-card border rounded-lg p-4 transition-all duration-200',
        'hover:shadow-md hover:border-cyan-200',
        task.status === 'blocked' && 'border-red-200 bg-red-50/30',
        task.status === 'done' && 'opacity-75',
        isDragging && 'shadow-lg ring-2 ring-primary',
        draggable && 'cursor-grab active:cursor-grabbing',
        className
      )}
      onClick={() => onClick?.(task.id)}
    >
      <div className="flex items-start gap-3">
        {/* Drag Handle & Status */}
        <div className="flex flex-col items-center gap-2">
          {draggable && (
            <GripVertical className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity cursor-grab" />
          )}
          <button
            onClick={handleStatusToggle}
            className={cn(
              'flex-shrink-0 transition-colors',
              statusConfig.color,
              'hover:scale-110'
            )}
            title={`Click to ${task.status === 'done' ? 'reopen' : 'complete'}`}
          >
            <statusConfig.icon className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h4 className={cn(
                'font-medium text-sm leading-snug',
                task.status === 'done' && 'line-through text-muted-foreground'
              )}>
                {task.title}
              </h4>

              {task.description && (
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {task.description}
                </p>
              )}
            </div>

            {/* Actions */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit?.(task.id)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-600 focus:text-red-600"
                  onClick={() => onDelete?.(task.id)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Hapus
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-2 mt-3">
            {/* Priority */}
            <Badge variant="secondary" className={cn('text-xs', priorityConfig.color)}>
              {priorityConfig.label}
            </Badge>

            {/* Campaign */}
            {showCampaign && task.campaign && (
              <Badge variant="outline" className="text-xs">
                {task.campaign.name}
              </Badge>
            )}

            {/* Due Date */}
            {dueDate && (
              <span className={cn(
                'flex items-center gap-1 text-xs',
                isOverdue ? 'text-red-500 font-medium' : 'text-muted-foreground'
              )}>
                <Calendar className="h-3 w-3" />
                {isOverdue ? 'Overdue: ' : ''}
                {format(dueDate, 'dd MMM yyyy', { locale: id })}
              </span>
            )}

            {/* Time ago */}
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(parseISO(task.created_at), { addSuffix: true, locale: id })}
            </span>
          </div>

          {/* Footer */}
          {(showOwner && task.owner) && (
            <div className="flex items-center justify-between mt-3 pt-3 border-t">
              <div className="flex items-center gap-2">
                <Avatar className="h-5 w-5">
                  <AvatarImage src={task.owner.avatar_url ?? undefined} />
                  <AvatarFallback className="text-[10px]">
                    {task.owner.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs">{task.owner.name}</span>
              </div>

              <Link
                href={`/tasks/${task.id}`}
                className="text-xs text-muted-foreground hover:text-primary transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                Detail →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
})

// ============================================
// Task Card Variant
// ============================================

export interface TaskCardProps extends TaskItemProps {
  onAssign?: (id: string) => void
}

export const TaskCard = memo(function TaskCard(props: TaskCardProps) {
  return (
    <TaskItem {...props} />
  )
})
