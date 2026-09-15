'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft, Plus, Trash2, X, MapPin, Calendar, TrendingUp, Users, FileText, Building2,
  Clock, DollarSign, AlertTriangle, Check, Circle, Clock3, Image as ImageIcon, Upload, Layers,
} from 'lucide-react'
import { useStore, BudgetCategory, TimelineTask, Unit, Investor } from '@/lib/store'
import { useToast } from '@/lib/toast'
import { fmtCompact } from '@/lib/format'

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
  const addDealPhoto = useStore((s) => s.addDealPhoto)
  const removeDealPhoto = useStore((s) => s.removeDealPhoto)
  const addUnit = useStore((s) => s.addUnit)
  const updateUnit = useStore((s) => s.updateUnit)
  const deleteUnit = useStore((s) => s.deleteUnit)
  const investors = useStore((s) => s.investors.filter((i) => i.dealId === dealId))
  const addInvestor = useStore((s) => s.addInvestor)
  const deleteInvestor = useStore((s) => s.deleteInvestor)

  const [showBudgetForm, setShowBudgetForm] = useState(false)
  const [bForm, setBForm] = useState({ category: 'finishes' as BudgetCategory, label: '', budgeted: '', spent: '' })
  const [showUnitForm, setShowUnitForm] = useState(false)
  const [uForm, setUForm] = useState({ name: '', beds: '', baths: '', sqft: '', status: 'planned' as Unit['status'], targetRent: '', targetSalePrice: '' })
  const [showInvestorForm, setShowInvestorForm] = useState(false)
  const [iForm, setIForm] = useState({ name: '', type: 'equity' as Investor['type'], amount: '', ownershipPct: '', preferredReturn: '', interestRate: '', lenderType: '' })

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

  const isDevelopment = deal.projectType && ['multifamily', 'new-construction', 'mixed-use'].includes(deal.projectType)
  const units = deal.units || []
  const totalUnitRent = units.reduce((s, u) => s + (u.targetRent || 0), 0)
  const totalUnitSalePrice = units.reduce((s, u) => s + (u.targetSalePrice || 0), 0)
  const totalSqft = units.reduce((s, u) => s + u.sqft, 0)
  const unitsSold = units.filter((u) => u.status === 'sold').length
  const unitsLeased = units.filter((u) => u.status === 'leased').length

  const totalEquity = investors.filter((i) => i.type === 'equity').reduce((s, i) => s + i.amount, 0)
  const totalDebt = investors.filter((i) => i.type === 'debt').reduce((s, i) => s + i.amount, 0)
  const totalCapital = totalEquity + totalDebt

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

  const handleAddUnit = (e: React.FormEvent) => {
    e.preventDefault()
    addUnit(dealId, {
      name: uForm.name,
      beds: Number(uForm.beds) || 0,
      baths: Number(uForm.baths) || 0,
      sqft: Number(uForm.sqft) || 0,
      status: uForm.status,
      targetRent: uForm.targetRent ? Number(uForm.targetRent) : undefined,
      targetSalePrice: uForm.targetSalePrice ? Number(uForm.targetSalePrice) : undefined,
    })
    setUForm({ name: '', beds: '', baths: '', sqft: '', status: 'planned', targetRent: '', targetSalePrice: '' })
    setShowUnitForm(false)
    toast('Unit added')
  }

  const handleAddInvestor = (e: React.FormEvent) => {
    e.preventDefault()
    addInvestor({
      dealId,
      name: iForm.name,
      type: iForm.type,
      amount: Number(iForm.amount) || 0,
      ownershipPct: iForm.ownershipPct ? Number(iForm.ownershipPct) : undefined,
      preferredReturn: iForm.preferredReturn ? Number(iForm.preferredReturn) : undefined,
      interestRate: iForm.interestRate ? Number(iForm.interestRate) : undefined,
      lenderType: iForm.lenderType || undefined,
    })
    setIForm({ name: '', type: 'equity', amount: '', ownershipPct: '', preferredReturn: '', interestRate: '', lenderType: '' })
    setShowInvestorForm(false)
    toast('Added to capital stack')
  }

  const cycleTask = (task: TimelineTask) => {
    const order: TimelineTask['status'][] = ['pending', 'in-progress', 'done']
    updateTask(task.id, { status: order[(order.indexOf(task.status) + 1) % order.length] })
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) {
      toast('Image too large (max 2MB)', 'error')
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      addDealPhoto(dealId, reader.result as string)
      toast('Photo added')
    }
    reader.readAsDataURL(file)
    e.target.value = ''
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
            {deal.projectType && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700 capitalize">
                {deal.projectType.replace('-', ' ')}
              </span>
            )}
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
          <p className="text-2xl font-bold">{fmtCompact(deal.acquisitionPrice)}</p>
        </div>
        <div className="card">
          <div className="flex items-center gap-2 text-gray-500 text-sm mb-1"><TrendingUp className="w-4 h-4" /> All-In Cost</div>
          <p className="text-2xl font-bold">{fmtCompact(allIn)}</p>
        </div>
        <div className="card">
          <div className="flex items-center gap-2 text-gray-500 text-sm mb-1"><MapPin className="w-4 h-4" /> Target Sale</div>
          <p className="text-2xl font-bold">{deal.saleTarget ? fmtCompact(deal.saleTarget) : '—'}</p>
        </div>
        <div className="card">
          <div className="flex items-center gap-2 text-gray-500 text-sm mb-1"><TrendingUp className="w-4 h-4" /> Projected Profit</div>
          <p className={`text-2xl font-bold ${projectedProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {fmtCompact(projectedProfit)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Budget breakdown - main column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Units section - only for development project types */}
          {isDevelopment && (
            <div className="card">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-lg font-bold flex items-center gap-2"><Building2 className="w-5 h-5 text-indigo-500" /> Units</h3>
                <button onClick={() => setShowUnitForm(true)} className="text-blue-600 text-sm font-medium flex items-center gap-1 hover:text-blue-700">
                  <Plus className="w-4 h-4" /> Add Unit
                </button>
              </div>
              {units.length > 0 ? (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 my-4">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500">Total Units</p>
                      <p className="text-xl font-bold">{units.length}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500">Total Sq Ft</p>
                      <p className="text-xl font-bold">{totalSqft.toLocaleString()}</p>
                    </div>
                    {totalUnitRent > 0 && (
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-500">Gross Rent/mo</p>
                        <p className="text-xl font-bold text-green-600">{fmtCompact(totalUnitRent)}</p>
                      </div>
                    )}
                    {totalUnitSalePrice > 0 && (
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-500">Total Sellout</p>
                        <p className="text-xl font-bold text-green-600">{fmtCompact(totalUnitSalePrice)}</p>
                      </div>
                    )}
                    {(unitsSold > 0 || unitsLeased > 0) && (
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-500">Sold / Leased</p>
                        <p className="text-xl font-bold">{unitsSold + unitsLeased}/{units.length}</p>
                      </div>
                    )}
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-gray-500 border-b border-gray-100">
                          <th className="py-2 pr-3 font-medium">Unit</th>
                          <th className="py-2 pr-3 font-medium">Bed/Bath</th>
                          <th className="py-2 pr-3 font-medium">Sq Ft</th>
                          <th className="py-2 pr-3 font-medium">Rent / Sale</th>
                          <th className="py-2 pr-3 font-medium">Status</th>
                          <th className="py-2 font-medium"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {units.map((u) => (
                          <tr key={u.id}>
                            <td className="py-2.5 pr-3 font-medium text-gray-900">{u.name}</td>
                            <td className="py-2.5 pr-3 text-gray-600">{u.beds}bd / {u.baths}ba</td>
                            <td className="py-2.5 pr-3 text-gray-600">{u.sqft.toLocaleString()}</td>
                            <td className="py-2.5 pr-3 text-gray-600">
                              {u.targetRent ? `$${u.targetRent.toLocaleString()}/mo` : u.targetSalePrice ? `$${u.targetSalePrice.toLocaleString()}` : '—'}
                            </td>
                            <td className="py-2.5 pr-3">
                              <select
                                value={u.status}
                                onChange={(e) => updateUnit(dealId, u.id, { status: e.target.value as Unit['status'] })}
                                className={`text-xs font-medium px-2 py-1 rounded-full border-0 outline-none cursor-pointer capitalize ${
                                  u.status === 'sold' ? 'bg-green-100 text-green-700'
                                  : u.status === 'leased' ? 'bg-blue-100 text-blue-700'
                                  : u.status === 'complete' ? 'bg-purple-100 text-purple-700'
                                  : u.status === 'under-construction' ? 'bg-amber-100 text-amber-700'
                                  : 'bg-gray-100 text-gray-600'
                                }`}
                              >
                                <option value="planned">Planned</option>
                                <option value="under-construction">Under Construction</option>
                                <option value="complete">Complete</option>
                                <option value="leased">Leased</option>
                                <option value="sold">Sold</option>
                              </select>
                            </td>
                            <td className="py-2.5 text-right">
                              <button onClick={() => { deleteUnit(dealId, u.id); toast('Unit removed', 'info') }} className="text-gray-300 hover:text-red-600">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-gray-400 text-sm">
                  No units yet. Add each apartment, townhome, or unit to track status, rent, and sellout.
                </div>
              )}
            </div>
          )}

          {/* Capital Stack - only for development project types */}
          {isDevelopment && (
            <div className="card">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-lg font-bold flex items-center gap-2"><Layers className="w-5 h-5 text-emerald-500" /> Capital Stack</h3>
                <button onClick={() => setShowInvestorForm(true)} className="text-blue-600 text-sm font-medium flex items-center gap-1 hover:text-blue-700">
                  <Plus className="w-4 h-4" /> Add Source
                </button>
              </div>

              {investors.length > 0 ? (
                <>
                  <div className="grid grid-cols-3 gap-3 my-4">
                    <div className="bg-emerald-50 rounded-lg p-3">
                      <p className="text-xs text-emerald-700">Total Equity</p>
                      <p className="text-lg font-bold text-emerald-700">{fmtCompact(totalEquity)}</p>
                    </div>
                    <div className="bg-amber-50 rounded-lg p-3">
                      <p className="text-xs text-amber-700">Total Debt</p>
                      <p className="text-lg font-bold text-amber-700">{fmtCompact(totalDebt)}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500">Total Capital</p>
                      <p className="text-lg font-bold">{fmtCompact(totalCapital)}</p>
                    </div>
                  </div>

                  {/* Stacked capital bar */}
                  {totalCapital > 0 && (
                    <div className="flex h-3 rounded-full overflow-hidden mb-4">
                      <div className="bg-emerald-500" style={{ width: `${(totalEquity / totalCapital) * 100}%` }} title="Equity" />
                      <div className="bg-amber-500" style={{ width: `${(totalDebt / totalCapital) * 100}%` }} title="Debt" />
                    </div>
                  )}

                  <div className="space-y-2">
                    {investors.map((inv) => (
                      <div key={inv.id} className="flex items-center justify-between border border-gray-100 rounded-lg px-3 py-2.5 group">
                        <div className="flex items-center gap-3">
                          <span className={`w-2 h-2 rounded-full ${inv.type === 'equity' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{inv.name}</p>
                            <p className="text-xs text-gray-500 capitalize">
                              {inv.type === 'equity'
                                ? `Equity${inv.ownershipPct ? ` · ${inv.ownershipPct}% ownership` : ''}${inv.preferredReturn ? ` · ${inv.preferredReturn}% pref` : ''}`
                                : `${inv.lenderType || 'Debt'}${inv.interestRate ? ` · ${inv.interestRate}% interest` : ''}`}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-semibold">{fmtCompact(inv.amount)}</span>
                          <button onClick={() => { deleteInvestor(inv.id); toast('Removed from capital stack', 'info') }} className="text-gray-300 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-gray-400 text-sm">
                  No capital sources yet. Add your equity, partner equity, and construction loans to model the stack.
                </div>
              )}
            </div>
          )}

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
                    <span className="text-sm font-semibold text-gray-700">{fmtCompact(c.totalPaid)}</span>
                  </div>
                ))}
              </div>
            )}
            <Link href="/dashboard/contractors" className="text-blue-600 text-xs font-medium mt-3 inline-block hover:text-blue-700">Manage contractors →</Link>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold flex items-center gap-2"><ImageIcon className="w-4 h-4 text-gray-400" /> Photos</h3>
              <label className="text-blue-600 text-xs font-medium cursor-pointer hover:text-blue-700 flex items-center gap-1">
                <Upload className="w-3.5 h-3.5" /> Add
                <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
              </label>
            </div>
            {(!deal.photos || deal.photos.length === 0) ? (
              <label className="block border-2 border-dashed border-gray-200 rounded-lg py-8 text-center cursor-pointer hover:border-blue-300 hover:bg-blue-50/50 transition-colors">
                <ImageIcon className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-xs text-gray-400">Upload before/after photos</p>
                <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
              </label>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {deal.photos.map((photo, i) => (
                  <div key={i} className="relative group aspect-square rounded-lg overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={photo} alt={`Deal photo ${i + 1}`} className="w-full h-full object-cover" />
                    <button
                      onClick={() => { removeDealPhoto(dealId, i); toast('Photo removed', 'info') }}
                      className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
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

      {/* Add investor / capital source modal */}
      {showInvestorForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50" onClick={() => setShowInvestorForm(false)}>
          <form onSubmit={handleAddInvestor} onClick={(e) => e.stopPropagation()} className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold">Add Capital Source</h3>
              <button type="button" onClick={() => setShowInvestorForm(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div className="flex gap-2">
                <button type="button" onClick={() => setIForm({ ...iForm, type: 'equity' })}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${iForm.type === 'equity' ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-white text-gray-600 border-gray-200'}`}>
                  Equity
                </button>
                <button type="button" onClick={() => setIForm({ ...iForm, type: 'debt' })}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${iForm.type === 'debt' ? 'bg-amber-500 text-white border-amber-500' : 'bg-white text-gray-600 border-gray-200'}`}>
                  Debt
                </button>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Name</label>
                <input required value={iForm.name} onChange={(e) => setIForm({ ...iForm, name: e.target.value })} placeholder={iForm.type === 'equity' ? 'e.g. Riverside Capital / You' : 'e.g. First Metro Construction Loan'} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Amount ($)</label>
                <input type="number" required value={iForm.amount} onChange={(e) => setIForm({ ...iForm, amount: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              {iForm.type === 'equity' ? (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Ownership (%)</label>
                    <input type="number" value={iForm.ownershipPct} onChange={(e) => setIForm({ ...iForm, ownershipPct: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Pref Return (%)</label>
                    <input type="number" step="0.1" value={iForm.preferredReturn} onChange={(e) => setIForm({ ...iForm, preferredReturn: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Loan Type</label>
                    <input value={iForm.lenderType} onChange={(e) => setIForm({ ...iForm, lenderType: e.target.value })} placeholder="Construction Loan" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Interest (%)</label>
                    <input type="number" step="0.1" value={iForm.interestRate} onChange={(e) => setIForm({ ...iForm, interestRate: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button type="button" onClick={() => setShowInvestorForm(false)} className="btn-secondary">Cancel</button>
              <button type="submit" className="btn-primary">Add</button>
            </div>
          </form>
        </div>
      )}

      {/* Add unit modal */}
      {showUnitForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50" onClick={() => setShowUnitForm(false)}>
          <form onSubmit={handleAddUnit} onClick={(e) => e.stopPropagation()} className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold">Add Unit</h3>
              <button type="button" onClick={() => setShowUnitForm(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Unit Name / Number</label>
                <input required value={uForm.name} onChange={(e) => setUForm({ ...uForm, name: e.target.value })} placeholder="Unit 2A" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Beds</label>
                  <input type="number" value={uForm.beds} onChange={(e) => setUForm({ ...uForm, beds: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Baths</label>
                  <input type="number" step="0.5" value={uForm.baths} onChange={(e) => setUForm({ ...uForm, baths: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Sq Ft</label>
                  <input type="number" value={uForm.sqft} onChange={(e) => setUForm({ ...uForm, sqft: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Target Rent ($/mo)</label>
                  <input type="number" value={uForm.targetRent} onChange={(e) => setUForm({ ...uForm, targetRent: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Target Sale ($)</label>
                  <input type="number" value={uForm.targetSalePrice} onChange={(e) => setUForm({ ...uForm, targetSalePrice: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
                <select value={uForm.status} onChange={(e) => setUForm({ ...uForm, status: e.target.value as Unit['status'] })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                  <option value="planned">Planned</option>
                  <option value="under-construction">Under Construction</option>
                  <option value="complete">Complete</option>
                  <option value="leased">Leased</option>
                  <option value="sold">Sold</option>
                </select>
              </div>
              <p className="text-xs text-gray-400">Tip: use rent for buy-and-hold units, sale price for units you'll sell individually.</p>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button type="button" onClick={() => setShowUnitForm(false)} className="btn-secondary">Cancel</button>
              <button type="submit" className="btn-primary">Add Unit</button>
            </div>
          </form>
        </div>
      )}

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
