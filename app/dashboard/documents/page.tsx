'use client'

import { useState } from 'react'
import { Plus, Trash2, X, FileText, FilePlus2, Stamp, ClipboardCheck, ScrollText, File } from 'lucide-react'
import { useStore, DocumentItem } from '@/lib/store'

const categoryIcon: Record<DocumentItem['category'], any> = {
  contract: ScrollText,
  permit: Stamp,
  inspection: ClipboardCheck,
  title: FileText,
  other: File,
}

const categoryLabel: Record<DocumentItem['category'], string> = {
  contract: 'Contract',
  permit: 'Permit',
  inspection: 'Inspection',
  title: 'Title',
  other: 'Other',
}

const emptyForm = {
  name: '',
  category: 'contract' as DocumentItem['category'],
  dealId: '',
  notes: '',
}

export default function DocumentsPage() {
  const documents = useStore((s) => s.documents)
  const deals = useStore((s) => s.deals)
  const addDocument = useStore((s) => s.addDocument)
  const deleteDocument = useStore((s) => s.deleteDocument)

  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [filter, setFilter] = useState<'all' | DocumentItem['category']>('all')

  const filtered = filter === 'all' ? documents : documents.filter((d) => d.category === filter)
  const dealAddress = (id?: string) => deals.find((d) => d.id === id)?.address

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    addDocument({
      name: form.name,
      category: form.category,
      dealId: form.dealId || undefined,
      dateAdded: new Date().toISOString().slice(0, 10),
      notes: form.notes || undefined,
    })
    setForm(emptyForm)
    setShowForm(false)
  }

  return (
    <div className="container-max py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Document Hub</h1>
          <p className="text-gray-500 text-sm mt-1">Organize contracts, permits, inspections, and title docs.</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2.5 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors font-medium text-sm"
        >
          <FilePlus2 className="w-4 h-4" />
          Log Document
        </button>
      </div>

      <p className="text-xs text-gray-400 mb-4 italic">
        Note: this MVP tracks document records — actual file uploads/storage come with the Supabase integration.
      </p>

      <div className="flex gap-2 mb-6 flex-wrap">
        {(['all', 'contract', 'permit', 'inspection', 'title', 'other'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filter === f ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {f === 'all' ? 'All' : categoryLabel[f]}
          </button>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50" onClick={() => setShowForm(false)}>
          <form onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()} className="bg-white rounded-xl p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold">Log Document</h3>
              <button type="button" onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">File Name</label>
                <input
                  required
                  placeholder="Purchase Agreement - 123 Main St.pdf"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value as DocumentItem['category'] })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="contract">Contract</option>
                    <option value="permit">Permit</option>
                    <option value="inspection">Inspection</option>
                    <option value="title">Title</option>
                    <option value="other">Other</option>
                  </select>
                </div>
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
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Notes</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
              <button type="submit" className="btn-primary">Save</button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        {filtered.length === 0 ? (
          <p className="text-center text-gray-500 py-12">No documents in this category yet.</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {filtered.map((doc) => {
              const Icon = categoryIcon[doc.category]
              return (
                <div key={doc.id} className="flex items-center justify-between py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{doc.name}</p>
                      <p className="text-xs text-gray-500">
                        {categoryLabel[doc.category]} · Added {doc.dateAdded}
                        {doc.dealId && ` · ${dealAddress(doc.dealId)}`}
                      </p>
                    </div>
                  </div>
                  <button onClick={() => deleteDocument(doc.id)} className="text-gray-400 hover:text-red-600 p-2">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
