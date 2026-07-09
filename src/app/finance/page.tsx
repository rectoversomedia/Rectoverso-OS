"use client"

import { useState } from "react"
import {
  Plus,
  Search,
  DollarSign,
  Clock,
  AlertTriangle,
  CheckCircle,
  FileText,
  MessageSquare,
  Download,
  TrendingUp,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  getInvoicesWithRelations,
  campaigns,
  clients,
} from "@/data/mock-data"
import {
  formatCurrency,
  formatDate,
  getDaysOverdue,
  getInvoiceAging,
  getStatusColor,
} from "@/lib/utils"

export default function FinancePage() {
  const invoices = getInvoicesWithRelations()

  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [clientFilter, setClientFilter] = useState<string>("all")

  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.invoice_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.client?.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || inv.status === statusFilter
    const matchesClient = clientFilter === "all" || inv.client_id === clientFilter

    return matchesSearch && matchesStatus && matchesClient
  })

  // Stats
  const totalOutstanding = invoices
    .filter((i) => i.status !== "paid" && i.status !== "disputed")
    .reduce((sum, i) => sum + i.amount, 0)

  const paidThisMonth = invoices
    .filter((i) => i.status === "paid" && i.paid_date?.startsWith("2024-07"))
    .reduce((sum, i) => sum + i.amount, 0)

  const overdueInvoices = invoices.filter((i) => i.status === "overdue")
  const overdueAmount = overdueInvoices.reduce((sum, i) => sum + i.amount, 0)

  const upcomingDue = invoices.filter(
    (i) =>
      i.status !== "paid" &&
      i.status !== "overdue" &&
      i.status !== "disputed" &&
      getDaysOverdue(i.due_date) >= -7 &&
      getDaysOverdue(i.due_date) <= 7
  )

  const notInvoiced = campaigns.filter(
    (c) => c.payment_status === "not_invoiced" && c.status === "running"
  )
  const notInvoicedAmount = notInvoiced.reduce((sum, c) => sum + c.budget, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Finance</h1>
          <p className="text-sm text-slate-600">
            Track invoices, payments, and cashflow
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Invoice
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-slate-200">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Outstanding</p>
                <p className="text-2xl font-bold mt-1">{formatCurrency(totalOutstanding)}</p>
              </div>
              <div className="rounded-full bg-amber-500/10 p-3">
                <DollarSign className="h-5 w-5 text-amber-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-emerald-500/30 bg-emerald-500/5">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-600">Paid This Month</p>
                <p className="text-2xl font-bold mt-1 text-emerald-600">
                  {formatCurrency(paidThisMonth)}
                </p>
              </div>
              <div className="rounded-full bg-emerald-500/10 p-3">
                <CheckCircle className="h-5 w-5 text-emerald-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-500/30 bg-red-500/5">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-600">Overdue Amount</p>
                <p className="text-2xl font-bold mt-1 text-red-600">
                  {formatCurrency(overdueAmount)}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {overdueInvoices.length} invoices
                </p>
              </div>
              <div className="rounded-full bg-red-500/10 p-3">
                <AlertTriangle className="h-5 w-5 text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-800">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-600">Not Yet Invoiced</p>
                <p className="text-2xl font-bold mt-1">{formatCurrency(notInvoicedAmount)}</p>
                <p className="text-xs text-slate-500 mt-1">
                  {notInvoiced.length} campaigns
                </p>
              </div>
              <div className="rounded-full bg-cyan-500/10 p-3">
                <FileText className="h-5 w-5 text-cyan-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Invoices Table */}
        <Card className="border-slate-200 lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Invoice Overview</CardTitle>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px] bg-slate-50">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="not_invoiced">Not Invoiced</SelectItem>
                  <SelectItem value="invoice_sent">Invoice Sent</SelectItem>
                  <SelectItem value="waiting_payment">Waiting Payment</SelectItem>
                  <SelectItem value="partially_paid">Partially Paid</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-200 hover:bg-transparent">
                  <TableHead>Invoice</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Aging</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.map((inv) => {
                  const aging = getDaysOverdue(inv.due_date)
                  const agingInfo = getInvoiceAging(aging)
                  return (
                    <TableRow key={inv.id} className="border-slate-200">
                      <TableCell>
                        <p className="font-mono font-medium">{inv.invoice_number}</p>
                        <p className="text-xs text-slate-500">
                          {formatDate(inv.invoice_date)}
                        </p>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium">{inv.client?.name}</p>
                        {inv.campaign && (
                          <p className="text-xs text-slate-500">
                            {inv.campaign.name.substring(0, 25)}...
                          </p>
                        )}
                      </TableCell>
                      <TableCell className="font-mono font-medium">
                        {formatCurrency(inv.amount)}
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {formatDate(inv.due_date)}
                      </TableCell>
                      <TableCell>
                        <span className={`font-medium ${agingInfo.color}`}>
                          {aging <= 0 ? "On Track" : `${aging} days`}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getStatusColor(inv.status)} border`}>
                          {inv.status.replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Overdue Invoices Alert */}
          {overdueInvoices.length > 0 && (
            <Card className="border-red-500/30 bg-red-50/50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  Overdue Invoices
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {overdueInvoices.map((inv) => (
                  <div
                    key={inv.id}
                    className="flex items-center justify-between rounded-lg border border-red-500/20 bg-red-50/50 p-3"
                  >
                    <div>
                      <p className="font-medium">{inv.client?.name}</p>
                      <p className="text-xs text-slate-500">
                        {getDaysOverdue(inv.due_date)} days overdue
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono font-bold text-red-600">
                        {formatCurrency(inv.amount)}
                      </p>
                      <Button size="sm" variant="outline" className="mt-1 border-red-500/30 text-red-600 hover:bg-red-50">
                        Follow Up
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Upcoming Due */}
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5 text-amber-600" />
                Due This Week
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingDue.length > 0 ? (
                upcomingDue.map((inv) => (
                  <div
                    key={inv.id}
                    className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-3"
                  >
                    <div>
                      <p className="font-medium">{inv.client?.name}</p>
                      <p className="text-xs text-slate-500">
                        Due in {getDaysOverdue(inv.due_date)} days
                      </p>
                    </div>
                    <p className="font-mono font-medium">
                      {formatCurrency(inv.amount)}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500 text-center py-4">
                  No invoices due this week
                </p>
              )}
            </CardContent>
          </Card>

          {/* Not Yet Invoiced */}
          <Card className="border-cyan-500/30 bg-cyan-50/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5 text-cyan-600" />
                Ready to Invoice
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {notInvoiced.length > 0 ? (
                notInvoiced.map((camp) => (
                  <div
                    key={camp.id}
                    className="flex items-center justify-between rounded-lg border border-cyan-500/20 bg-cyan-50/50 p-3"
                  >
                    <div>
                      <p className="font-medium text-sm">{camp.name}</p>
                      <p className="text-xs text-slate-500">
                        {camp.client?.name}
                      </p>
                    </div>
                    <Button size="sm" variant="outline" className="border-cyan-500/30 text-cyan-600 hover:bg-cyan-50">
                      Create Invoice
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500 text-center py-4">
                  No campaigns ready to invoice
                </p>
              )}
            </CardContent>
          </Card>

          {/* AI Suggested Follow Up */}
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-cyan-600" />
                AI Follow Up Messages
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {overdueInvoices.slice(0, 2).map((inv) => (
                <div
                  key={inv.id}
                  className="rounded-lg border border-slate-200 bg-slate-50 p-3"
                >
                  <p className="text-xs text-slate-500 mb-2">For {inv.client?.name}:</p>
                  <p className="text-sm italic text-slate-700">
                    &quot;Hi Mas/Mba, izin follow up untuk invoice {inv.invoice_number} campaign {inv.campaign?.name} sebesar {formatCurrency(inv.amount)} yang jatuh tempo pada {formatDate(inv.due_date)}. Mohon dibantu update estimasi pembayarannya ya. Terima kasih.&quot;
                  </p>
                  <Button size="sm" variant="ghost" className="mt-2 text-cyan-600">
                    Copy Message
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
