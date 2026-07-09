"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Plus,
  Search,
  MapPin,
  Phone,
  Mail,
  Star,
  MoreHorizontal,
  ExternalLink,
  Filter,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
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
import { publishers } from "@/data/mock-data"
import { formatCurrency } from "@/lib/utils"

const typeLabels: Record<string, string> = {
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
  active: "bg-emerald-100 text-emerald-700 border-emerald-200",
  inactive: "bg-slate-100 text-slate-600 border-slate-200",
  testing: "bg-amber-100 text-amber-700 border-amber-200",
  blacklist: "bg-red-100 text-red-700 border-red-200",
}

export default function PublishersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [cityFilter, setCityFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const filteredPublishers = publishers.filter((pub) => {
    const matchesSearch =
      pub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pub.category.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = typeFilter === "all" || pub.type === typeFilter
    const matchesCity = cityFilter === "all" || pub.city === cityFilter
    const matchesStatus = statusFilter === "all" || pub.status === statusFilter

    return matchesSearch && matchesType && matchesCity && matchesStatus
  })

  const cities = [...new Set(publishers.map((p) => p.city))]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Publishers</h1>
          <p className="text-sm text-slate-600">
            Manage publisher partnerships and channels
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Publisher
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="border-slate-200">
          <CardContent className="p-4">
            <p className="text-2xl font-bold">{publishers.length}</p>
            <p className="text-xs text-slate-500">Total Publishers</p>
          </CardContent>
        </Card>
        <Card className="border-emerald-500/30 bg-emerald-500/5">
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-emerald-400">
              {publishers.filter((p) => p.status === "active").length}
            </p>
            <p className="text-xs text-slate-500">Active</p>
          </CardContent>
        </Card>
        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-amber-400">
              {publishers.filter((p) => p.status === "testing").length}
            </p>
            <p className="text-xs text-slate-500">Testing</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200">
          <CardContent className="p-4">
            <p className="text-2xl font-bold">
              {publishers.reduce((sum, p) => sum + (p.audience_size || 0), 0).toLocaleString()}
            </p>
            <p className="text-xs text-slate-500">Total Audience</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-slate-200">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[300px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <Input
                placeholder="Search publishers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-50"
              />
            </div>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[180px] bg-slate-50">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {Object.entries(typeLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={cityFilter} onValueChange={setCityFilter}>
              <SelectTrigger className="w-[160px] bg-slate-50">
                <SelectValue placeholder="All Cities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cities</SelectItem>
                {cities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px] bg-slate-50">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="testing">Testing</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="blacklist">Blacklist</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Publishers Table */}
      <Card className="border-slate-200">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-200 hover:bg-transparent">
                <TableHead>Publisher</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Rate</TableHead>
                <TableHead>Audience</TableHead>
                <TableHead>Quality</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPublishers.map((pub) => (
                <TableRow key={pub.id} className="border-slate-100">
                  <TableCell>
                    <Link href={`/publishers/${pub.id}`} className="font-medium text-slate-900 hover:text-cyan-600">
                      {pub.name}
                    </Link>
                    {pub.notes && (
                      <p className="text-xs text-slate-500 truncate max-w-xs">
                        {pub.notes}
                      </p>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {typeLabels[pub.type]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-600">{pub.category}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm text-slate-500">
                      <MapPin className="h-3 w-3" />
                      {pub.city}, {pub.province}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="text-sm">{pub.contact_person}</p>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {pub.whatsapp}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono">
                    {pub.rate ? formatCurrency(pub.rate) : "-"}
                  </TableCell>
                  <TableCell className="text-slate-600">
                    {pub.audience_size ? pub.audience_size.toLocaleString() : "-"}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Star
                        className={`h-4 w-4 ${
                          (pub.quality_score || 0) >= 80
                            ? "text-amber-400 fill-amber-400"
                            : (pub.quality_score || 0) >= 60
                            ? "text-slate-400"
                            : "text-slate-300"
                        }`}
                      />
                      <span className="text-sm">{pub.quality_score || "-"}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={`border ${statusColors[pub.status]}`}>
                      {pub.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <ExternalLink className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>Edit Publisher</DropdownMenuItem>
                        <DropdownMenuItem>Add to Campaign</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-400">
                          Remove
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

      {filteredPublishers.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Search className="h-12 w-12 text-slate-500 mb-4" />
          <h3 className="text-lg font-medium text-slate-700">No publishers found</h3>
          <p className="text-sm text-slate-500 mt-1">
            Try adjusting your filters or add a new publisher.
          </p>
        </div>
      )}
    </div>
  )
}
