"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Megaphone,
  Users,
  CheckSquare,
  BookOpen,
  Building2,
  Wallet,
  Brain,
  Settings,
  ChevronLeft,
  ChevronRight,
  Calendar,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useState } from "react"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Campaigns", href: "/campaigns", icon: Megaphone },
  { name: "Clients", href: "/clients", icon: Building2 },
  { name: "Tasks", href: "/tasks", icon: CheckSquare },
  { name: "Team Calendar", href: "/calendar", icon: Calendar },
  { name: "Publishers", href: "/publishers", icon: BookOpen },
  { name: "Finance", href: "/finance", icon: Wallet },
  { name: "SOP Library", href: "/sop", icon: BookOpen },
  { name: "AI Assistant", href: "/ai", icon: Brain },
  { name: "Settings", href: "/settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-slate-800 bg-[#0a1628] transition-all duration-300",
        collapsed ? "w-[70px]" : "w-[260px]"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b border-slate-800 px-4">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-cyan-600">
              <span className="text-sm font-bold text-white">R</span>
            </div>
            <div>
              <span className="text-sm font-semibold text-slate-100">Rectoverso</span>
              <span className="text-sm font-medium text-cyan-400"> OS</span>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-cyan-600">
            <span className="text-sm font-bold text-white">R</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`)
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-cyan-500/20 text-cyan-400"
                      : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                  )}
                >
                  <item.icon className={cn("h-5 w-5 shrink-0", collapsed && "mx-auto")} />
                  {!collapsed && <span>{item.name}</span>}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Collapse Button */}
      <div className="border-t border-slate-800 p-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className={cn("w-full text-slate-400 hover:text-slate-200 hover:bg-slate-800/50", collapsed && "px-2")}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4" />
              <span>Collapse</span>
            </>
          )}
        </Button>
      </div>
    </aside>
  )
}
