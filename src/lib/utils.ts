import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat("id-ID").format(num)
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date))
}

export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date))
}

export function getDaysUntil(date: string | Date): number {
  const now = new Date()
  const target = new Date(date)
  const diff = target.getTime() - now.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

export function getDaysOverdue(date: string | Date): number {
  const now = new Date()
  const target = new Date(date)
  const diff = now.getTime() - target.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

export function getProgressPercentage(current: number, target: number): number {
  if (target === 0) return 0
  return Math.min(100, Math.round((current / target) * 100))
}

export function getCampaignHealthColor(health: string): string {
  switch (health) {
    case "green":
      return "text-emerald-500 bg-emerald-500/10"
    case "yellow":
      return "text-amber-500 bg-amber-500/10"
    case "red":
      return "text-red-500 bg-red-500/10"
    default:
      return "text-gray-400 bg-gray-400/10"
  }
}

export function getStatusColor(status: string): string {
  const statusColors: Record<string, string> = {
    // Campaign status
    draft: "bg-gray-500/10 text-gray-400",
    waiting_brief: "bg-yellow-500/10 text-yellow-500",
    setup: "bg-blue-500/10 text-blue-500",
    running: "bg-emerald-500/10 text-emerald-500",
    reporting: "bg-purple-500/10 text-purple-500",
    completed: "bg-emerald-500/10 text-emerald-500",
    paused: "bg-orange-500/10 text-orange-500",
    problem: "bg-red-500/10 text-red-500",
    // Payment status
    not_invoiced: "bg-gray-500/10 text-gray-400",
    invoice_sent: "bg-blue-500/10 text-blue-500",
    waiting_payment: "bg-yellow-500/10 text-yellow-500",
    partially_paid: "bg-orange-500/10 text-orange-500",
    paid: "bg-emerald-500/10 text-emerald-500",
    overdue: "bg-red-500/10 text-red-500",
    disputed: "bg-pink-500/10 text-pink-500",
    // Task status
    todo: "bg-gray-500/10 text-gray-400",
    in_progress: "bg-blue-500/10 text-blue-500",
    review: "bg-purple-500/10 text-purple-500",
    done: "bg-emerald-500/10 text-emerald-500",
    blocked: "bg-red-500/10 text-red-500",
    // Publisher status
    active: "bg-emerald-500/10 text-emerald-500",
    inactive: "bg-gray-500/10 text-gray-400",
    testing: "bg-yellow-500/10 text-yellow-500",
    blacklist: "bg-red-500/10 text-red-500",
  }
  return statusColors[status] || "bg-gray-500/10 text-gray-400"
}

export function getPriorityColor(priority: string): string {
  switch (priority) {
    case "low":
      return "text-gray-400"
    case "medium":
      return "text-blue-500"
    case "high":
      return "text-orange-500"
    case "urgent":
      return "text-red-500"
    default:
      return "text-gray-400"
  }
}

export function getInvoiceAging(days: number): { label: string; color: string } {
  if (days <= 0) return { label: "0-30", color: "text-emerald-500" }
  if (days <= 30) return { label: "0-30", color: "text-emerald-500" }
  if (days <= 60) return { label: "31-60", color: "text-yellow-500" }
  if (days <= 90) return { label: "61-90", color: "text-orange-500" }
  return { label: "90+", color: "text-red-500" }
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15)
}
