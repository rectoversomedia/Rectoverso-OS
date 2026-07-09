/**
 * Rectoverso OS - Command Palette
 * Global search and quick actions (Cmd+K)
 */

'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Command } from 'cmdk'
import {
  Search,
  FileText,
  Users,
  FolderOpen,
  CheckSquare,
  DollarSign,
  BookOpen,
  Settings,
  Plus,
  ArrowRight,
  Clock,
  RecentSearchesIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Dialog, DialogContent } from '@/components/ui/dialog'

// ============================================
// Types
// ============================================

interface SearchResult {
  id: string
  type: 'campaign' | 'task' | 'client' | 'publisher' | 'invoice' | 'sop' | 'settings'
  title: string
  description?: string
  url: string
  icon?: React.ReactNode
}

interface CommandPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

// ============================================
// Search Items Configuration
// ============================================

const QUICK_ACTIONS = [
  {
    id: 'new-campaign',
    type: 'action' as const,
    title: 'Buat Campaign Baru',
    description: 'Mulai campaign baru',
    url: '/campaigns/new',
    icon: <Plus className="h-4 w-4" />,
  },
  {
    id: 'new-task',
    type: 'action' as const,
    title: 'Buat Task Baru',
    description: 'Tambah task baru',
    url: '/tasks/new',
    icon: <Plus className="h-4 w-4" />,
  },
  {
    id: 'new-client',
    type: 'action' as const,
    title: 'Tambah Client Baru',
    description: 'Daftarkan client baru',
    url: '/clients/new',
    icon: <Plus className="h-4 w-4" />,
  },
  {
    id: 'new-invoice',
    type: 'action' as const,
    title: 'Buat Invoice Baru',
    description: 'Buat invoice untuk client',
    url: '/finance/invoices/new',
    icon: <Plus className="h-4 w-4" />,
  },
]

const NAVIGATION_ITEMS = [
  { title: 'Dashboard', url: '/dashboard', icon: <FolderOpen className="h-4 w-4" /> },
  { title: 'Campaigns', url: '/campaigns', icon: <FolderOpen className="h-4 w-4" /> },
  { title: 'Clients', url: '/clients', icon: <Users className="h-4 w-4" /> },
  { title: 'Tasks', url: '/tasks', icon: <CheckSquare className="h-4 w-4" /> },
  { title: 'Calendar', url: '/calendar', icon: <Clock className="h-4 w-4" /> },
  { title: 'Finance', url: '/finance', icon: <DollarSign className="h-4 w-4" /> },
  { title: 'SOP Library', url: '/sop', icon: <BookOpen className="h-4 w-4" /> },
  { title: 'Settings', url: '/settings', icon: <Settings className="h-4 w-4" /> },
]

// ============================================
// Command Palette Component
// ============================================

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('command-palette-recent')
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved))
      } catch {
        // Ignore parse errors
      }
    }
  }, [])

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    } else {
      setSearch('')
    }
  }, [open])

  // Keyboard shortcut
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        onOpenChange(!open)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [open, onOpenChange])

  // Save to recent searches
  const saveToRecent = useCallback((term: string) => {
    const updated = [term, ...recentSearches.filter(r => r !== term)].slice(0, 5)
    setRecentSearches(updated)
    localStorage.setItem('command-palette-recent', JSON.stringify(updated))
  }, [recentSearches])

  // Handle navigation
  const handleSelect = useCallback((url: string) => {
    onOpenChange(false)
    router.push(url)
  }, [router, onOpenChange])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden p-0 shadow-2xl border-0 bg-transparent [&>*:first-child]:bg-transparent [&>*:first-child]:shadow-none [&>*:first-child]:border-0 max-w-[600px]">
        <Command
          className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-14 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5"
          filter={(value, search) => {
            if (search === '') return 1
            const searchLower = search.toLowerCase()
            const valueLower = value.toLowerCase()
            return valueLower.includes(searchLower) ? 1 : 0
          }}
        >
          {/* Search Input */}
          <div className="flex items-center border-b px-3 bg-background rounded-t-xl">
            <Search className="mr-2 h-5 w-5 shrink-0 text-muted-foreground" />
            <Command.Input
              ref={inputRef}
              placeholder="Cari campaigns, tasks, clients, atau ketik command..."
              value={search}
              onValueChange={setSearch}
              className="flex h-14 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          {/* Content */}
          <Command.List className="max-h-[400px] overflow-y-auto overflow-x-hidden bg-background rounded-b-xl border shadow-lg">
            {/* Empty State */}
            <Command.Empty className="py-6 text-center text-sm text-muted-foreground">
              Tidak ada hasil. Coba kata kunci lain.
            </Command.Empty>

            {/* Recent Searches */}
            {!search && recentSearches.length > 0 && (
              <Command.Group heading="Recent Searches">
                {recentSearches.map((term) => (
                  <Command.Item
                    key={term}
                    value={`recent:${term}`}
                    onSelect={() => {
                      setSearch(term)
                      saveToRecent(term)
                    }}
                    className="flex items-center gap-2 px-2 py-2 cursor-pointer"
                  >
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{term}</span>
                  </Command.Item>
                ))}
              </Command.Group>
            )}

            {/* Quick Actions */}
            <Command.Group heading="Quick Actions">
              {QUICK_ACTIONS.map((item) => (
                <Command.Item
                  key={item.id}
                  value={`action:${item.title}:${item.description}`}
                  onSelect={() => handleSelect(item.url)}
                  className="flex items-center gap-2 px-2 py-2 cursor-pointer"
                >
                  {item.icon}
                  <span>{item.title}</span>
                  <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground" />
                </Command.Item>
              ))}
            </Command.Group>

            {/* Navigation */}
            <Command.Group heading="Navigation">
              {NAVIGATION_ITEMS.map((item) => (
                <Command.Item
                  key={item.url}
                  value={`nav:${item.title}`}
                  onSelect={() => handleSelect(item.url)}
                  className="flex items-center gap-2 px-2 py-2 cursor-pointer"
                >
                  {item.icon}
                  <span>{item.title}</span>
                </Command.Item>
              ))}
            </Command.Group>

            {/* Search Results */}
            {search && (
              <Command.Group heading="Search Results">
                <SearchResults search={search} onSelect={handleSelect} />
              </Command.Group>
            )}
          </Command.List>
        </Command>
      </DialogContent>
    </Dialog>
  )
}

// ============================================
// Search Results Component
// ============================================

function SearchResults({
  search,
  onSelect,
}: {
  search: string
  onSelect: (url: string) => void
}) {
  // In a real app, this would fetch from API
  // For now, we'll show placeholder results

  const mockResults: SearchResult[] = [
    {
      id: '1',
      type: 'campaign',
      title: `Campaign "${search}"`,
      description: 'Lead Generation Campaign',
      url: '/campaigns/1',
      icon: <FolderOpen className="h-4 w-4" />,
    },
    {
      id: '2',
      type: 'task',
      title: `Task "${search}"`,
      description: 'Campaign setup task',
      url: '/tasks/1',
      icon: <CheckSquare className="h-4 w-4" />,
    },
    {
      id: '3',
      type: 'client',
      title: `Client "${search}"`,
      description: 'Tunaiku by Amar Bank',
      url: '/clients/1',
      icon: <Users className="h-4 w-4" />,
    },
  ]

  if (mockResults.length === 0) {
    return (
      <div className="py-6 text-center text-sm text-muted-foreground">
        Tidak ada hasil untuk &quot;{search}&quot;
      </div>
    )
  }

  return (
    <>
      {mockResults.map((result) => (
        <Command.Item
          key={result.id}
          value={`result:${result.type}:${result.title}`}
          onSelect={() => onSelect(result.url)}
          className="flex items-center gap-2 px-2 py-2 cursor-pointer"
        >
          {result.icon}
          <div className="flex flex-col">
            <span>{result.title}</span>
            {result.description && (
              <span className="text-xs text-muted-foreground">
                {result.description}
              </span>
            )}
          </div>
        </Command.Item>
      ))}
    </>
  )
}

// ============================================
// Command Palette Trigger
// ============================================

export function CommandPaletteTrigger({
  children,
}: {
  children?: React.ReactNode
}) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground bg-muted/50 hover:bg-muted rounded-md transition-colors border"
      >
        {children || (
          <>
            <Search className="h-4 w-4" />
            <span>Search...</span>
            <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
              <span className="text-xs">⌘</span>K
            </kbd>
          </>
        )}
      </button>
      <CommandPalette open={open} onOpenChange={setOpen} />
    </>
  )
}
