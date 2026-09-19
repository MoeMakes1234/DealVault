'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus, Trash2, Edit2, X, Search, ArrowUpDown, Building2, ChevronRight, FileSpreadsheet, Copy } from 'lucide-react'
import { useStore, Deal } from '@/lib/store'
import { useToast } from '@/lib/toast'
import { fmtCompact } from '@/lib/format'
import { useConfirm } from '@/components/ConfirmDialog'

type SortKey = 'newest' | 'profit' | 'budget-usage' | 'address'

const emptyForm = {
  address: '',
  acquisitionPrice: '',
  budget: '',
  spent: '',
  saleTarget: '',
  status: 'planning' as Deal['status'],
  projectType: 'flip' as Deal['projectType'],
  startDate: '',
  targetCompletionDate: '',
  notes: '',
}

export default function DealsPage() {
  const deals = useStore((s) => s.deals)
  const addDeal = useStore((s) => s.addDeal)
  const updateDeal = useStore((s) => s.updateDeal)
  const deleteDeal = useStore((s) => s.deleteDeal)

  const toast = useToast((s) => s.show)
  const confirm = useConfirm((s) => s.ask)

  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [filter, setFilter] = useState<'all' | Deal['status']>('all')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<SortKey>('newest')

  const filteredDeals = deals
    .filter((d) => filter === 'all' || d.status === filter)
    .filter((d) => d.address.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      switch (sort) {
        case 'profit':
          return b.expectedProfit - a.expectedProfit
        case 'budget-usage':
          return b.spent / (b.budget || 1) - a.spent / (a.budget || 1)
        case 'address':
          return a.address.localeCompare(b.address)
        default:
          return Number(b.id) - Number(a.id)
      }
    })

  const openNew = () => {
    setForm(emptyForm)
    setEditingId(null)
    setShowForm(true)
  }

  const openEdit = (deal: Deal) => {
    setForm({
      address: deal.address,
      acquisitionPrice: String(deal.acquisitionPrice),
      budget: String(deal.budget),
      spent: String(deal.spent),
      saleTarget: deal.saleTarget ? String(deal.saleTarget) : '',
      status: deal.status,
      projectType: deal.projectType || 'flip',
      startDate: deal.startDate || '',
      targetCompletionDate: deal.targetCompletionDate || '',
      notes: deal.notes || '',
    })
    setEditingId(deal.id)
    setShowForm(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const payload = {
      address: form.address,
      acquisitionPrice: Number(form.acquisitionPrice) || 0,
      budget: Number(form.budget) || 0,
      spent: Number(form.spent) || 0,
      saleTarget: form.saleTarget ? Number(form.saleTarget) : undefined,
      status: form.status,
      projectType: form.projectType,
      expectedProfit: (Number(form.saleTarget) || 0) - (Number(form.acquisitionPrice) || 0) - (Number(form.budget) || 0),
      startDate: form.startDate || undefined,
      targetCompletionDate: form.targetCompletionDate || undefined,
      notes: form.notes || undefined,
    }

    if (editingId) {
      updateDeal(editingId, payload)
      toast('Deal updated')
    } else {
      addDeal(payload)
      toast('Deal added')
    }
    setShowForm(false)
    setForm(emptyForm)
    setEditingId(null)
  }

  return (
    <div className="container-max py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Deals</h1>
          <p className="text-gray-500 text-sm mt-1">Manage every property in your pipeline.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/dashboard/import" className="btn-secondary text-sm">Import</Link>
          <Link href="/dashboard/pipeline" className="btn-secondary text-sm">Board View</Link>
          <button
            onClick={openNew}
            className="bg-blue-600 text-white px-4 py-2.5 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors font-medium text-sm"
          >
            <Plus className="w-4 h-4" />
            New Deal
          </button>
        </div>
      </div>

      {/* Filters + search + sort */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6">
        <div className="flex gap-2 flex-wrap">
          {(['all', 'planning', 'in-progress', 'completed'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filter === f ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1).replace('-', ' ')}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search address..."
              className="pl-9 pr-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none w-full md:w-48"
            />
          </div>
          <div className="relative">
            <ArrowUpDown className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="pl-9 pr-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none appearance-none bg-white cursor-pointer"
            >
              <option value="newest">Newest</option>
              <option value="profit">Highest profit</option>
              <option value="budget-usage">Budget usage</option>
              <option value="address">Address (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50" onClick={() => setShowForm(false)}>
          <form
            onSubmit={handleSubmit}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold">{editingId ? 'Edit Deal' : 'New Deal'}</h3>
              <button type="button" onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-gray-600 mb-1">Address</label>
                <input
                  type="text"
                  required
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="123 Main St, Brooklyn NY"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-gray-600 mb-1">Project Type</label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {([
                    ['flip', 'Flip'],
                    ['rental', 'Rental'],
                    ['multifamily', 'Multifamily'],
                    ['new-construction', 'New Build'],
                    ['mixed-use', 'Mixed-Use'],
                  ] as const).map(([val, label]) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setForm({ ...form, projectType: val })}
                      className={`px-2 py-2 rounded-lg text-xs font-medium border transition-colors ${
                        form.projectType === val
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                {form.projectType && form.projectType !== 'flip' && form.projectType !== 'rental' && (
                  <p className="text-xs text-blue-600 mt-2">
                    Development project — after saving, open it to add individual units.
                  </p>
                )}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Acquisition Price ($)</label>
                <input
                  type="number"
                  required
                  value={form.acquisitionPrice}
                  onChange={(e) => setForm({ ...form, acquisitionPrice: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Rehab Budget ($)</label>
                <input
                  type="number"
                  required
                  value={form.budget}
                  onChange={(e) => setForm({ ...form, budget: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Spent So Far ($)</label>
                <input
                  type="number"
                  value={form.spent}
                  onChange={(e) => setForm({ ...form, spent: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Target Sale Price ($)</label>
                <input
                  type="number"
                  value={form.saleTarget}
                  onChange={(e) => setForm({ ...form, saleTarget: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as Deal['status'] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="planning">Planning</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Start Date</label>
                <input
                  type="date"
                  value={form.startDate}
                  onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Target Completion</label>
                <input
                  type="date"
                  value={form.targetCompletionDate}
                  onChange={(e) => setForm({ ...form, targetCompletionDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-gray-600 mb-1">Notes</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Deal specifics, comps, risks..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                {editingId ? 'Save Changes' : 'Add Deal'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Deals List */}
      <div className="space-y-4">
        {filteredDeals.length === 0 ? (
          <div className="card text-center py-16">
            <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-7 h-7 text-blue-500" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">
              {search || filter !== 'all' ? 'No matching deals' : 'No deals yet'}
            </h3>
            <p className="text-gray-500 text-sm mb-5 max-w-sm mx-auto">
              {search || filter !== 'all'
                ? 'Try adjusting your search or filters.'
                : 'Add your first property to start tracking budgets, contractors, and profit.'}
            </p>
            {!search && filter === 'all' && (
              <div className="flex items-center justify-center gap-3 flex-wrap">
                <button onClick={openNew} className="btn-primary inline-flex items-center gap-2 text-sm">
                  <Plus className="w-4 h-4" /> Add Your First Deal
                </button>
                <Link href="/dashboard/import" className="btn-secondary inline-flex items-center gap-2 text-sm">
                  <FileSpreadsheet className="w-4 h-4" /> Import from Spreadsheet
                </Link>
              </div>
            )}
          </div>
        ) : (
          filteredDeals.map((deal) => (
            <div key={deal.id} className="card hover:shadow-md transition-shadow animate-fade-in">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1 grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="col-span-2 md:col-span-1">
                    <p className="text-xs text-gray-500 mb-1">Address</p>
                    <Link href={`/dashboard/deals/${deal.id}`} className="font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                      {deal.address}
                    </Link>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      {deal.projectType && deal.projectType !== 'flip' && (
                        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700 capitalize">
                          {deal.projectType.replace('-', ' ')}
                        </span>
                      )}
                      {deal.units && deal.units.length > 0 && (
                        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">
                          {deal.units.length} units
                        </span>
                      )}
                    </div>
                    {deal.startDate && (
                      <p className="text-xs text-gray-400 mt-1">
                        {deal.startDate} → {deal.targetCompletionDate || 'TBD'}
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Acquisition</p>
                    <p className="font-semibold text-gray-900">{fmtCompact(deal.acquisitionPrice)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Spent / Budget</p>
                    <p className="font-semibold text-gray-900">
                      {fmtCompact(deal.spent)} / {fmtCompact(deal.budget)}
                    </p>
                    <div className="bg-gray-200 rounded-full h-2 mt-2 overflow-hidden w-32">
                      <div
                        className={`h-full transition-all ${deal.spent > deal.budget ? 'bg-red-500' : 'bg-green-500'}`}
                        style={{ width: `${Math.min((deal.spent / (deal.budget || 1)) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Expected Profit</p>
                    <p className={`font-semibold ${deal.expectedProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {fmtCompact(deal.expectedProfit)}
                    </p>
                    {deal.saleTarget && (
                      <p className="text-xs text-gray-400 mt-1">Target sale {fmtCompact(deal.saleTarget)}</p>
                    )}
                  </div>
                  <div className="flex items-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        deal.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : deal.status === 'in-progress'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {deal.status.charAt(0).toUpperCase() + deal.status.slice(1).replace('-', ' ')}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 md:flex-col md:gap-2 shrink-0">
                  <Link
                    href={`/dashboard/deals/${deal.id}`}
                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="View details"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => {
                      const { id, units, ...rest } = deal
                      addDeal({ ...rest, address: `${deal.address} (copy)`, units: units ? units.map((u) => ({ ...u, id: Math.random().toString(36).slice(2) })) : undefined })
                      toast('Deal duplicated')
                    }}
                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Duplicate"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => openEdit(deal)}
                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() =>
                      confirm({
                        message: `Delete "${deal.address}"? This also removes its budget lines, units, and tasks.`,
                        onConfirm: () => {
                          deleteDeal(deal.id)
                          toast('Deal deleted', 'info')
                        },
                      })
                    }
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              {deal.notes && <p className="text-sm text-gray-500 mt-4 border-t border-gray-100 pt-3">{deal.notes}</p>}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
