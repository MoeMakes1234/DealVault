'use client'

import { Download } from 'lucide-react'
import { useStore } from '@/lib/store'
import { fmtCompact } from '@/lib/format'

export default function ReportsPage() {
  const deals = useStore((s) => s.deals)
  const contractors = useStore((s) => s.contractors)

  const totalInvested = deals.reduce((sum, d) => sum + d.acquisitionPrice, 0)
  const totalBudget = deals.reduce((sum, d) => sum + d.budget, 0)
  const totalSpent = deals.reduce((sum, d) => sum + d.spent, 0)
  const totalProfit = deals.reduce((sum, d) => sum + d.expectedProfit, 0)
  const overBudgetDeals = deals.filter((d) => d.spent > d.budget)

  const exportCSV = () => {
    const headers = ['Address', 'Acquisition Price', 'Budget', 'Spent', 'Expected Profit', 'Status', 'Start Date', 'Target Completion']
    const rows = deals.map((d) => [
      d.address,
      d.acquisitionPrice,
      d.budget,
      d.spent,
      d.expectedProfit,
      d.status,
      d.startDate || '',
      d.targetCompletionDate || '',
    ])
    const csv = [headers, ...rows].map((r) => r.map((v) => `"${v}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'dealvault-portfolio-report.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="container-max py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-500 text-sm mt-1">Export detailed P&amp;L and profitability reports.</p>
        </div>
        <button
          onClick={exportCSV}
          className="bg-blue-600 text-white px-4 py-2.5 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors font-medium text-sm"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <p className="text-sm text-gray-600 mb-1">Total Invested</p>
          <p className="text-2xl font-bold">{fmtCompact(totalInvested)}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-600 mb-1">Budget vs Spent</p>
          <p className="text-2xl font-bold">
            {fmtCompact(totalSpent)} <span className="text-sm text-gray-400 font-normal">/ {fmtCompact(totalBudget)}</span>
          </p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-600 mb-1">Expected Profit</p>
          <p className="text-2xl font-bold text-green-600">{fmtCompact(totalProfit)}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-600 mb-1">Over-Budget Deals</p>
          <p className="text-2xl font-bold">{overBudgetDeals.length}</p>
        </div>
      </div>

      {/* P&L Table */}
      <div className="card overflow-x-auto mb-8">
        <h3 className="text-lg font-bold mb-4">Profit & Loss by Deal</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b border-gray-200">
              <th className="py-2 pr-4 font-medium">Address</th>
              <th className="py-2 pr-4 font-medium">Acquisition</th>
              <th className="py-2 pr-4 font-medium">Budget</th>
              <th className="py-2 pr-4 font-medium">Spent</th>
              <th className="py-2 pr-4 font-medium">Variance</th>
              <th className="py-2 pr-4 font-medium">Expected Profit</th>
              <th className="py-2 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {deals.map((d) => {
              const variance = d.budget - d.spent
              return (
                <tr key={d.id}>
                  <td className="py-3 pr-4 font-medium text-gray-900">{d.address}</td>
                  <td className="py-3 pr-4">${d.acquisitionPrice.toLocaleString()}</td>
                  <td className="py-3 pr-4">${d.budget.toLocaleString()}</td>
                  <td className="py-3 pr-4">${d.spent.toLocaleString()}</td>
                  <td className={`py-3 pr-4 font-medium ${variance < 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {variance < 0 ? '-' : '+'}${Math.abs(variance).toLocaleString()}
                  </td>
                  <td className="py-3 pr-4 font-medium text-green-600">${d.expectedProfit.toLocaleString()}</td>
                  <td className="py-3 capitalize">{d.status.replace('-', ' ')}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Contractor spend */}
      <div className="card overflow-x-auto">
        <h3 className="text-lg font-bold mb-4">Contractor Spend</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b border-gray-200">
              <th className="py-2 pr-4 font-medium">Contractor</th>
              <th className="py-2 pr-4 font-medium">Trade</th>
              <th className="py-2 pr-4 font-medium">Total Paid</th>
              <th className="py-2 font-medium">Rating</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {contractors.map((c) => (
              <tr key={c.id}>
                <td className="py-3 pr-4 font-medium text-gray-900">{c.name}</td>
                <td className="py-3 pr-4">{c.trade}</td>
                <td className="py-3 pr-4">${c.totalPaid.toLocaleString()}</td>
                <td className="py-3">{c.rating.toFixed(1)} / 5</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
