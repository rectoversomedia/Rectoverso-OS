"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  Clock,
  Users,
  ListChecks,
  FileText,
  Video,
  ExternalLink,
  Check,
  Copy,
  Edit,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { sops } from "@/data/mock-data"
import { formatDate } from "@/lib/utils"

export default function SOPDetailPage() {
  const params = useParams()
  const sopId = params.id as string

  const sop = sops.find((s) => s.id === sopId)

  if (!sop) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h2 className="text-xl font-semibold text-slate-300">SOP not found</h2>
        <p className="text-sm text-slate-500 mt-2">
          The SOP you&apos;re looking for doesn&apos;t exist.
        </p>
        <Button className="mt-4" asChild>
          <Link href="/sop">Back to SOP Library</Link>
        </Button>
      </div>
    )
  }

  const steps = sop.content.split("\n").filter((s) => s.trim())
  const numberedSteps = steps
    .map((step, index) => {
      const cleanedStep = step.replace(/^\d+\.\s*/, "").trim()
      return { number: index + 1, text: cleanedStep }
    })
    .filter((s) => s.text.length > 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/sop">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-50">{sop.title}</h1>
              <Badge variant="outline">{sop.category}</Badge>
            </div>
            <div className="flex items-center gap-4 mt-2 text-sm text-slate-400">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{sop.estimated_time}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span className="capitalize">{sop.role.replace("_", " ")}</span>
              </div>
              <div className="flex items-center gap-1">
                <ListChecks className="h-4 w-4" />
                <span>{sop.checklist.length} steps</span>
              </div>
              <span>•</span>
              <span>Updated {formatDate(sop.updated_at)}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Copy className="mr-2 h-4 w-4" />
            Copy SOP
          </Button>
          <Button>
            <Edit className="mr-2 h-4 w-4" />
            Edit SOP
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Steps */}
          <Card className="border-slate-800">
            <CardHeader>
              <CardTitle className="text-lg">Step by Step Guide</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {numberedSteps.map((step, index) => (
                  <div
                    key={index}
                    className="flex gap-4 p-4 rounded-lg border border-slate-800 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-400 font-bold">
                      {step.number}
                    </div>
                    <p className="text-slate-200 pt-1">{step.text}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Video Placeholder */}
          {sop.video_url && (
            <Card className="border-slate-800">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Video className="h-5 w-5 text-cyan-400" />
                  Video Tutorial
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video rounded-lg bg-slate-800 flex items-center justify-center">
                  <Button variant="outline">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Watch Video
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Checklist */}
          <Card className="border-slate-800">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <ListChecks className="h-5 w-5 text-cyan-400" />
                Checklist
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {sop.checklist.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-800/50 transition-colors"
                  >
                    <div className="h-5 w-5 rounded border border-slate-700 flex items-center justify-center">
                      <Check className="h-3 w-3 text-cyan-400" />
                    </div>
                    <span className="text-sm text-slate-300">{item}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Templates */}
          {sop.templates && sop.templates.length > 0 && (
            <Card className="border-slate-800">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5 text-cyan-400" />
                  Related Templates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {sop.templates.map((template, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-slate-400" />
                        <span className="text-sm">{template}</span>
                      </div>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <Card className="border-cyan-500/30 bg-cyan-500/5">
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <FileText className="mr-2 h-4 w-4" />
                Start New Campaign with this SOP
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <ListChecks className="mr-2 h-4 w-4" />
                Generate Checklist Task
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Copy className="mr-2 h-4 w-4" />
                Duplicate SOP
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
