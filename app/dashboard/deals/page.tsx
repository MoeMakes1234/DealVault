'use client'

import { useState } from 'react'
import { Plus, Trash2, Edit2, X } from 'lucide-react'
import { useStore, Deal } from '@/lib/store'

const emptyForm = {
  address: '',
  acquisitionPrice: '',
  budget: '',
  spent: '',
  saleTarget: '',
  status: 'planning' as Deal['status'],
  startDate: '',
  targetCompletionDate: '',
  notes: '',
}

export default function DealsPage() {
  const deals = useStore((s) => s.deals)
  const addDeal = useStore((s) => s.addDeal)
  const updateDeal = useStore((s) => s.updateDeal)
  const deleteDeal = useStore((s) => s.deleteDeal)

  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [filter, setFilter] = useState<'all' | Deal['status']>('all')

  const filteredDeals = filter === 'all' ? deals : deals.filter((d) => d.status === filter)

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
      expectedProfit: (Number(form.saleTarget) || 0) - (Number(form.acquisitionPrice) || 0) - (Number(form.budget) || 0),
      startDate: form.startDate || undefined,
      targetCompletionDate: form.targetCompletionDate || undefined,
      notes: form.notes || undefined,
    }

    if (editingId) {
      updateDeal(editingId, payload)
    } else {
      addDeal(payload)
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
        <button
          onClick={openNew}
          className="bg-blue-600 text-white px-4 py-2.5 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors font-medium text-sm"
        >
          <Plus className="w-4 h-4" />
          New Deal
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        {(['all', 'planning', 'in-progress', 'completed'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filter === f ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
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
          <div className="card text-center py-12 text-gray-500">No deals in this filter yet.</div>
        ) : (
          filteredDeals.map((deal) => (
            <div key={deal.id} className="card hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1 grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="col-span-2 md:col-span-1">
                    <p className="text-xs text-gray-500 mb-1">Address</p>
                    <p className="font-semibold text-gray-900">{deal.address}</p>
                    {deal.startDate && (
                      <p className="text-xs text-gray-400 mt-1">
                        {deal.startDate} → {deal.targetCompletionDate || 'TBD'}
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Acquisition</p>
                    <p className="font-semibold text-gray-900">${(deal.acquisitionPrice / 1000).toFixed(0)}K</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Spent / Budget</p>
                    <p className="font-semibold text-gray-900">
                      ${(deal.spent / 1000).toFixed(0)}K / ${(deal.budget / 1000).toFixed(0)}K
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
                      ${(deal.expectedProfit / 1000).toFixed(0)}K
                    </p>
                    {deal.saleTarget && (
                      <p className="text-xs text-gray-400 mt-1">Target sale ${(deal.saleTarget / 1000).toFixed(0)}K</p>
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
                  <button
                    onClick={() => openEdit(deal)}
                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteDeal(deal.id)}
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
