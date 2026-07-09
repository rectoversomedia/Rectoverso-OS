"use client"

import { useState } from "react"
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  AlertCircle,
  CheckCircle,
  User,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { getTasksWithRelations, users } from "@/data/mock-data"
import { formatDate, getDaysOverdue } from "@/lib/utils"
import Link from "next/link"

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
]

export default function CalendarPage() {
  const tasks = getTasksWithRelations()
  const today = new Date()
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())
  const [currentYear, setCurrentYear] = useState(today.getFullYear())
  const [view, setView] = useState<"month" | "list">("month")

  // Get all dates in the current month view
  const getMonthDates = () => {
    const firstDay = new Date(currentYear, currentMonth, 1)
    const lastDay = new Date(currentYear, currentMonth + 1, 0)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - ((firstDay.getDay() + 6) % 7)) // Monday start

    const dates: Date[] = []
    const current = new Date(startDate)

    // Get 6 weeks of dates
    for (let i = 0; i < 42; i++) {
      dates.push(new Date(current))
      current.setDate(current.getDate() + 1)
    }

    return dates
  }

  const getTasksForDate = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0]
    return tasks.filter((t) => t.due_date === dateStr)
  }

  const isToday = (date: Date) => {
    return date.toDateString() === today.toDateString()
  }

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentMonth
  }

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  const goToToday = () => {
    setCurrentMonth(today.getMonth())
    setCurrentYear(today.getFullYear())
  }

  const dates = getMonthDates()

  // List view data
  const upcomingTasks = tasks
    .filter((t) => t.status !== "done")
    .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())
    .slice(0, 20)

  const overdueTasks = tasks.filter(
    (t) => t.status !== "done" && getDaysOverdue(t.due_date) > 0
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Team Calendar</h1>
          <p className="text-sm text-slate-500">
            View deadlines and task schedule for your team
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex border border-slate-200 rounded-lg overflow-hidden">
            <Button
              variant={view === "month" ? "default" : "ghost"}
              size="sm"
              onClick={() => setView("month")}
              className={view === "month" ? "bg-cyan-500 hover:bg-cyan-600" : ""}
            >
              Month
            </Button>
            <Button
              variant={view === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setView("list")}
              className={view === "list" ? "bg-cyan-500 hover:bg-cyan-600" : ""}
            >
              List
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="rounded-full bg-amber-50 p-2">
              <Clock className="h-4 w-4 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{upcomingTasks.length}</p>
              <p className="text-xs text-slate-500">Upcoming Tasks</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="rounded-full bg-red-50 p-2">
              <AlertCircle className="h-4 w-4 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{overdueTasks.length}</p>
              <p className="text-xs text-slate-500">Overdue</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="rounded-full bg-emerald-50 p-2">
              <CheckCircle className="h-4 w-4 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">
                {tasks.filter((t) => t.status === "done").length}
              </p>
              <p className="text-xs text-slate-500">Completed</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="rounded-full bg-cyan-50 p-2">
              <User className="h-4 w-4 text-cyan-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{users.length}</p>
              <p className="text-xs text-slate-500">Team Members</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {view === "month" ? (
        <>
          {/* Month Navigation */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button variant="outline" size="icon" onClick={prevMonth}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <h2 className="text-lg font-semibold text-slate-900 min-w-[200px] text-center">
                    {MONTHS[currentMonth]} {currentYear}
                  </h2>
                  <Button variant="outline" size="icon" onClick={nextMonth}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={goToToday}>
                    Today
                  </Button>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="mt-4">
                {/* Day Headers */}
                <div className="grid grid-cols-7 gap-px bg-slate-200 rounded-t-lg overflow-hidden">
                  {DAYS.map((day) => (
                    <div
                      key={day}
                      className="bg-slate-50 p-2 text-center text-sm font-medium text-slate-600"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* Date Cells */}
                <div className="grid grid-cols-7 gap-px bg-slate-200 rounded-b-lg overflow-hidden">
                  {dates.map((date, index) => {
                    const dayTasks = getTasksForDate(date)
                    const hasOverdue = dayTasks.some(
                      (t) => getDaysOverdue(t.due_date) > 0 && t.status !== "done"
                    )
                    const hasUrgent = dayTasks.some(
                      (t) => (t.priority === "urgent" || t.priority === "high") && t.status !== "done"
                    )

                    return (
                      <div
                        key={index}
                        className={`min-h-[100px] p-2 ${
                          isCurrentMonth(date) ? "bg-white" : "bg-slate-50"
                        } ${isToday(date) ? "ring-2 ring-cyan-500 ring-inset" : ""}`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span
                            className={`text-sm font-medium ${
                              isToday(date)
                                ? "text-cyan-600"
                                : isCurrentMonth(date)
                                ? "text-slate-900"
                                : "text-slate-400"
                            }`}
                          >
                            {date.getDate()}
                          </span>
                          {hasOverdue && (
                            <AlertCircle className="h-3 w-3 text-red-500" />
                          )}
                        </div>
                        <div className="space-y-1">
                          {dayTasks.slice(0, 3).map((task) => (
                            <Link
                              key={task.id}
                              href="/tasks"
                              className={`block text-[10px] p-1 rounded truncate hover:opacity-80 ${
                                task.priority === "urgent"
                                  ? "bg-red-100 text-red-700"
                                  : task.priority === "high"
                                  ? "bg-amber-100 text-amber-700"
                                  : "bg-slate-100 text-slate-600"
                              }`}
                            >
                              {task.title.substring(0, 20)}...
                            </Link>
                          ))}
                          {dayTasks.length > 3 && (
                            <span className="text-[10px] text-slate-400 pl-1">
                              +{dayTasks.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Legend */}
          <div className="flex items-center gap-4 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-red-100 border border-red-200"></span>
              <span>Urgent</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-amber-100 border border-amber-200"></span>
              <span>High Priority</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-slate-100 border border-slate-200"></span>
              <span>Normal</span>
            </div>
          </div>
        </>
      ) : (
        /* List View */
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-900">Upcoming Deadlines</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100">
              {upcomingTasks.map((task) => {
                const daysUntil = getDaysOverdue(task.due_date)
                const isOverdue = daysUntil > 0

                return (
                  <div
                    key={task.id}
                    className="flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-slate-900">{task.title}</p>
                        {isOverdue && (
                          <Badge variant="destructive" className="text-xs">
                            {daysUntil} days overdue
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 mt-1">
                        {task.campaign && (
                          <Badge variant="outline" className="text-xs border-slate-200">
                            {task.campaign.name.substring(0, 30)}...
                          </Badge>
                        )}
                        <div className="flex items-center gap-1 text-xs text-slate-400">
                          <CalendarIcon className="h-3 w-3" />
                          {formatDate(task.due_date)}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-slate-400">
                          <Avatar className="h-4 w-4">
                            <AvatarFallback className="bg-slate-100 text-slate-600 text-[8px]">
                              {task.owner?.full_name.split(" ").map((n) => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          {task.owner?.full_name}
                        </div>
                      </div>
                    </div>
                    <Badge
                      variant={
                        task.priority === "urgent"
                          ? "destructive"
                          : task.priority === "high"
                          ? "warning"
                          : "secondary"
                      }
                    >
                      {task.priority}
                    </Badge>
                  </div>
                )
              })}
              {upcomingTasks.length === 0 && (
                <div className="p-8 text-center text-slate-500">
                  No upcoming tasks
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
