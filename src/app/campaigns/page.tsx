"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  AlertTriangle,
  ExternalLink,
  ChevronDown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getCampaignsWithRelations, clients } from "@/data/mock-data"
import {
  formatCurrency,
  formatDate,
  getProgressPercentage,
  getStatusColor,
} from "@/lib/utils"
import { CampaignStatus, HealthStatus } from "@/types"

const campaignTypeLabels: Record<string, string> = {
  lead_generation: "Lead Generation",
  app_download: "App Download",
  registration: "Registration",
  vcbl: "VCBL",
  influencer_campaign: "Influencer Campaign",
  publisher_distribution: "Publisher Distribution",
  media_placement: "Media Placement",
  performance_campaign: "Performance Campaign",
  social_amplification: "Social Amplification",
}

export default function CampaignsPage() {
  const campaigns = getCampaignsWithRelations()

  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [clientFilter, setClientFilter] = useState<string>("all")
  const [healthFilter, setHealthFilter] = useState<string>("all")

  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch =
      campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.client?.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus =
      statusFilter === "all" || campaign.status === statusFilter
    const matchesClient =
      clientFilter === "all" || campaign.client_id === clientFilter
    const matchesHealth =
      healthFilter === "all" || campaign.health_status === healthFilter

    return matchesSearch && matchesStatus && matchesClient && matchesHealth
  })

  const statusCounts = campaigns.reduce(
    (acc, campaign) => {
      acc[campaign.status] = (acc[campaign.status] || 0) + 1
      return acc
    },
    {} as Record<string, number>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-50">Campaigns</h1>
          <p className="text-sm text-slate-400">
            Manage and monitor all campaigns
          </p>
        </div>
        <Button asChild>
          <Link href="/campaigns/new">
            <Plus className="mr-2 h-4 w-4" />
            New Campaign
          </Link>
        </Button>
      </div>

      {/* Status Tabs */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={statusFilter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setStatusFilter("all")}
        >
          All ({campaigns.length})
        </Button>
        {Object.entries(statusCounts).map(([status, count]) => (
          <Button
            key={status}
            variant={statusFilter === status ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter(status)}
          >
            {status.replace("_", " ")} ({count})
          </Button>
        ))}
      </div>

      {/* Filters */}
      <Card className="border-slate-800">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[300px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <Input
                placeholder="Search campaigns..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-800/50"
              />
            </div>

            <Select value={clientFilter} onValueChange={setClientFilter}>
              <SelectTrigger className="w-[200px] bg-slate-800/50">
                <SelectValue placeholder="Filter by client" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Clients</SelectItem>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={healthFilter} onValueChange={setHealthFilter}>
              <SelectTrigger className="w-[150px] bg-slate-800/50">
                <SelectValue placeholder="Health" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Health</SelectItem>
                <SelectItem value="green">Green</SelectItem>
                <SelectItem value="yellow">Yellow</SelectItem>
                <SelectItem value="red">Red</SelectItem>
              </SelectContent>
            </Select>

            {(searchQuery || statusFilter !== "all" || clientFilter !== "all" || healthFilter !== "all") && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchQuery("")
                  setStatusFilter("all")
                  setClientFilter("all")
                  setHealthFilter("all")
                }}
              >
                Clear Filters
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Campaigns Table */}
      <Card className="border-slate-800">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-800 hover:bg-transparent">
                <TableHead className="w-[300px]">Campaign</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Health</TableHead>
                <TableHead>Budget</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCampaigns.map((campaign) => (
                <TableRow key={campaign.id} className="border-slate-800/50">
                  <TableCell>
                    <Link
                      href={`/campaigns/${campaign.id}`}
                      className="font-medium hover:text-cyan-400 transition-colors"
                    >
                      {campaign.name}
                    </Link>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge
                        variant={
                          campaign.payment_status === "overdue"
                            ? "destructive"
                            : campaign.payment_status === "paid"
                            ? "success"
                            : "secondary"
                        }
                        className="text-[10px]"
                      >
                        {campaign.payment_status.replace("_", " ")}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-slate-400">
                    {campaign.client?.name}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {campaignTypeLabels[campaign.type]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={getStatusColor(campaign.status)}
                      variant="outline"
                    >
                      {campaign.status.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1 w-32">
                      <Progress
                        value={getProgressPercentage(
                          campaign.kpi_current,
                          campaign.kpi_target
                        )}
                        className="h-2"
                      />
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500">
                          {getProgressPercentage(
                            campaign.kpi_current,
                            campaign.kpi_target
                          )}
                          %
                        </span>
                        <span className="text-slate-500">
                          {campaign.kpi_current.toLocaleString()} /{" "}
                          {campaign.kpi_target.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span
                        className={`status-dot ${
                          campaign.health_status === "green"
                            ? "green"
                            : campaign.health_status === "yellow"
                            ? "yellow"
                            : "red"
                        }`}
                      />
                      {campaign.health_status === "red" && (
                        <AlertTriangle className="h-4 w-4 text-red-400" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {formatCurrency(campaign.budget)}
                  </TableCell>
                  <TableCell className="text-slate-400 text-sm">
                    {formatDate(campaign.end_date)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/campaigns/${campaign.id}`}
                            className="flex items-center"
                          >
                            <ExternalLink className="mr-2 h-4 w-4" />
                            View Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>Edit Campaign</DropdownMenuItem>
                        <DropdownMenuItem>Duplicate</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-400">
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {filteredCampaigns.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="rounded-full bg-slate-800 p-4 mb-4">
            <Search className="h-8 w-8 text-slate-500" />
          </div>
          <h3 className="text-lg font-medium text-slate-300">No campaigns found</h3>
          <p className="text-sm text-slate-500 mt-1">
            Try adjusting your filters or create a new campaign.
          </p>
          <Button className="mt-4" asChild>
            <Link href="/campaigns/new">
              <Plus className="mr-2 h-4 w-4" />
              New Campaign
            </Link>
          </Button>
        </div>
      )}
    </div>
  )
}
