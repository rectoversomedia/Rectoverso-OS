"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Circle,
  Clock,
  AlertTriangle,
  CheckCircle,
  FileText,
  Users,
  TrendingUp,
  MessageSquare,
  DollarSign,
  FolderOpen,
  BookOpen,
  Activity,
  ExternalLink,
  Plus,
  MoreHorizontal,
  ChevronDown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  getCampaignsWithRelations,
  getChecklistsByCampaign,
  getTasksWithRelations,
  publishers,
  campaignPublishers,
  performanceEntries,
  invoices,
  clientUpdates,
  activityLogs,
  sops,
} from "@/data/mock-data"
import {
  formatCurrency,
  formatDate,
  formatDateTime,
  getProgressPercentage,
  getStatusColor,
} from "@/lib/utils"

const phases = [
  { id: "preparation", label: "Preparation", icon: FileText },
  { id: "setup", label: "Setup", icon: Settings },
  { id: "execution", label: "Execution", icon: Play },
  { id: "monitoring", label: "Monitoring", icon: Activity },
  { id: "reporting", label: "Reporting", icon: TrendingUp },
  { id: "finance", label: "Finance", icon: DollarSign },
]

function Settings(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function Play(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <polygon points="6 3 20 12 6 21 6 3" />
    </svg>
  )
}

const campaignTypeLabels: Record<string, string> = {
  lead_generation: "Lead Generation",
  app_download: "App Download",
  registration: "Registration",
  vcbl: "VCBL",
  influencer_campaign: "Influencer Campaign",
  publisher_distribution: "Publisher Distribution",
  media_placement: "Media Placement",
  performance_campaign: "Performance Campaign",
  social_amplification: "Social Amplification",
}

export default function CampaignDetailPage() {
  const params = useParams()
  const campaignId = params.id as string

  const campaigns = getCampaignsWithRelations()
  const campaign = campaigns.find((c) => c.id === campaignId)

  const checklists = getChecklistsByCampaign(campaignId)
  const campaignTasks = getTasksWithRelations().filter((t) => t.campaign_id === campaignId)
  const campaignPublishersList = campaignPublishers.filter(
    (cp) => cp.campaign_id === campaignId
  )
  const campaignPerformance = performanceEntries.filter((p) => p.campaign_id === campaignId)
  const campaignInvoices = invoices.filter((i) => i.campaign_id === campaignId)
  const campaignUpdates = clientUpdates.filter((u) => u.campaign_id === campaignId)
  const campaignLogs = activityLogs.filter(
    (l) => l.entity_type === "campaign" && l.entity_id === campaignId
  )

  const [checklistState, setChecklistState] = useState(
    Object.fromEntries(checklists.map((c) => [c.id, c.status]))
  )

  const toggleChecklistItem = (id: string) => {
    setChecklistState((prev) => ({
      ...prev,
      [id]: prev[id] === "done" ? "todo" : "done",
    }))
  }

  if (!campaign) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
        <h2 className="text-xl font-semibold text-slate-300">Campaign not found</h2>
        <p className="text-sm text-slate-9000 mt-2">
          The campaign you&apos;re looking for doesn&apos;t exist.
        </p>
        <Button className="mt-4" asChild>
          <Link href="/campaigns">Back to Campaigns</Link>
        </Button>
      </div>
    )
  }

  const groupedChecklists = phases.map((phase) => ({
    ...phase,
    items: checklists.filter((c) => c.phase === phase.id),
  }))

  const completedChecklists = Object.values(checklistState).filter(
    (s) => s === "done"
  ).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/campaigns">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-900">{campaign.name}</h1>
              <Badge className={getStatusColor(campaign.status)} variant="outline">
                {campaign.status.replace("_", " ")}
              </Badge>
              {campaign.health_status === "red" && (
                <Badge variant="destructive" className="animate-pulse">
                  <AlertTriangle className="mr-1 h-3 w-3" />
                  At Risk
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-4 mt-1 text-sm text-slate-400">
              <span>{campaign.client?.name}</span>
              <span>•</span>
              <Badge variant="outline" className="text-xs">
                {campaignTypeLabels[campaign.type]}
              </Badge>
              <span>•</span>
              <span>PIC: {campaign.pic?.full_name}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <ExternalLink className="mr-2 h-4 w-4" />
            View Live
          </Button>
          <Button size="sm">Edit Campaign</Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-9000">Budget</p>
                <p className="text-xl font-bold">{formatCurrency(campaign.budget)}</p>
              </div>
              <div className="rounded-full bg-cyan-500/10 p-3">
                <DollarSign className="h-5 w-5 text-cyan-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-9000">KPI Progress</p>
                <p className="text-xl font-bold">
                  {getProgressPercentage(campaign.kpi_current, campaign.kpi_target)}%
                </p>
              </div>
              <Progress
                value={getProgressPercentage(campaign.kpi_current, campaign.kpi_target)}
                className="w-20"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-9000">Current / Target</p>
                <p className="text-xl font-bold">
                  {campaign.kpi_current.toLocaleString()} / {campaign.kpi_target.toLocaleString()}
                </p>
              </div>
              <TrendingUp className="h-5 w-5 text-cyan-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-9000">Payment Status</p>
                <p className="text-xl font-bold capitalize">
                  {campaign.payment_status.replace("_", " ")}
                </p>
              </div>
              <Badge
                className={getStatusColor(campaign.payment_status)}
                variant="outline"
              >
                {campaign.payment_status.replace("_", " ")}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="bg-slate-100">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="checklist">
            Checklist ({completedChecklists}/{checklists.length})
          </TabsTrigger>
          <TabsTrigger value="tasks">
            Tasks ({campaignTasks.length})
          </TabsTrigger>
          <TabsTrigger value="publishers">
            Publishers ({campaignPublishersList.length})
          </TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="updates">Client Updates</TabsTrigger>
          <TabsTrigger value="finance">Finance</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg">Campaign Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-xs text-slate-9000">Objective</p>
                  <p className="text-sm">{campaign.objective}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-9000">Start Date</p>
                    <p className="text-sm font-medium">{formatDate(campaign.start_date)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-9000">End Date</p>
                    <p className="text-sm font-medium">{formatDate(campaign.end_date)}</p>
                  </div>
                </div>
                {campaign.notes && (
                  <div>
                    <p className="text-xs text-slate-9000">Notes</p>
                    <p className="text-sm">{campaign.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg">Deliverables</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {campaign.deliverables?.map((deliverable, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-cyan-600" />
                      {deliverable}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg">Tracking Setup</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-xs text-slate-9000">Tracking Link</p>
                  <p className="text-sm font-mono truncate">{campaign.tracking_link || "-"}</p>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <p className="text-xs text-slate-9000">UTM Source</p>
                    <p className="text-sm font-mono">{campaign.utm_source || "-"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-9000">UTM Medium</p>
                    <p className="text-sm font-mono">{campaign.utm_medium || "-"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-9000">UTM Campaign</p>
                    <p className="text-sm font-mono">{campaign.utm_campaign || "-"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-400" />
                  AI Risk Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                {campaign.health_status === "red" ? (
                  <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-3">
                    <p className="text-sm text-red-300">
                      Campaign is at risk. {campaign.notes}
                    </p>
                  </div>
                ) : campaign.health_status === "yellow" ? (
                  <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3">
                    <p className="text-sm text-amber-300">
                      Campaign needs attention. {campaign.notes}
                    </p>
                  </div>
                ) : (
                  <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3">
                    <p className="text-sm text-emerald-300">
                      Campaign is on track. All metrics are within expected range.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Checklist Tab */}
        <TabsContent value="checklist" className="space-y-4">
          <Card className="border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Campaign Checklist</CardTitle>
                <CardDescription>
                  Progress: {completedChecklists} of {checklists.length} completed
                </CardDescription>
              </div>
              <Progress
                value={(completedChecklists / checklists.length) * 100}
                className="w-32"
              />
            </CardHeader>
            <CardContent className="space-y-6">
              {groupedChecklists.map((phase) => (
                <div key={phase.id}>
                  <div className="flex items-center gap-2 mb-3">
                    <phase.icon className="h-4 w-4 text-cyan-600" />
                    <h3 className="font-semibold text-slate-700">{phase.label}</h3>
                    <Badge variant="outline" className="text-xs">
                      {phase.items.filter((i) => checklistState[i.id] === "done").length}/
                      {phase.items.length}
                    </Badge>
                  </div>
                  <div className="space-y-2 ml-6">
                    {phase.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 rounded-lg border border-slate-200 p-3 hover:bg-slate-800/30 transition-colors"
                      >
                        <Checkbox
                          checked={checklistState[item.id] === "done"}
                          onCheckedChange={() => toggleChecklistItem(item.id)}
                        />
                        <div className="flex-1">
                          <p
                            className={`text-sm ${
                              checklistState[item.id] === "done"
                                ? "text-slate-9000 line-through"
                                : "text-slate-700"
                            }`}
                          >
                            {item.title}
                          </p>
                          {item.due_date && (
                            <p className="text-xs text-slate-9000">
                              Due: {formatDate(item.due_date)}
                            </p>
                          )}
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {item.owner?.full_name}
                        </Badge>
                        {item.sop && (
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/sop/${item.sop.id}`}>
                              <BookOpen className="h-3 w-3 mr-1" />
                              SOP
                            </Link>
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              {checklists.length === 0 && (
                <div className="text-center py-8 text-slate-9000">
                  No checklist items for this campaign
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tasks Tab */}
        <TabsContent value="tasks" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Campaign Tasks</h3>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Task
            </Button>
          </div>
          <Card className="border-slate-200">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-200">
                    <TableHead>Task</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>SOP</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {campaignTasks.map((task) => (
                    <TableRow key={task.id} className="border-slate-200/50">
                      <TableCell>
                        <p className="font-medium">{task.title}</p>
                        {task.description && (
                          <p className="text-xs text-slate-9000 truncate max-w-xs">
                            {task.description}
                          </p>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(task.status)} variant="outline">
                          {task.status.replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`text-sm capitalize ${
                            task.priority === "urgent"
                              ? "text-red-400"
                              : task.priority === "high"
                              ? "text-amber-400"
                              : "text-slate-400"
                          }`}
                        >
                          {task.priority}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-[10px] bg-slate-800">
                              {task.owner?.full_name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{task.owner?.full_name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-slate-400">
                        {formatDate(task.due_date)}
                      </TableCell>
                      <TableCell>
                        {task.sop && (
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/sop/${task.sop.id}`}>
                              <BookOpen className="h-3 w-3 mr-1" />
                              {task.sop.title.substring(0, 15)}...
                            </Link>
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          {campaignTasks.length === 0 && (
            <div className="text-center py-8 text-slate-9000">
              No tasks for this campaign
            </div>
          )}
        </TabsContent>

        {/* Publishers Tab */}
        <TabsContent value="publishers" className="space-y-4">
          <Card className="border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Assigned Publishers</CardTitle>
                <CardDescription>
                  {campaignPublishersList.length} publishers assigned
                </CardDescription>
              </div>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Publisher
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-200">
                    <TableHead>Publisher</TableHead>
                    <TableHead>Deliverable</TableHead>
                    <TableHead>Budget</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {campaignPublishersList.map((cp) => {
                    const pub = publishers.find((p) => p.id === cp.publisher_id)
                    return (
                      <TableRow key={cp.id} className="border-slate-200/50">
                        <TableCell>
                          <p className="font-medium">{pub?.name}</p>
                          <p className="text-xs text-slate-9000">
                            {pub?.category} • {pub?.city}
                          </p>
                        </TableCell>
                        <TableCell>{cp.deliverable}</TableCell>
                        <TableCell className="font-mono">
                          {formatCurrency(cp.budget_allocation)}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={getStatusColor(cp.status)}
                            variant="outline"
                          >
                            {cp.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-4">
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle>Performance Entries</CardTitle>
              <CardDescription>Daily performance data for this campaign</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-200">
                    <TableHead>Date</TableHead>
                    <TableHead>Leads</TableHead>
                    <TableHead>Clicks</TableHead>
                    <TableHead>Downloads</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead>CPL/CPA</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {campaignPerformance.map((perf) => (
                    <TableRow key={perf.id} className="border-slate-200/50">
                      <TableCell className="text-slate-400">
                        {formatDate(perf.date)}
                      </TableCell>
                      <TableCell className="font-medium">
                        {perf.leads?.toLocaleString() || "-"}
                      </TableCell>
                      <TableCell>{perf.clicks?.toLocaleString() || "-"}</TableCell>
                      <TableCell>{perf.downloads?.toLocaleString() || "-"}</TableCell>
                      <TableCell className="font-mono">
                        {formatCurrency(perf.cost_spent)}
                      </TableCell>
                      <TableCell className="text-slate-400">
                        {perf.leads
                          ? formatCurrency(perf.cost_spent / perf.leads)
                          : perf.downloads
                          ? formatCurrency(perf.cost_spent / perf.downloads)
                          : "-"}
                      </TableCell>
                      <TableCell className="text-sm text-slate-9000 max-w-xs truncate">
                        {perf.notes || "-"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          {campaignPerformance.length === 0 && (
            <div className="text-center py-8 text-slate-9000">
              No performance data recorded yet
            </div>
          )}
        </TabsContent>

        {/* Client Updates Tab */}
        <TabsContent value="updates" className="space-y-4">
          <Card className="border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Client Updates</CardTitle>
                <CardDescription>Timeline of updates sent to client</CardDescription>
              </div>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                New Update
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {campaignUpdates.map((update) => (
                <div
                  key={update.id}
                  className="flex gap-4 rounded-lg border border-slate-200 p-4"
                >
                  <div className="rounded-full bg-slate-800 p-2 h-fit">
                    <MessageSquare className="h-4 w-4 text-slate-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <Badge variant="outline" className="text-xs">
                        {update.update_type}
                      </Badge>
                      <span className="text-xs text-slate-9000">
                        {formatDateTime(update.created_at)}
                      </span>
                    </div>
                    <p className="text-sm">{update.message}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
          {campaignUpdates.length === 0 && (
            <div className="text-center py-8 text-slate-9000">
              No updates sent yet
            </div>
          )}
        </TabsContent>

        {/* Finance Tab */}
        <TabsContent value="finance" className="space-y-4">
          <Card className="border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Invoices</CardTitle>
                <CardDescription>Campaign-related invoices</CardDescription>
              </div>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Create Invoice
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-200">
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Invoice Date</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Paid Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {campaignInvoices.map((inv) => (
                    <TableRow key={inv.id} className="border-slate-200/50">
                      <TableCell className="font-mono">{inv.invoice_number}</TableCell>
                      <TableCell className="font-mono font-medium">
                        {formatCurrency(inv.amount)}
                      </TableCell>
                      <TableCell className="text-slate-400">
                        {formatDate(inv.invoice_date)}
                      </TableCell>
                      <TableCell className="text-slate-400">
                        {formatDate(inv.due_date)}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(inv.status)} variant="outline">
                          {inv.status.replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-400">
                        {inv.paid_date ? formatDate(inv.paid_date) : "-"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          {campaignInvoices.length === 0 && (
            <div className="text-center py-8 text-slate-9000">
              No invoices for this campaign
            </div>
          )}
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity" className="space-y-4">
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle>Activity Log</CardTitle>
              <CardDescription>Recent activities on this campaign</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {campaignLogs.map((log) => (
                <div key={log.id} className="flex items-start gap-3">
                  <div className="rounded-full bg-slate-800 p-2">
                    <Activity className="h-4 w-4 text-slate-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">{log.description}</p>
                    <p className="text-xs text-slate-9000">
                      {formatDateTime(log.created_at)}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
          {campaignLogs.length === 0 && (
            <div className="text-center py-8 text-slate-9000">
              No activity recorded yet
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
