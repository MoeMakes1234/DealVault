'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Calculator, TrendingUp, Home, DollarSign, Check, X, Trash2, ArrowRight, Percent, Save } from 'lucide-react'
import { useStore } from '@/lib/store'
import { useToast } from '@/lib/toast'

type Tab = 'flip' | 'rental' | 'financing'

export default function AnalyzerPage() {
  const router = useRouter()
  const toast = useToast((s) => s.show)
  const addDeal = useStore((s) => s.addDeal)
  const addAnalysis = useStore((s) => s.addAnalysis)
  const deleteAnalysis = useStore((s) => s.deleteAnalysis)
  const markConverted = useStore((s) => s.markAnalysisConverted)
  const analyses = useStore((s) => s.analyses)

  const [tab, setTab] = useState<Tab>('flip')

  // ---- Flip Analyzer state ----
  const [flip, setFlip] = useState({ address: '', purchasePrice: '', rehabBudget: '', arv: '', holdingCosts: '', sellingCosts: '' })

  // Pick up a rehab total handed off from the Rehab Estimator
  useEffect(() => {
    const handoff = sessionStorage.getItem('dealvault-rehab-total')
    if (handoff) {
      setFlip((f) => ({ ...f, rehabBudget: handoff }))
      sessionStorage.removeItem('dealvault-rehab-total')
      setTab('flip')
    }
  }, [])
  const fp = Number(flip.purchasePrice) || 0
  const fr = Number(flip.rehabBudget) || 0
  const farv = Number(flip.arv) || 0
  const holding = Number(flip.holdingCosts) || 0
  const selling = Number(flip.sellingCosts) || farv * 0.08 // default 8% selling costs
  const mao = farv * 0.7 - fr // 70% rule max allowable offer
  const allIn = fp + fr + holding + selling
  const flipProfit = farv - allIn
  const flipROI = allIn > 0 ? (flipProfit / allIn) * 100 : 0
  const passes70 = fp <= mao && farv > 0
  const marginPct = farv > 0 ? (flipProfit / farv) * 100 : 0

  // ---- Rental Analyzer state ----
  const [rental, setRental] = useState({ address: '', price: '', rent: '', taxes: '', insurance: '', otherExpenses: '', downPct: '20' })
  const rprice = Number(rental.price) || 0
  const rrent = Number(rental.rent) || 0
  const rtaxes = Number(rental.taxes) || 0
  const rins = Number(rental.insurance) || 0
  const rother = Number(rental.otherExpenses) || 0
  const downPct = Number(rental.downPct) || 0
  const monthlyExpenses = rtaxes / 12 + rins / 12 + rother
  const monthlyCashFlow = rrent - monthlyExpenses
  const annualNOI = (rrent - (rtaxes / 12 + rins / 12 + rother)) * 12
  const capRate = rprice > 0 ? (annualNOI / rprice) * 100 : 0
  const downPayment = rprice * (downPct / 100)
  const cashOnCash = downPayment > 0 ? ((monthlyCashFlow * 12) / downPayment) * 100 : 0
  const onePctRule = rprice > 0 ? (rrent / rprice) * 100 : 0
  const passesRental = capRate >= 6 && monthlyCashFlow > 0

  // ---- Financing Calculator state ----
  const [fin, setFin] = useState({ price: '', downPct: '20', rate: '7.5', termYears: '30' })
  const finPrice = Number(fin.price) || 0
  const finDownPct = Number(fin.downPct) || 0
  const finRate = Number(fin.rate) || 0
  const finTerm = Number(fin.termYears) || 30
  const loanAmount = finPrice * (1 - finDownPct / 100)
  const monthlyRate = finRate / 100 / 12
  const nPayments = finTerm * 12
  const monthlyPayment =
    monthlyRate > 0 ? (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, nPayments)) / (Math.pow(1 + monthlyRate, nPayments) - 1) : loanAmount / nPayments
  const totalPaid = monthlyPayment * nPayments
  const totalInterest = totalPaid - loanAmount

  const fmt = (n: number) => n.toLocaleString('en-US', { maximumFractionDigits: 0 })

  const saveFlip = () => {
    if (!flip.address) { toast('Enter an address to save', 'error'); return }
    addAnalysis({ address: flip.address, type: 'flip', purchasePrice: fp, rehabBudget: fr, arv: farv, dateAdded: new Date().toISOString().slice(0, 10) })
    toast('Analysis saved')
  }
  const saveRental = () => {
    if (!rental.address) { toast('Enter an address to save', 'error'); return }
    addAnalysis({ address: rental.address, type: 'rental', purchasePrice: rprice, rehabBudget: 0, arv: 0, monthlyRent: rrent, monthlyExpenses, downPayment, dateAdded: new Date().toISOString().slice(0, 10) })
    toast('Analysis saved')
  }

  const convertToDeal = (a: typeof analyses[0]) => {
    addDeal({
      address: a.address,
      acquisitionPrice: a.purchasePrice,
      budget: a.rehabBudget,
      spent: 0,
      status: 'planning',
      expectedProfit: a.type === 'flip' ? a.arv - a.purchasePrice - a.rehabBudget : 0,
      saleTarget: a.type === 'flip' ? a.arv : undefined,
    })
    markConverted(a.id)
    toast('Converted to a deal!')
    setTimeout(() => router.push('/dashboard/deals'), 800)
  }

  const inputCls = 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none'
  const labelCls = 'block text-xs font-medium text-gray-600 mb-1'

  return (
    <div className="container-max py-8 animate-fade-in">
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-500 rounded-lg flex items-center justify-center">
            <Calculator className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Property Analyzer</h1>
        </div>
        <p className="text-gray-500 text-sm mt-1">Run the numbers before you commit. Analyze a property, then convert winners into tracked deals.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        {([['flip', 'Flip Analyzer', TrendingUp], ['rental', 'Rental Analyzer', Home], ['financing', 'Financing', Percent]] as const).map(([key, label, Icon]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
              tab === key ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <Icon className="w-4 h-4" /> {label}
          </button>
        ))}
      </div>

      {/* FLIP ANALYZER */}
      {tab === 'flip' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="font-bold mb-4">Deal Inputs</h3>
            <div className="space-y-4">
              <div>
                <label className={labelCls}>Property Address</label>
                <input value={flip.address} onChange={(e) => setFlip({ ...flip, address: e.target.value })} placeholder="123 Main St, Brooklyn NY" className={inputCls} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Purchase Price ($)</label>
                  <input type="number" value={flip.purchasePrice} onChange={(e) => setFlip({ ...flip, purchasePrice: e.target.value })} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>
                    Rehab Budget ($) · <a href="/dashboard/rehab" className="text-blue-600 hover:underline">estimate it</a>
                  </label>
                  <input type="number" value={flip.rehabBudget} onChange={(e) => setFlip({ ...flip, rehabBudget: e.target.value })} className={inputCls} />
                </div>
              </div>
              <div>
                <label className={labelCls}>ARV — After Repair Value ($)</label>
                <input type="number" value={flip.arv} onChange={(e) => setFlip({ ...flip, arv: e.target.value })} placeholder="What it sells for fixed up" className={inputCls} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Holding Costs ($)</label>
                  <input type="number" value={flip.holdingCosts} onChange={(e) => setFlip({ ...flip, holdingCosts: e.target.value })} placeholder="Taxes, utilities, loan" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Selling Costs ($)</label>
                  <input type="number" value={flip.sellingCosts} onChange={(e) => setFlip({ ...flip, sellingCosts: e.target.value })} placeholder={`Default 8% = $${fmt(farv * 0.08)}`} className={inputCls} />
                </div>
              </div>
              <button onClick={saveFlip} className="btn-secondary w-full flex items-center justify-center gap-2 text-sm">
                <Save className="w-4 h-4" /> Save Analysis
              </button>
            </div>
          </div>

          {/* Flip results */}
          <div className="space-y-4">
            <div className={`card border-2 ${passes70 ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">DealVault Score</p>
                  <p className={`text-2xl font-bold ${passes70 ? 'text-green-700' : 'text-red-700'}`}>
                    {farv === 0 ? 'Enter ARV' : passes70 ? 'Strong Buy' : 'Overpriced'}
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${passes70 ? 'bg-green-500' : 'bg-red-500'}`}>
                  {passes70 ? <Check className="w-6 h-6 text-white" /> : <X className="w-6 h-6 text-white" />}
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Recommended max offer: <span className="font-semibold">${fmt(mao)}</span>
                {fp > 0 && ` · you're offering $${fmt(fp)}`}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="card">
                <p className="text-sm text-gray-600 mb-1">Projected Profit</p>
                <p className={`text-2xl font-bold ${flipProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>${fmt(flipProfit)}</p>
              </div>
              <div className="card">
                <p className="text-sm text-gray-600 mb-1">ROI</p>
                <p className={`text-2xl font-bold ${flipROI >= 0 ? 'text-gray-900' : 'text-red-600'}`}>{flipROI.toFixed(1)}%</p>
              </div>
              <div className="card">
                <p className="text-sm text-gray-600 mb-1">All-In Cost</p>
                <p className="text-xl font-bold text-gray-900">${fmt(allIn)}</p>
              </div>
              <div className="card">
                <p className="text-sm text-gray-600 mb-1">Profit Margin</p>
                <p className="text-xl font-bold text-gray-900">{marginPct.toFixed(1)}%</p>
              </div>
            </div>
            <p className="text-xs text-gray-400 px-1">
              Rule of thumb: aim for a profit margin above 15% and ROI above 20%. Our recommended max offer builds in a safety buffer for surprises.
            </p>
          </div>
        </div>
      )}

      {/* RENTAL ANALYZER */}
      {tab === 'rental' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="font-bold mb-4">Rental Inputs</h3>
            <div className="space-y-4">
              <div>
                <label className={labelCls}>Property Address</label>
                <input value={rental.address} onChange={(e) => setRental({ ...rental, address: e.target.value })} className={inputCls} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Purchase Price ($)</label>
                  <input type="number" value={rental.price} onChange={(e) => setRental({ ...rental, price: e.target.value })} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Monthly Rent ($)</label>
                  <input type="number" value={rental.rent} onChange={(e) => setRental({ ...rental, rent: e.target.value })} className={inputCls} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Annual Taxes ($)</label>
                  <input type="number" value={rental.taxes} onChange={(e) => setRental({ ...rental, taxes: e.target.value })} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Annual Insurance ($)</label>
                  <input type="number" value={rental.insurance} onChange={(e) => setRental({ ...rental, insurance: e.target.value })} className={inputCls} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Other Monthly Exp. ($)</label>
                  <input type="number" value={rental.otherExpenses} onChange={(e) => setRental({ ...rental, otherExpenses: e.target.value })} placeholder="Mgmt, maintenance" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Down Payment (%)</label>
                  <input type="number" value={rental.downPct} onChange={(e) => setRental({ ...rental, downPct: e.target.value })} className={inputCls} />
                </div>
              </div>
              <button onClick={saveRental} className="btn-secondary w-full flex items-center justify-center gap-2 text-sm">
                <Save className="w-4 h-4" /> Save Analysis
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div className={`card border-2 ${passesRental ? 'border-green-200 bg-green-50' : 'border-amber-200 bg-amber-50'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Rental Verdict</p>
                  <p className={`text-2xl font-bold ${passesRental ? 'text-green-700' : 'text-amber-700'}`}>
                    {rprice === 0 ? 'Enter numbers' : passesRental ? 'Cash Flows' : 'Marginal'}
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${passesRental ? 'bg-green-500' : 'bg-amber-500'}`}>
                  {passesRental ? <Check className="w-6 h-6 text-white" /> : <TrendingUp className="w-6 h-6 text-white" />}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="card">
                <p className="text-sm text-gray-600 mb-1">Monthly Cash Flow</p>
                <p className={`text-2xl font-bold ${monthlyCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>${fmt(monthlyCashFlow)}</p>
              </div>
              <div className="card">
                <p className="text-sm text-gray-600 mb-1">Cap Rate</p>
                <p className="text-2xl font-bold text-gray-900">{capRate.toFixed(1)}%</p>
              </div>
              <div className="card">
                <p className="text-sm text-gray-600 mb-1">Cash-on-Cash</p>
                <p className="text-xl font-bold text-gray-900">{cashOnCash.toFixed(1)}%</p>
              </div>
              <div className="card">
                <p className="text-sm text-gray-600 mb-1">1% Rule</p>
                <p className={`text-xl font-bold ${onePctRule >= 1 ? 'text-green-600' : 'text-gray-900'}`}>{onePctRule.toFixed(2)}%</p>
              </div>
            </div>
            <p className="text-xs text-gray-400 px-1">
              Healthy targets: cap rate 6%+, positive monthly cash flow, and rent ≥ 1% of purchase price. Cash-on-cash above 8% is strong.
            </p>
          </div>
        </div>
      )}

      {/* FINANCING CALCULATOR */}
      {tab === 'financing' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="font-bold mb-4">Loan Inputs</h3>
            <div className="space-y-4">
              <div>
                <label className={labelCls}>Purchase Price ($)</label>
                <input type="number" value={fin.price} onChange={(e) => setFin({ ...fin, price: e.target.value })} className={inputCls} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Down Payment (%)</label>
                  <input type="number" value={fin.downPct} onChange={(e) => setFin({ ...fin, downPct: e.target.value })} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Interest Rate (%)</label>
                  <input type="number" step="0.1" value={fin.rate} onChange={(e) => setFin({ ...fin, rate: e.target.value })} className={inputCls} />
                </div>
              </div>
              <div>
                <label className={labelCls}>Loan Term (years)</label>
                <select value={fin.termYears} onChange={(e) => setFin({ ...fin, termYears: e.target.value })} className={inputCls}>
                  <option value="15">15 years</option>
                  <option value="30">30 years</option>
                </select>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="card bg-blue-50 border-2 border-blue-200">
              <p className="text-sm font-medium text-gray-600">Monthly Payment (P&amp;I)</p>
              <p className="text-3xl font-bold text-blue-700">${fmt(monthlyPayment)}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="card">
                <p className="text-sm text-gray-600 mb-1">Loan Amount</p>
                <p className="text-xl font-bold text-gray-900">${fmt(loanAmount)}</p>
              </div>
              <div className="card">
                <p className="text-sm text-gray-600 mb-1">Down Payment</p>
                <p className="text-xl font-bold text-gray-900">${fmt(finPrice * (finDownPct / 100))}</p>
              </div>
              <div className="card">
                <p className="text-sm text-gray-600 mb-1">Total Interest</p>
                <p className="text-xl font-bold text-red-600">${fmt(totalInterest)}</p>
              </div>
              <div className="card">
                <p className="text-sm text-gray-600 mb-1">Total of Payments</p>
                <p className="text-xl font-bold text-gray-900">${fmt(totalPaid)}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SAVED ANALYSES */}
      <div className="mt-10">
        <h3 className="text-lg font-bold mb-4">Saved Analyses</h3>
        {analyses.length === 0 ? (
          <div className="card text-center py-10 text-gray-400 text-sm">
            No saved analyses yet. Run the numbers above and hit "Save Analysis" to keep properties you're considering here.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analyses.map((a) => {
              const profit = a.type === 'flip' ? a.arv - a.purchasePrice - a.rehabBudget : (a.monthlyRent || 0) - (a.monthlyExpenses || 0)
              return (
                <div key={a.id} className="card">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold text-gray-900">{a.address}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${a.type === 'flip' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                        {a.type === 'flip' ? 'Flip' : 'Rental'}
                      </span>
                    </div>
                    <button onClick={() => { deleteAnalysis(a.id); toast('Analysis deleted', 'info') }} className="text-gray-300 hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1 mb-3">
                    <div className="flex justify-between"><span>Purchase</span><span className="font-medium">${fmt(a.purchasePrice)}</span></div>
                    {a.type === 'flip' ? (
                      <>
                        <div className="flex justify-between"><span>ARV</span><span className="font-medium">${fmt(a.arv)}</span></div>
                        <div className="flex justify-between"><span>Est. Profit</span><span className="font-medium text-green-600">${fmt(profit)}</span></div>
                      </>
                    ) : (
                      <>
                        <div className="flex justify-between"><span>Monthly Rent</span><span className="font-medium">${fmt(a.monthlyRent || 0)}</span></div>
                        <div className="flex justify-between"><span>Cash Flow</span><span className="font-medium text-green-600">${fmt(profit)}/mo</span></div>
                      </>
                    )}
                  </div>
                  {a.converted ? (
                    <span className="text-xs text-green-600 font-medium flex items-center gap-1"><Check className="w-3 h-3" /> Converted to deal</span>
                  ) : (
                    <button onClick={() => convertToDeal(a)} className="w-full btn-primary text-sm flex items-center justify-center gap-2">
                      Convert to Deal <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
