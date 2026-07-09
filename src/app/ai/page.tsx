"use client"

import { useState } from "react"
import {
  Send,
  Brain,
  Sparkles,
  MessageSquare,
  Zap,
  FileText,
  Users,
  DollarSign,
  Megaphone,
  Lightbulb,
  Copy,
  RefreshCw,
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
import { ScrollArea } from "@/components/ui/scroll-area"
import { campaigns, clients } from "@/data/mock-data"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

const suggestedPrompts = [
  {
    icon: MessageSquare,
    title: "Buatkan update harian",
    description: "Generate daily update untuk client Tunaiku",
    prompt: "Buatkan update harian untuk campaign Tunaiku App Download Q3 2024",
  },
  {
    icon: AlertTriangle,
    title: "Analisis risiko campaign",
    description: "Identifikasi risiko campaign saat ini",
    prompt: "Apa risiko campaign FIFGROUP Hajatan saat ini dan rekomendasikan aksi yang perlu diambil?",
  },
  {
    icon: FileText,
    title: "Generate publisher brief",
    description: "Buat brief untuk publisher",
    prompt: "Buatkan brief untuk publisher untuk campaign lead generation",
  },
  {
    icon: DollarSign,
    title: "Follow up invoice",
    description: "Buat pesan follow up invoice",
    prompt: "Buatkan pesan follow up invoice overdue dengan bahasa sopan untuk client Prudential",
  },
  {
    icon: CheckSquare,
    title: "Generate checklist",
    description: "Buat checklist campaign",
    prompt: "Generate checklist lengkap untuk campaign app download baru",
  },
]

function AlertTriangle(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  )
}

function CheckSquare(props: React.SVGProps<SVGSVGElement>) {
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
      <polyline points="9 11 12 14 22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  )
}

const mockResponses: Record<string, string> = {
  "Buatkan update harian":
    `📊 **Daily Update - Campaign Tunaiku App Download Q3 2024**

**Tanggal:** 8 Juli 2024

**Summary:**
- Downloads hari ini: **1,245** (target: 1,100) ✅
- Total to date: 32,450 / 50,000 (**64.9%**)
- CPC turun **12%** dari kemarin

**Channel Performance:**
| Channel | Downloads | CPC | CTR |
|---------|-----------|-----|-----|
| Facebook | 680 | Rp 2,850 | 3.2% |
| Google | 420 | Rp 3,100 | 2.8% |
| Tiktok | 145 | Rp 1,950 | 4.1% |

**Highlights:**
- Facebook performs best dengan CTR 3.2%
- CPC Tiktok paling rendah Rp 1,950

**Recommendations:**
- Naikkan budget Facebook 20%
- Optimize creative untuk weekend campaign
- Test audience expansion di Google

**Action Items:**
- [ ] Review creative performance
- [ ] Setup A/B test untuk headlines
- [ ] Follow up tracking accuracy`,

  "Apa risiko campaign FIFGROUP":
    `🚨 **AI Risk Analysis: FIFGROUP Hajatan Campaign**

**Overall Risk Level:** 🔴 CRITICAL

**Identified Risks:**

1. **Publisher Delivery Failure** (CRITICAL)
   - Publisher utama tidak bisa deliver schedule
   - Impact: 40% dari total reach terancam tidak tercapai
   - Timeline: Now - perlu aksi segera

2. **Budget Underutilization**
   - Budget terpakai hanya 30% tapi waktu sudah 50%
   - Burn rate terlalu lambat

3. **Client Communication Gap**
   - Client belum di-notifikasi tentang masalah
   - Risk: Trust issue jika baru informed sekarang

**Recommended Actions:**

1. **Immediate (Hari Ini):**
   - Redirect 60% budget ke 3 publisher cadangan
   - Notify client tentang situasinya
   - Set up daily sync dengan publisher baru

2. **This Week:**
   - QC semua content dari publisher cadangan
   - Adjust timeline deliverables
   - Prepare backup plan untuk week 2

3. **Next Sprint:**
   - Review publisher selection criteria
   - Update SOP untuk contingency planning

**AI Confidence:** 92%

Mau saya generate pesan untuk notify client?`,

  "Buatkan pesan follow up invoice":
    `💰 **Generated Follow Up Message - Invoice Overdue**

---

**Untuk:** Maya Sari, Prudential Indonesia
**Invoice:** INV-2024-007
**Amount:** Rp 150,000,000
**Due Date:** 20 Juli 2024

---

**Bahasa Indonesia (Formal):**

> Selamat sore, Mbak Maya.
>
> Semoga sehat selalu. Izin follow up terkait invoice INV-2024-007 untuk campaign Prudential PRULady VCBL Campaign sebesar Rp 150.000.000 yang telah jatuh tempo pada tanggal 20 Juli 2024.
>
> Kami sangat appreciate hubungan kerja yang sudah terjalin dengan baik selama ini. Mohon dibantu untuk dapat diupdate estimasi timeline pembayarannya, agar kami bisa planning cashflow dengan lebih baik.
>
> Jika ada kendala atau hal yang perlu didiskusikan, saya sangat terbuka untuk berkomunikasi lebih lanjut.
>
> Terima kasih atas perhatiannya.
>
> Salam,
> [Nama]

---

**Tone Options:**
- 😊 Friendly but professional
- 📋 Formal with urgency
- 🤝 Collaborative approach

Mau saya copy pesan ini atau adjust tone-nya?`,
}

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [selectedContext, setSelectedContext] = useState<string>("general")
  const [isTyping, setIsTyping] = useState(false)

  const handleSendMessage = (prompt: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: prompt,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const responseContent =
        mockResponses[prompt] ||
        `🤖 **AI Response**

Terima kasih atas pertanyaan Anda. Saya sedang memproses request Anda...

**Insights:**
- Request Anda telah diterima
- AI Assistant Rectoverso OS sedang dalam pengembangan
- Untuk MVP, berikut informasi yang relevan:

**Suggested Actions:**
1. Buka halaman terkait untuk informasi lebih detail
2. Hubungi tim yang berwenang untuk pertanyaan spesifik
3. Gunakan SOP Library untuk panduan workflow

**Note:** Fitur AI akan diintegrasikan dengan OpenAI/Claude API untuk response yang lebih akurat dan context-aware.

Ada yang lain yang bisa saya bantu?`

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: responseContent,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMessage])
      setIsTyping(false)
    }, 1500)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-6">
      {/* Left Sidebar - Context Selection & Suggestions */}
      <div className="w-80 space-y-4 flex flex-col">
        {/* Context Selector */}
        <Card className="border-slate-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Context</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Select value={selectedContext} onValueChange={setSelectedContext}>
              <SelectTrigger className="bg-slate-800/50">
                <SelectValue placeholder="Select context" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="campaign">Campaign</SelectItem>
                <SelectItem value="client">Client</SelectItem>
                <SelectItem value="publisher">Publisher</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
              </SelectContent>
            </Select>

            {selectedContext === "campaign" && (
              <Select>
                <SelectTrigger className="bg-slate-800/50">
                  <SelectValue placeholder="Select campaign" />
                </SelectTrigger>
                <SelectContent>
                  {campaigns.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {selectedContext === "client" && (
              <Select>
                <SelectTrigger className="bg-slate-800/50">
                  <SelectValue placeholder="Select client" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </CardContent>
        </Card>

        {/* Suggested Prompts */}
        <Card className="border-slate-800 flex-1 overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-cyan-400" />
              Suggested Prompts
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[calc(100vh-20rem)]">
              <div className="space-y-2 p-4 pt-0">
                {suggestedPrompts.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSendMessage(suggestion.prompt)}
                    className="w-full text-left p-3 rounded-lg border border-slate-800 hover:border-cyan-500/50 hover:bg-cyan-500/5 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <suggestion.icon className="h-5 w-5 text-cyan-400 mt-0.5" />
                      <div>
                        <p className="font-medium text-sm text-slate-200">
                          {suggestion.title}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {suggestion.description}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <Card className="border-slate-800 flex-1 flex flex-col overflow-hidden">
          {/* Chat Header */}
          <CardHeader className="border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 p-2">
                <Brain className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg">AI Assistant</CardTitle>
                <p className="text-xs text-slate-500">
                  Powered by Rectoverso OS • MVP Version
                </p>
              </div>
              <Badge variant="outline" className="ml-auto">
                <Zap className="h-3 w-3 mr-1 text-amber-400" />
                Beta
              </Badge>
            </div>
          </CardHeader>

          {/* Messages Area */}
          <CardContent className="flex-1 overflow-hidden p-0">
            <ScrollArea className="h-full p-4">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 p-6 mb-4">
                    <Brain className="h-12 w-12 text-cyan-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-200 mb-2">
                    Welcome to AI Assistant
                  </h3>
                  <p className="text-sm text-slate-500 max-w-md mb-6">
                    Ask me anything about campaigns, clients, tasks, or use the suggested
                    prompts on the left to get started.
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    <Badge
                      variant="outline"
                      className="cursor-pointer hover:bg-cyan-500/10"
                      onClick={() =>
                        handleSendMessage("Summarize campaign condition for Tunaiku")
                      }
                    >
                      Summarize campaign
                    </Badge>
                    <Badge
                      variant="outline"
                      className="cursor-pointer hover:bg-cyan-500/10"
                      onClick={() =>
                        handleSendMessage("Generate client update for Prudential")
                      }
                    >
                      Generate client update
                    </Badge>
                    <Badge
                      variant="outline"
                      className="cursor-pointer hover:bg-cyan-500/10"
                      onClick={() =>
                        handleSendMessage("Identify campaign risks")
                      }
                    >
                      Identify risks
                    </Badge>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-4 ${
                          message.role === "user"
                            ? "bg-cyan-500/20 border border-cyan-500/30"
                            : "bg-slate-800/50 border border-slate-700"
                        }`}
                      >
                        <div className="flex items-start gap-2 mb-2">
                          {message.role === "assistant" && (
                            <Brain className="h-4 w-4 text-cyan-400 mt-1" />
                          )}
                          <span
                            className={`text-xs ${
                              message.role === "user"
                                ? "text-cyan-400"
                                : "text-slate-500"
                            }`}
                          >
                            {message.role === "user" ? "You" : "AI Assistant"}
                          </span>
                          {message.role === "assistant" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="ml-auto h-6 px-2"
                              onClick={() => copyToClipboard(message.content)}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                        <div
                          className={`text-sm whitespace-pre-wrap ${
                            message.role === "user"
                              ? "text-slate-200"
                              : "text-slate-300"
                          }`}
                        >
                          {message.content}
                        </div>
                      </div>
                    </div>
                  ))}

                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                        <div className="flex items-center gap-2">
                          <Brain className="h-4 w-4 text-cyan-400 animate-pulse" />
                          <span className="text-sm text-slate-400">
                            AI is thinking...
                          </span>
                          <RefreshCw className="h-4 w-4 text-slate-500 animate-spin" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </ScrollArea>
          </CardContent>

          {/* Input Area */}
          <div className="border-t border-slate-800 p-4">
            <div className="flex gap-2">
              <Input
                placeholder="Ask anything about campaigns, tasks, SOPs..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && inputValue.trim()) {
                    handleSendMessage(inputValue)
                  }
                }}
                className="flex-1 bg-slate-800/50"
              />
              <Button
                onClick={() => inputValue.trim() && handleSendMessage(inputValue)}
                disabled={!inputValue.trim() || isTyping}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-slate-500 mt-2 text-center">
              AI responses are for reference only. Always verify critical information.
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}
