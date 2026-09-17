'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Hammer, Plus, Trash2, ArrowRight, RotateCcw } from 'lucide-react'
import { useStore } from '@/lib/store'
import { useToast } from '@/lib/toast'
import PageGuide from '@/components/PageGuide'

interface LineItem {
  id: string
  category: string
  label: string
  cost: number
}

// Preset common rehab items with ballpark costs to get people started fast
const presets: { category: string; label: string; cost: number }[] = [
  { category: 'Kitchen', label: 'Full kitchen remodel', cost: 25000 },
  { category: 'Kitchen', label: 'Cabinets & countertops', cost: 12000 },
  { category: 'Bathroom', label: 'Full bathroom remodel', cost: 12000 },
  { category: 'Bathroom', label: 'Half bath refresh', cost: 4000 },
  { category: 'Flooring', label: 'Hardwood/LVP throughout', cost: 9000 },
  { category: 'Flooring', label: 'Carpet (bedrooms)', cost: 3000 },
  { category: 'Paint', label: 'Interior paint (whole house)', cost: 5000 },
  { category: 'Paint', label: 'Exterior paint', cost: 6000 },
  { category: 'Roof', label: 'Full roof replacement', cost: 12000 },
  { category: 'HVAC', label: 'New HVAC system', cost: 8000 },
  { category: 'Electrical', label: 'Full rewire + panel', cost: 12000 },
  { category: 'Plumbing', label: 'Repipe + fixtures', cost: 10000 },
  { category: 'Windows', label: 'Window replacement', cost: 8000 },
  { category: 'Exterior', label: 'Landscaping & curb appeal', cost: 4000 },
  { category: 'Systems', label: 'Water heater', cost: 1800 },
]

const categoryColors: Record<string, string> = {
  Kitchen: 'bg-orange-100 text-orange-700',
  Bathroom: 'bg-blue-100 text-blue-700',
  Flooring: 'bg-amber-100 text-amber-700',
  Paint: 'bg-purple-100 text-purple-700',
  Roof: 'bg-red-100 text-red-700',
  HVAC: 'bg-cyan-100 text-cyan-700',
  Electrical: 'bg-yellow-100 text-yellow-700',
  Plumbing: 'bg-indigo-100 text-indigo-700',
  Windows: 'bg-teal-100 text-teal-700',
  Exterior: 'bg-green-100 text-green-700',
  Systems: 'bg-gray-100 text-gray-700',
}

export default function RehabEstimatorPage() {
  const router = useRouter()
  const toast = useToast((s) => s.show)
  const settings = useStore((s) => s.settings)

  const [items, setItems] = useState<LineItem[]>([])
  const [custom, setCustom] = useState({ category: 'Kitchen', label: '', cost: '' })

  const addPreset = (p: (typeof presets)[0]) => {
    setItems((prev) => [...prev, { ...p, id: Date.now().toString() + Math.random() }])
  }

  const addCustom = (e: React.FormEvent) => {
    e.preventDefault()
    if (!custom.label) return
    setItems((prev) => [...prev, { id: Date.now().toString(), category: custom.category.trim() || 'Other', label: custom.label, cost: Number(custom.cost) || 0 }])
    setCustom({ category: custom.category, label: '', cost: '' })
  }

  const remove = (id: string) => setItems((prev) => prev.filter((i) => i.id !== id))

  const subtotal = items.reduce((s, i) => s + i.cost, 0)
  const buffer = settings.defaultRehabBuffer || 15
  const bufferAmount = subtotal * (buffer / 100)
  const total = subtotal + bufferAmount

  const useInAnalyzer = () => {
    if (total === 0) { toast('Add some items first', 'error'); return }
    sessionStorage.setItem('dealvault-rehab-total', String(Math.round(total)))
    toast('Rehab total sent to Analyzer')
    setTimeout(() => router.push('/dashboard/analyzer'), 600)
  }

  return (
    <div className="container-max py-8 animate-fade-in">
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
            <Hammer className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Rehab Estimator</h1>
        </div>
        <p className="text-gray-500 text-sm mt-1">Build a renovation budget line by line, then send the total straight to the Analyzer.</p>
      </div>

      <PageGuide id="rehab" title="How the Rehab Estimator works">
        Click the <strong>Quick Add</strong> buttons for common jobs, or add your own line with any category. Your running total (plus a contingency buffer from Settings) shows on the right. Hit <strong>Use in Analyzer</strong> and the total drops into your flip analysis automatically.
      </PageGuide>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Presets + custom */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <h3 className="font-bold mb-4">Quick Add — Common Items</h3>
            <div className="flex flex-wrap gap-2">
              {presets.map((p, i) => (
                <button
                  key={i}
                  onClick={() => addPreset(p)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-sm hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5 text-blue-500" />
                  {p.label}
                  <span className="text-gray-400">${(p.cost / 1000).toFixed(0)}k</span>
                </button>
              ))}
            </div>
          </div>

          <div className="card">
            <h3 className="font-bold mb-4">Add Custom Item</h3>
            <form onSubmit={addCustom} className="flex flex-col sm:flex-row gap-3">
              <input
                value={custom.category}
                onChange={(e) => setCustom({ ...custom, category: e.target.value })}
                list="rehab-categories"
                placeholder="Category"
                className="sm:w-40 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <datalist id="rehab-categories">
                {Object.keys(categoryColors).map((c) => <option key={c} value={c} />)}
                {['Foundation', 'Pool', 'Solar', 'Septic', 'Driveway', 'Garage', 'Deck / Patio', 'Appliances', 'Insulation', 'Drywall'].map((c) => <option key={c} value={c} />)}
              </datalist>
              <input value={custom.label} onChange={(e) => setCustom({ ...custom, label: e.target.value })}
                placeholder="Description" className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              <input type="number" value={custom.cost} onChange={(e) => setCustom({ ...custom, cost: e.target.value })}
                placeholder="Cost $" className="w-28 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              <button type="submit" className="btn-primary text-sm">Add</button>
            </form>
            <p className="text-xs text-gray-400 mt-2">Pick a suggested category or type your own — anything goes.</p>
          </div>

          {/* Line items */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold">Your Estimate</h3>
              {items.length > 0 && (
                <button onClick={() => setItems([])} className="text-xs text-gray-400 hover:text-red-600 flex items-center gap-1">
                  <RotateCcw className="w-3 h-3" /> Clear all
                </button>
              )}
            </div>
            {items.length === 0 ? (
              <p className="text-center text-gray-400 text-sm py-8">Add items above to start building your estimate.</p>
            ) : (
              <div className="space-y-2">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded ${categoryColors[item.category] || 'bg-gray-100 text-gray-600'}`}>{item.category}</span>
                      <span className="text-sm text-gray-900">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold">${item.cost.toLocaleString()}</span>
                      <button onClick={() => remove(item.id)} className="text-gray-300 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Summary */}
        <div className="space-y-4">
          <div className="card sticky top-6">
            <h3 className="font-bold mb-4">Budget Summary</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal ({items.length} items)</span>
                <span className="font-semibold">${subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Contingency ({buffer}%)</span>
                <span className="font-semibold">${Math.round(bufferAmount).toLocaleString()}</span>
              </div>
              <div className="border-t border-gray-100 pt-3 flex justify-between">
                <span className="font-bold text-gray-900">Total Rehab</span>
                <span className="font-bold text-lg text-blue-600">${Math.round(total).toLocaleString()}</span>
              </div>
            </div>
            <button onClick={useInAnalyzer} className="btn-primary w-full mt-5 flex items-center justify-center gap-2 text-sm">
              Use in Analyzer <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-xs text-gray-400 mt-3 text-center">Contingency buffer is set in Settings.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
