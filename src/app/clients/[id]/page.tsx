"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { useState } from "react"
import {
  ArrowLeft,
  Mail,
  Phone,
  Building2,
  ExternalLink,
  Edit,
  DollarSign,
  Megaphone,
  FileText,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  clients,
  campaigns,
  invoices,
  getCampaignsWithRelations,
  getInvoicesWithRelations,
} from "@/data/mock-data"
import { formatCurrency, formatDate, getProgressPercentage, getStatusColor } from "@/lib/utils"
import { showToast } from "@/features/notifications/Toaster"

export default function ClientDetailPage() {
  const params = useParams()
  const clientId = params.id as string

  const client = clients.find((c) => c.id === clientId)
  const clientCampaigns = getCampaignsWithRelations().filter((c) => c.client_id === clientId)
  const clientInvoices = getInvoicesWithRelations().filter((i) => i.client_id === clientId)

  const activeCampaigns = clientCampaigns.filter((c) => c.status === "running")
  const totalRevenue = clientInvoices
    .filter((i) => i.status === "paid")
    .reduce((sum, i) => sum + i.amount, 0)
  const outstandingPayment = clientInvoices
    .filter((i) => i.status !== "paid" && i.status !== "disputed")
    .reduce((sum, i) => sum + i.amount, 0)

  // Click handlers
  const handleEditClient = () => {
    showToast.info("Coming soon", "Client editing functionality coming soon")
  }

  const handleCreateCampaign = () => {
    showToast.info("Coming soon", "Campaign creation will be available soon")
  }

  const handleViewInvoice = (invoice: typeof clientInvoices[0]) => {
    showToast.info("Invoice details", `Invoice: ${invoice.invoice_number}`)
  }

  if (!client) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Building2 className="h-12 w-12 text-slate-400 mb-4" />
        <h2 className="text-xl font-semibold text-slate-700">Client not found</h2>
        <p className="text-sm text-slate-500 mt-2">
          The client you&apos;re looking for doesn&apos;t exist.
        </p>
        <Button className="mt-4" asChild>
          <Link href="/clients">Back to Clients</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/clients">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-slate-100 p-3">
              <Building2 className="h-8 w-8 text-slate-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{client.name}</h1>
              <p className="text-sm text-slate-600">{client.industry}</p>
              <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                {client.pic_name && (
                  <span>PIC: {client.pic_name}</span>
                )}
                {client.pic_email && (
                  <a href={`mailto:${client.pic_email}`} className="flex items-center gap-1 hover:text-cyan-600">
                    <Mail className="h-3 w-3" />
                    {client.pic_email}
                  </a>
                )}
                {client.pic_whatsapp && (
                  <a href={`https://wa.me/${client.pic_whatsapp}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-cyan-600">
                    <Phone className="h-3 w-3" />
                    {client.pic_whatsapp}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleEditClient}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Client
          </Button>
          <Button onClick={handleCreateCampaign}>
            <Megaphone className="mr-2 h-4 w-4" />
            New Campaign
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-slate-200">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="rounded-full bg-cyan-100 p-2">
              <Megaphone className="h-4 w-4 text-cyan-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{clientCampaigns.length}</p>
              <p className="text-xs text-slate-500">Total Campaigns</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="rounded-full bg-emerald-100 p-2">
              <Megaphone className="h-4 w-4 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{activeCampaigns.length}</p>
              <p className="text-xs text-slate-500">Active Campaigns</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="rounded-full bg-emerald-100 p-2">
              <DollarSign className="h-4 w-4 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{formatCurrency(totalRevenue)}</p>
              <p className="text-xs text-slate-500">Total Revenue</p>
            </div>
          </CardContent>
        </Card>

        <Card className={outstandingPayment > 0 ? "border-amber-200 bg-amber-50" : "border-slate-200"}>
          <CardContent className="p-4 flex items-center gap-3">
            <div className={`rounded-full ${outstandingPayment > 0 ? "bg-amber-100" : "bg-slate-100"} p-2`}>
              <DollarSign className={`h-4 w-4 ${outstandingPayment > 0 ? "text-amber-600" : "text-slate-600"}`} />
            </div>
            <div>
              <p className={`text-2xl font-bold ${outstandingPayment > 0 ? "text-amber-700" : "text-slate-900"}`}>
                {formatCurrency(outstandingPayment)}
              </p>
              <p className="text-xs text-slate-500">Outstanding</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notes */}
      {client.notes && (
        <Card className="border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600">{client.notes}</p>
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      <Tabs defaultValue="campaigns" className="space-y-4">
        <TabsList className="bg-slate-100">
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns">
          <Card className="border-slate-200">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-100 hover:bg-transparent">
                    <TableHead>Campaign</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Budget</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clientCampaigns.map((campaign) => (
                    <TableRow key={campaign.id} className="border-slate-50">
                      <TableCell>
                        <Link href={`/campaigns/${campaign.id}`} className="font-medium text-slate-900 hover:text-cyan-600">
                          {campaign.name}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {campaign.type.replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(campaign.status)} variant="outline">
                          {campaign.status.replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1 w-32">
                          <Progress
                            value={getProgressPercentage(campaign.kpi_current, campaign.kpi_target)}
                            className="h-2"
                          />
                          <span className="text-xs text-slate-500">
                            {getProgressPercentage(campaign.kpi_current, campaign.kpi_target)}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm text-slate-700">
                        {formatCurrency(campaign.budget)}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/campaigns/${campaign.id}`}>
                            <ExternalLink className="h-4 w-4" />
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {clientCampaigns.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                        No campaigns yet
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invoices">
          <Card className="border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">Client Invoices</CardTitle>
              </div>
              <Button size="sm" onClick={() => showToast.info("Coming soon", "Create invoice from finance page")}>
                Create Invoice
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-100 hover:bg-transparent">
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Campaign</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clientInvoices.map((invoice) => (
                    <TableRow key={invoice.id} className="border-slate-50">
                      <TableCell className="font-mono text-sm">{invoice.invoice_number}</TableCell>
                      <TableCell>
                        {invoice.campaign && (
                          <Link href={`/campaigns/${invoice.campaign.id}`} className="text-slate-900 hover:text-cyan-600">
                            {invoice.campaign.name}
                          </Link>
                        )}
                      </TableCell>
                      <TableCell className="font-mono text-sm text-slate-700">
                        {formatCurrency(invoice.amount)}
                      </TableCell>
                      <TableCell className="text-sm text-slate-600">
                        {formatDate(invoice.invoice_date)}
                      </TableCell>
                      <TableCell className="text-sm text-slate-600">
                        {formatDate(invoice.due_date)}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(invoice.status)} variant="outline">
                          {invoice.status.replace("_", " ")}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                  {clientInvoices.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                        No invoices yet
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
