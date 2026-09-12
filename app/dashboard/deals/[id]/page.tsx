'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft, Plus, Trash2, X, MapPin, Calendar, TrendingUp, Users, FileText,
  Clock, DollarSign, AlertTriangle, Check, Circle, Clock3,
} from 'lucide-react'
import { useStore, BudgetCategory, TimelineTask } from '@/lib/store'
import { useToast } from '@/lib/toast'

const categoryLabels: Record<BudgetCategory, string> = {
  acquisition: 'Acquisition', demo: 'Demolition', framing: 'Framing', electrical: 'Electrical',
  plumbing: 'Plumbing', hvac: 'HVAC', roofing: 'Roofing', finishes: 'Finishes',
  permits: 'Permits', landscaping: 'Landscaping', contingency: 'Contingency', other: 'Other',
}

const statusStyle: Record<TimelineTask['status'], string> = {
  done: 'bg-green-100 text-green-700',
  'in-progress': 'bg-blue-100 text-blue-700',
  pending: 'bg-gray-100 text-gray-500',
}
const statusIcon: Record<TimelineTask['status'], any> = { done: Check, 'in-progress': Clock3, pending: Circle }

export default function DealDetailPage() {
  const params = useParams()
  const router = useRouter()
  const dealId = params.id as string
  const toast = useToast((s) => s.show)

  const deal = useStore((s) => s.deals.find((d) => d.id === dealId))
  const budgetItems = useStore((s) => s.budgetItems.filter((b) => b.dealId === dealId))
  const contractors = useStore((s) => s.contractors.filter((c) => c.dealId === dealId))
  const documents = useStore((s) => s.documents.filter((d) => d.dealId === dealId))
  const tasks = useStore((s) => s.tasks.filter((t) => t.dealId === dealId))
  const addBudgetItem = useStore((s) => s.addBudgetItem)
  const deleteBudgetItem = useStore((s) => s.deleteBudgetItem)
  const updateTask = useStore((s) => s.updateTask)

  const [showBudgetForm, setShowBudgetForm] = useState(false)
  const [bForm, setBForm] = useState({ category: 'finishes' as BudgetCategory, label: '', budgeted: '', spent: '' })

  if (!deal) {
    return (
      <div className="container-max py-16 text-center">
        <p className="text-gray-500 mb-4">This deal doesn't exist or was deleted.</p>
        <Link href="/dashboard/deals" className="btn-primary inline-flex">Back to Deals</Link>
      </div>
    )
  }

  const totalBudgeted = budgetItems.reduce((s, b) => s + b.budgeted, 0)
  const totalSpent = budgetItems.reduce((s, b) => s + b.spent, 0)
  const budgetUsedPct = totalBudgeted > 0 ? (totalSpent / totalBudgeted) * 100 : 0
  const allIn = deal.acquisitionPrice + (totalBudgeted || deal.budget)
  const projectedProfit = (deal.saleTarget || 0) - deal.acquisitionPrice - (totalSpent || deal.spent)

  const handleAddBudget = (e: React.FormEvent) => {
    e.preventDefault()
    addBudgetItem({
      dealId,
      category: bForm.category,
      label: bForm.label,
      budgeted: Number(bForm.budgeted) || 0,
      spent: Number(bForm.spent) || 0,
    })
    setBForm({ category: 'finishes', label: '', budgeted: '', spent: '' })
    setShowBudgetForm(false)
    toast('Budget line added')
  }

  const cycleTask = (task: TimelineTask) => {
    const order: TimelineTask['status'][] = ['pending', 'in-progress', 'done']
    updateTask(task.id, { status: order[(order.indexOf(task.status) + 1) % order.length] })
  }

  return (
    <div className="container-max py-8 animate-fade-in">
      {/* Back link */}
      <Link href="/dashboard/deals" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 text-sm mb-4 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Deals
      </Link>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-gray-900">{deal.address}</h1>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                deal.status === 'completed' ? 'bg-green-100 text-green-800'
                : deal.status === 'in-progress' ? 'bg-blue-100 text-blue-800'
                : 'bg-yellow-100 text-yellow-800'
              }`}
            >
              {deal.status.charAt(0).toUpperCase() + deal.status.slice(1).replace('-', ' ')}
            </span>
          </div>
          {(deal.startDate || deal.targetCompletionDate) && (
            <p className="text-sm text-gray-500 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {deal.startDate || 'TBD'} → {deal.targetCompletionDate || 'TBD'}
            </p>
          )}
        </div>
        <Link href="/dashboard/deals" className="btn-secondary text-sm">Edit Deal</Link>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="card">
          <div className="flex items-center gap-2 text-gray-500 text-sm mb-1"><DollarSign className="w-4 h-4" /> Acquisition</div>
          <p className="text-2xl font-bold">${(deal.acquisitionPrice / 1000).toFixed(0)}K</p>
        </div>
        <div className="card">
          <div className="flex items-center gap-2 text-gray-500 text-sm mb-1"><TrendingUp className="w-4 h-4" /> All-In Cost</div>
          <p className="text-2xl font-bold">${(allIn / 1000).toFixed(0)}K</p>
        </div>
        <div className="card">
          <div className="flex items-center gap-2 text-gray-500 text-sm mb-1"><MapPin className="w-4 h-4" /> Target Sale</div>
          <p className="text-2xl font-bold">{deal.saleTarget ? `$${(deal.saleTarget / 1000).toFixed(0)}K` : '—'}</p>
        </div>
        <div className="card">
          <div className="flex items-center gap-2 text-gray-500 text-sm mb-1"><TrendingUp className="w-4 h-4" /> Projected Profit</div>
          <p className={`text-2xl font-bold ${projectedProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ${(projectedProfit / 1000).toFixed(0)}K
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Budget breakdown - main column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-lg font-bold">Budget Breakdown</h3>
              <button onClick={() => setShowBudgetForm(true)} className="text-blue-600 text-sm font-medium flex items-center gap-1 hover:text-blue-700">
                <Plus className="w-4 h-4" /> Add Line
              </button>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              ${totalSpent.toLocaleString()} spent of ${totalBudgeted.toLocaleString()} budgeted
              {budgetUsedPct > 100 && <span className="text-red-600 font-medium"> · over budget</span>}
            </p>
            <div className="bg-gray-200 rounded-full h-2.5 mb-6 overflow-hidden">
              <div
                className={`h-full transition-all ${budgetUsedPct > 100 ? 'bg-red-500' : budgetUsedPct > 85 ? 'bg-amber-500' : 'bg-green-500'}`}
                style={{ width: `${Math.min(budgetUsedPct, 100)}%` }}
              />
            </div>

            {budgetItems.length === 0 ? (
              <div className="text-center py-8 text-gray-400 text-sm">
                No budget lines yet. Add categories like demo, electrical, finishes to track spend in detail.
              </div>
            ) : (
              <div className="space-y-3">
                {budgetItems.map((item) => {
                  const pct = item.budgeted > 0 ? (item.spent / item.budgeted) * 100 : 0
                  const over = item.spent > item.budgeted
                  return (
                    <div key={item.id} className="border border-gray-100 rounded-lg p-3 hover:border-gray-200 transition-colors group">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                            {categoryLabels[item.category]}
                          </span>
                          <span className="font-medium text-gray-900 text-sm">{item.label}</span>
                          {over && <AlertTriangle className="w-3.5 h-3.5 text-red-500" />}
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`text-sm font-semibold ${over ? 'text-red-600' : 'text-gray-900'}`}>
                            ${item.spent.toLocaleString()} / ${item.budgeted.toLocaleString()}
                          </span>
                          <button
                            onClick={() => { deleteBudgetItem(item.id); toast('Budget line removed', 'info') }}
                            className="text-gray-300 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="bg-gray-100 rounded-full h-1.5 overflow-hidden">
                        <div className={`h-full ${over ? 'bg-red-500' : 'bg-blue-500'}`} style={{ width: `${Math.min(pct, 100)}%` }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Timeline */}
          <div className="card">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Clock className="w-5 h-5 text-gray-400" /> Timeline</h3>
            {tasks.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-6">No tasks yet. Add them from the Timeline page.</p>
            ) : (
              <div className="space-y-2">
                {tasks.sort((a, b) => (a.dueDate || '').localeCompare(b.dueDate || '')).map((task) => {
                  const Icon = statusIcon[task.status]
                  return (
                    <div key={task.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                      <button onClick={() => cycleTask(task)} className="flex items-center gap-3 text-left">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center ${statusStyle[task.status]}`}>
                          <Icon className="w-3.5 h-3.5" />
                        </span>
                        <span className="text-sm text-gray-900">{task.title}</span>
                      </button>
                      {task.dueDate && <span className="text-xs text-gray-400">{task.dueDate}</span>}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar - contractors, docs, notes */}
        <div className="space-y-6">
          <div className="card">
            <h3 className="text-base font-bold mb-4 flex items-center gap-2"><Users className="w-4 h-4 text-gray-400" /> Contractors</h3>
            {contractors.length === 0 ? (
              <p className="text-sm text-gray-400">None linked to this deal.</p>
            ) : (
              <div className="space-y-3">
                {contractors.map((c) => (
                  <div key={c.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{c.name}</p>
                      <p className="text-xs text-gray-500">{c.trade}</p>
                    </div>
                    <span className="text-sm font-semibold text-gray-700">${(c.totalPaid / 1000).toFixed(1)}K</span>
                  </div>
                ))}
              </div>
            )}
            <Link href="/dashboard/contractors" className="text-blue-600 text-xs font-medium mt-3 inline-block hover:text-blue-700">Manage contractors →</Link>
          </div>

          <div className="card">
            <h3 className="text-base font-bold mb-4 flex items-center gap-2"><FileText className="w-4 h-4 text-gray-400" /> Documents</h3>
            {documents.length === 0 ? (
              <p className="text-sm text-gray-400">No documents linked.</p>
            ) : (
              <div className="space-y-2">
                {documents.map((d) => (
                  <div key={d.id} className="text-sm text-gray-700 truncate">📄 {d.name}</div>
                ))}
              </div>
            )}
            <Link href="/dashboard/documents" className="text-blue-600 text-xs font-medium mt-3 inline-block hover:text-blue-700">Manage documents →</Link>
          </div>

          {deal.notes && (
            <div className="card">
              <h3 className="text-base font-bold mb-2">Notes</h3>
              <p className="text-sm text-gray-600 whitespace-pre-wrap">{deal.notes}</p>
            </div>
          )}
        </div>
      </div>

      {/* Add budget modal */}
      {showBudgetForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50" onClick={() => setShowBudgetForm(false)}>
          <form onSubmit={handleAddBudget} onClick={(e) => e.stopPropagation()} className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold">Add Budget Line</h3>
              <button type="button" onClick={() => setShowBudgetForm(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Category</label>
                <select value={bForm.category} onChange={(e) => setBForm({ ...bForm, category: e.target.value as BudgetCategory })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                  {Object.entries(categoryLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                <input required value={bForm.label} onChange={(e) => setBForm({ ...bForm, label: e.target.value })}
                  placeholder="e.g. Full rewire + panel upgrade"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Budgeted ($)</label>
                  <input type="number" required value={bForm.budgeted} onChange={(e) => setBForm({ ...bForm, budgeted: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Spent ($)</label>
                  <input type="number" value={bForm.spent} onChange={(e) => setBForm({ ...bForm, spent: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button type="button" onClick={() => setShowBudgetForm(false)} className="btn-secondary">Cancel</button>
              <button type="submit" className="btn-primary">Add Line</button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
