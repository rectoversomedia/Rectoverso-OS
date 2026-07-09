import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Providers } from "@/lib/query/providers/query-provider"
import { Toaster } from "@/features/notifications/Toaster"
import { NotificationProvider } from "@/hooks/use-notifications"
import "./globals.css"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Rectoverso OS - Internal Operating System",
  description: "The internal operating system for Rectoverso Growth Technology Company. Manage campaigns, clients, tasks, and operations.",
  icons: {
    icon: [
      {
        url: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect fill='%2306b6d4' rx='20' width='100' height='100'/><text x='50' y='70' font-size='60' text-anchor='middle' fill='white' font-family='system-ui' font-weight='bold'>R</text></svg>",
        type: "image/svg+xml",
      },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} min-h-screen antialiased`}>
        <NotificationProvider>
          <Providers>
            {children}
            <Toaster />
          </Providers>
        </NotificationProvider>
      </body>
    </html>
  )
}
