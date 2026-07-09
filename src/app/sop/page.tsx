"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Search,
  BookOpen,
  Clock,
  Users,
  ChevronRight,
  Play,
  FileText,
  ListChecks,
  Video,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { sops } from "@/data/mock-data"
import { formatDate } from "@/lib/utils"

const categoryIcons: Record<string, React.ElementType> = {
  "Campaign Setup": BookOpen,
  "Lead Generation": Users,
  "Publisher Coordination": Users,
  "Client Reporting": FileText,
  "Finance & Invoice": FileText,
  "Quality Control": ListChecks,
  "Influencer Campaign": Users,
  "Media Placement": Play,
  "App Download Campaign": DownloadIcon,
  "Registration Campaign": FileText,
}

function DownloadIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" x2="12" y1="15" y2="3" />
    </svg>
  )
}

const categories = [...new Set(sops.map((s) => s.category))]

export default function SOPLibraryPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")

  const filteredSOPs = sops.filter((sop) => {
    const matchesSearch =
      sop.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sop.content.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory =
      categoryFilter === "all" || sop.category === categoryFilter

    return matchesSearch && matchesCategory
  })

  const groupedSOPs = categories.reduce(
    (acc, category) => {
      acc[category] = filteredSOPs.filter((s) => s.category === category)
      return acc
    },
    {} as Record<string, typeof sops>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-50">SOP Library</h1>
          <p className="text-sm text-slate-400">
            Standard Operating Procedures for Rectoverso workflows
          </p>
        </div>
        <Button>
          <BookOpen className="mr-2 h-4 w-4" />
          Add SOP
        </Button>
      </div>

      {/* Info Banner */}
      <Card className="border-cyan-500/30 bg-gradient-to-r from-cyan-500/10 to-blue-500/10">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-cyan-500/20 p-3">
              <BookOpen className="h-6 w-6 text-cyan-400" />
            </div>
            <div>
              <p className="font-medium text-slate-200">
                Every workflow should have an SOP
              </p>
              <p className="text-sm text-slate-400">
                Link SOPs to tasks and checklist items so team members can follow the system,
                not ask the founder repeatedly.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card className="border-slate-800">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[300px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <Input
                placeholder="Search SOPs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-800/50"
              />
            </div>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[200px] bg-slate-800/50">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* SOP Categories */}
      <div className="space-y-8">
        {Object.entries(groupedSOPs).map(([category, categorySOPs]) => {
          if (categorySOPs.length === 0) return null
          const Icon = categoryIcons[category] || BookOpen

          return (
            <div key={category}>
              <div className="flex items-center gap-2 mb-4">
                <Icon className="h-5 w-5 text-cyan-400" />
                <h2 className="text-lg font-semibold text-slate-200">{category}</h2>
                <Badge variant="outline" className="text-xs">
                  {categorySOPs.length} SOPs
                </Badge>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {categorySOPs.map((sop) => (
                  <Card
                    key={sop.id}
                    className="border-slate-800 hover:border-slate-700 transition-colors cursor-pointer group"
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base font-medium group-hover:text-cyan-400 transition-colors">
                        {sop.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center gap-4 text-sm text-slate-400">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{sop.estimated_time}</span>
                          </div>
                          <Badge variant="outline" className="text-xs capitalize">
                            {sop.role.replace("_", " ")}
                          </Badge>
                        </div>

                        <p className="text-sm text-slate-500 line-clamp-2">
                          {sop.content.substring(0, 120)}...
                        </p>

                        {sop.checklist && (
                          <div className="flex items-center gap-1 text-xs text-slate-500">
                            <ListChecks className="h-3 w-3" />
                            <span>{sop.checklist.length} checklist items</span>
                          </div>
                        )}

                        {sop.templates && (
                          <div className="flex items-center gap-1 text-xs text-slate-500">
                            <FileText className="h-3 w-3" />
                            <span>{sop.templates.length} templates</span>
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                          <span className="text-xs text-slate-500">
                            Updated {formatDate(sop.updated_at)}
                          </span>
                          <Button variant="ghost" size="sm" className="text-cyan-400" asChild>
                            <Link href={`/sop/${sop.id}`}>
                              View SOP
                              <ChevronRight className="ml-1 h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {filteredSOPs.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <BookOpen className="h-12 w-12 text-slate-500 mb-4" />
          <h3 className="text-lg font-medium text-slate-300">No SOPs found</h3>
          <p className="text-sm text-slate-500 mt-1">
            Try adjusting your search or filters.
          </p>
        </div>
      )}
    </div>
  )
}
