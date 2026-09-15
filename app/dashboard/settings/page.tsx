'use client'

import { useState } from 'react'
import { User, Building, Sliders, Trash2, AlertTriangle } from 'lucide-react'
import { useStore } from '@/lib/store'
import { useToast } from '@/lib/toast'

export default function SettingsPage() {
  const settings = useStore((s) => s.settings)
  const updateSettings = useStore((s) => s.updateSettings)
  const toast = useToast((s) => s.show)

  const [form, setForm] = useState(settings)

  const save = () => {
    updateSettings(form)
    toast('Settings saved')
  }

  const resetData = () => {
    if (confirm('This clears ALL your data (deals, contractors, analyses) and reloads the demo data. Continue?')) {
      localStorage.removeItem('dealvault-storage')
      toast('Data reset — reloading...', 'info')
      setTimeout(() => location.reload(), 800)
    }
  }

  const inputCls = 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none'
  const labelCls = 'block text-sm font-medium text-gray-700 mb-1'

  return (
    <div className="container-max py-8 max-w-3xl animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your profile, company, and preferences.</p>
      </div>

      {/* Profile */}
      <div className="card mb-6">
        <h3 className="font-bold mb-4 flex items-center gap-2"><User className="w-4 h-4 text-gray-400" /> Profile</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Full Name</label>
            <input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} className={inputCls} placeholder="Your name" />
          </div>
          <div>
            <label className={labelCls}>Email</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputCls} placeholder="you@example.com" />
          </div>
        </div>
      </div>

      {/* Company */}
      <div className="card mb-6">
        <h3 className="font-bold mb-4 flex items-center gap-2"><Building className="w-4 h-4 text-gray-400" /> Company</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Company Name</label>
            <input value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} className={inputCls} placeholder="Your business name" />
          </div>
          <div>
            <label className={labelCls}>Currency</label>
            <select value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })} className={inputCls}>
              <option value="USD">USD ($)</option>
              <option value="CAD">CAD ($)</option>
              <option value="GBP">GBP (£)</option>
              <option value="EUR">EUR (€)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="card mb-6">
        <h3 className="font-bold mb-4 flex items-center gap-2"><Sliders className="w-4 h-4 text-gray-400" /> Deal Preferences</h3>
        <div>
          <label className={labelCls}>Default Rehab Contingency Buffer (%)</label>
          <input type="number" value={form.defaultRehabBuffer} onChange={(e) => setForm({ ...form, defaultRehabBuffer: Number(e.target.value) })} className={inputCls + ' max-w-xs'} />
          <p className="text-xs text-gray-400 mt-1">Applied as a safety margin when estimating rehab budgets.</p>
        </div>
      </div>

      <button onClick={save} className="btn-primary mb-10">Save Settings</button>

      {/* Danger zone */}
      <div className="card border-red-100 bg-red-50/50">
        <h3 className="font-bold mb-2 flex items-center gap-2 text-red-700"><AlertTriangle className="w-4 h-4" /> Danger Zone</h3>
        <p className="text-sm text-gray-600 mb-4">Reset all local data and restore the original demo content. This cannot be undone.</p>
        <button onClick={resetData} className="px-4 py-2 bg-white border border-red-200 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors flex items-center gap-2">
          <Trash2 className="w-4 h-4" /> Reset All Data
        </button>
      </div>
    </div>
  )
}
