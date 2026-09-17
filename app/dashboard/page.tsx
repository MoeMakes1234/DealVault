'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus, DollarSign, TrendingUp, BarChart3, ArrowRight, Users, FileText, Clock, Calculator, KanbanSquare } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, Legend } from 'recharts'
import { useStore } from '@/lib/store'
import { fmtCompact } from '@/lib/format'
import Onboarding from '@/components/Onboarding'

export default function DashboardOverview() {
  const deals = useStore((s) => s.deals)
  const contractors = useStore((s) => s.contractors)
  const documents = useStore((s) => s.documents)
  const settings = useStore((s) => s.settings)
  const firstName = settings.fullName ? settings.fullName.split(' ')[0] : ''

  const totalInvested = deals.reduce((sum, d) => sum + d.acquisitionPrice, 0)
  const totalSpent = deals.reduce((sum, d) => sum + d.spent, 0)
  const totalProfit = deals.reduce((sum, d) => sum + d.expectedProfit, 0)
  const activeDeals = deals.filter((d) => d.status === 'in-progress').length

  // Real per-deal budget vs spent for the bar chart
  const dealChartData = deals.map((d) => ({
    name: d.address.split(',')[0].slice(0, 14),
    Budget: d.budget,
    Spent: d.spent,
  }))

  // Cumulative expected profit across deals (real data) for the trend area
  const chartData = deals.length
    ? deals.reduce((acc: { month: string; profit: number }[], d, i) => {
        const prev = i > 0 ? acc[i - 1].profit : 0
        acc.push({ month: d.address.split(',')[0].slice(0, 10), profit: prev + d.expectedProfit })
        return acc
      }, [])
    : [{ month: 'No deals', profit: 0 }]

  return (
    <div className="container-max py-8">
      <Onboarding />
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{firstName ? `Welcome back, ${firstName}` : 'Overview'}</h1>
          <p className="text-gray-500 text-sm mt-1">Here's how your portfolio is doing.</p>
        </div>
        <Link
          href="/dashboard/deals"
          className="bg-blue-600 text-white px-4 py-2.5 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors font-medium text-sm"
        >
          <Plus className="w-4 h-4" />
          New Deal
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex justify-between items-start mb-3">
            <span className="text-gray-600 font-medium text-sm">Total Invested</span>
            <DollarSign className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-3xl font-bold">{fmtCompact(totalInvested)}</p>
          <p className="text-sm text-gray-500 mt-2">{deals.length} total projects</p>
        </div>

        <div className="card">
          <div className="flex justify-between items-start mb-3">
            <span className="text-gray-600 font-medium text-sm">Total Spent</span>
            <TrendingUp className="w-5 h-5 text-orange-600" />
          </div>
          <p className="text-3xl font-bold">{fmtCompact(totalSpent)}</p>
          <p className="text-sm text-gray-500 mt-2">Across all projects</p>
        </div>

        <div className="card">
          <div className="flex justify-between items-start mb-3">
            <span className="text-gray-600 font-medium text-sm">Expected Profit</span>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-3xl font-bold">{fmtCompact(totalProfit)}</p>
          <p className="text-sm text-gray-500 mt-2">Portfolio total</p>
        </div>

        <div className="card">
          <div className="flex justify-between items-start mb-3">
            <span className="text-gray-600 font-medium text-sm">Active Deals</span>
            <BarChart3 className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-3xl font-bold">{activeDeals}</p>
          <p className="text-sm text-gray-500 mt-2">In progress</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 card">
          <h3 className="text-lg font-bold mb-1">Cumulative Expected Profit</h3>
          <p className="text-sm text-gray-500 mb-6">Built from your actual deals</p>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
              <YAxis stroke="#9ca3af" fontSize={12} tickFormatter={(v) => fmtCompact(v)} />
              <Tooltip
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                formatter={(v: number) => `$${v.toLocaleString()}`}
              />
              <Area type="monotone" dataKey="profit" stroke="#0066cc" fill="#0066cc" fillOpacity={0.1} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="text-lg font-bold mb-6">Deal Status</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={[
                  { name: 'In Progress', value: deals.filter((d) => d.status === 'in-progress').length },
                  { name: 'Completed', value: deals.filter((d) => d.status === 'completed').length },
                  { name: 'Planning', value: deals.filter((d) => d.status === 'planning').length },
                ]}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={2}
                dataKey="value"
              >
                <Cell fill="#0066cc" />
                <Cell fill="#10b981" />
                <Cell fill="#f59e0b" />
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-2 text-xs text-gray-600">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-600 inline-block" /> In Progress</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500 inline-block" /> Completed</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500 inline-block" /> Planning</span>
          </div>
        </div>
      </div>

      {/* Budget vs Spent bar chart - real data */}
      {deals.length > 0 && (
        <div className="card mb-8">
          <h3 className="text-lg font-bold mb-1">Budget vs. Spent by Deal</h3>
          <p className="text-sm text-gray-500 mb-6">Track where you stand against budget on each project</p>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={dealChartData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
              <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
              <YAxis stroke="#9ca3af" fontSize={12} tickFormatter={(v) => fmtCompact(v)} />
              <Tooltip
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                formatter={(v: number) => `$${v.toLocaleString()}`}
              />
              <Legend />
              <Bar dataKey="Budget" fill="#93c5fd" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Spent" fill="#2563eb" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Analyzer promo */}
      <Link href="/dashboard/analyzer" className="block mb-8 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white hover:shadow-lg transition-shadow group">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Analyze a property before you buy</h3>
              <p className="text-blue-100 text-sm">Check the numbers, ROI, cap rate & financing — then convert winners into deals.</p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </div>
      </Link>

      {/* Quick links to other sections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link href="/dashboard/contractors" className="card hover:shadow-md transition-shadow flex items-center justify-between group">
          <div>
            <div className="flex items-center gap-2 text-purple-600 mb-1">
              <Users className="w-4 h-4" />
              <span className="text-sm font-semibold">Contractors</span>
            </div>
            <p className="text-2xl font-bold">{contractors.length}</p>
            <p className="text-xs text-gray-500">{contractors.filter(c => c.status === 'active').length} active</p>
          </div>
          <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
        </Link>
        <Link href="/dashboard/documents" className="card hover:shadow-md transition-shadow flex items-center justify-between group">
          <div>
            <div className="flex items-center gap-2 text-blue-600 mb-1">
              <FileText className="w-4 h-4" />
              <span className="text-sm font-semibold">Documents</span>
            </div>
            <p className="text-2xl font-bold">{documents.length}</p>
            <p className="text-xs text-gray-500">files stored</p>
          </div>
          <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
        </Link>
        <Link href="/dashboard/pipeline" className="card hover:shadow-md transition-shadow flex items-center justify-between group">
          <div>
            <div className="flex items-center gap-2 text-green-600 mb-1">
              <KanbanSquare className="w-4 h-4" />
              <span className="text-sm font-semibold">Pipeline</span>
            </div>
            <p className="text-2xl font-bold">Deal board</p>
            <p className="text-xs text-gray-500">drag through stages</p>
          </div>
          <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
        </Link>
      </div>

      {/* Deals Preview */}
      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold">Recent Projects</h3>
          <Link href="/dashboard/deals" className="text-blue-600 text-sm font-medium flex items-center gap-1 hover:text-blue-700">
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="space-y-4">
          {deals.length === 0 && (
            <div className="text-center py-8 text-gray-400 text-sm">
              No deals yet. Head to the Analyzer to evaluate a property, or add one directly on the Deals page.
            </div>
          )}
          {deals.slice(0, 3).map((deal) => (
            <div key={deal.id} className="border border-gray-200 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Address</p>
                  <p className="font-semibold text-gray-900">{deal.address}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Acquisition</p>
                  <p className="font-semibold text-gray-900">{fmtCompact(deal.acquisitionPrice)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Spent / Budget</p>
                  <p className="font-semibold text-gray-900">{fmtCompact(deal.spent)} / {fmtCompact(deal.budget)}</p>
                  <div className="bg-gray-200 rounded-full h-2 mt-2 overflow-hidden">
                    <div
                      className={`h-full transition-all ${deal.spent > deal.budget ? 'bg-red-500' : 'bg-green-500'}`}
                      style={{ width: `${Math.min((deal.spent / deal.budget) * 100, 100)}%` }}
                    />
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Expected Profit</p>
                  <p className="font-semibold text-green-600">{fmtCompact(deal.expectedProfit)}</p>
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
                    {deal.status.charAt(0).toUpperCase() + deal.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
