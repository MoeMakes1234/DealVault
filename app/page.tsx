'use client'

import Link from 'next/link'
import { CheckCircle, TrendingUp, Users, FileText, BarChart3, Clock } from 'lucide-react'
import { useState } from 'react'

export default function Home() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly')

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="container-max flex justify-between items-center py-4">
          <div className="text-2xl font-bold text-blue-600">DealVault</div>
          <div className="flex gap-6 items-center">
            <Link href="/auth/login" className="text-gray-600 hover:text-gray-900">
              Login
            </Link>
            <Link href="/auth/signup" className="btn-primary">
              Start Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container-max py-24">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="section-title text-5xl mb-6">
            Manage Your Real Estate Empire
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Professional project management, budgeting, and tracking for real estate developers and house flippers. 
            Track profitability in real-time across all your projects.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/auth/signup" className="btn-primary text-lg px-8 py-4">
              Get Started Free
            </Link>
            <button className="btn-secondary text-lg px-8 py-4">
              Watch Demo
            </button>
          </div>
          <p className="text-gray-500 mt-4">No credit card required • 14-day free trial</p>
        </div>

        {/* Hero Image Placeholder */}
        <div className="rounded-xl bg-gradient-to-br from-blue-200 to-indigo-200 p-1 shadow-2xl">
          <div className="bg-white rounded-lg p-8 h-96 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <BarChart3 className="w-24 h-24 mx-auto mb-4 opacity-50" />
              <p>Dashboard Preview</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-24 border-t border-gray-200">
        <div className="container-max">
          <h2 className="section-title text-center mb-16">Everything You Need</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: BarChart3,
                title: 'Deal Pipeline',
                desc: 'Track all your projects from acquisition to sale with real-time profitability tracking.',
              },
              {
                icon: TrendingUp,
                title: 'Budget Management',
                desc: 'Set budgets and track actual costs. Never go over budget on a project again.',
              },
              {
                icon: Users,
                title: 'Contractor Management',
                desc: 'Store quotes, track payments, and rate contractor performance across projects.',
              },
              {
                icon: FileText,
                title: 'Document Hub',
                desc: 'Organize contracts, permits, inspections, and title docs all in one place.',
              },
              {
                icon: Clock,
                title: 'Timeline View',
                desc: 'Visual project timeline with milestones and task tracking built-in.',
              },
              {
                icon: CheckCircle,
                title: 'Smart Reports',
                desc: 'Export detailed P&L statements and profitability reports for each deal.',
              },
            ].map((feature, i) => (
              <div key={i} className="card hover:shadow-md transition-shadow">
                <feature.icon className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24">
        <div className="container-max">
          <h2 className="section-title text-center mb-4">Simple, Transparent Pricing</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Choose the plan that fits your business. Always scale up or down—no long-term contracts.
          </p>

          {/* Billing Toggle */}
          <div className="flex justify-center mb-12">
            <div className="bg-gray-200 rounded-lg p-1 flex">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-6 py-2 rounded font-semibold transition-all ${
                  billingCycle === 'monthly'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('annual')}
                className={`px-6 py-2 rounded font-semibold transition-all ${
                  billingCycle === 'annual'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600'
                }`}
              >
                Annual (Save 20%)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Starter',
                price: billingCycle === 'monthly' ? 99 : 950,
                description: 'Perfect for beginners',
                features: [
                  '1-2 active projects',
                  'Basic project tracking',
                  'Budget tracking',
                  'Up to 5 contractors',
                  'Email support',
                ],
              },
              {
                name: 'Professional',
                price: billingCycle === 'monthly' ? 199 : 1910,
                description: 'For active flippers',
                popular: true,
                features: [
                  'Unlimited projects',
                  'Full project management',
                  'Advanced budgeting',
                  'Unlimited contractors',
                  'Document storage',
                  'Reports & exports',
                  'Priority support',
                ],
              },
              {
                name: 'Enterprise',
                price: 'Custom',
                description: 'For development teams',
                features: [
                  'Everything in Professional',
                  'Team collaboration',
                  'Partner portal',
                  'Custom integrations',
                  'Dedicated support',
                  'API access',
                ],
              },
            ].map((plan, i) => (
              <div
                key={i}
                className={`rounded-xl border-2 p-8 transition-all ${
                  plan.popular
                    ? 'border-blue-600 bg-gradient-to-br from-blue-50 to-white shadow-lg scale-105'
                    : 'border-gray-200 bg-white'
                }`}
              >
                {plan.popular && (
                  <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold mb-4 w-fit">
                    Most Popular
                  </div>
                )}
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-4 text-sm">{plan.description}</p>
                <div className="mb-6">
                  {typeof plan.price === 'number' ? (
                    <>
                      <span className="text-4xl font-bold">${plan.price}</span>
                      <span className="text-gray-600">/{billingCycle === 'monthly' ? 'month' : 'year'}</span>
                    </>
                  ) : (
                    <span className="text-4xl font-bold">{plan.price}</span>
                  )}
                </div>
                <button
                  className={`w-full py-3 rounded-lg font-semibold mb-6 transition-colors ${
                    plan.popular
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  Get Started
                </button>
                <div className="space-y-3">
                  {plan.features.map((feature, j) => (
                    <div key={j} className="flex gap-3 text-sm">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-24">
        <div className="container-max text-center">
          <h2 className="text-4xl font-bold mb-4">
            Ready to build your empire?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join developers and flippers who are already saving time and money with DealVault.
          </p>
          <Link href="/auth/signup" className="btn-primary bg-white text-blue-600 hover:bg-gray-100">
            Start Your 14-Day Free Trial
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container-max">
          <div className="grid grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-white font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Features</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">Security</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/privacy" className="hover:text-white">Privacy</a></li>
                <li><a href="/terms" className="hover:text-white">Terms</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">DealVault</h4>
              <p className="text-sm">Real estate platform for developers.</p>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-sm text-center">
            <p>&copy; 2024 DealVault. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
