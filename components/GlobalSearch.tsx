'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Building2, Users, FileText, X } from 'lucide-react'
import { useStore } from '@/lib/store'

export default function GlobalSearch() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const deals = useStore((s) => s.deals)
  const contractors = useStore((s) => s.contractors)
  const documents = useStore((s) => s.documents)

  // Cmd/Ctrl+K to open, Esc to close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen(true)
      }
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50)
    else setQ('')
  }, [open])

  const term = q.toLowerCase().trim()
  const dealHits = term ? deals.filter((d) => d.address.toLowerCase().includes(term)).slice(0, 5) : []
  const contractorHits = term ? contractors.filter((c) => c.name.toLowerCase().includes(term) || c.trade.toLowerCase().includes(term)).slice(0, 4) : []
  const docHits = term ? documents.filter((d) => d.name.toLowerCase().includes(term)).slice(0, 4) : []
  const hasResults = dealHits.length + contractorHits.length + docHits.length > 0

  const go = (href: string) => {
    setOpen(false)
    router.push(href)
  }

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 text-sm text-gray-400 bg-gray-100 hover:bg-gray-200 rounded-lg px-3 py-2 transition-colors w-full max-w-xs"
      >
        <Search className="w-4 h-4" />
        <span className="flex-1 text-left">Search deals, contractors...</span>
        <kbd className="hidden sm:inline text-[10px] bg-white border border-gray-200 rounded px-1.5 py-0.5 text-gray-400">⌘K</kbd>
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-start justify-center pt-[15vh] px-4 z-[95]" onClick={() => setOpen(false)}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search deals, contractors, documents..."
                className="flex-1 outline-none text-sm"
              />
              <button onClick={() => setOpen(false)} className="text-gray-300 hover:text-gray-500"><X className="w-4 h-4" /></button>
            </div>

            <div className="max-h-80 overflow-y-auto">
              {!term && <p className="text-center text-gray-400 text-sm py-8">Start typing to search…</p>}
              {term && !hasResults && <p className="text-center text-gray-400 text-sm py-8">No matches for "{q}"</p>}

              {dealHits.length > 0 && (
                <div className="py-2">
                  <p className="px-4 py-1 text-[11px] font-semibold text-gray-400 uppercase tracking-wide">Deals</p>
                  {dealHits.map((d) => (
                    <button key={d.id} onClick={() => go(`/dashboard/deals/${d.id}`)} className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-left">
                      <Building2 className="w-4 h-4 text-blue-500 shrink-0" />
                      <span className="text-sm text-gray-900 flex-1 truncate">{d.address}</span>
                      {d.projectType && d.projectType !== 'flip' && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700 capitalize">{d.projectType.replace('-', ' ')}</span>
                      )}
                    </button>
                  ))}
                </div>
              )}

              {contractorHits.length > 0 && (
                <div className="py-2 border-t border-gray-50">
                  <p className="px-4 py-1 text-[11px] font-semibold text-gray-400 uppercase tracking-wide">Contractors</p>
                  {contractorHits.map((c) => (
                    <button key={c.id} onClick={() => go('/dashboard/contractors')} className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-left">
                      <Users className="w-4 h-4 text-purple-500 shrink-0" />
                      <span className="text-sm text-gray-900 flex-1 truncate">{c.name}</span>
                      <span className="text-xs text-gray-400">{c.trade}</span>
                    </button>
                  ))}
                </div>
              )}

              {docHits.length > 0 && (
                <div className="py-2 border-t border-gray-50">
                  <p className="px-4 py-1 text-[11px] font-semibold text-gray-400 uppercase tracking-wide">Documents</p>
                  {docHits.map((d) => (
                    <button key={d.id} onClick={() => go('/dashboard/documents')} className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-left">
                      <FileText className="w-4 h-4 text-green-500 shrink-0" />
                      <span className="text-sm text-gray-900 flex-1 truncate">{d.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
