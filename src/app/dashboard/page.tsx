"use client"

import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  Building2,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  Download,
  Megaphone,
  TrendingUp,
  Users,
  Zap,
  FileText,
  MessageSquare,
  AlertCircle,
  Lightbulb,
  ChevronRight,
  ArrowRight,
  User,
  Brain,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  dashboardStats,
  getCampaignsWithRelations,
  getTasksWithRelations,
  getInvoicesWithRelations,
  getRecentActivity,
  users,
} from "@/data/mock-data"
import {
  formatCurrency,
  formatNumber,
  formatDate,
  getProgressPercentage,
  getDaysOverdue,
} from "@/lib/utils"
import Link from "next/link"

const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendUp,
  variant = "default",
  iconBg,
  iconColor,
}: {
  title: string
  value: string | number
  subtitle?: string
  icon: React.ElementType
  trend?: string
  trendUp?: boolean
  variant?: "default" | "warning" | "danger" | "success"
  iconBg?: string
  iconColor?: string
}) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
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
          <div className={`rounded-xl p-3 ${iconBg || "bg-cyan-50"}`}>
            <Icon className={`h-5 w-5 ${iconColor || "text-cyan-600"}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function DashboardPage() {
  const campaigns = getCampaignsWithRelations()
  const tasks = getTasksWithRelations()
  const invoices = getInvoicesWithRelations()
  const recentActivity = getRecentActivity()

  const runningCampaigns = campaigns.filter((c) => c.status === "running")
  const atRiskCampaigns = campaigns.filter(
    (c) => c.health_status === "red" || c.status === "problem"
  )
  const todayTasks = tasks.filter(
    (t) => t.due_date === new Date().toISOString().split("T")[0]
  )
  const overdueInvoices = invoices.filter((i) => i.status === "overdue")
  const pendingInvoices = invoices.filter(
    (i) => i.status !== "paid" && i.status !== "disputed"
  )
  const outstandingAmount = pendingInvoices.reduce((sum, i) => sum + i.amount, 0)

  // Team workload calculation
  const teamWorkload = users.map((user) => {
    const userTasks = tasks.filter((t) => t.owner_id === user.id && t.status !== "done")
    const urgentTasks = userTasks.filter((t) => t.priority === "urgent" || t.priority === "high")
    return {
      ...user,
      taskCount: userTasks.length,
      urgentCount: urgentTasks.length,
    }
  }).filter((u) => u.taskCount > 0).sort((a, b) => b.urgentCount - a.urgentCount)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Good Morning, Reza</h1>
          <p className="text-sm text-slate-500">
            {new Date().toLocaleDateString("id-ID", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {atRiskCampaigns.length > 0 && (
            <Badge variant="destructive" className="text-xs">
              <span className="mr-1 inline-block h-2 w-2 rounded-full bg-white animate-pulse" />
              {atRiskCampaigns.length} At Risk
            </Badge>
          )}
          <Button asChild>
            <Link href="/campaigns/new">
              <Megaphone className="mr-2 h-4 w-4" />
              New Campaign
            </Link>
          </Button>
        </div>
      </div>

      {/* Priority Alert Banner */}
      {atRiskCampaigns.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-red-100 p-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="font-semibold text-red-800">
                  Action Required: {atRiskCampaigns.length} campaign(s) at risk
                </p>
                <p className="text-sm text-red-600">
                  {atRiskCampaigns.map((c) => c.name).join(", ")}
                </p>
              </div>
            </div>
            <Button variant="destructive" size="sm" asChild>
              <Link href={`/campaigns/${atRiskCampaigns[0].id}`}>View Now</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Active Campaigns"
          value={dashboardStats.activeCampaigns}
          subtitle={`${runningCampaigns.length} running`}
          icon={Megaphone}
          iconBg="bg-cyan-50"
          iconColor="text-cyan-600"
        />
        <StatCard
          title="Tasks Due Today"
          value={dashboardStats.tasksDueToday}
          subtitle={`${todayTasks.length} assigned to you`}
          icon={CheckCircle}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
        />
        <StatCard
          title="Outstanding Payment"
          value={formatCurrency(dashboardStats.outstandingPayment)}
          subtitle={`${overdueInvoices.length} overdue`}
          icon={DollarSign}
          iconBg="bg-amber-50"
          iconColor="text-amber-600"
        />
        <StatCard
          title="Leads This Month"
          value={formatNumber(dashboardStats.leadsThisMonth)}
          subtitle="Across all campaigns"
          icon={TrendingUp}
          trend="12%"
          trendUp
          iconBg="bg-purple-50"
          iconColor="text-purple-600"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Campaign Health */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold text-slate-900">Active Campaigns</CardTitle>
            <Button variant="ghost" size="sm" asChild className="text-cyan-600 hover:text-cyan-700 hover:bg-cyan-50">
              <Link href="/campaigns">
                View All
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-slate-100">
                  <TableHead className="text-slate-500">Campaign</TableHead>
                  <TableHead className="text-slate-500">Progress</TableHead>
                  <TableHead className="text-slate-500">Health</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {runningCampaigns.slice(0, 5).map((campaign) => (
                  <TableRow key={campaign.id} className="border-slate-50">
                    <TableCell>
                      <Link
                        href={`/campaigns/${campaign.id}`}
                        className="font-medium text-slate-900 hover:text-cyan-600"
                      >
                        {campaign.name}
                      </Link>
                      <p className="text-xs text-slate-400">{campaign.client?.name}</p>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1 w-32">
                        <Progress
                          value={getProgressPercentage(campaign.kpi_current, campaign.kpi_target)}
                          className="h-2"
                        />
                        <span className="text-xs text-slate-400">
                          {formatNumber(campaign.kpi_current)} / {formatNumber(campaign.kpi_target)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span
                          className={`status-dot ${
                            campaign.health_status === "green"
                              ? "green"
                              : campaign.health_status === "yellow"
                              ? "yellow"
                              : "red"
                          }`}
                        />
                        <span className="text-xs capitalize text-slate-500">
                          {campaign.health_status}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Today's Tasks */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold text-slate-900">Today&apos;s Tasks</CardTitle>
            <Button variant="ghost" size="sm" asChild className="text-cyan-600 hover:text-cyan-700 hover:bg-cyan-50">
              <Link href="/tasks">
                View All
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {todayTasks.slice(0, 5).map((task) => (
              <div
                key={task.id}
                className="flex items-start gap-3 p-3 rounded-lg border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-colors"
              >
                <div className="mt-1">
                  <span
                    className={`status-dot ${
                      task.priority === "urgent"
                        ? "red"
                        : task.priority === "high"
                        ? "yellow"
                        : "green"
                    }`}
                  />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium text-slate-900">{task.title}</p>
                  <div className="flex items-center gap-2">
                    {task.campaign && (
                      <Badge variant="outline" className="text-[10px] border-slate-200">
                        {task.campaign.name.substring(0, 20)}...
                      </Badge>
                    )}
                    <span className="text-xs text-slate-400">{task.owner?.full_name}</span>
                  </div>
                </div>
                <Badge
                  variant={
                    task.status === "todo"
                      ? "secondary"
                      : task.status === "in_progress"
                      ? "info"
                      : "success"
                  }
                  className="text-[10px]"
                >
                  {task.status.replace("_", " ")}
                </Badge>
              </div>
            ))}
            {todayTasks.length === 0 && (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <CheckCircle className="h-10 w-10 text-emerald-500 mb-2" />
                <p className="text-sm text-slate-500">All clear for today!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Second Row */}
      <div className="grid gap-6 lg:grid-cols-4">
        {/* Team Workload */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <Users className="h-5 w-5 text-cyan-600" />
              Team Workload
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {teamWorkload.slice(0, 5).map((member) => (
              <div key={member.id} className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-blue-600 text-xs text-white">
                    {member.full_name.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">{member.full_name}</p>
                  <p className="text-xs text-slate-400">{member.taskCount} tasks</p>
                </div>
                {member.urgentCount > 0 && (
                  <Badge variant="destructive" className="text-xs">
                    {member.urgentCount} urgent
                  </Badge>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Finance Alert */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-cyan-600" />
              Finance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 rounded-lg bg-slate-50">
              <p className="text-xs text-slate-500">Outstanding</p>
              <p className="text-xl font-bold text-slate-900">{formatCurrency(outstandingAmount)}</p>
            </div>
            {overdueInvoices.length > 0 && (
              <div className="p-3 rounded-lg border border-red-200 bg-red-50">
                <div className="flex items-center gap-2 mb-1">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  <span className="text-xs font-medium text-red-700">Overdue</span>
                </div>
                <p className="text-sm font-semibold text-red-800">{formatCurrency(overdueInvoices.reduce((sum, i) => sum + i.amount, 0))}</p>
              </div>
            )}
            <Button variant="outline" size="sm" className="w-full border-slate-200 hover:bg-slate-50" asChild>
              <Link href="/finance">View Finance</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <Activity className="h-5 w-5 text-cyan-600" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentActivity.slice(0, 5).map((log) => (
              <div key={log.id} className="flex items-start gap-3">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="bg-slate-100 text-slate-600 text-[10px]">
                    {log.user?.full_name.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-0.5">
                  <p className="text-xs">
                    <span className="font-medium text-slate-900">{log.user?.full_name}</span>{" "}
                    <span className="text-slate-500">{log.description}</span>
                  </p>
                  <p className="text-[10px] text-slate-400">{formatDate(log.created_at)}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="lg:col-span-1 border-cyan-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <Zap className="h-5 w-5 text-cyan-600" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start border-slate-200 hover:bg-slate-50" asChild>
              <Link href="/campaigns/new">
                <Megaphone className="mr-2 h-4 w-4 text-cyan-600" />
                New Campaign
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start border-slate-200 hover:bg-slate-50" asChild>
              <Link href="/tasks">
                <CheckCircle className="mr-2 h-4 w-4 text-cyan-600" />
                My Tasks
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start border-slate-200 hover:bg-slate-50" asChild>
              <Link href="/calendar">
                <Calendar className="mr-2 h-4 w-4 text-cyan-600" />
                Team Calendar
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start border-slate-200 hover:bg-slate-50" asChild>
              <Link href="/ai">
                <Brain className="mr-2 h-4 w-4 text-cyan-600" />
                AI Assistant
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
