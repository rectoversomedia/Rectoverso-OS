"use client"

import { useState } from "react"
import {
  Users,
  Settings as SettingsIcon,
  Tags,
  Building2,
  BookOpen,
  Shield,
  Database,
  Plus,
  Pencil,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { users, clients } from "@/data/mock-data"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { showToast } from "@/features/notifications/Toaster"

const teamMembers = users

const roles = [
  { id: "founder", name: "Founder / Admin", color: "bg-purple-100 text-purple-700" },
  { id: "campaign_manager", name: "Campaign Manager", color: "bg-cyan-100 text-cyan-700" },
  { id: "campaign_ops", name: "Campaign Operations", color: "bg-blue-100 text-blue-700" },
  { id: "finance", name: "Finance", color: "bg-amber-100 text-amber-700" },
  { id: "sales", name: "Sales", color: "bg-emerald-100 text-emerald-700" },
  { id: "intern", name: "Intern", color: "bg-slate-100 text-slate-600" },
]

const campaignTypes = [
  "Lead Generation",
  "App Download",
  "Registration",
  "VCBL",
  "Influencer Campaign",
  "Publisher Distribution",
  "Media Placement",
  "Performance Campaign",
  "Social Amplification",
]

const taskStatuses = [
  { id: "todo", name: "Todo", color: "bg-slate-100 text-slate-600" },
  { id: "in_progress", name: "In Progress", color: "bg-blue-100 text-blue-700" },
  { id: "review", name: "Review", color: "bg-purple-100 text-purple-700" },
  { id: "done", name: "Done", color: "bg-emerald-100 text-emerald-700" },
  { id: "blocked", name: "Blocked", color: "bg-red-100 text-red-700" },
]

const paymentStatuses = [
  { id: "not_invoiced", name: "Not Invoiced" },
  { id: "invoice_sent", name: "Invoice Sent" },
  { id: "waiting_payment", name: "Waiting Payment" },
  { id: "partially_paid", name: "Partially Paid" },
  { id: "paid", name: "Paid" },
  { id: "overdue", name: "Overdue" },
  { id: "disputed", name: "Disputed" },
]

const publisherTypes = [
  "Media",
  "Influencer",
  "Community",
  "Local Contributor",
  "Website",
  "Social Account",
  "WhatsApp Group",
  "Telegram Group",
]

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("team")

  // Dialog states
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false)
  const [isEditPermissionsOpen, setIsEditPermissionsOpen] = useState(false)
  const [isEditTypeOpen, setIsEditTypeOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState<typeof roles[0] | null>(null)
  const [selectedType, setSelectedType] = useState<string>("")

  // Click handlers
  const handleAddMember = () => {
    setIsAddMemberOpen(true)
    showToast.info("Coming soon", "Add member form will be available soon")
  }

  const handleEditMember = (member: typeof users[0]) => {
    showToast.info("Coming soon", `Edit member: ${member.full_name}`)
  }

  const handleEditPermissions = (role: typeof roles[0]) => {
    setSelectedRole(role)
    setIsEditPermissionsOpen(true)
  }

  const handleAddType = (type: 'campaign' | 'task' | 'finance' | 'publisher') => {
    setSelectedType(type)
    setIsEditTypeOpen(true)
    showToast.info("Coming soon", "Add new type functionality coming soon")
  }

  const handleEditType = (typeName: string) => {
    showToast.info("Coming soon", `Edit type: ${typeName}`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="text-sm text-slate-600">
          Manage team, roles, and system configurations
        </p>
      </div>

      {/* Settings Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-slate-100">
          <TabsTrigger value="team" className="gap-2">
            <Users className="h-4 w-4" />
            Team
          </TabsTrigger>
          <TabsTrigger value="roles" className="gap-2">
            <Shield className="h-4 w-4" />
            Roles
          </TabsTrigger>
          <TabsTrigger value="campaigns" className="gap-2">
            <Tags className="h-4 w-4" />
            Campaign Types
          </TabsTrigger>
          <TabsTrigger value="tasks" className="gap-2">
            <SettingsIcon className="h-4 w-4" />
            Task Statuses
          </TabsTrigger>
          <TabsTrigger value="finance" className="gap-2">
            <Building2 className="h-4 w-4" />
            Finance Statuses
          </TabsTrigger>
          <TabsTrigger value="publishers" className="gap-2">
            <BookOpen className="h-4 w-4" />
            Publisher Types
          </TabsTrigger>
        </TabsList>

        {/* Team Members */}
        <TabsContent value="team" className="space-y-6">
          <Card className="border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Team Members</CardTitle>
                <CardDescription>
                  Manage team members and their roles
                </CardDescription>
              </div>
              <Button onClick={handleAddMember}>
                <Plus className="h-4 w-4 mr-2" />
                Add Member
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {teamMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-blue-600 text-lg">
                        {member.full_name.split(" ").map((n) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-slate-900">{member.full_name}</p>
                      <p className="text-sm text-slate-500">{member.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={roles.find((r) => r.id === member.role)?.color}>
                      {roles.find((r) => r.id === member.role)?.name}
                    </Badge>
                    <Button variant="ghost" size="sm" onClick={() => handleEditMember(member)}>
                      <Pencil className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Roles */}
        <TabsContent value="roles" className="space-y-6">
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle>User Roles</CardTitle>
              <CardDescription>
                Define roles and their permissions for the system
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {roles.map((role) => (
                <div
                  key={role.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${role.color}`} />
                    <div>
                      <p className="font-medium">{role.name}</p>
                      <p className="text-sm text-slate-500">
                        ID: {role.id}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => handleEditPermissions(role)}>
                    Edit Permissions
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Campaign Types */}
        <TabsContent value="campaigns" className="space-y-6">
          <Card className="border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Campaign Types</CardTitle>
                <CardDescription>
                  Manage available campaign types for your campaigns
                </CardDescription>
              </div>
              <Button onClick={() => handleAddType('campaign')}>
                <Plus className="h-4 w-4 mr-2" />
                Add Type
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2">
                {campaignTypes.map((type, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors"
                  >
                    <span className="text-sm">{type}</span>
                    <Button variant="ghost" size="sm" onClick={() => handleEditType(type)}>
                      <Pencil className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Task Statuses */}
        <TabsContent value="tasks" className="space-y-6">
          <Card className="border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Task Statuses</CardTitle>
                <CardDescription>
                  Configure task workflow statuses
                </CardDescription>
              </div>
              <Button onClick={() => handleAddType('task')}>
                <Plus className="h-4 w-4 mr-2" />
                Add Status
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {taskStatuses.map((status) => (
                  <div
                    key={status.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${status.color}`} />
                      <span className="font-medium">{status.name}</span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => handleEditType(status.name)}>
                      <Pencil className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Finance Statuses */}
        <TabsContent value="finance" className="space-y-6">
          <Card className="border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Finance / Payment Statuses</CardTitle>
                <CardDescription>
                  Configure invoice and payment workflow statuses
                </CardDescription>
              </div>
              <Button onClick={() => handleAddType('finance')}>
                <Plus className="h-4 w-4 mr-2" />
                Add Status
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {paymentStatuses.map((status) => (
                  <div
                    key={status.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors"
                  >
                    <div>
                      <span className="font-medium">{status.name}</span>
                      <p className="text-xs text-slate-500">ID: {status.id}</p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => handleEditType(status.name)}>
                      <Pencil className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Publisher Types */}
        <TabsContent value="publishers" className="space-y-6">
          <Card className="border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Publisher Types</CardTitle>
                <CardDescription>
                  Configure available publisher/channel types
                </CardDescription>
              </div>
              <Button onClick={() => handleAddType('publisher')}>
                <Plus className="h-4 w-4 mr-2" />
                Add Type
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2">
                {publisherTypes.map((type, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors"
                  >
                    <span className="text-sm">{type}</span>
                    <Button variant="ghost" size="sm" onClick={() => handleEditType(type)}>
                      <Pencil className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Database Info */}
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-cyan-600" />
            Database Configuration
          </CardTitle>
          <CardDescription>
            Supabase configuration for production deployment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="supabase_url">Supabase URL</Label>
              <Input
                id="supabase_url"
                placeholder="https://your-project.supabase.co"
                className="bg-slate-100"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="supabase_key">Supabase Anonymous Key</Label>
              <Input
                id="supabase_key"
                type="password"
                placeholder="eyJhbGciOiJIUzI1NiIs..."
                className="bg-slate-100"
              />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-4">
            Add these to your .env.local file for Supabase integration.
          </p>
        </CardContent>
      </Card>

      {/* Add Member Dialog */}
      <Dialog open={isAddMemberOpen} onOpenChange={setIsAddMemberOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Team Member</DialogTitle>
            <DialogDescription>
              Add a new member to your team.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-slate-500">
              Team member invitation functionality coming soon.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddMemberOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Permissions Dialog */}
      <Dialog open={isEditPermissionsOpen} onOpenChange={setIsEditPermissionsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Role Permissions</DialogTitle>
            <DialogDescription>
              Configure permissions for {selectedRole?.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-slate-500">
              Role permissions management coming soon.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditPermissionsOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Type Dialog */}
      <Dialog open={isEditTypeOpen} onOpenChange={setIsEditTypeOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Type</DialogTitle>
            <DialogDescription>
              Edit {selectedType}.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-slate-500">
              Type editing functionality coming soon.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditTypeOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
