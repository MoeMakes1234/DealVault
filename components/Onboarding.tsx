'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { X, Calculator, Hammer, Building2, KanbanSquare, ArrowRight, Sparkles } from 'lucide-react'
import { useStore } from '@/lib/store'

const steps = [
  { icon: Calculator, title: 'Analyze a property', desc: 'Run the numbers on a deal before you buy.', href: '/dashboard/analyzer' },
  { icon: Hammer, title: 'Estimate a rehab', desc: 'Build a renovation budget line by line.', href: '/dashboard/rehab' },
  { icon: Building2, title: 'Add your first deal', desc: 'Start tracking a property from the Deals page.', href: '/dashboard/deals' },
  { icon: KanbanSquare, title: 'Work your pipeline', desc: 'Drag deals through your stages to sold.', href: '/dashboard/pipeline' },
]

export default function Onboarding() {
  const settings = useStore((s) => s.settings)
  const [dismissed, setDismissed] = useState(true)

  // Show until the user dismisses it (persisted in localStorage, separate from deal data)
  useEffect(() => {
    const seen = localStorage.getItem('dealvault-onboarded')
    if (!seen) setDismissed(false)
  }, [])

  const dismiss = () => {
    localStorage.setItem('dealvault-onboarded', '1')
    setDismissed(true)
  }

  if (dismissed) return null

  return (
    <div className="relative mb-8 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 p-6 text-white overflow-hidden">
      <button onClick={dismiss} className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors" aria-label="Dismiss">
        <X className="w-5 h-5" />
      </button>

      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="w-5 h-5" />
        <h2 className="text-xl font-bold">
          {settings.fullName ? `Welcome to DealVault, ${settings.fullName.split(' ')[0]}` : 'Welcome to DealVault'}
        </h2>
      </div>
      <p className="text-blue-100 text-sm mb-6 max-w-2xl">
        Everything you need to find, fund, and finish real estate deals — from a single flip to a full development. Here's how to get started:
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {steps.map((step, i) => (
          <Link
            key={i}
            href={step.href}
            onClick={dismiss}
            className="bg-white/10 hover:bg-white/20 rounded-xl p-4 transition-colors group"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center">
                <step.icon className="w-5 h-5" />
              </div>
              <span className="text-xs text-white/50">{i + 1}</span>
            </div>
            <h3 className="font-semibold text-sm mb-0.5 flex items-center gap-1">
              {step.title}
              <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </h3>
            <p className="text-xs text-blue-100">{step.desc}</p>
          </Link>
        ))}
      </div>

      <button onClick={dismiss} className="text-blue-100 hover:text-white text-xs mt-5 underline underline-offset-2">
        Skip — I'll explore on my own
      </button>
    </div>
  )
}
