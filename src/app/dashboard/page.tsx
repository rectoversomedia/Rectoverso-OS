"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Calendar,
  CheckCircle,
  AlertTriangle,
  Clock,
  DollarSign,
  TrendingUp,
  Users,
  Zap,
  Activity,
  ChevronRight,
  ArrowRight,
  Filter,
  Plus,
  MoreHorizontal,
  Eye,
  EyeOff,
  Bell,
  FileText,
  MessageSquare,
  Briefcase,
  User,
  Building2,
  Target,
  AlertCircle,
  CheckSquare,
  CalendarDays,
  Globe,
  Video,
  Phone,
  Mail,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs as TabsPrimitive } from "@/components/ui/tabs"

// Types
interface Campaign {
  id: string
  name: string
  client_name: string
  status: "draft" | "waiting_brief" | "setup" | "running" | "reporting" | "completed" | "paused" | "problem"
  health_status: "green" | "yellow" | "red"
  kpi_type: string
  kpi_target: number
  kpi_current: number
  budget: number
  start_date: string
  end_date: string
  pic_name: string
  payment_status: string
  current_phase: string
  next_action: string
  next_action_due: string
  open_tasks: number
  open_issues: number
}

interface Task {
  id: string
  title: string
  description: string
  status: "todo" | "in_progress" | "review" | "done" | "blocked"
  priority: "low" | "medium" | "high" | "urgent"
  due_date: string
  due_time: string
  estimated_hours: number
  campaign_name: string
  campaign_id: string
  client_name: string
  owner_name: string
  owner_id: string
  sop_title: string
  sop_id: string
}

interface Schedule {
  id: string
  title: string
  description: string
  type: string
  start_datetime: string
  end_datetime: string
  location_type: "online" | "offline" | "hybrid"
  location: string
  meeting_link: string
  campaign_name: string
  color: string
  is_recurring: boolean
  created_by_name: string
}

interface Issue {
  id: string
  title: string
  description: string
  severity: "low" | "medium" | "high" | "critical"
  status: "open" | "in_progress" | "waiting_external" | "resolved" | "closed"
  due_date: string
  campaign_name: string
  assigned_to_name: string
  created_at: string
}

interface TeamMember {
  id: string
  full_name: string
  role: string
  email: string
  total_tasks: number
  todo_tasks: number
  in_progress_tasks: number
  urgent_tasks: number
  active_campaigns: number
}

// Mock data - Replace with Supabase queries
const mockCampaigns: Campaign[] = [
  {
    id: "camp1",
    name: "GradePlus Social Media Management",
    client_name: "GradePlus Education",
    status: "running",
    health_status: "yellow",
    kpi_type: "posts",
    kpi_target: 100,
    kpi_current: 45,
    budget: 50000000,
    start_date: "2024-07-01",
    end_date: "2024-12-31",
    pic_name: "Dewi Lestari",
    payment_status: "waiting_payment",
    current_phase: "execution",
    next_action: "Tunggu sertifikat ISP dari GradePlus",
    next_action_due: "2024-07-20",
    open_tasks: 2,
    open_issues: 1,
  },
  {
    id: "camp2",
    name: "FIFGROUP Hajatan Cabin Jawa",
    client_name: "FIFGROUP",
    status: "problem",
    health_status: "red",
    kpi_type: "views",
    kpi_target: 500000,
    kpi_current: 156000,
    budget: 200000000,
    start_date: "2024-06-01",
    end_date: "2024-07-31",
    pic_name: "Dewi Lestari",
    payment_status: "not_invoiced",
    current_phase: "monitoring",
    next_action: "Redirect budget ke publisher cadangan - CRITICAL",
    next_action_due: "2024-07-09",
    open_tasks: 3,
    open_issues: 2,
  },
  {
    id: "camp3",
    name: "Tunaiku App Download Q3",
    client_name: "Tunaiku by Amar Bank",
    status: "running",
    health_status: "green",
    kpi_type: "downloads",
    kpi_target: 50000,
    kpi_current: 32450,
    budget: 750000000,
    start_date: "2024-07-01",
    end_date: "2024-09-30",
    pic_name: "Dewi Lestari",
    payment_status: "waiting_payment",
    current_phase: "monitoring",
    next_action: "Kirim update harian ke Tunaiku",
    next_action_due: "2024-07-14",
    open_tasks: 1,
    open_issues: 0,
  },
  {
    id: "camp4",
    name: "Prudential PRULady VCBL",
    client_name: "Prudential Indonesia",
    status: "running",
    health_status: "yellow",
    kpi_type: "leads",
    kpi_target: 15000,
    kpi_current: 7850,
    budget: 450000000,
    start_date: "2024-06-15",
    end_date: "2024-08-15",
    pic_name: "Ahmad Fauzi",
    payment_status: "invoice_sent",
    current_phase: "monitoring",
    next_action: "QC 500 leads terakhir - kualitas bermasalah",
    next_action_due: "2024-07-09",
    open_tasks: 1,
    open_issues: 1,
  },
  {
    id: "camp5",
    name: "ANTV PitchFlow Enablement",
    client_name: "ANTV",
    status: "setup",
    health_status: "green",
    kpi_type: "registrations",
    kpi_target: 100,
    kpi_current: 0,
    budget: 350000000,
    start_date: "2024-07-15",
    end_date: "2024-09-15",
    pic_name: "Ahmad Fauzi",
    payment_status: "not_invoiced",
    current_phase: "preparation",
    next_action: "Review brief dari ANTV",
    next_action_due: "2024-07-10",
    open_tasks: 2,
    open_issues: 0,
  },
]

const mockTasks: Task[] = [
  {
    id: "t1",
    title: "Redirect budget ke publisher cadangan",
    description: "Budget Rp 50jt dialokasikan ke 3 publisher cadangan",
    status: "in_progress",
    priority: "urgent",
    due_date: "2024-07-09",
    due_time: "10:00",
    estimated_hours: 2,
    campaign_name: "FIFGROUP Hajatan Cabin Jawa",
    campaign_id: "camp2",
    client_name: "FIFGROUP",
    owner_name: "Dewi Lestari",
    owner_id: "u2",
    sop_title: "",
    sop_id: "",
  },
  {
    id: "t2",
    title: "QC 500 leads terakhir dari Google Display",
    description: "Sampling dan analisis kualitas leads",
    status: "todo",
    priority: "high",
    due_date: "2024-07-09",
    due_time: "14:00",
    estimated_hours: 4,
    campaign_name: "Prudential PRULady VCBL",
    campaign_id: "camp4",
    client_name: "Prudential Indonesia",
    owner_name: "Ahmad Fauzi",
    owner_id: "u3",
    sop_title: "Lead Quality Check",
    sop_id: "sop1",
  },
  {
    id: "t3",
    title: "Kirim update harian ke Tunaiku",
    description: "Report performa campaign harian",
    status: "todo",
    priority: "high",
    due_date: "2024-07-14",
    due_time: "09:00",
    estimated_hours: 1,
    campaign_name: "Tunaiku App Download Q3",
    campaign_id: "camp3",
    client_name: "Tunaiku",
    owner_name: "Dewi Lestari",
    owner_id: "u2",
    sop_title: "Daily Client Update",
    sop_id: "sop3",
  },
  {
    id: "t4",
    title: "Review brief ANTV PitchFlow",
    description: "Review dan konfirmasi brief program",
    status: "in_progress",
    priority: "medium",
    due_date: "2024-07-10",
    due_time: "11:00",
    estimated_hours: 2,
    campaign_name: "ANTV PitchFlow Enablement",
    campaign_id: "camp5",
    client_name: "ANTV",
    owner_name: "Ahmad Fauzi",
    owner_id: "u3",
    sop_title: "",
    sop_id: "",
  },
  {
    id: "t5",
    title: "Follow up sertifikat ISP GradePlus",
    description: "Konfirmasi timeline sertifikat ISP",
    status: "todo",
    priority: "high",
    due_date: "2024-07-15",
    due_time: "10:00",
    estimated_hours: 1,
    campaign_name: "GradePlus Social Media Management",
    campaign_id: "camp1",
    client_name: "GradePlus",
    owner_name: "Dewi Lestari",
    owner_id: "u2",
    sop_title: "",
    sop_id: "",
  },
  {
    id: "t6",
    title: "Brief publisher cadangan Hajatan",
    description: "Siapkan brief untuk 3 publisher cadangan",
    status: "todo",
    priority: "urgent",
    due_date: "2024-07-09",
    due_time: "15:00",
    estimated_hours: 2,
    campaign_name: "FIFGROUP Hajatan Cabin Jawa",
    campaign_id: "camp2",
    client_name: "FIFGROUP",
    owner_name: "Ahmad Fauzi",
    owner_id: "u3",
    sop_title: "Publisher Brief Preparation",
    sop_id: "sop2",
  },
]

const mockSchedules: Schedule[] = [
  {
    id: "sch1",
    title: "Emergency: Publisher Redirect Discussion",
    description: "Discussion about redirecting budget",
    type: "client_meeting",
    start_datetime: "2024-07-09 14:00:00",
    end_datetime: "2024-07-09 15:00:00",
    location_type: "online",
    location: "",
    meeting_link: "https://meet.google.com/abc-defg-hij",
    campaign_name: "FIFGROUP Hajatan",
    color: "#EF4444",
    is_recurring: false,
    created_by_name: "Dewi Lestari",
  },
  {
    id: "sch2",
    title: "Lead Quality Review",
    description: "Review hasil QC leads VCBL",
    type: "internal_meeting",
    start_datetime: "2024-07-10 10:00:00",
    end_datetime: "2024-07-10 11:00:00",
    location_type: "online",
    location: "",
    meeting_link: "https://meet.google.com/xyz-uvwx",
    campaign_name: "Prudential PRULady",
    color: "#F59E0B",
    is_recurring: false,
    created_by_name: "Ahmad Fauzi",
  },
  {
    id: "sch3",
    title: "Brief Review dengan ANTV",
    description: "Review brief PitchFlow",
    type: "client_meeting",
    start_datetime: "2024-07-10 15:00:00",
    end_datetime: "2024-07-10 16:00:00",
    location_type: "offline",
    location: "Kantor ANTV, Jakarta",
    meeting_link: "",
    campaign_name: "ANTV PitchFlow",
    color: "#10B981",
    is_recurring: false,
    created_by_name: "Ahmad Fauzi",
  },
  {
    id: "sch4",
    title: "GradePlus ISP Follow-up",
    description: "Follow-up sertifikat ISP",
    type: "other",
    start_datetime: "2024-07-15 10:00:00",
    end_datetime: "2024-07-15 10:30:00",
    location_type: "online",
    location: "",
    meeting_link: "https://wa.me/6287778889990",
    campaign_name: "GradePlus SMMA",
    color: "#3B82F6",
    is_recurring: false,
    created_by_name: "Dewi Lestari",
  },
  {
    id: "sch5",
    title: "Weekly Team Sync",
    description: "Weekly sync semua team",
    type: "internal_meeting",
    start_datetime: "2024-07-15 09:00:00",
    end_datetime: "2024-07-15 10:00:00",
    location_type: "online",
    location: "",
    meeting_link: "https://meet.google.com/weekly-sync",
    campaign_name: "",
    color: "#06B6D4",
    is_recurring: true,
    created_by_name: "Reza Mahendra",
  },
]

const mockIssues: Issue[] = [
  {
    id: "iss1",
    title: "Publisher utama tidak bisa deliver",
    description: "Otosport Media tidak bisa deliver konten tepat waktu",
    severity: "critical",
    status: "in_progress",
    due_date: "2024-07-09",
    campaign_name: "FIFGROUP Hajatan",
    assigned_to_name: "Dewi Lestari",
    created_at: "2024-07-08",
  },
  {
    id: "iss2",
    title: "Kualitas leads tidak qualified",
    description: "40% leads tidak memenuhi criteria VCBL",
    severity: "high",
    status: "in_progress",
    due_date: "2024-07-09",
    campaign_name: "Prudential PRULady",
    assigned_to_name: "Ahmad Fauzi",
    created_at: "2024-07-08",
  },
  {
    id: "iss3",
    title: "Budget belum dialokasikan",
    description: "Perlu approval untuk redirect budget Rp 50jt",
    severity: "high",
    status: "open",
    due_date: "2024-07-10",
    campaign_name: "FIFGROUP Hajatan",
    assigned_to_name: "Dewi Lestari",
    created_at: "2024-07-08",
  },
  {
    id: "iss4",
    title: "Menunggu sertifikat ISP GradePlus",
    description: "Sertifikat ISP belum keluar",
    severity: "medium",
    status: "waiting_external",
    due_date: "2024-07-20",
    campaign_name: "GradePlus SMMA",
    assigned_to_name: "Dewi Lestari",
    created_at: "2024-07-01",
  },
]

const mockTeam: TeamMember[] = [
  {
    id: "u1",
    full_name: "Reza Mahendra",
    role: "founder",
    email: "reza@rectoverso.id",
    total_tasks: 1,
    todo_tasks: 0,
    in_progress_tasks: 0,
    urgent_tasks: 0,
    active_campaigns: 0,
  },
  {
    id: "u2",
    full_name: "Dewi Lestari",
    role: "campaign_manager",
    email: "dewi@rectoverso.id",
    total_tasks: 4,
    todo_tasks: 2,
    in_progress_tasks: 1,
    urgent_tasks: 1,
    active_campaigns: 3,
  },
  {
    id: "u3",
    full_name: "Ahmad Fauzi",
    role: "campaign_ops",
    email: "ahmad@rectoverso.id",
    total_tasks: 3,
    todo_tasks: 2,
    in_progress_tasks: 1,
    urgent_tasks: 2,
    active_campaigns: 2,
  },
  {
    id: "u4",
    full_name: "Sari Wulandari",
    role: "finance",
    email: "sari@rectoverso.id",
    total_tasks: 1,
    todo_tasks: 1,
    in_progress_tasks: 0,
    urgent_tasks: 0,
    active_campaigns: 0,
  },
]

// Utility functions
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
  return num.toString()
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString("id-ID", {
    weekday: "short",
    day: "numeric",
    month: "short",
  })
}

function formatTime(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  })
}

function getProgressPercent(current: number, target: number): number {
  if (target === 0) return 0
  return Math.min(100, Math.round((current / target) * 100))
}

function getDaysUntil(dateStr: string): number {
  const date = new Date(dateStr)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  date.setHours(0, 0, 0, 0)
  return Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
}

function isOverdue(dateStr: string): boolean {
  return getDaysUntil(dateStr) < 0
}

function isToday(dateStr: string): boolean {
  return getDaysUntil(dateStr) === 0
}

function isThisWeek(dateStr: string): boolean {
  const days = getDaysUntil(dateStr)
  return days >= 0 && days <= 7
}

// Components
const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendUp,
  variant = "default",
}: {
  title: string
  value: string | number
  subtitle?: string
  icon: React.ElementType
  trend?: string
  trendUp?: boolean
  variant?: "default" | "warning" | "danger" | "success"
}) => {
  const variantStyles = {
    default: "border-slate-200",
    warning: "border-amber-200 bg-amber-50/50",
    danger: "border-red-200 bg-red-50/50",
    success: "border-emerald-200 bg-emerald-50/50",
  }

  const iconBgStyles = {
    default: "bg-cyan-50",
    warning: "bg-amber-50",
    danger: "bg-red-50",
    success: "bg-emerald-50",
  }

  const iconColorStyles = {
    default: "text-cyan-600",
    warning: "text-amber-600",
    danger: "text-red-600",
    success: "text-emerald-600",
  }

  return (
    <Card className={`hover:shadow-md transition-shadow ${variantStyles[variant]}`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
              {trend && (
                <span className={`text-xs font-medium ${trendUp ? "text-emerald-600" : "text-red-600"}`}>
                  {trendUp ? "↑" : "↓"} {trend}
                </span>
              )}
            </div>
            {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
          </div>
          <div className={`rounded-xl p-3 ${iconBgStyles[variant]}`}>
            <Icon className={`h-5 w-5 ${iconColorStyles[variant]}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const PriorityBadge = ({ priority }: { priority: string }) => {
  const styles: Record<string, string> = {
    urgent: "bg-red-100 text-red-700 border-red-200",
    high: "bg-amber-100 text-amber-700 border-amber-200",
    medium: "bg-blue-100 text-blue-700 border-blue-200",
    low: "bg-slate-100 text-slate-600 border-slate-200",
  }
  return (
    <Badge className={`${styles[priority] || styles.low} text-xs border`}>
      {priority.toUpperCase()}
    </Badge>
  )
}

const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    running: "bg-emerald-100 text-emerald-700 border-emerald-200",
    completed: "bg-blue-100 text-blue-700 border-blue-200",
    paused: "bg-slate-100 text-slate-600 border-slate-200",
    problem: "bg-red-100 text-red-700 border-red-200",
    draft: "bg-slate-100 text-slate-500 border-slate-200",
    setup: "bg-purple-100 text-purple-700 border-purple-200",
    reporting: "bg-indigo-100 text-indigo-700 border-indigo-200",
    waiting_brief: "bg-amber-100 text-amber-700 border-amber-200",
  }
  return (
    <Badge className={`${styles[status] || styles.draft} text-xs border`}>
      {status.replace("_", " ")}
    </Badge>
  )
}

const HealthDot = ({ status }: { status: string }) => {
  const colors: Record<string, string> = {
    green: "bg-emerald-500",
    yellow: "bg-amber-500",
    red: "bg-red-500",
  }
  return <span className={`h-2.5 w-2.5 rounded-full ${colors[status] || colors.green}`} />
}

const IssueCard = ({ issue }: { issue: Issue }) => {
  const severityStyles: Record<string, string> = {
    critical: "border-l-red-500 bg-red-50/30",
    high: "border-l-amber-500 bg-amber-50/30",
    medium: "border-l-blue-500 bg-blue-50/30",
    low: "border-l-slate-300",
  }

  const statusStyles: Record<string, string> = {
    open: "bg-slate-100 text-slate-700",
    in_progress: "bg-blue-100 text-blue-700",
    waiting_external: "bg-purple-100 text-purple-700",
    resolved: "bg-emerald-100 text-emerald-700",
    closed: "bg-slate-100 text-slate-500",
  }

  return (
    <div className={`p-4 rounded-lg border-l-4 ${severityStyles[issue.severity]} border border-slate-200`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-slate-500 uppercase">
              {issue.severity}
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500">{issue.campaign_name}</span>
          </div>
          <h4 className="font-medium text-slate-900 text-sm">{issue.title}</h4>
          <p className="text-xs text-slate-500 mt-1 line-clamp-2">{issue.description}</p>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-xs text-slate-500">
              Assigned to: {issue.assigned_to_name}
            </span>
            {issue.due_date && (
              <span className={`text-xs ${isOverdue(issue.due_date) ? "text-red-600 font-medium" : "text-slate-500"}`}>
                Due: {formatDate(issue.due_date)}
              </span>
            )}
          </div>
        </div>
        <Badge className={`${statusStyles[issue.status]} text-xs shrink-0`}>
          {issue.status.replace("_", " ")}
        </Badge>
      </div>
    </div>
  )
}

const ScheduleCard = ({ schedule }: { schedule: Schedule }) => {
  const typeIcons: Record<string, React.ElementType> = {
    client_meeting: Users,
    internal_meeting: Users,
    deadline: Target,
    campaign_launch: Zap,
    content_publish: FileText,
    report_submission: FileText,
    payment_due: DollarSign,
    publisher_delivery: Briefcase,
    other: Calendar,
  }

  const Icon = typeIcons[schedule.type] || Calendar

  return (
    <div className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors">
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
        style={{ backgroundColor: `${schedule.color}20` }}
      >
        <Icon className="h-5 w-5" style={{ color: schedule.color }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <h4 className="font-medium text-slate-900 text-sm truncate">{schedule.title}</h4>
          {schedule.is_recurring && (
            <Badge variant="outline" className="text-[10px] shrink-0">
              Recurring
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-slate-500">
            {formatDate(schedule.start_datetime)} • {formatTime(schedule.start_datetime)}
          </span>
          {schedule.end_datetime && (
            <span className="text-xs text-slate-400">- {formatTime(schedule.end_datetime)}</span>
          )}
        </div>
        <div className="flex items-center gap-2 mt-1">
          {schedule.location_type === "online" && schedule.meeting_link && (
            <a
              href={schedule.meeting_link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-cyan-600 hover:underline flex items-center gap-1"
            >
              <Video className="h-3 w-3" /> Join
            </a>
          )}
          {schedule.location_type === "offline" && schedule.location && (
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <Building2 className="h-3 w-3" /> {schedule.location}
            </span>
          )}
          {schedule.campaign_name && (
            <Badge variant="outline" className="text-[10px]">
              {schedule.campaign_name}
            </Badge>
          )}
        </div>
      </div>
    </div>
  )
}

// Main Dashboard Component
export default function EnhancedDashboard() {
  const [filter, setFilter] = useState<"all" | "today" | "week" | "mine">("all")
  const [showCompleted, setShowCompleted] = useState(false)

  // Filter tasks based on selected view
  const filteredTasks = mockTasks.filter((task) => {
    if (filter === "today") {
      return isToday(task.due_date) && task.status !== "done"
    }
    if (filter === "week") {
      return isThisWeek(task.due_date) && task.status !== "done"
    }
    if (filter === "mine") {
      return task.owner_id === "u2" && task.status !== "done" // Current user
    }
    return !showCompleted ? task.status !== "done" : true
  })

  // Calculate stats
  const runningCampaigns = mockCampaigns.filter((c) => c.status === "running").length
  const problemCampaigns = mockCampaigns.filter((c) => c.status === "problem" || c.health_status === "red")
  const todayTasksCount = mockTasks.filter((t) => isToday(t.due_date) && t.status !== "done").length
  const urgentTasksCount = mockTasks.filter((t) => t.priority === "urgent" && t.status !== "done").length
  const criticalIssues = mockIssues.filter((i) => i.severity === "critical" && i.status !== "resolved")
  const todaySchedules = mockSchedules.filter((s) => isToday(s.start_datetime))

  // Get today's date formatted
  const today = new Date()
  const formattedDate = today.toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-50">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-sm text-slate-500">{formattedDate}</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Notification Bell */}
            {criticalIssues.length > 0 && (
              <Button variant="destructive" size="sm" className="relative">
                <Bell className="h-4 w-4 mr-2" />
                {criticalIssues.length} Critical
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center animate-pulse">
                  {criticalIssues.length}
                </span>
              </Button>
            )}
            <Button asChild>
              <Link href="/campaigns/new">
                <Plus className="mr-2 h-4 w-4" />
                New Campaign
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Critical Alert Banner */}
        {criticalIssues.length > 0 && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-red-100 p-2 animate-pulse">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="font-semibold text-red-800">
                    Action Required: {criticalIssues.length} Critical Issue(s)
                  </p>
                  <p className="text-sm text-red-600">
                    {criticalIssues.map((i) => i.title).join(", ")}
                  </p>
                </div>
              </div>
              <Button variant="destructive" size="sm" asChild>
                <Link href="#issues">View Issues</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <StatCard
            title="Running Campaigns"
            value={runningCampaigns}
            subtitle={`${problemCampaigns.length} with issues`}
            icon={Zap}
            variant={problemCampaigns.length > 0 ? "warning" : "default"}
          />
          <StatCard
            title="Today's Tasks"
            value={todayTasksCount}
            subtitle={`${urgentTasksCount} urgent`}
            icon={CheckSquare}
            variant={urgentTasksCount > 0 ? "danger" : "success"}
          />
          <StatCard
            title="Today's Meetings"
            value={todaySchedules.length}
            subtitle={todaySchedules.filter((s) => s.location_type === "online").length + " online"}
            icon={CalendarDays}
          />
          <StatCard
            title="Open Issues"
            value={mockIssues.filter((i) => !["resolved", "closed"].includes(i.status)).length}
            subtitle={`${criticalIssues.length} critical`}
            icon={AlertCircle}
            variant={criticalIssues.length > 0 ? "danger" : "default"}
          />
          <StatCard
            title="Total Budget"
            value={formatCurrency(mockCampaigns.reduce((sum, c) => sum + c.budget, 0))}
            subtitle="Active campaigns"
            icon={DollarSign}
          />
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
            <TabsTrigger value="issues" className="text-red-600">
              Issues {criticalIssues.length > 0 && `(${criticalIssues.length})`}
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Running Campaigns */}
              <Card className="lg:col-span-2">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div>
                    <CardTitle className="text-lg">Running Campaigns</CardTitle>
                    <CardDescription>Active campaigns requiring attention</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" asChild className="text-cyan-600">
                    <Link href="/campaigns">View All <ChevronRight className="ml-1 h-4 w-4" /></Link>
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockCampaigns
                      .filter((c) => c.status === "running" || c.status === "problem")
                      .map((campaign) => (
                        <Link
                          key={campaign.id}
                          href={`/campaigns/${campaign.id}`}
                          className="block p-4 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <HealthDot status={campaign.health_status} />
                                <h3 className="font-semibold text-slate-900 truncate">
                                  {campaign.name}
                                </h3>
                              </div>
                              <p className="text-sm text-slate-500">{campaign.client_name}</p>
                              <div className="flex items-center gap-4 mt-2">
                                <StatusBadge status={campaign.status} />
                                <span className="text-xs text-slate-400">
                                  PIC: {campaign.pic_name}
                                </span>
                              </div>
                            </div>
                            <div className="text-right shrink-0">
                              <div className="text-sm font-medium text-slate-900">
                                {formatNumber(campaign.kpi_current)} / {formatNumber(campaign.kpi_target)}
                              </div>
                              <div className="text-xs text-slate-500">{campaign.kpi_type}</div>
                              <div className="mt-1">
                                <Progress
                                  value={getProgressPercent(campaign.kpi_current, campaign.kpi_target)}
                                  className="h-1.5 w-20"
                                />
                              </div>
                            </div>
                          </div>
                          {/* Next Action */}
                          {campaign.next_action && (
                            <div className="mt-3 pt-3 border-t border-slate-100">
                              <div className="flex items-center gap-2">
                                <AlertCircle className={`h-4 w-4 ${campaign.health_status === "red" ? "text-red-500" : "text-amber-500"}`} />
                                <span className="text-xs text-slate-600">{campaign.next_action}</span>
                                {campaign.next_action_due && (
                                  <span className={`text-xs ml-auto ${isOverdue(campaign.next_action_due) ? "text-red-600 font-medium" : "text-slate-400"}`}>
                                    Due: {formatDate(campaign.next_action_due)}
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                        </Link>
                      ))}
                  </div>
                </CardContent>
              </Card>

              {/* Today's Focus */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CalendarDays className="h-5 w-5 text-cyan-600" />
                    Today&apos;s Focus
                  </CardTitle>
                  <CardDescription>Tasks due today & upcoming meetings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Today Tasks */}
                  <div>
                    <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">
                      Tasks Due Today
                    </h4>
                    <div className="space-y-2">
                      {mockTasks
                        .filter((t) => isToday(t.due_date) && t.status !== "done")
                        .slice(0, 3)
                        .map((task) => (
                          <div
                            key={task.id}
                            className="p-2 rounded-lg border border-slate-100 bg-white"
                          >
                            <div className="flex items-start gap-2">
                              <Checkbox
                                checked={task.status === "done"}
                                className="mt-0.5"
                              />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-slate-900 line-clamp-1">
                                  {task.title}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                  <PriorityBadge priority={task.priority} />
                                  {task.due_time && (
                                    <span className="text-xs text-slate-500">
                                      {task.due_time}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      {mockTasks.filter((t) => isToday(t.due_date) && t.status !== "done").length === 0 && (
                        <p className="text-sm text-slate-500 text-center py-4">
                          No tasks due today
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Today Meetings */}
                  <div>
                    <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">
                      Today&apos;s Meetings
                    </h4>
                    <div className="space-y-2">
                      {todaySchedules.slice(0, 3).map((schedule) => (
                        <div
                          key={schedule.id}
                          className="p-2 rounded-lg border border-slate-100 bg-white"
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: schedule.color }}
                            />
                            <span className="text-sm font-medium text-slate-900 flex-1 truncate">
                              {schedule.title}
                            </span>
                            <span className="text-xs text-slate-500">
                              {formatTime(schedule.start_datetime)}
                            </span>
                          </div>
                          {schedule.meeting_link && (
                            <a
                              href={schedule.meeting_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-cyan-600 hover:underline mt-1 block"
                            >
                              Join Meeting
                            </a>
                          )}
                        </div>
                      ))}
                      {todaySchedules.length === 0 && (
                        <p className="text-sm text-slate-500 text-center py-4">
                          No meetings today
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Team Workload */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Users className="h-5 w-5 text-cyan-600" />
                    Team Workload
                  </CardTitle>
                  <CardDescription>Current task distribution</CardDescription>
                </div>
                <Button variant="ghost" size="sm" asChild className="text-cyan-600">
                  <Link href="/settings">Manage Team <ChevronRight className="ml-1 h-4 w-4" /></Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  {mockTeam.map((member) => (
                    <div
                      key={member.id}
                      className="p-4 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-blue-600 text-sm text-white">
                            {member.full_name.split(" ").map((n) => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-slate-900">{member.full_name}</p>
                          <p className="text-xs text-slate-500 capitalize">{member.role.replace("_", " ")}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="p-2 bg-slate-50 rounded">
                          <p className="text-lg font-bold text-slate-900">{member.total_tasks}</p>
                          <p className="text-[10px] text-slate-500">Total</p>
                        </div>
                        <div className="p-2 bg-blue-50 rounded">
                          <p className="text-lg font-bold text-blue-600">{member.in_progress_tasks}</p>
                          <p className="text-[10px] text-slate-500">Active</p>
                        </div>
                        <div className={`p-2 rounded ${member.urgent_tasks > 0 ? "bg-red-50" : "bg-slate-50"}`}>
                          <p className={`text-lg font-bold ${member.urgent_tasks > 0 ? "text-red-600" : "text-slate-900"}`}>
                            {member.urgent_tasks}
                          </p>
                          <p className="text-[10px] text-slate-500">Urgent</p>
                        </div>
                      </div>
                      {member.active_campaigns > 0 && (
                        <p className="text-xs text-slate-500 mt-2 text-center">
                          {member.active_campaigns} active campaign(s)
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tasks Tab */}
          <TabsContent value="tasks" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>All Tasks</CardTitle>
                    <CardDescription>Track daily tasks across campaigns</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
                      {(["all", "today", "week", "mine"] as const).map((f) => (
                        <Button
                          key={f}
                          variant={filter === f ? "default" : "ghost"}
                          size="sm"
                          onClick={() => setFilter(f)}
                        >
                          {f === "all" ? "All" : f === "today" ? "Today" : f === "week" ? "This Week" : "Mine"}
                        </Button>
                      ))}
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setShowCompleted(!showCompleted)}>
                      {showCompleted ? <EyeOff className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}
                      {showCompleted ? "Hide Completed" : "Show Completed"}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {filteredTasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-start gap-4 p-4 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors"
                    >
                      <Checkbox className="mt-1" defaultChecked={task.status === "done"} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className={`font-medium ${task.status === "done" ? "text-slate-400 line-through" : "text-slate-900"}`}>
                            {task.title}
                          </h4>
                          <PriorityBadge priority={task.priority} />
                        </div>
                        <p className="text-sm text-slate-500 line-clamp-1">{task.description}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <Link
                            href={`/campaigns/${task.campaign_id}`}
                            className="text-xs text-cyan-600 hover:underline"
                          >
                            {task.campaign_name}
                          </Link>
                          <span className="text-xs text-slate-400">•</span>
                          <span className="text-xs text-slate-500">{task.client_name}</span>
                          {task.sop_title && (
                            <>
                              <span className="text-xs text-slate-400">•</span>
                              <Badge variant="outline" className="text-[10px]">
                                SOP: {task.sop_title}
                              </Badge>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4 text-slate-400" />
                          <span className={`text-xs ${isOverdue(task.due_date) ? "text-red-600 font-medium" : "text-slate-500"}`}>
                            {task.due_time && `${task.due_time} • `}
                            {formatDate(task.due_date)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1 justify-end">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="bg-slate-100 text-slate-600 text-[10px]">
                              {task.owner_name.split(" ").map((n) => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs text-slate-500">{task.owner_name}</span>
                        </div>
                        {task.estimated_hours && (
                          <p className="text-xs text-slate-400 mt-1">
                            Est: {task.estimated_hours}h
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                  {filteredTasks.length === 0 && (
                    <div className="text-center py-12">
                      <CheckCircle className="h-12 w-12 text-emerald-500 mx-auto mb-4" />
                      <p className="text-lg font-medium text-slate-700">All clear!</p>
                      <p className="text-sm text-slate-500">No tasks to show for this filter.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Schedule Tab */}
          <TabsContent value="schedule" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Team Schedule</CardTitle>
                    <CardDescription>Meetings, deadlines, and events</CardDescription>
                  </div>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Event
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Today */}
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2">
                      <CalendarDays className="h-4 w-4" />
                      Today, {today.toLocaleDateString("id-ID", { month: "long", day: "numeric" })}
                    </h3>
                    <div className="space-y-2">
                      {mockSchedules
                        .filter((s) => isToday(s.start_datetime))
                        .map((schedule) => (
                          <ScheduleCard key={schedule.id} schedule={schedule} />
                        ))}
                      {mockSchedules.filter((s) => isToday(s.start_datetime)).length === 0 && (
                        <p className="text-sm text-slate-500 text-center py-4 border border-dashed border-slate-200 rounded-lg">
                          No events today
                        </p>
                      )}
                    </div>
                  </div>

                  {/* This Week */}
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 mb-2">
                      This Week
                    </h3>
                    <div className="grid gap-2 md:grid-cols-2">
                      {mockSchedules
                        .filter((s) => isThisWeek(s.start_datetime) && !isToday(s.start_datetime))
                        .map((schedule) => (
                          <ScheduleCard key={schedule.id} schedule={schedule} />
                        ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Campaigns Tab */}
          <TabsContent value="campaigns" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>All Campaigns</CardTitle>
                    <CardDescription>Monitor all campaign performance</CardDescription>
                  </div>
                  <Button asChild>
                    <Link href="/campaigns/new">
                      <Plus className="mr-2 h-4 w-4" />
                      New Campaign
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Campaign</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Health</TableHead>
                      <TableHead>Budget</TableHead>
                      <TableHead>Next Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockCampaigns.map((campaign) => (
                      <TableRow key={campaign.id}>
                        <TableCell>
                          <Link
                            href={`/campaigns/${campaign.id}`}
                            className="font-medium text-slate-900 hover:text-cyan-600"
                          >
                            {campaign.name}
                          </Link>
                          <p className="text-xs text-slate-500">{campaign.client_name}</p>
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={campaign.status} />
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1 w-32">
                            <Progress
                              value={getProgressPercent(campaign.kpi_current, campaign.kpi_target)}
                              className="h-2"
                            />
                            <span className="text-xs text-slate-500">
                              {formatNumber(campaign.kpi_current)} / {formatNumber(campaign.kpi_target)} {campaign.kpi_type}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <HealthDot status={campaign.health_status} />
                            <span className="text-xs capitalize text-slate-500">
                              {campaign.health_status}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {formatCurrency(campaign.budget)}
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs">
                            <p className="text-xs text-slate-600 truncate">{campaign.next_action}</p>
                            {campaign.next_action_due && (
                              <p className={`text-xs ${isOverdue(campaign.next_action_due) ? "text-red-600" : "text-slate-400"}`}>
                                Due: {formatDate(campaign.next_action_due)}
                              </p>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Issues Tab */}
          <TabsContent value="issues" className="space-y-4" id="issues">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Campaign Issues</CardTitle>
                    <CardDescription>Track and resolve blockers</CardDescription>
                  </div>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Report Issue
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Critical Issues */}
                  {criticalIssues.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-red-600 mb-2 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        Critical Issues - Immediate Action Required
                      </h3>
                      <div className="space-y-2">
                        {criticalIssues.map((issue) => (
                          <IssueCard key={issue.id} issue={issue} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* All Issues */}
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 mb-2">All Open Issues</h3>
                    <div className="space-y-2">
                      {mockIssues
                        .filter((i) => !["resolved", "closed"].includes(i.status))
                        .map((issue) => (
                          <IssueCard key={issue.id} issue={issue} />
                        ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
