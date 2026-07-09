"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Plus,
  Search,
  Calendar,
  MessageSquare,
  BookOpen,
  MoreHorizontal,
  CheckCircle,
  Clock,
  AlertTriangle,
  Circle,
  XCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getTasksWithRelations, campaigns, users } from "@/data/mock-data"
import { formatDate } from "@/lib/utils"
import { TaskStatus } from "@/types"

const statusConfig: Record<TaskStatus, { label: string; color: string; icon: React.ElementType }> = {
  todo: { label: "Todo", color: "bg-slate-100 text-slate-600 border-slate-200", icon: Circle },
  in_progress: { label: "In Progress", color: "bg-blue-100 text-blue-600 border-blue-200", icon: Clock },
  review: { label: "Review", color: "bg-purple-100 text-purple-600 border-purple-200", icon: AlertTriangle },
  done: { label: "Done", color: "bg-emerald-100 text-emerald-600 border-emerald-200", icon: CheckCircle },
  blocked: { label: "Blocked", color: "bg-red-100 text-red-600 border-red-200", icon: XCircle },
}

const priorityConfig = {
  low: "text-slate-400",
  medium: "text-blue-500",
  high: "text-amber-500",
  urgent: "text-red-500",
}

export default function TasksPage() {
  const tasks = getTasksWithRelations()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [campaignFilter, setCampaignFilter] = useState<string>("all")
  const [ownerFilter, setOwnerFilter] = useState<string>("all")

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || task.status === statusFilter
    const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter
    const matchesCampaign = campaignFilter === "all" || task.campaign_id === campaignFilter
    const matchesOwner = ownerFilter === "all" || task.owner_id === ownerFilter

    return matchesSearch && matchesStatus && matchesPriority && matchesCampaign && matchesOwner
  })

  const today = new Date().toISOString().split("T")[0]
  const overdueTasks = tasks.filter((t) => t.due_date < today && t.status !== "done")
  const todayTasks = tasks.filter((t) => t.due_date === today)
  const blockedTasks = tasks.filter((t) => t.status === "blocked")

  const tasksByStatus = {
    todo: filteredTasks.filter((t) => t.status === "todo"),
    in_progress: filteredTasks.filter((t) => t.status === "in_progress"),
    review: filteredTasks.filter((t) => t.status === "review"),
    done: filteredTasks.filter((t) => t.status === "done"),
    blocked: filteredTasks.filter((t) => t.status === "blocked"),
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Tasks</h1>
          <p className="text-sm text-slate-500">
            Task command center - manage and track all tasks
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Task
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="border-slate-200">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="rounded-full bg-amber-100 p-2">
              <Clock className="h-4 w-4 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{todayTasks.length}</p>
              <p className="text-xs text-slate-500">Due Today</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="rounded-full bg-red-100 p-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-red-700">{overdueTasks.length}</p>
              <p className="text-xs text-red-600">Overdue</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="rounded-full bg-red-100 p-2">
              <XCircle className="h-4 w-4 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{blockedTasks.length}</p>
              <p className="text-xs text-slate-500">Blocked</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="rounded-full bg-emerald-100 p-2">
              <CheckCircle className="h-4 w-4 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{tasksByStatus.done.length}</p>
              <p className="text-xs text-slate-500">Completed</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-slate-200">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[300px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-50 border-slate-200"
              />
            </div>

            <Select value={campaignFilter} onValueChange={setCampaignFilter}>
              <SelectTrigger className="w-[200px] bg-slate-50 border-slate-200">
                <SelectValue placeholder="All Campaigns" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Campaigns</SelectItem>
                {campaigns.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={ownerFilter} onValueChange={setOwnerFilter}>
              <SelectTrigger className="w-[180px] bg-slate-50 border-slate-200">
                <SelectValue placeholder="All Owners" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Owners</SelectItem>
                {users.map((u) => (
                  <SelectItem key={u.id} value={u.id}>
                    {u.full_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-[150px] bg-slate-50 border-slate-200">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Kanban Board */}
      <Tabs defaultValue="kanban" className="space-y-4">
        <TabsList className="bg-slate-100">
          <TabsTrigger value="kanban">Kanban Board</TabsTrigger>
          <TabsTrigger value="table">Table View</TabsTrigger>
        </TabsList>

        {/* Kanban View */}
        <TabsContent value="kanban">
          <div className="grid grid-cols-5 gap-4 overflow-x-auto">
            {(["todo", "in_progress", "review", "done", "blocked"] as TaskStatus[]).map((status) => {
              const StatusIcon = statusConfig[status].icon
              return (
                <div key={status} className="space-y-3">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-100">
                    <div className="flex items-center gap-2">
                      <StatusIcon className="h-4 w-4 text-slate-600" />
                      <span className="text-sm font-medium text-slate-700">{statusConfig[status].label}</span>
                    </div>
                    <Badge variant="outline" className="text-xs bg-white">
                      {tasksByStatus[status].length}
                    </Badge>
                  </div>

                  <div className="space-y-2 min-h-[200px]">
                    {tasksByStatus[status].map((task) => (
                      <Card
                        key={task.id}
                        className="border-slate-200 hover:border-slate-300 hover:shadow-sm cursor-pointer transition-all"
                      >
                        <CardContent className="p-3 space-y-2">
                          <div className="flex items-start justify-between">
                            <span
                              className={`text-xs font-medium ${
                                priorityConfig[task.priority as keyof typeof priorityConfig]
                              }`}
                            >
                              {task.priority.toUpperCase()}
                            </span>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-6 w-6">
                                  <MoreHorizontal className="h-3 w-3" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>Edit</DropdownMenuItem>
                                <DropdownMenuItem>Change Status</DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>

                          <p className="text-sm font-medium text-slate-900 line-clamp-2">{task.title}</p>

                          {task.campaign && (
                            <Badge variant="outline" className="text-[10px]">
                              {task.campaign.name.substring(0, 25)}...
                            </Badge>
                          )}

                          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                            <div className="flex items-center gap-1">
                              <Avatar className="h-5 w-5">
                                <AvatarFallback className="text-[8px] bg-slate-100 text-slate-600">
                                  {task.owner?.full_name.split(" ").map((n) => n[0]).join("")}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-[10px] text-slate-500">
                                {task.owner?.full_name.split(" ")[0]}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-[10px] text-slate-500">
                              <Calendar className="h-3 w-3" />
                              {formatDate(task.due_date)}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {task.sop && (
                              <Button variant="ghost" size="sm" className="h-6 text-[10px] px-2" asChild>
                                <Link href={`/sop/${task.sop.id}`}>
                                  <BookOpen className="h-3 w-3 mr-1" />
                                  SOP
                                </Link>
                              </Button>
                            )}
                            {task.comment_count && task.comment_count > 0 && (
                              <div className="flex items-center gap-1 text-[10px] text-slate-500">
                                <MessageSquare className="h-3 w-3" />
                                {task.comment_count}
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}

                    {tasksByStatus[status].length === 0 && (
                      <div className="flex items-center justify-center h-20 rounded-lg border border-dashed border-slate-200 text-xs text-slate-400">
                        No tasks
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </TabsContent>

        {/* Table View */}
        <TabsContent value="table">
          <Card className="border-slate-200">
            <CardContent className="p-0">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="text-left p-4 text-sm font-medium text-slate-600">Task</th>
                    <th className="text-left p-4 text-sm font-medium text-slate-600">Status</th>
                    <th className="text-left p-4 text-sm font-medium text-slate-600">Priority</th>
                    <th className="text-left p-4 text-sm font-medium text-slate-600">Campaign</th>
                    <th className="text-left p-4 text-sm font-medium text-slate-600">Owner</th>
                    <th className="text-left p-4 text-sm font-medium text-slate-600">Due Date</th>
                    <th className="text-left p-4 text-sm font-medium text-slate-600">SOP</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTasks.map((task) => (
                    <tr key={task.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="p-4">
                        <p className="font-medium text-slate-900">{task.title}</p>
                        {task.description && (
                          <p className="text-xs text-slate-500 truncate max-w-xs">
                            {task.description}
                          </p>
                        )}
                      </td>
                      <td className="p-4">
                        <Badge className={`${statusConfig[task.status].color} border`}>
                          {statusConfig[task.status].label}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <span className={priorityConfig[task.priority as keyof typeof priorityConfig]}>
                          {task.priority}
                        </span>
                      </td>
                      <td className="p-4">
                        {task.campaign ? (
                          <Badge variant="outline" className="text-xs">
                            {task.campaign.name.substring(0, 20)}...
                          </Badge>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-[10px] bg-slate-100 text-slate-600">
                              {task.owner?.full_name.split(" ").map((n) => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-slate-700">{task.owner?.full_name}</span>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-slate-600">
                        {formatDate(task.due_date)}
                      </td>
                      <td className="p-4">
                        {task.sop ? (
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/sop/${task.sop.id}`}>
                              <BookOpen className="h-3 w-3 mr-1" />
                              View
                            </Link>
                          </Button>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
