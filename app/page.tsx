'use client'

import Link from 'next/link'
import { CheckCircle, TrendingUp, Users, FileText, BarChart3, Clock, Home as HomeIcon, DollarSign, ArrowRight, Calculator, X } from 'lucide-react'
import { useState } from 'react'
import { Reveal, CountUp } from '@/components/Reveal'

const testimonials = [
  { quote: "I used to run five flips out of a mess of spreadsheets. Now I know my exact profit on every project at a glance.", name: 'Marcus T.', role: 'House Flipper, Atlanta' },
  { quote: "The analyzer alone paid for itself. I passed on a deal that looked great on paper but the numbers said no — dodged a bad one.", name: 'Priya S.', role: 'Investor, Dallas' },
  { quote: "Finally something between a spreadsheet and Procore. My contractors, budgets, and docs are all in one place.", name: 'Danny R.', role: 'Small Developer, Chicago' },
  { quote: "The budget line-items caught me going over on electrical before it blew the whole project. Saved me thousands.", name: 'Alicia M.', role: 'Flipper, Phoenix' },
]

const testimonials2 = [
  { quote: "Converting an analyzed property straight into a tracked deal is such a smooth workflow. It just makes sense.", name: 'Reggie B.', role: 'Wholesaler, Kansas City' },
  { quote: "I manage 12 rentals and DealVault finally gave me one dashboard for all of them. Cash flow at a glance.", name: 'Sandra K.', role: 'Landlord, Tampa' },
  { quote: "Showed my private lender the reports and he funded my next two deals on the spot. Looks that professional.", name: 'Tomas V.', role: 'Developer, Denver' },
  { quote: "Simple enough that I actually use it every day, detailed enough to run my whole operation. Rare combo.", name: 'Jordan P.', role: 'House Flipper, Newark' },
]

function TestimonialCard({ quote, name, role }: { quote: string; name: string; role: string }) {
  return (
    <div className="card w-80 shrink-0 mx-3">
      <div className="flex gap-1 mb-3 text-amber-400">
        {'★★★★★'.split('').map((s, i) => <span key={i}>{s}</span>)}
      </div>
      <p className="text-gray-700 mb-4 leading-relaxed text-sm">"{quote}"</p>
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white text-sm font-bold shrink-0">
          {name.charAt(0)}
        </div>
        <div>
          <p className="font-semibold text-gray-900 text-sm">{name}</p>
          <p className="text-xs text-gray-500">{role}</p>
        </div>
      </div>
    </div>
  )
}

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
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/60 via-white to-white">
        {/* Decorative gradient blobs + grid */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-300 rounded-full blur-3xl opacity-25" />
          <div className="absolute top-20 right-1/4 w-[500px] h-[500px] bg-indigo-300 rounded-full blur-3xl opacity-25" />
          <div className="absolute top-40 left-1/2 w-[400px] h-[400px] bg-purple-200 rounded-full blur-3xl opacity-20" />
          <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '48px 48px' }} />
        </div>
        <div className="container-max py-24">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-white border border-blue-100 text-blue-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6 shadow-sm">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Built for flippers &amp; developers
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-[1.05] tracking-tight">
              Manage Your Real Estate <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Empire</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-2xl mx-auto">
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
            <div className="flex items-center justify-center gap-6 mt-6 text-sm text-gray-500 flex-wrap">
              <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-green-500" /> No credit card required</span>
              <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-green-500" /> 14-day free trial</span>
              <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-green-500" /> Cancel anytime</span>
            </div>
          </div>

        {/* Hero dashboard mockup */}
        <div className="relative max-w-5xl mx-auto">
          {/* Floating verdict badge */}
          <div className="hidden md:flex absolute -left-6 top-24 z-20 bg-white rounded-xl shadow-xl border border-gray-100 p-3 items-center gap-3 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="w-9 h-9 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 leading-tight">Deal verdict</p>
              <p className="text-sm font-bold text-green-600 leading-tight">Strong Buy</p>
            </div>
          </div>
          {/* Floating profit badge */}
          <div className="hidden md:flex absolute -right-6 bottom-16 z-20 bg-white rounded-xl shadow-xl border border-gray-100 p-3 items-center gap-3 animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 leading-tight">Projected profit</p>
              <p className="text-sm font-bold text-gray-900 leading-tight">+$87,000</p>
            </div>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 p-1.5 shadow-2xl animate-fade-in">
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
        </div>
      </section>

      {/* Stats band */}
      <section className="bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 py-14 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="container-max grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white relative">
          <div>
            <p className="text-3xl md:text-5xl font-bold"><CountUp value={50} prefix="$" suffix="M+" /></p>
            <p className="text-blue-100 text-sm mt-1">market opportunity</p>
          </div>
          <div>
            <p className="text-3xl md:text-5xl font-bold"><CountUp value={100} suffix="K+" /></p>
            <p className="text-blue-100 text-sm mt-1">US flippers &amp; developers</p>
          </div>
          <div>
            <p className="text-3xl md:text-5xl font-bold"><CountUp value={8} suffix="" /></p>
            <p className="text-blue-100 text-sm mt-1">tools in one platform</p>
          </div>
          <div>
            <p className="text-3xl md:text-5xl font-bold"><CountUp value={14} suffix=" days" /></p>
            <p className="text-blue-100 text-sm mt-1">free to try</p>
          </div>
        </div>
      </section>

      {/* Who it's for */}
      <section className="py-24 bg-white border-t border-gray-100">
        <div className="container-max">
          <Reveal>
            <h2 className="section-title text-center mb-4">Built for every stage of the game</h2>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">Whether you're closing your first flip or breaking ground on a 40-unit build, DealVault grows with you.</p>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: HomeIcon, title: 'House Flippers', desc: 'Analyze deals with the numbers that matter, track rehab budgets line by line, and know your profit before you ever swing a hammer.' },
              { icon: TrendingUp, title: 'Rental Investors', desc: 'Run cap rate and cash-flow analysis, manage your holdings, and keep every property\'s performance in one dashboard.' },
              { icon: BarChart3, title: 'Developers', desc: 'Track multi-unit projects, model your capital stack with partners and lenders, and manage sellout across every unit.' },
            ].map((a, i) => (
              <Reveal key={i} delay={i * 120}>
                <div className="rounded-2xl border border-gray-200 p-8 hover:border-blue-300 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full bg-gradient-to-b from-white to-gray-50/50">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center mb-4 shadow-sm">
                    <a.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{a.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{a.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-white py-24 border-t border-gray-200">
        <div className="container-max">
          <Reveal>
            <h2 className="section-title text-center mb-16">Everything You Need</h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Calculator,
                title: 'Property Analyzer',
                desc: 'Check ROI, cap rate, and financing on any property before you commit — then convert winners into deals.',
              },
              {
                icon: BarChart3,
                title: 'Deal Pipeline',
                desc: 'Drag every project from prospecting to sold, with real-time profitability at each stage.',
              },
              {
                icon: TrendingUp,
                title: 'Budget Management',
                desc: 'Set budgets and track actual costs by category. Never blow a rehab budget again.',
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
                icon: BarChart3,
                title: 'Capital Stack',
                desc: 'Model equity partners, lenders, and ownership splits on your larger developments.',
              },
              {
                icon: CheckCircle,
                title: 'Smart Reports',
                desc: 'Export detailed P&L statements and profitability reports for each deal.',
              },
              {
                icon: FileText,
                title: 'Spreadsheet Import',
                desc: 'Already tracking deals elsewhere? Bring them in from any spreadsheet — no retyping.',
              },
            ].map((feature, i) => (
              <Reveal key={i} delay={(i % 3) * 100}>
                <div className="card hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center mb-4 shadow-sm">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Dark showcase — Analyzer spotlight */}
      <section className="bg-[#0a0e27] py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, #3b82f6 0px, transparent 40%), radial-gradient(circle at 10% 80%, #6366f1 0px, transparent 40%)' }} />
        <div className="container-max relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <Reveal>
              <div>
                <div className="inline-flex items-center gap-2 bg-white/10 text-blue-300 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
                  <Calculator className="w-4 h-4" /> Know before you buy
                </div>
                <h2 className="text-4xl font-bold text-white mb-4 leading-tight">Stop guessing whether a deal will make money</h2>
                <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                  Punch in the numbers and get an instant verdict — projected profit, ROI, and a clear buy-or-pass call. Analyze rentals and model financing too, then turn winners into tracked deals with one click.
                </p>
                <div className="space-y-3">
                  {['Instant flip profit & ROI analysis', 'Cap rate and cash flow for rentals', 'Recommended max offer with a safety buffer', 'One click from analysis to tracked deal'].map((item) => (
                    <div key={item} className="flex items-center gap-3 text-gray-300">
                      <CheckCircle className="w-5 h-5 text-green-400 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
                <Link href="/auth/signup" className="inline-flex items-center gap-2 mt-8 bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                  Try the Analyzer free <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </Reveal>

            {/* Mock analyzer card */}
            <Reveal delay={200}>
              <div className="bg-white/5 backdrop-blur rounded-2xl border border-white/10 p-6">
                <div className="bg-white rounded-xl p-5">
                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                    <div>
                      <p className="text-xs text-gray-400">42 Sycamore Lane</p>
                      <p className="font-bold text-gray-900">Flip Analysis</p>
                    </div>
                    <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">STRONG BUY</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-400">Projected Profit</p>
                      <p className="text-2xl font-bold text-green-600">$87K</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">ROI</p>
                      <p className="text-2xl font-bold text-gray-900">28.4%</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">All-In Cost</p>
                      <p className="text-lg font-semibold text-gray-900">$306K</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Max Offer</p>
                      <p className="text-lg font-semibold text-gray-900">$197K</p>
                    </div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3 text-sm text-green-800">
                    This deal clears your margin targets with room to spare.
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="py-24 bg-gray-50 border-t border-gray-100 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '48px 48px' }} />
        <div className="container-max max-w-5xl relative">
          <Reveal>
            <h2 className="section-title text-center mb-4">Your deals deserve better than a spreadsheet</h2>
            <p className="text-center text-gray-600 mb-14 max-w-2xl mx-auto">Formulas break, tabs multiply, and one wrong cell throws off everything. DealVault just works.</p>
          </Reveal>

          <Reveal>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Spreadsheet column */}
              <div className="bg-white rounded-2xl border border-gray-200 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-11 h-11 rounded-xl bg-gray-100 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">The spreadsheet way</h3>
                    <p className="text-xs text-gray-400">Tabs, formulas, and crossed fingers</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {[
                    'Rebuild the same formulas every deal',
                    'No idea if a deal pencils until it\'s too late',
                    'Contractor info scattered across texts',
                    'One wrong cell breaks everything',
                    'Useless on your phone at a job site',
                  ].map((row) => (
                    <div key={row} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-red-50 flex items-center justify-center shrink-0 mt-0.5">
                        <X className="w-3 h-3 text-red-400" />
                      </div>
                      <span className="text-sm text-gray-500">{row}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* DealVault column - highlighted */}
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-8 shadow-xl shadow-blue-600/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
                <div className="flex items-center gap-3 mb-6 relative">
                  <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center">
                    <HomeIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">The DealVault way</h3>
                    <p className="text-xs text-blue-100">Everything in one place, always</p>
                  </div>
                </div>
                <div className="space-y-3 relative">
                  {[
                    'Know your profit before you buy',
                    'Instant buy-or-pass verdict on any deal',
                    'Every contractor & document organized',
                    'Nothing breaks — ever',
                    'Works right from your phone',
                  ].map((row) => (
                    <div key={row} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle className="w-3.5 h-3.5 text-white" />
                      </div>
                      <span className="text-sm text-white font-medium">{row}</span>
                    </div>
                  ))}
                </div>
                <Link href="/auth/signup" className="inline-flex items-center gap-2 mt-7 bg-white text-blue-700 px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-blue-50 transition-colors relative">
                  Make the switch <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </Reveal>
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
      <section className="py-24 bg-gray-50 border-t border-gray-100 overflow-hidden">
        <div className="container-max mb-12">
          <h2 className="section-title text-center mb-4">Loved by operators</h2>
          <p className="text-center text-gray-600">See what real estate pros say about running their business on DealVault.</p>
        </div>

        {/* Marquee row 1 */}
        <div className="marquee-mask mb-6">
          <div className="marquee-track">
            {[...testimonials, ...testimonials].map((t, i) => (
              <TestimonialCard key={`a-${i}`} {...t} />
            ))}
          </div>
        </div>
        {/* Marquee row 2 (reverse) */}
        <div className="marquee-mask">
          <div className="marquee-track marquee-reverse">
            {[...testimonials2, ...testimonials2].map((t, i) => (
              <TestimonialCard key={`b-${i}`} {...t} />
            ))}
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-12">Illustrative testimonials shown while we onboard our first customers.</p>
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
