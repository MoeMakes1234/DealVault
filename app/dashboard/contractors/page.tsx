'use client'

import { useState } from 'react'
import { Plus, Trash2, X, Star, Phone, Mail } from 'lucide-react'
import { useStore, Contractor } from '@/lib/store'
import { useToast } from '@/lib/toast'

const emptyForm = {
  name: '',
  trade: '',
  phone: '',
  email: '',
  rating: '5',
  dealId: '',
  totalPaid: '0',
  status: 'active' as Contractor['status'],
}

export default function ContractorsPage() {
  const contractors = useStore((s) => s.contractors)
  const deals = useStore((s) => s.deals)
  const toast = useToast((s) => s.show)
  const addContractor = useStore((s) => s.addContractor)
  const deleteContractor = useStore((s) => s.deleteContractor)
  const updateContractor = useStore((s) => s.updateContractor)

  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    addContractor({
      name: form.name,
      trade: form.trade,
      phone: form.phone,
      email: form.email,
      rating: Number(form.rating),
      dealId: form.dealId || undefined,
      totalPaid: Number(form.totalPaid) || 0,
      status: form.status,
    })
    setForm(emptyForm)
    setShowForm(false)
    toast('Contractor added')
  }

  const dealAddress = (id?: string) => deals.find((d) => d.id === id)?.address

  return (
    <div className="container-max py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contractors</h1>
          <p className="text-gray-500 text-sm mt-1">Store quotes, track payments, and rate performance.</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2.5 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors font-medium text-sm"
        >
          <Plus className="w-4 h-4" />
          Add Contractor
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50" onClick={() => setShowForm(false)}>
          <form
            onSubmit={handleSubmit}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl p-6 w-full max-w-lg"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold">Add Contractor</h3>
              <button type="button" onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Name / Company</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Trade</label>
                <input
                  required
                  placeholder="Electrician, Plumber, General Contractor..."
                  value={form.trade}
                  onChange={(e) => setForm({ ...form, trade: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Phone</label>
                  <input
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Linked Deal</label>
                  <select
                    value={form.dealId}
                    onChange={(e) => setForm({ ...form, dealId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="">None</option>
                    {deals.map((d) => (
                      <option key={d.id} value={d.id}>{d.address}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Total Paid ($)</label>
                  <input
                    type="number"
                    value={form.totalPaid}
                    onChange={(e) => setForm({ ...form, totalPaid: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
              <button type="submit" className="btn-primary">Add Contractor</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contractors.map((c) => (
          <div key={c.id} className="card">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-bold text-gray-900">{c.name}</h3>
                <p className="text-sm text-gray-500">{c.trade}</p>
              </div>
              <button onClick={() => { deleteContractor(c.id); toast('Contractor removed', 'info') }} className="text-gray-400 hover:text-red-600">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-1 mb-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < Math.round(c.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`}
                />
              ))}
              <span className="text-xs text-gray-500 ml-1">{c.rating.toFixed(1)}</span>
            </div>

            <div className="space-y-1.5 text-sm text-gray-600 mb-3">
              {c.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5" /> {c.phone}
                </div>
              )}
              {c.email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5" /> {c.email}
                </div>
              )}
            </div>

            {c.dealId && (
              <p className="text-xs text-gray-500 mb-3 truncate">Working on: {dealAddress(c.dealId)}</p>
            )}

            <div className="flex justify-between items-center pt-3 border-t border-gray-100">
              <span className="text-sm font-semibold text-gray-900">${c.totalPaid.toLocaleString()} paid</span>
              <select
                value={c.status}
                onChange={(e) => updateContractor(c.id, { status: e.target.value as Contractor['status'] })}
                className={`text-xs font-semibold px-2 py-1 rounded-full border-0 outline-none cursor-pointer ${
                  c.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                }`}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        ))}
      </div>

      {contractors.length === 0 && (
        <div className="card text-center py-12 text-gray-500">No contractors yet. Add your first one to get started.</div>
      )}
    </div>
  )
}
