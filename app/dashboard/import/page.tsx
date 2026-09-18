'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Upload, Download, FileSpreadsheet, ArrowRight, Check, X, AlertCircle } from 'lucide-react'
import { useStore, Deal, ProjectType } from '@/lib/store'
import { useToast } from '@/lib/toast'
import PageGuide from '@/components/PageGuide'

// DealVault fields the importer can map to
const targetFields = [
  { key: 'address', label: 'Address', required: true },
  { key: 'acquisitionPrice', label: 'Acquisition Price', required: true },
  { key: 'budget', label: 'Rehab Budget', required: false },
  { key: 'spent', label: 'Spent So Far', required: false },
  { key: 'saleTarget', label: 'Target Sale Price', required: false },
  { key: 'projectType', label: 'Project Type', required: false },
  { key: 'status', label: 'Status', required: false },
  { key: 'notes', label: 'Notes', required: false },
] as const

type FieldKey = (typeof targetFields)[number]['key']

// Minimal CSV parser that handles quoted fields and commas inside quotes
function parseCSV(text: string): string[][] {
  const rows: string[][] = []
  let row: string[] = []
  let field = ''
  let inQuotes = false
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++ }
        else inQuotes = false
      } else field += c
    } else {
      if (c === '"') inQuotes = true
      else if (c === ',') { row.push(field); field = '' }
      else if (c === '\n' || c === '\r') {
        if (c === '\r' && text[i + 1] === '\n') i++
        row.push(field); field = ''
        if (row.some((f) => f.trim() !== '')) rows.push(row)
        row = []
      } else field += c
    }
  }
  if (field !== '' || row.length) { row.push(field); if (row.some((f) => f.trim() !== '')) rows.push(row) }
  return rows
}

// Guess which CSV column maps to a DealVault field by header name
function guessMapping(headers: string[]): Record<FieldKey, number> {
  const norm = (s: string) => s.toLowerCase().replace(/[^a-z]/g, '')
  const patterns: Record<FieldKey, string[]> = {
    address: ['address', 'property', 'propertyaddress', 'location', 'street'],
    acquisitionPrice: ['acquisition', 'purchase', 'purchaseprice', 'buyprice', 'price', 'cost', 'acquisitionprice'],
    budget: ['budget', 'rehabbudget', 'rehab', 'renovation', 'construction'],
    spent: ['spent', 'spentsofar', 'actual', 'actualcost', 'costtodate'],
    saleTarget: ['saletarget', 'targetsale', 'arv', 'aftervalue', 'saleprice', 'resale', 'exitprice'],
    projectType: ['projecttype', 'type', 'dealtype', 'category'],
    status: ['status', 'stage', 'phase'],
    notes: ['notes', 'note', 'comments', 'description', 'memo'],
  }
  const result = {} as Record<FieldKey, number>
  for (const field of targetFields) {
    const idx = headers.findIndex((h) => patterns[field.key].includes(norm(h)))
    result[field.key] = idx
  }
  return result
}

function parseMoney(v: string): number {
  return Number((v || '').replace(/[$,\s]/g, '')) || 0
}

function normalizeType(v: string): ProjectType {
  const s = (v || '').toLowerCase()
  if (s.includes('multi')) return 'multifamily'
  if (s.includes('construct') || s.includes('build') || s.includes('ground')) return 'new-construction'
  if (s.includes('mixed')) return 'mixed-use'
  if (s.includes('rent')) return 'rental'
  return 'flip'
}

function normalizeStatus(v: string): Deal['status'] {
  const s = (v || '').toLowerCase()
  if (s.includes('complete') || s.includes('done') || s.includes('sold')) return 'completed'
  if (s.includes('progress') || s.includes('active') || s.includes('rehab') || s.includes('construction')) return 'in-progress'
  return 'planning'
}

export default function ImportPage() {
  const router = useRouter()
  const toast = useToast((s) => s.show)
  const addDeal = useStore((s) => s.addDeal)

  const [headers, setHeaders] = useState<string[]>([])
  const [rows, setRows] = useState<string[][]>([])
  const [mapping, setMapping] = useState<Record<FieldKey, number>>({} as Record<FieldKey, number>)
  const [fileName, setFileName] = useState('')

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setFileName(file.name)
    const reader = new FileReader()
    reader.onload = () => {
      const parsed = parseCSV(reader.result as string)
      if (parsed.length < 2) {
        toast('That file has no data rows', 'error')
        return
      }
      const hdrs = parsed[0].map((h) => h.trim())
      setHeaders(hdrs)
      setRows(parsed.slice(1))
      setMapping(guessMapping(hdrs))
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const addressIdx = mapping.address
  const priceIdx = mapping.acquisitionPrice
  const canImport = headers.length > 0 && addressIdx >= 0 && priceIdx >= 0

  const doImport = () => {
    let count = 0
    rows.forEach((r) => {
      const address = (r[mapping.address] || '').trim()
      if (!address) return
      const acquisitionPrice = parseMoney(r[mapping.acquisitionPrice])
      const budget = mapping.budget >= 0 ? parseMoney(r[mapping.budget]) : 0
      const spent = mapping.spent >= 0 ? parseMoney(r[mapping.spent]) : 0
      const saleTarget = mapping.saleTarget >= 0 ? parseMoney(r[mapping.saleTarget]) : undefined
      addDeal({
        address,
        acquisitionPrice,
        budget,
        spent,
        saleTarget: saleTarget || undefined,
        status: mapping.status >= 0 ? normalizeStatus(r[mapping.status]) : 'planning',
        projectType: mapping.projectType >= 0 ? normalizeType(r[mapping.projectType]) : 'flip',
        expectedProfit: (saleTarget || 0) - acquisitionPrice - budget,
        notes: mapping.notes >= 0 ? (r[mapping.notes] || '').trim() || undefined : undefined,
      })
      count++
    })
    toast(`Imported ${count} deal${count === 1 ? '' : 's'}`)
    setTimeout(() => router.push('/dashboard/deals'), 800)
  }

  const downloadTemplate = () => {
    const csv = 'Address,Acquisition Price,Rehab Budget,Spent So Far,Target Sale Price,Project Type,Status,Notes\n' +
      '"123 Main St, Brooklyn NY",250000,75000,42000,410000,Flip,In Progress,"Great block, needs kitchen"\n' +
      '"456 Oak Ave, Queens NY",180000,50000,50000,292000,Flip,Completed,\n'
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'dealvault-import-template.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  const reset = () => { setHeaders([]); setRows([]); setFileName('') }

  return (
    <div className="container-max py-8 max-w-4xl animate-fade-in">
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
            <FileSpreadsheet className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Import Deals</h1>
        </div>
        <p className="text-gray-500 text-sm mt-1">Already tracking deals in a spreadsheet? Bring them in — no retyping.</p>
      </div>

      <PageGuide id="import" title="How importing works">
        Export your spreadsheet as a <strong>CSV file</strong> (every tool — Excel, Google Sheets, Numbers — can do this under "Save As" or "Download"). Upload it below and DealVault will auto-match your columns to the right fields. Review the match, then import. Not sure how to format it? <strong>Download our template</strong> and paste your data in.
      </PageGuide>

      {headers.length === 0 ? (
        <>
          <label className="block border-2 border-dashed border-gray-300 rounded-xl py-14 text-center cursor-pointer hover:border-green-400 hover:bg-green-50/40 transition-colors">
            <Upload className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="font-medium text-gray-700">Click to upload a CSV file</p>
            <p className="text-sm text-gray-400 mt-1">or drag and drop</p>
            <input type="file" accept=".csv,text/csv" onChange={handleFile} className="hidden" />
          </label>
          <div className="text-center mt-6">
            <button onClick={downloadTemplate} className="inline-flex items-center gap-2 text-sm text-green-700 font-medium hover:text-green-800">
              <Download className="w-4 h-4" /> Download the import template
            </button>
          </div>
        </>
      ) : (
        <>
          {/* Mapping */}
          <div className="card mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold">Match your columns</h3>
                <p className="text-xs text-gray-500 mt-0.5">{fileName} · {rows.length} rows found</p>
              </div>
              <button onClick={reset} className="text-gray-400 hover:text-gray-600 text-sm">Start over</button>
            </div>
            <div className="space-y-3">
              {targetFields.map((f) => (
                <div key={f.key} className="flex items-center gap-3">
                  <div className="w-40 shrink-0">
                    <span className="text-sm font-medium text-gray-700">{f.label}</span>
                    {f.required && <span className="text-red-500 ml-1">*</span>}
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-300 shrink-0" />
                  <select
                    value={mapping[f.key] ?? -1}
                    onChange={(e) => setMapping({ ...mapping, [f.key]: Number(e.target.value) })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  >
                    <option value={-1}>— Not mapped —</option>
                    {headers.map((h, i) => (
                      <option key={i} value={i}>{h}</option>
                    ))}
                  </select>
                  {mapping[f.key] >= 0 && <Check className="w-4 h-4 text-green-500 shrink-0" />}
                </div>
              ))}
            </div>
            {!canImport && (
              <div className="mt-4 flex items-center gap-2 text-sm text-amber-700 bg-amber-50 rounded-lg px-3 py-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                Address and Acquisition Price are required to import.
              </div>
            )}
          </div>

          {/* Preview */}
          <div className="card mb-6">
            <h3 className="font-bold mb-4">Preview <span className="text-gray-400 font-normal text-sm">(first 5 rows)</span></h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b border-gray-100">
                    <th className="py-2 pr-3 font-medium">Address</th>
                    <th className="py-2 pr-3 font-medium">Acquisition</th>
                    <th className="py-2 pr-3 font-medium">Budget</th>
                    <th className="py-2 pr-3 font-medium">Sale Target</th>
                    <th className="py-2 font-medium">Type</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {rows.slice(0, 5).map((r, i) => (
                    <tr key={i}>
                      <td className="py-2 pr-3 font-medium text-gray-900">{addressIdx >= 0 ? r[addressIdx] : '—'}</td>
                      <td className="py-2 pr-3 text-gray-600">{priceIdx >= 0 ? `$${parseMoney(r[priceIdx]).toLocaleString()}` : '—'}</td>
                      <td className="py-2 pr-3 text-gray-600">{mapping.budget >= 0 ? `$${parseMoney(r[mapping.budget]).toLocaleString()}` : '—'}</td>
                      <td className="py-2 pr-3 text-gray-600">{mapping.saleTarget >= 0 ? `$${parseMoney(r[mapping.saleTarget]).toLocaleString()}` : '—'}</td>
                      <td className="py-2 text-gray-600 capitalize">{mapping.projectType >= 0 ? normalizeType(r[mapping.projectType]).replace('-', ' ') : 'flip'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button onClick={reset} className="btn-secondary">Cancel</button>
            <button onClick={doImport} disabled={!canImport} className="btn-primary disabled:opacity-40 flex items-center gap-2">
              Import {rows.length} Deal{rows.length === 1 ? '' : 's'} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </>
      )}
    </div>
  )
}
