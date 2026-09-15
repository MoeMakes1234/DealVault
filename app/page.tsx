'use client'

import Link from 'next/link'
import { CheckCircle, TrendingUp, Users, FileText, BarChart3, Clock, Home as HomeIcon, DollarSign, ArrowRight, Calculator } from 'lucide-react'
import { useState } from 'react'

export default function Home() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly')

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="container-max flex justify-between items-center py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <HomeIcon className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-blue-600">DealVault</span>
          </Link>
          <div className="flex gap-6 items-center">
            <Link href="#features" className="text-gray-600 hover:text-gray-900 hidden sm:block">
              Features
            </Link>
            <Link href="#pricing" className="text-gray-600 hover:text-gray-900 hidden sm:block">
              Pricing
            </Link>
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
      <section className="relative overflow-hidden">
        {/* Decorative gradient blobs */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200 rounded-full blur-3xl opacity-30" />
          <div className="absolute top-20 right-1/4 w-96 h-96 bg-indigo-200 rounded-full blur-3xl opacity-30" />
        </div>
        <div className="container-max py-24">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              Built for flippers &amp; developers
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Manage Your Real Estate <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Empire</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Analyze deals, track budgets, manage contractors, and see real-time profitability across every project — all in one place.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/auth/signup" className="btn-primary text-lg px-8 py-4">
                Get Started Free
              </Link>
              <a href="#features" className="btn-secondary text-lg px-8 py-4">
                See Features
              </a>
            </div>
            <p className="text-gray-500 mt-4">No credit card required • 14-day free trial</p>
          </div>

        {/* Hero dashboard mockup */}
        <div className="rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 p-1.5 shadow-2xl max-w-5xl mx-auto animate-fade-in">
          <div className="bg-gray-50 rounded-xl overflow-hidden">
            {/* Fake browser bar */}
            <div className="bg-white border-b border-gray-200 px-4 py-2.5 flex items-center gap-2">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-400" />
                <span className="w-3 h-3 rounded-full bg-yellow-400" />
                <span className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="flex-1 mx-4">
                <div className="bg-gray-100 rounded-md px-3 py-1 text-xs text-gray-400 max-w-xs mx-auto text-center">
                  app.dealvault.com/dashboard
                </div>
              </div>
            </div>
            {/* Mock dashboard content */}
            <div className="flex">
              {/* Mini sidebar */}
              <div className="hidden sm:block w-44 bg-[#0a0e27] p-3 space-y-1">
                <div className="flex items-center gap-2 px-2 py-2 mb-3">
                  <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                    <HomeIcon className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="text-white font-bold text-sm">DealVault</span>
                </div>
                {['Overview', 'Deals', 'Contractors', 'Documents', 'Reports'].map((item, i) => (
                  <div key={item} className={`px-2 py-1.5 rounded text-xs ${i === 0 ? 'bg-blue-600 text-white' : 'text-gray-400'}`}>
                    {item}
                  </div>
                ))}
              </div>
              {/* Main area */}
              <div className="flex-1 p-4 sm:p-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                  {[
                    { label: 'Total Invested', value: '$430K', color: 'text-blue-600', icon: DollarSign },
                    { label: 'Total Spent', value: '$92K', color: 'text-orange-600', icon: TrendingUp },
                    { label: 'Expected Profit', value: '$147K', color: 'text-green-600', icon: TrendingUp },
                    { label: 'Active Deals', value: '2', color: 'text-purple-600', icon: BarChart3 },
                  ].map((kpi) => (
                    <div key={kpi.label} className="bg-white rounded-lg border border-gray-100 p-3">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[10px] text-gray-500">{kpi.label}</span>
                        <kpi.icon className={`w-3.5 h-3.5 ${kpi.color}`} />
                      </div>
                      <p className="text-lg font-bold text-gray-900">{kpi.value}</p>
                    </div>
                  ))}
                </div>
                {/* Fake chart */}
                <div className="bg-white rounded-lg border border-gray-100 p-4">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-semibold text-gray-700">Portfolio Performance</span>
                    <span className="text-[10px] text-green-600 font-medium">↑ 23% this quarter</span>
                  </div>
                  <svg viewBox="0 0 400 100" className="w-full h-24" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="heroGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path d="M0,80 C50,70 80,50 120,45 C160,40 200,30 250,22 C300,15 350,10 400,5 L400,100 L0,100 Z" fill="url(#heroGrad)" />
                    <path d="M0,80 C50,70 80,50 120,45 C160,40 200,30 250,22 C300,15 350,10 400,5" fill="none" stroke="#3b82f6" strokeWidth="2" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </section>

      {/* Stats band */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 py-12">
        <div className="container-max grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
          {[
            { stat: '$50M+', label: 'TAM opportunity' },
            { stat: '100K+', label: 'US flippers' },
            { stat: '6', label: 'tools in one' },
            { stat: '14 days', label: 'free to try' },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-3xl md:text-4xl font-bold">{s.stat}</p>
              <p className="text-blue-100 text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-white py-24 border-t border-gray-200">
        <div className="container-max">
          <h2 className="section-title text-center mb-16">Everything You Need</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Calculator,
                title: 'Property Analyzer',
                desc: 'Run the 70% rule, ROI, cap rate, and financing on any property before you commit — then convert winners into deals.',
              },
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
              <div key={i} className="card hover:shadow-md hover:-translate-y-1 transition-all duration-200">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24">
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
                <Link
                  href="/auth/signup"
                  className={`block text-center w-full py-3 rounded-lg font-semibold mb-6 transition-colors ${
                    plan.popular
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  Get Started
                </Link>
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

      {/* Testimonials */}
      <section className="py-24 bg-gray-50 border-t border-gray-100">
        <div className="container-max">
          <h2 className="section-title text-center mb-4">Loved by operators</h2>
          <p className="text-center text-gray-600 mb-12">See what real estate pros say about running their business on DealVault.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { quote: "I used to run five flips out of a mess of spreadsheets. Now I know my exact profit on every project at a glance.", name: 'Marcus T.', role: 'House Flipper, Atlanta' },
              { quote: "The analyzer alone paid for itself. I passed on a deal that looked good but failed the 70% rule — dodged a bad one.", name: 'Priya S.', role: 'Investor, Dallas' },
              { quote: "Finally something between a spreadsheet and Procore. My contractors, budgets, and docs are all in one place.", name: 'Danny R.', role: 'Small Developer, Chicago' },
            ].map((t) => (
              <div key={t.name} className="card">
                <div className="flex gap-1 mb-3 text-amber-400">
                  {'★★★★★'.split('').map((s, i) => <span key={i}>{s}</span>)}
                </div>
                <p className="text-gray-700 mb-4 leading-relaxed">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white text-sm font-bold">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-gray-400 mt-8">Illustrative testimonials shown while we onboard our first customers.</p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-white py-24 border-t border-gray-100">
        <div className="container-max max-w-3xl">
          <h2 className="section-title text-center mb-4">Frequently Asked Questions</h2>
          <p className="text-center text-gray-600 mb-12">Everything you need to know before getting started.</p>
          <div className="space-y-4">
            {[
              {
                q: 'Can I cancel anytime?',
                a: 'Yes. There are no long-term contracts — upgrade, downgrade, or cancel your plan whenever you want, right from your dashboard.',
              },
              {
                q: 'Is my data secure?',
                a: 'Your data is encrypted in transit and at rest. We never share your deal information with third parties, and you own all your data.',
              },
              {
                q: 'Do I need a credit card to start?',
                a: 'No credit card required for the 14-day free trial. Explore every feature first, then decide if DealVault is right for you.',
              },
              {
                q: 'Who is DealVault built for?',
                a: 'Real estate developers, house flippers, and small development teams managing anywhere from 1 to 50+ projects a year who need more than a spreadsheet but less than enterprise construction software.',
              },
              {
                q: 'Can I track multiple properties at once?',
                a: 'Absolutely. Track unlimited deals on the Professional plan, each with its own budget breakdown, contractors, documents, and timeline.',
              },
            ].map((faq, i) => (
              <details key={i} className="group border border-gray-200 rounded-xl p-5 hover:border-gray-300 transition-colors [&_svg]:open:rotate-180">
                <summary className="flex items-center justify-between cursor-pointer list-none font-semibold text-gray-900">
                  {faq.q}
                  <ArrowRight className="w-4 h-4 text-gray-400 rotate-90 transition-transform" />
                </summary>
                <p className="text-gray-600 mt-3 text-sm leading-relaxed">{faq.a}</p>
              </details>
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-white font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="hover:text-white">Features</a></li>
                <li><a href="#pricing" className="hover:text-white">Pricing</a></li>
                <li><Link href="/auth/signup" className="hover:text-white">Get Started</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about" className="hover:text-white">About</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
              </ul>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
                  <HomeIcon className="w-4 h-4 text-white" />
                </div>
                <h4 className="text-white font-bold">DealVault</h4>
              </div>
              <p className="text-sm">The all-in-one platform for real estate developers and house flippers.</p>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-sm text-center">
            <p>&copy; {new Date().getFullYear()} DealVault. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
