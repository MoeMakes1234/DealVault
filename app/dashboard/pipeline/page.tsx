'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useStore, Deal } from '@/lib/store'
import { useToast } from '@/lib/toast'
import { fmtCompact } from '@/lib/format'
import { GripVertical, TrendingUp } from 'lucide-react'

type Stage = NonNullable<Deal['pipelineStage']>

const stages: { key: Stage; label: string; accent: string; dot: string }[] = [
  { key: 'prospecting', label: 'Prospecting', accent: 'border-t-gray-400', dot: 'bg-gray-400' },
  { key: 'under-contract', label: 'Under Contract', accent: 'border-t-amber-400', dot: 'bg-amber-400' },
  { key: 'rehab', label: 'Rehab / Build', accent: 'border-t-blue-500', dot: 'bg-blue-500' },
  { key: 'listed', label: 'Listed', accent: 'border-t-purple-500', dot: 'bg-purple-500' },
  { key: 'sold', label: 'Sold', accent: 'border-t-green-500', dot: 'bg-green-500' },
]

export default function PipelinePage() {
  const deals = useStore((s) => s.deals)
  const updateDeal = useStore((s) => s.updateDeal)
  const toast = useToast((s) => s.show)
  const [dragId, setDragId] = useState<string | null>(null)
  const [overStage, setOverStage] = useState<Stage | null>(null)

  // Deals with no stage default to prospecting so nothing gets lost
  const stageFor = (d: Deal): Stage => d.pipelineStage || 'prospecting'

  const onDrop = (stage: Stage) => {
    if (dragId) {
      const deal = deals.find((d) => d.id === dragId)
      if (deal && stageFor(deal) !== stage) {
        updateDeal(dragId, { pipelineStage: stage })
        toast(`Moved to ${stages.find((s) => s.key === stage)?.label}`)
      }
    }
    setDragId(null)
    setOverStage(null)
  }

  return (
    <div className="container-max py-8 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pipeline</h1>
          <p className="text-gray-500 text-sm mt-1">Drag each property through your deal stages, from first look to sold.</p>
        </div>
        <Link href="/dashboard/deals" className="btn-secondary text-sm">List View</Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {stages.map((stage) => {
          const stageDeals = deals.filter((d) => stageFor(d) === stage.key)
          const stageValue = stageDeals.reduce((s, d) => s + d.expectedProfit, 0)
          return (
            <div
              key={stage.key}
              onDragOver={(e) => { e.preventDefault(); setOverStage(stage.key) }}
              onDragLeave={() => setOverStage((s) => (s === stage.key ? null : s))}
              onDrop={() => onDrop(stage.key)}
              className={`rounded-xl border-t-4 ${stage.accent} bg-gray-50 p-3 min-h-[200px] transition-colors ${
                overStage === stage.key ? 'bg-blue-50 ring-2 ring-blue-200' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${stage.dot}`} />
                  <span className="font-semibold text-sm text-gray-800">{stage.label}</span>
                </div>
                <span className="text-xs text-gray-400 bg-white rounded-full px-2 py-0.5">{stageDeals.length}</span>
              </div>

              <div className="space-y-2">
                {stageDeals.map((deal) => (
                  <div
                    key={deal.id}
                    draggable
                    onDragStart={() => setDragId(deal.id)}
                    onDragEnd={() => { setDragId(null); setOverStage(null) }}
                    className={`bg-white rounded-lg border border-gray-100 p-3 cursor-grab active:cursor-grabbing shadow-sm hover:shadow transition-all ${
                      dragId === deal.id ? 'opacity-50' : ''
                    }`}
                  >
                    <div className="flex items-start gap-1.5">
                      <GripVertical className="w-3.5 h-3.5 text-gray-300 mt-0.5 shrink-0" />
                      <div className="min-w-0 flex-1">
                        <Link href={`/dashboard/deals/${deal.id}`} className="font-medium text-sm text-gray-900 hover:text-blue-600 transition-colors block truncate">
                          {deal.address}
                        </Link>
                        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                          {deal.projectType && deal.projectType !== 'flip' && (
                            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700 capitalize">
                              {deal.projectType.replace('-', ' ')}
                            </span>
                          )}
                          <span className="text-xs text-green-600 font-semibold flex items-center gap-0.5">
                            <TrendingUp className="w-3 h-3" /> {fmtCompact(deal.expectedProfit)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {stageDeals.length === 0 && (
                  <div className="text-center text-xs text-gray-300 py-6 border-2 border-dashed border-gray-200 rounded-lg">
                    Drop deals here
                  </div>
                )}
              </div>

              {stageValue !== 0 && (
                <div className="mt-3 pt-2 border-t border-gray-200 px-1 text-xs text-gray-500 flex justify-between">
                  <span>Expected profit</span>
                  <span className="font-semibold text-gray-700">{fmtCompact(stageValue)}</span>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <p className="text-xs text-gray-400 mt-4">Tip: dragging a card only changes its pipeline stage — budgets, units, and everything else stay intact.</p>
    </div>
  )
}
