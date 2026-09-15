'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home,
  LayoutDashboard,
  Building2,
  Users,
  FileText,
  Clock,
  BarChart3,
  LogOut,
  Menu,
  X,
  Sparkles,
  Calculator,
} from 'lucide-react'
import { useState } from 'react'

const navItems = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/analyzer', label: 'Analyzer', icon: Calculator },
  { href: '/dashboard/deals', label: 'Deals', icon: Building2 },
  { href: '/dashboard/contractors', label: 'Contractors', icon: Users },
  { href: '/dashboard/documents', label: 'Documents', icon: FileText },
  { href: '/dashboard/timeline', label: 'Timeline', icon: Clock },
  { href: '/dashboard/reports', label: 'Reports', icon: BarChart3 },
  { href: '/dashboard/assistant', label: 'AI Assistant', icon: Sparkles },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const SidebarContent = (
    <>
      <Link href="/dashboard" className="flex items-center gap-3 px-6 py-5 border-b border-gray-800 hover:bg-gray-900 transition-colors">
        <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
          <Home className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="font-bold text-white leading-tight">DealVault</h2>
          <p className="text-xs text-gray-400">Developer Platform</p>
        </div>
      </Link>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const active = pathname === item.href
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="px-3 py-4 border-t border-gray-800">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </Link>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-[#0a0e27] flex items-center justify-between px-4 py-3 border-b border-gray-800">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Home className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-white">DealVault</span>
        </Link>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="text-white">
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-30 bg-black/50" onClick={() => setMobileOpen(false)}>
          <div
            className="w-64 h-full bg-[#0a0e27] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {SidebarContent}
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-[#0a0e27]">
        {SidebarContent}
      </aside>
    </>
  )
}
