'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Home, ArrowLeft, Mail, CheckCircle } from 'lucide-react'

export default function ContactPage() {
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', message: '' })

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

      <div className="container-max max-w-xl py-12">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 text-sm mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to home
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Get in touch</h1>
        <p className="text-gray-600 mb-8">
          Questions, feedback, or want a demo? Send us a message and we'll get back to you.
        </p>

        {sent ? (
          <div className="card text-center py-12">
            <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-7 h-7 text-green-500" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Message sent!</h3>
            <p className="text-gray-500 text-sm">Thanks for reaching out — we'll be in touch soon.</p>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault()
              setSent(true)
            }}
            className="card space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea
                required
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <button type="submit" className="btn-primary w-full">Send Message</button>
            <p className="text-xs text-gray-400 text-center flex items-center justify-center gap-1">
              <Mail className="w-3 h-3" /> Or email us directly at hello@dealvault.com
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
