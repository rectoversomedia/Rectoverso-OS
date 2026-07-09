"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useMutation } from "@tanstack/react-query"
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Plus,
  Trash2,
  Calendar,
  DollarSign,
  Target,
  FileText,
  Users,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { clients, users, publishers } from "@/data/mock-data"
import { formatCurrency } from "@/lib/utils"
import { showToast, toastMessages } from "@/features/notifications/Toaster"

const steps = [
  { id: 1, title: "Client & Basic Info", icon: FileText },
  { id: 2, title: "KPI & Tracking", icon: Target },
  { id: 3, title: "Deliverables", icon: Check },
  { id: 4, title: "Publisher Plan", icon: Users },
  { id: 5, title: "Review & Create", icon: Check },
]

const campaignTypes = [
  { value: "lead_generation", label: "Lead Generation" },
  { value: "app_download", label: "App Download" },
  { value: "registration", label: "Registration" },
  { value: "vcbl", label: "VCBL" },
  { value: "influencer_campaign", label: "Influencer Campaign" },
  { value: "publisher_distribution", label: "Publisher Distribution" },
  { value: "media_placement", label: "Media Placement" },
  { value: "performance_campaign", label: "Performance Campaign" },
  { value: "social_amplification", label: "Social Amplification" },
]

const kpiTypes = [
  { value: "leads", label: "Leads" },
  { value: "downloads", label: "Downloads" },
  { value: "registrations", label: "Registrations" },
  { value: "views", label: "Views" },
  { value: "clicks", label: "Clicks" },
  { value: "sales", label: "Sales" },
  { value: "custom", label: "Custom" },
]

export default function NewCampaignPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)

  // Create campaign mutation
  const createCampaignMutation = useMutation({
    mutationFn: async (campaignData: typeof formData) => {
      // In production, call API here
      // For demo, simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      return { id: `camp_${Date.now()}`, ...campaignData }
    },
    onSuccess: () => {
      showToast.success("Campaign created", "Redirecting to campaigns list...")
      router.push("/campaigns")
    },
    onError: (error) => {
      showToast.error("Failed to create campaign", error instanceof Error ? error.message : "Please try again")
    },
  })

  // Form state
  const [formData, setFormData] = useState({
    // Step 1
    client_id: "",
    name: "",
    type: "",
    objective: "",
    budget: "",
    start_date: "",
    end_date: "",
    pic_id: "",
    // Step 2
    kpi_type: "",
    kpi_target: "",
    tracking_link: "",
    utm_source: "",
    utm_medium: "",
    utm_campaign: "",
    notes: "",
    // Step 3
    deliverables: [""],
    // Step 4
    selectedPublishers: [] as string[],
  })

  const updateFormData = (field: string, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const addDeliverable = () => {
    setFormData((prev) => ({
      ...prev,
      deliverables: [...prev.deliverables, ""],
    }))
  }

  const removeDeliverable = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      deliverables: prev.deliverables.filter((_, i) => i !== index),
    }))
  }

  const updateDeliverable = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      deliverables: prev.deliverables.map((d, i) => (i === index ? value : d)),
    }))
  }

  const togglePublisher = (publisherId: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedPublishers: prev.selectedPublishers.includes(publisherId)
        ? prev.selectedPublishers.filter((id) => id !== publisherId)
        : [...prev.selectedPublishers, publisherId],
    }))
  }

  const handleSubmit = () => {
    // Validate form before submission
    if (!canProceed()) {
      showToast.warning("Please complete all required fields")
      return
    }

    // Submit via mutation
    createCampaignMutation.mutate(formData)
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return (
          formData.client_id &&
          formData.name &&
          formData.type &&
          formData.budget &&
          formData.start_date &&
          formData.end_date
        )
      case 2:
        return formData.kpi_type && formData.kpi_target
      case 3:
        return formData.deliverables.some((d) => d.trim())
      default:
        return true
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/campaigns">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">New Campaign</h1>
          <p className="text-sm text-slate-400">Create a new campaign for your client</p>
        </div>
      </div>

      {/* Progress Steps */}
      <Card className="border-slate-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex items-center">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                      currentStep > step.id
                        ? "border-cyan-500 bg-cyan-600 text-white"
                        : currentStep === step.id
                        ? "border-cyan-500 bg-cyan-600/20 text-cyan-400"
                        : "border-slate-300 text-slate-9000"
                    }`}
                  >
                    {currentStep > step.id ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <step.icon className="h-5 w-5" />
                    )}
                  </div>
                  <span
                    className={`ml-3 text-sm font-medium hidden md:block ${
                      currentStep >= step.id ? "text-slate-700" : "text-slate-9000"
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`mx-4 h-px w-16 md:w-24 ${
                      currentStep > step.id ? "bg-cyan-600" : "bg-slate-800"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Form Content */}
      <Card className="border-slate-200">
        <CardContent className="p-6">
          {/* Step 1: Client & Basic Info */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="h-5 w-5 text-cyan-400" />
                <h2 className="text-lg font-semibold">Client & Basic Information</h2>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="client_id">Client *</Label>
                  <Select
                    value={formData.client_id}
                    onValueChange={(value) => updateFormData("client_id", value)}
                  >
                    <SelectTrigger className="bg-slate-100">
                      <SelectValue placeholder="Select client" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Campaign Name *</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Tunaiku App Download Q3 2024"
                    value={formData.name}
                    onChange={(e) => updateFormData("name", e.target.value)}
                    className="bg-slate-100"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Campaign Type *</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => updateFormData("type", value)}
                  >
                    <SelectTrigger className="bg-slate-100">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {campaignTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pic_id">PIC (Person in Charge)</Label>
                  <Select
                    value={formData.pic_id}
                    onValueChange={(value) => updateFormData("pic_id", value)}
                  >
                    <SelectTrigger className="bg-slate-100">
                      <SelectValue placeholder="Select PIC" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.full_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="objective">Objective *</Label>
                  <Textarea
                    id="objective"
                    placeholder="Describe the campaign objective..."
                    value={formData.objective}
                    onChange={(e) => updateFormData("objective", e.target.value)}
                    className="bg-slate-100"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="budget">Budget (IDR) *</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-9000">
                      Rp
                    </span>
                    <Input
                      id="budget"
                      type="number"
                      placeholder="500000000"
                      value={formData.budget}
                      onChange={(e) => updateFormData("budget", e.target.value)}
                      className="pl-10 bg-slate-100"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="budget_formatted">Budget Preview</Label>
                  <div className="flex h-10 items-center rounded-md border border-slate-300 bg-slate-100 px-3 text-slate-400">
                    {formData.budget ? formatCurrency(Number(formData.budget)) : "-"}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="start_date">Start Date *</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => updateFormData("start_date", e.target.value)}
                    className="bg-slate-100"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="end_date">End Date *</Label>
                  <Input
                    id="end_date"
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => updateFormData("end_date", e.target.value)}
                    className="bg-slate-100"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: KPI & Tracking */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <Target className="h-5 w-5 text-cyan-400" />
                <h2 className="text-lg font-semibold">KPI & Tracking Setup</h2>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="kpi_type">KPI Type *</Label>
                  <Select
                    value={formData.kpi_type}
                    onValueChange={(value) => updateFormData("kpi_type", value)}
                  >
                    <SelectTrigger className="bg-slate-100">
                      <SelectValue placeholder="Select KPI type" />
                    </SelectTrigger>
                    <SelectContent>
                      {kpiTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="kpi_target">KPI Target *</Label>
                  <Input
                    id="kpi_target"
                    type="number"
                    placeholder="50000"
                    value={formData.kpi_target}
                    onChange={(e) => updateFormData("kpi_target", e.target.value)}
                    className="bg-slate-100"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="tracking_link">Tracking Link</Label>
                  <Input
                    id="tracking_link"
                    placeholder="https://landing.page/conversion"
                    value={formData.tracking_link}
                    onChange={(e) => updateFormData("tracking_link", e.target.value)}
                    className="bg-slate-100"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="utm_source">UTM Source</Label>
                  <Input
                    id="utm_source"
                    placeholder="facebook, google, instagram"
                    value={formData.utm_source}
                    onChange={(e) => updateFormData("utm_source", e.target.value)}
                    className="bg-slate-100"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="utm_medium">UTM Medium</Label>
                  <Input
                    id="utm_medium"
                    placeholder="cpc, content, influencer"
                    value={formData.utm_medium}
                    onChange={(e) => updateFormData("utm_medium", e.target.value)}
                    className="bg-slate-100"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="utm_campaign">UTM Campaign</Label>
                  <Input
                    id="utm_campaign"
                    placeholder="campaign_name_q3_2024"
                    value={formData.utm_campaign}
                    onChange={(e) => updateFormData("utm_campaign", e.target.value)}
                    className="bg-slate-100"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Additional notes..."
                    value={formData.notes}
                    onChange={(e) => updateFormData("notes", e.target.value)}
                    className="bg-slate-100"
                    rows={3}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Deliverables */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <Check className="h-5 w-5 text-cyan-400" />
                <h2 className="text-lg font-semibold">Campaign Deliverables</h2>
              </div>

              <p className="text-sm text-slate-400">
                Define what this campaign will deliver. These will be used for client
                reporting and internal tracking.
              </p>

              <div className="space-y-4">
                {formData.deliverables.map((deliverable, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Input
                      placeholder={`Deliverable ${index + 1} (e.g., 50,000 app downloads)`}
                      value={deliverable}
                      onChange={(e) => updateDeliverable(index, e.target.value)}
                      className="bg-slate-100"
                    />
                    {formData.deliverables.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeDeliverable(index)}
                        className="text-slate-400 hover:text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}

                <Button
                  variant="outline"
                  onClick={addDeliverable}
                  className="mt-2 border-slate-300"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Deliverable
                </Button>
              </div>

              <div className="mt-6 rounded-lg border border-slate-200 bg-slate-100 p-4">
                <h4 className="text-sm font-medium text-slate-600 mb-2">
                  Quick Add Templates
                </h4>
                <div className="flex flex-wrap gap-2">
                  {[
                    "50,000 app downloads",
                    "10,000 qualified leads",
                    "100 influencer posts",
                    "Daily performance report",
                    "Final campaign report",
                  ].map((template) => (
                    <Badge
                      key={template}
                      variant="outline"
                      className="cursor-pointer hover:bg-slate-700"
                      onClick={() => {
                        if (!formData.deliverables.includes(template)) {
                          setFormData((prev) => ({
                            ...prev,
                            deliverables: [...prev.deliverables.filter(d => d), template],
                          }))
                        }
                      }}
                    >
                      {template}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Publisher Plan */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <Users className="h-5 w-5 text-cyan-400" />
                <h2 className="text-lg font-semibold">Publisher / Channel Plan</h2>
              </div>

              <p className="text-sm text-slate-400">
                Select publishers or channels for this campaign. You can add more later.
              </p>

              <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                {publishers
                  .filter((p) => p.status === "active" || p.status === "testing")
                  .map((publisher) => (
                    <div
                      key={publisher.id}
                      className={`flex items-center gap-4 rounded-lg border p-4 cursor-pointer transition-colors ${
                        formData.selectedPublishers.includes(publisher.id)
                          ? "border-cyan-500 bg-cyan-600/10"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                      onClick={() => togglePublisher(publisher.id)}
                    >
                      <Checkbox
                        checked={formData.selectedPublishers.includes(publisher.id)}
                        onCheckedChange={() => togglePublisher(publisher.id)}
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{publisher.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {publisher.type}
                          </Badge>
                        </div>
                        <div className="text-sm text-slate-400">
                          {publisher.category} • {publisher.city}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          {formatCurrency(publisher.rate || 0)}
                        </div>
                        <div className="text-xs text-slate-9000">
                          {publisher.audience_size?.toLocaleString()} reach
                        </div>
                      </div>
                    </div>
                  ))}
              </div>

              <div className="mt-4 rounded-lg border border-slate-200 bg-slate-100 p-4">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-400">Selected Publishers</span>
                  <span className="font-medium">{formData.selectedPublishers.length}</span>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Review */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <Check className="h-5 w-5 text-cyan-400" />
                <h2 className="text-lg font-semibold">Review & Create Campaign</h2>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <Card className="border-slate-200 bg-slate-100">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-slate-400">
                      Campaign Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-xs text-slate-9000">Name</p>
                      <p className="font-medium">{formData.name || "-"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-9000">Client</p>
                      <p className="font-medium">
                        {clients.find((c) => c.id === formData.client_id)?.name || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-9000">Type</p>
                      <p className="font-medium">
                        {campaignTypes.find((t) => t.value === formData.type)?.label || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-9000">Budget</p>
                      <p className="font-medium">
                        {formData.budget ? formatCurrency(Number(formData.budget)) : "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-9000">Period</p>
                      <p className="font-medium">
                        {formData.start_date} - {formData.end_date}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-slate-200 bg-slate-100">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-slate-400">KPI Target</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-xs text-slate-9000">KPI Type</p>
                      <p className="font-medium">
                        {kpiTypes.find((k) => k.value === formData.kpi_type)?.label || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-9000">Target</p>
                      <p className="font-medium">
                        {formData.kpi_target
                          ? Number(formData.kpi_target).toLocaleString()
                          : "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-9000">Tracking Link</p>
                      <p className="font-medium text-sm truncate">
                        {formData.tracking_link || "-"}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-slate-200 bg-slate-100 md:col-span-2">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-slate-400">
                      Deliverables ({formData.deliverables.filter((d) => d).length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1">
                      {formData.deliverables
                        .filter((d) => d)
                        .map((deliverable, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm">
                            <Check className="h-4 w-4 text-cyan-400" />
                            {deliverable}
                          </li>
                        ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-slate-200 bg-slate-100 md:col-span-2">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-slate-400">
                      Selected Publishers ({formData.selectedPublishers.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {formData.selectedPublishers.map((pubId) => {
                        const pub = publishers.find((p) => p.id === pubId)
                        return pub ? (
                          <Badge key={pubId} variant="outline">
                            {pub.name}
                          </Badge>
                        ) : null
                      })}
                      {formData.selectedPublishers.length === 0 && (
                        <span className="text-sm text-slate-9000">No publishers selected</span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="rounded-lg border border-cyan-500/30 bg-cyan-600/5 p-4">
                <p className="text-sm text-slate-600">
                  <strong className="text-cyan-400">Note:</strong> After creating this
                  campaign, a checklist of tasks will be automatically generated based on
                  the campaign type and workflow.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
          disabled={currentStep === 1}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>

        <div className="flex items-center gap-2">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`h-2 w-2 rounded-full ${
                step.id === currentStep
                  ? "bg-cyan-600"
                  : step.id < currentStep
                  ? "bg-cyan-600/50"
                  : "bg-slate-700"
              }`}
            />
          ))}
        </div>

        {currentStep < 5 ? (
          <Button
            onClick={() => setCurrentStep((prev) => Math.min(5, prev + 1))}
            disabled={!canProceed()}
          >
            Next
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={createCampaignMutation.isPending}>
            {createCampaignMutation.isPending ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Creating...
              </>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                Create Campaign
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  )
}
