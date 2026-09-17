'use client'

import { useState, useEffect } from 'react'
import { Info, X } from 'lucide-react'

// A dismissible "how it works" strip, remembered per-page via localStorage key.
export default function PageGuide({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  const [dismissed, setDismissed] = useState(true)

  useEffect(() => {
    const seen = localStorage.getItem(`dealvault-guide-${id}`)
    if (!seen) setDismissed(false)
  }, [id])

  const dismiss = () => {
    localStorage.setItem(`dealvault-guide-${id}`, '1')
    setDismissed(true)
  }

  if (dismissed) return null

  return (
    <div className="relative mb-6 rounded-xl bg-blue-50 border border-blue-100 p-4 pr-10">
      <button onClick={dismiss} className="absolute top-3 right-3 text-blue-300 hover:text-blue-500 transition-colors" aria-label="Dismiss guide">
        <X className="w-4 h-4" />
      </button>
      <div className="flex gap-3">
        <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
          <Info className="w-4 h-4 text-blue-600" />
        </div>
        <div>
          <p className="font-semibold text-blue-900 text-sm mb-1">{title}</p>
          <div className="text-sm text-blue-800/80 leading-relaxed">{children}</div>
        </div>
      </div>
    </div>
  )
}
