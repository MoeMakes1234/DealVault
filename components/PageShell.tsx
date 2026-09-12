'use client'

import Link from 'next/link'
import { Home, ArrowLeft } from 'lucide-react'

export default function PageShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="container-max flex justify-between items-center py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Home className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-blue-600">DealVault</span>
          </Link>
          <Link href="/auth/signup" className="btn-primary">Start Free</Link>
        </div>
      </nav>

      <div className="container-max max-w-3xl py-12">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 text-sm mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to home
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-8">{title}</h1>
        <div className="prose prose-gray max-w-none text-gray-600 space-y-4">{children}</div>
      </div>

      <footer className="border-t border-gray-200 py-8 mt-12">
        <div className="container-max text-center text-sm text-gray-400">
          &copy; {new Date().getFullYear()} DealVault. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
