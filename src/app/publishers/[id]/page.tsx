"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  Edit,
  Star,
  Users,
  DollarSign,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  publishers,
  campaigns,
  campaignPublishers,
  getCampaignsWithRelations,
} from "@/data/mock-data"
import { formatCurrency, formatDate } from "@/lib/utils"

const publisherTypeLabels: Record<string, string> = {
  media: "Media",
  influencer: "Influencer",
  community: "Community",
  local_contributor: "Local Contributor",
  website: "Website",
  social_account: "Social Account",
  whatsapp_group: "WhatsApp Group",
  telegram_group: "Telegram Group",
}

const statusColors: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-700",
  inactive: "bg-slate-100 text-slate-600",
  testing: "bg-amber-100 text-amber-700",
  blacklist: "bg-red-100 text-red-700",
}

export default function PublisherDetailPage() {
  const params = useParams()
  const publisherId = params.id as string

  const publisher = publishers.find((p) => p.id === publisherId)

  // Get campaigns linked to this publisher through campaignPublishers
  const publisherCampaignLinks = campaignPublishers.filter((cp) => cp.publisher_id === publisherId)
  const linkedCampaignIds = publisherCampaignLinks.map((cp) => cp.campaign_id)
  const publisherCampaigns = getCampaignsWithRelations().filter((c) => linkedCampaignIds.includes(c.id))

  const totalBudget = publisherCampaignLinks.reduce((sum, cp) => sum + cp.budget_allocation, 0)

  if (!publisher) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Users className="h-12 w-12 text-slate-400 mb-4" />
        <h2 className="text-xl font-semibold text-slate-700">Publisher not found</h2>
        <p className="text-sm text-slate-500 mt-2">
          The publisher you&apos;re looking for doesn&apos;t exist.
        </p>
        <Button className="mt-4" asChild>
          <Link href="/publishers">Back to Publishers</Link>
        </Button>
      </div>
    )
  }

  const renderQualityScore = (score: number | null) => {
    if (!score) return <span className="text-slate-400">N/A</span>
    const fullStars = Math.floor(score / 20)
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= fullStars
                ? "fill-amber-400 text-amber-400"
                : "text-slate-300"
            }`}
          />
        ))}
        <span className="ml-1 text-sm text-slate-600">{score}/100</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/publishers">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-slate-100 p-3">
              <Users className="h-8 w-8 text-slate-600" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-slate-900">{publisher.name}</h1>
                <Badge className={statusColors[publisher.status] || "bg-slate-100 text-slate-600"}>
                  {publisher.status}
                </Badge>
              </div>
              <p className="text-sm text-slate-600">
                {publisherTypeLabels[publisher.type]} {publisher.category && `- ${publisher.category}`}
              </p>
              <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                {publisher.city && publisher.province && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {publisher.city}, {publisher.province}
                  </span>
                )}
                {publisher.contact_person && (
                  <span>Contact: {publisher.contact_person}</span>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <ExternalLink className="mr-2 h-4 w-4" />
            Add to Campaign
          </Button>
          <Button variant="outline">
            <Edit className="mr-2 h-4 w-4" />
            Edit Publisher
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-slate-200">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="rounded-full bg-cyan-100 p-2">
              <DollarSign className="h-4 w-4 text-cyan-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">
                {formatCurrency(publisher.rate || 0)}
              </p>
              <p className="text-xs text-slate-500">Rate</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="rounded-full bg-blue-100 p-2">
              <Users className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">
                {publisher.audience_size?.toLocaleString() || "N/A"}
              </p>
              <p className="text-xs text-slate-500">Audience Size</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="rounded-full bg-amber-100 p-2">
              <Star className="h-4 w-4 text-amber-600" />
            </div>
            <div>
              <div className="mt-1">
                {renderQualityScore(publisher.quality_score ?? null)}
              </div>
              <p className="text-xs text-slate-500">Quality Score</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="rounded-full bg-emerald-100 p-2">
              <DollarSign className="h-4 w-4 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">
                {formatCurrency(totalBudget)}
              </p>
              <p className="text-xs text-slate-500">Total Budget</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contact Info */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {publisher.contact_person && (
              <div className="flex items-center gap-3">
                <span className="text-sm text-slate-500 w-24">Contact Person</span>
                <span className="text-sm text-slate-900">{publisher.contact_person}</span>
              </div>
            )}
            {publisher.whatsapp && (
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-slate-400" />
                <a href={`https://wa.me/${publisher.whatsapp}`} target="_blank" rel="noopener noreferrer" className="text-sm text-cyan-600 hover:underline">
                  {publisher.whatsapp}
                </a>
              </div>
            )}
            {publisher.email && (
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-slate-400" />
                <a href={`mailto:${publisher.email}`} className="text-sm text-cyan-600 hover:underline">
                  {publisher.email}
                </a>
              </div>
            )}
            {publisher.city && publisher.province && (
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-slate-400" />
                <span className="text-sm text-slate-700">
                  {publisher.city}, {publisher.province}
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        {publisher.notes && (
          <Card className="border-slate-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600">{publisher.notes}</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Campaigns */}
      <Tabs defaultValue="campaigns" className="space-y-4">
        <TabsList className="bg-slate-100">
          <TabsTrigger value="campaigns">Campaign History</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns">
          <Card className="border-slate-200">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-100 hover:bg-transparent">
                    <TableHead>Campaign</TableHead>
                    <TableHead>Deliverable</TableHead>
                    <TableHead>Budget</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {publisherCampaigns.map((campaign) => {
                    const cp = publisherCampaignLinks.find((x) => x.campaign_id === campaign.id)
                    return (
                      <TableRow key={campaign.id} className="border-slate-50">
                        <TableCell>
                          <Link href={`/campaigns/${campaign.id}`} className="font-medium text-slate-900 hover:text-cyan-600">
                            {campaign.name}
                          </Link>
                        </TableCell>
                        <TableCell className="text-slate-600">
                          {cp?.deliverable || "N/A"}
                        </TableCell>
                        <TableCell className="font-mono text-sm text-slate-700">
                          {formatCurrency(cp?.budget_allocation || 0)}
                        </TableCell>
                        <TableCell>
                          <Badge className={cp?.status === "problem" ? "bg-red-100 text-red-700" : "bg-slate-100 text-slate-600"}>
                            {cp?.status || "pending"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/campaigns/${campaign.id}`}>
                              <ExternalLink className="h-4 w-4" />
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                  {publisherCampaigns.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                        No campaigns yet
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance">
          <Card className="border-slate-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600">
                Performance data will be available once campaigns are completed.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
