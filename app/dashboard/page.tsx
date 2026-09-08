'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Home, BarChart3, Users, LogOut, Trash2, Edit2, DollarSign, TrendingUp } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

interface Deal {
  id: string
  address: string
  acquisitionPrice: number
  budget: number
  spent: number
  status: 'planning' | 'in-progress' | 'completed'
  expectedProfit: number
}

export default function Dashboard() {
  const [deals, setDeals] = useState<Deal[]>([
    {
      id: '1',
      address: '123 Main St, Brooklyn NY',
      acquisitionPrice: 250000,
      budget: 75000,
      spent: 42000,
      status: 'in-progress',
      expectedProfit: 85000,
    },
    {
      id: '2',
      address: '456 Oak Ave, Queens NY',
      acquisitionPrice: 180000,
      budget: 50000,
      spent: 50000,
      status: 'completed',
      expectedProfit: 62000,
    },
  ])

  const [showNewDeal, setShowNewDeal] = useState(false)
  const [address, setAddress] = useState('')
  const [acquisition, setAcquisition] = useState('')
  const [budget, setBudget] = useState('')

  const totalInvested = deals.reduce((sum, d) => sum + d.acquisitionPrice, 0)
  const totalSpent = deals.reduce((sum, d) => sum + d.spent, 0)
  const totalProfit = deals.reduce((sum, d) => sum + d.expectedProfit, 0)
  const activeDeals = deals.filter(d => d.status === 'in-progress').length

  const chartData = [
    { month: 'Jan', profit: 15000 },
    { month: 'Feb', profit: 32000 },
    { month: 'Mar', profit: 48000 },
    { month: 'Apr', profit: 62000 },
    { month: 'May', profit: 85000 },
    { month: 'Jun', profit: 120000 },
  ]

  const handleAddDeal = (e: React.FormEvent) => {
    e.preventDefault()
    if (address && acquisition && budget) {
      const newDeal: Deal = {
        id: Date.now().toString(),
        address,
        acquisitionPrice: Number(acquisition),
        budget: Number(budget),
        spent: 0,
        status: 'planning',
        expectedProfit: Number(budget) * 0.8,
      }
      setDeals([...deals, newDeal])
      setAddress('')
      setAcquisition('')
      setBudget('')
      setShowNewDeal(false)
    }
  }

  const handleDeleteDeal = (id: string) => {
    setDeals(deals.filter(d => d.id !== id))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="container-max py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Home className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900">DealVault</h2>
              <p className="text-xs text-gray-600">Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Welcome back!</span>
            <Link href="/" className="text-gray-600 hover:text-gray-900 flex items-center gap-2">
              <LogOut className="w-5 h-5" />
              Logout
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container-max py-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex justify-between items-start mb-3">
              <span className="text-gray-600 font-medium">Total Invested</span>
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-3xl font-bold">${(totalInvested / 1000).toFixed(0)}K</p>
            <p className="text-sm text-gray-500 mt-2">{deals.length} active projects</p>
          </div>

          <div className="card">
            <div className="flex justify-between items-start mb-3">
              <span className="text-gray-600 font-medium">Total Spent</span>
              <TrendingUp className="w-5 h-5 text-orange-600" />
            </div>
            <p className="text-3xl font-bold">${(totalSpent / 1000).toFixed(0)}K</p>
            <p className="text-sm text-gray-500 mt-2">Across all projects</p>
          </div>

          <div className="card">
            <div className="flex justify-between items-start mb-3">
              <span className="text-gray-600 font-medium">Expected Profit</span>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold">${(totalProfit / 1000).toFixed(0)}K</p>
            <p className="text-sm text-gray-500 mt-2">Portfolio ROI</p>
          </div>

          <div className="card">
            <div className="flex justify-between items-start mb-3">
              <span className="text-gray-600 font-medium">Active Deals</span>
              <BarChart3 className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-3xl font-bold">{activeDeals}</p>
            <p className="text-sm text-gray-500 mt-2">In progress</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 card">
            <h3 className="text-lg font-bold mb-6">Portfolio Performance</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="profit"
                  stroke="#0066cc"
                  fill="#0066cc"
                  fillOpacity={0.1}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="card">
            <h3 className="text-lg font-bold mb-6">Deal Status</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'In Progress', value: activeDeals },
                    { name: 'Completed', value: deals.filter(d => d.status === 'completed').length },
                    { name: 'Planning', value: deals.filter(d => d.status === 'planning').length },
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                >
                  <Cell fill="#0066cc" />
                  <Cell fill="#10b981" />
                  <Cell fill="#f59e0b" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Deals Section */}
        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold">Your Projects</h3>
            <button
              onClick={() => setShowNewDeal(!showNewDeal)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              New Deal
            </button>
          </div>

          {showNewDeal && (
            <form onSubmit={handleAddDeal} className="bg-blue-50 p-6 rounded-lg mb-6 border-2 border-blue-200">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <input
                  type="text"
                  placeholder="Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
                <input
                  type="number"
                  placeholder="Acquisition Price"
                  value={acquisition}
                  onChange={(e) => setAcquisition(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
                <input
                  type="number"
                  placeholder="Rehab Budget"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                  Add Deal
                </button>
              </div>
            </form>
          )}

          <div className="space-y-4">
            {deals.length === 0 ? (
              <p className="text-gray-500 py-8 text-center">No deals yet. Create your first project to get started!</p>
            ) : (
              deals.map((deal) => (
                <div key={deal.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Address</p>
                      <p className="font-semibold text-gray-900">{deal.address}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Acquisition</p>
                      <p className="font-semibold text-gray-900">${(deal.acquisitionPrice / 1000).toFixed(0)}K</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Spent / Budget</p>
                      <p className="font-semibold text-gray-900">${(deal.spent / 1000).toFixed(0)}K / ${(deal.budget / 1000).toFixed(0)}K</p>
                      <div className="bg-gray-200 rounded-full h-2 mt-2 overflow-hidden">
                        <div
                          className={`h-full transition-all ${
                            deal.spent > deal.budget ? 'bg-red-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${Math.min((deal.spent / deal.budget) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Expected Profit</p>
                      <p className="font-semibold text-green-600">${(deal.expectedProfit / 1000).toFixed(0)}K</p>
                    </div>
                    <div className="flex items-end gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        deal.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : deal.status === 'in-progress'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {deal.status.charAt(0).toUpperCase() + deal.status.slice(1)}
                      </span>
                      <button
                        onClick={() => handleDeleteDeal(deal.id)}
                        className="text-red-600 hover:text-red-800 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
