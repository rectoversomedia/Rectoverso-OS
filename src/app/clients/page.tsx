"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Plus,
  Search,
  Building2,
  Mail,
  Phone,
  DollarSign,
  ExternalLink,
  MoreHorizontal,
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { clients, campaigns, invoices } from "@/data/mock-data"
import { formatCurrency } from "@/lib/utils"

export default function ClientsPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const clientsWithStats = clients.map((client) => {
    const clientCampaigns = campaigns.filter((c) => c.client_id === client.id)
    const clientInvoices = invoices.filter((i) => i.client_id === client.id)
    const activeCampaigns = clientCampaigns.filter((c) => c.status === "running").length
    const totalRevenue = clientInvoices
      .filter((i) => i.status === "paid")
      .reduce((sum, i) => sum + i.amount, 0)
    const outstandingPayment = clientInvoices
      .filter((i) => i.status !== "paid" && i.status !== "disputed")
      .reduce((sum, i) => sum + i.amount, 0)

    return {
      ...client,
      activeCampaigns,
      totalCampaigns: clientCampaigns.length,
      totalRevenue,
      outstandingPayment,
    }
  })

  const filteredClients = clientsWithStats.filter(
    (client) =>
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.industry.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Clients</h1>
          <p className="text-sm text-slate-600">
            Manage client relationships and history
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Client
        </Button>
      </div>

      {/* Search */}
      <Card className="border-slate-200">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <Input
              placeholder="Search clients by name or industry..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-slate-50"
            />
          </div>
        </CardContent>
      </Card>

      {/* Clients Table */}
      <Card className="border-slate-200">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-200 hover:bg-transparent">
                <TableHead>Client</TableHead>
                <TableHead>Industry</TableHead>
                <TableHead>PIC</TableHead>
                <TableHead>Active Campaigns</TableHead>
                <TableHead>Total Revenue</TableHead>
                <TableHead>Outstanding</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.map((client) => (
                <TableRow key={client.id} className="border-slate-100">
                  <TableCell>
                    <Link
                      href={`/clients/${client.id}`}
                      className="font-medium text-slate-900 hover:text-cyan-600 transition-colors"
                    >
                      {client.name}
                    </Link>
                    {client.notes && (
                      <p className="text-xs text-slate-500 truncate max-w-xs mt-1">
                        {client.notes}
                      </p>
                    )}
                  </TableCell>
                  <TableCell className="text-slate-600">
                    {client.industry}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="text-sm">{client.pic_name}</p>
                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {client.pic_email}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge variant={client.activeCampaigns > 0 ? "success" : "secondary"}>
                        {client.activeCampaigns} active
                      </Badge>
                      <span className="text-xs text-slate-500">
                        / {client.totalCampaigns} total
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono">
                    {formatCurrency(client.totalRevenue)}
                  </TableCell>
                  <TableCell>
                    {client.outstandingPayment > 0 ? (
                      <span className="font-mono text-amber-600">
                        {formatCurrency(client.outstandingPayment)}
                      </span>
                    ) : (
                      <span className="text-slate-500">-</span>
                    )}
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
                          <Link href={`/clients/${client.id}`}>
                            <ExternalLink className="mr-2 h-4 w-4" />
                            View Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>Edit Client</DropdownMenuItem>
                        <DropdownMenuItem>View Campaigns</DropdownMenuItem>
                        <DropdownMenuItem>View Invoices</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {filteredClients.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Building2 className="h-12 w-12 text-slate-500 mb-4" />
          <h3 className="text-lg font-medium text-slate-700">No clients found</h3>
          <p className="text-sm text-slate-500 mt-1">
            Try adjusting your search or add a new client.
          </p>
        </div>
      )}
    </div>
  )
}
