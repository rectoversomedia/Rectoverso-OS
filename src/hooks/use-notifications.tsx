"use client"

import React, { createContext, useContext, useState, useCallback } from "react"

export type NotificationType = "info" | "success" | "warning" | "error"

export interface Notification {
  id: string
  title: string
  message: string
  type: NotificationType
  timestamp: Date
  read: boolean
  link?: string
}

interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  addNotification: (notification: Omit<Notification, "id" | "timestamp" | "read">) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  clearNotification: (id: string) => void
  clearAll: () => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

// Generate sample notifications
const sampleNotifications: Notification[] = [
  {
    id: "1",
    title: "Campaign at Risk",
    message: "FIFGROUP Hajatan campaign needs immediate attention. Publisher unable to deliver.",
    type: "error",
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    read: false,
    link: "/campaigns/camp3",
  },
  {
    id: "2",
    title: "Invoice Overdue",
    message: "Tunaiku Juni invoice (INV-2024-006) is 7 days overdue. Amount: Rp 320,000,000",
    type: "warning",
    timestamp: new Date(Date.now() - 60 * 60 * 1000),
    read: false,
    link: "/finance",
  },
  {
    id: "3",
    title: "New Task Assigned",
    message: "QC leads untuk campaign Prudential PRULady assigned to you by Dewi Lestari",
    type: "info",
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
    read: false,
    link: "/tasks",
  },
  {
    id: "4",
    title: "Task Completed",
    message: "Optimasi targeting Facebook Ads has been marked as done by Dewi Lestari",
    type: "success",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    read: true,
  },
  {
    id: "5",
    title: "Campaign Milestone",
    message: "Tunaiku App Download Q3 2024 reached 65% of target KPI",
    type: "success",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    read: true,
    link: "/campaigns/camp1",
  },
]

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>(sampleNotifications)

  const addNotification = useCallback(
    (notification: Omit<Notification, "id" | "timestamp" | "read">) => {
      const newNotification: Notification = {
        ...notification,
        id: Date.now().toString(),
        timestamp: new Date(),
        read: false,
      }
      setNotifications((prev) => [newNotification, ...prev])
    },
    []
  )

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }, [])

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }, [])

  const clearNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }, [])

  const clearAll = useCallback(() => {
    setNotifications([])
  }, [])

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearNotification,
        clearAll,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider")
  }
  return context
}
