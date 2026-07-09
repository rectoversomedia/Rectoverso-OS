"use client"

import { Bell, Search, ChevronDown, LogOut, User, Settings, Check, Trash2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useNotifications, Notification } from "@/hooks/use-notifications"
import { users } from "@/data/mock-data"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"

const currentUser = users[0]

function NotificationItem({ notification }: { notification: Notification }) {
  const { markAsRead, clearNotification } = useNotifications()

  const typeStyles: Record<string, string> = {
    info: "bg-cyan-50 text-cyan-600",
    success: "bg-emerald-50 text-emerald-600",
    warning: "bg-amber-50 text-amber-600",
    error: "bg-red-50 text-red-600",
  }

  const typeIcons: Record<string, string> = {
    info: "●",
    success: "✓",
    warning: "⚠",
    error: "✕",
  }

  return (
    <div
      className={`flex items-start gap-3 p-3 hover:bg-slate-50 transition-colors cursor-pointer ${
        !notification.read ? "bg-cyan-50/50" : ""
      }`}
      onClick={() => markAsRead(notification.id)}
    >
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${typeStyles[notification.type]}`}>
        {typeIcons[notification.type]}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-900">{notification.title}</p>
        <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">{notification.message}</p>
        <p className="text-[10px] text-slate-400 mt-1">
          {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
        </p>
      </div>
      {!notification.read && (
        <div className="w-2 h-2 rounded-full bg-cyan-500 mt-2" />
      )}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 hover:bg-red-50"
        onClick={(e) => {
          e.stopPropagation()
          clearNotification(notification.id)
        }}
      >
        <Trash2 className="h-3 w-3" />
      </Button>
    </div>
  )
}

export function Header() {
  const { notifications, unreadCount, markAllAsRead, clearNotification } = useNotifications()

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
      {/* Search */}
      <div className="relative w-96">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input
          placeholder="Search campaigns, clients, tasks..."
          className="pl-10 bg-slate-50 border-slate-200 focus:border-cyan-500 focus:ring-cyan-500"
        />
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative text-slate-600 hover:text-slate-900 hover:bg-slate-100">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-96 p-0">
            <DropdownMenuLabel className="flex items-center justify-between p-4 pb-2">
              <span className="text-base font-semibold text-slate-900">Notifications</span>
              {unreadCount > 0 && (
                <Button variant="ghost" size="sm" className="text-xs h-auto py-1 text-cyan-600" onClick={markAllAsRead}>
                  <Check className="h-3 w-3 mr-1" />
                  Mark all read
                </Button>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="my-0" />
            <ScrollArea className="h-[400px]">
              <div className="divide-y divide-slate-100">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <div key={notification.id} className="relative group">
                      <NotificationItem notification={notification} />
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-slate-500">
                    No notifications
                  </div>
                )}
              </div>
            </ScrollArea>
            <DropdownMenuSeparator className="my-0" />
            <DropdownMenuItem className="p-3 text-center text-sm text-cyan-600 hover:text-cyan-700 hover:bg-cyan-50 cursor-pointer">
              <Link href="/notifications" className="w-full">
                View all notifications
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 px-2 hover:bg-slate-100">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-blue-600 text-sm text-white">
                  {currentUser.full_name.split(" ").map(n => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-slate-900">{currentUser.full_name}</p>
                <p className="text-xs text-slate-500 capitalize">{currentUser.role.replace("_", " ")}</p>
              </div>
              <ChevronDown className="h-4 w-4 text-slate-400" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span>{currentUser.full_name}</span>
                <span className="text-xs font-normal text-slate-500">{currentUser.email}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600 focus:text-red-600 cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
