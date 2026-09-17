import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ProjectType = 'flip' | 'rental' | 'multifamily' | 'new-construction' | 'mixed-use'

export interface Unit {
  id: string
  name: string
  beds: number
  baths: number
  sqft: number
  status: 'planned' | 'under-construction' | 'complete' | 'leased' | 'sold'
  targetRent?: number
  targetSalePrice?: number
}

export type CapitalType = 'equity' | 'debt'

export interface Investor {
  id: string
  dealId: string
  name: string
  type: CapitalType
  amount: number
  // equity fields
  ownershipPct?: number
  preferredReturn?: number
  // debt fields
  interestRate?: number
  lenderType?: string
}

export interface Deal {
  id: string
  address: string
  acquisitionPrice: number
  budget: number
  spent: number
  status: 'planning' | 'in-progress' | 'completed'
  pipelineStage?: 'prospecting' | 'under-contract' | 'rehab' | 'listed' | 'sold'
  expectedProfit: number
  saleTarget?: number
  startDate?: string
  targetCompletionDate?: string
  notes?: string
  photos?: string[]
  projectType?: ProjectType
  units?: Unit[]
}

export interface Settings {
  companyName: string
  fullName: string
  email: string
  currency: string
  defaultRehabBuffer: number
}

export interface Contractor {
  id: string
  name: string
  trade: string
  phone: string
  email: string
  rating: number
  dealId?: string
  totalPaid: number
  status: 'active' | 'inactive'
}

export interface DocumentItem {
  id: string
  name: string
  category: 'contract' | 'permit' | 'inspection' | 'title' | 'other'
  dealId?: string
  dateAdded: string
  notes?: string
}

export interface TimelineTask {
  id: string
  dealId: string
  title: string
  status: 'pending' | 'in-progress' | 'done'
  dueDate?: string
}

export type BudgetCategory =
  | 'acquisition'
  | 'demo'
  | 'framing'
  | 'electrical'
  | 'plumbing'
  | 'hvac'
  | 'roofing'
  | 'finishes'
  | 'permits'
  | 'landscaping'
  | 'contingency'
  | 'other'

export interface BudgetItem {
  id: string
  dealId: string
  category: BudgetCategory
  label: string
  budgeted: number
  spent: number
}

export interface SavedAnalysis {
  id: string
  address: string
  type: 'flip' | 'rental'
  // flip fields
  purchasePrice: number
  rehabBudget: number
  arv: number
  // rental fields
  monthlyRent?: number
  monthlyExpenses?: number
  downPayment?: number
  dateAdded: string
  converted?: boolean
}

interface DealVaultState {
  deals: Deal[]
  contractors: Contractor[]
  documents: DocumentItem[]
  tasks: TimelineTask[]
  budgetItems: BudgetItem[]
  analyses: SavedAnalysis[]
  investors: Investor[]
  settings: Settings

  updateSettings: (updates: Partial<Settings>) => void

  addInvestor: (i: Omit<Investor, 'id'>) => void
  updateInvestor: (id: string, updates: Partial<Investor>) => void
  deleteInvestor: (id: string) => void

  addDeal: (deal: Omit<Deal, 'id'>) => void
  updateDeal: (id: string, updates: Partial<Deal>) => void
  deleteDeal: (id: string) => void
  addDealPhoto: (dealId: string, dataUrl: string) => void
  removeDealPhoto: (dealId: string, index: number) => void
  addUnit: (dealId: string, unit: Omit<Unit, 'id'>) => void
  updateUnit: (dealId: string, unitId: string, updates: Partial<Unit>) => void
  deleteUnit: (dealId: string, unitId: string) => void

  addAnalysis: (a: Omit<SavedAnalysis, 'id'>) => void
  deleteAnalysis: (id: string) => void
  markAnalysisConverted: (id: string) => void

  addBudgetItem: (b: Omit<BudgetItem, 'id'>) => void
  updateBudgetItem: (id: string, updates: Partial<BudgetItem>) => void
  deleteBudgetItem: (id: string) => void

  addContractor: (c: Omit<Contractor, 'id'>) => void
  updateContractor: (id: string, updates: Partial<Contractor>) => void
  deleteContractor: (id: string) => void

  addDocument: (d: Omit<DocumentItem, 'id'>) => void
  deleteDocument: (id: string) => void

  addTask: (t: Omit<TimelineTask, 'id'>) => void
  updateTask: (id: string, updates: Partial<TimelineTask>) => void
  deleteTask: (id: string) => void
}

const initialDeals: Deal[] = [
  {
    id: '1',
    address: '123 Main St, Brooklyn NY',
    acquisitionPrice: 250000,
    budget: 75000,
    spent: 42000,
    status: 'in-progress',
    pipelineStage: 'rehab',
    expectedProfit: 85000,
    saleTarget: 410000,
    startDate: '2026-02-01',
    targetCompletionDate: '2026-06-15',
    projectType: 'flip',
  },
  {
    id: '2',
    address: '456 Oak Ave, Queens NY',
    acquisitionPrice: 180000,
    budget: 50000,
    spent: 50000,
    status: 'completed',
    pipelineStage: 'sold',
    expectedProfit: 62000,
    saleTarget: 292000,
    startDate: '2025-11-01',
    targetCompletionDate: '2026-02-01',
    projectType: 'flip',
  },
  {
    id: '3',
    address: '88 Grove St, Jersey City NJ',
    acquisitionPrice: 1200000,
    budget: 2400000,
    spent: 850000,
    status: 'in-progress',
    pipelineStage: 'rehab',
    expectedProfit: 1150000,
    saleTarget: 4750000,
    startDate: '2026-01-15',
    targetCompletionDate: '2027-06-01',
    projectType: 'multifamily',
    units: [
      { id: 'u1', name: 'Unit 1A', beds: 1, baths: 1, sqft: 720, status: 'under-construction', targetSalePrice: 525000 },
      { id: 'u2', name: 'Unit 1B', beds: 2, baths: 2, sqft: 1050, status: 'under-construction', targetSalePrice: 749000 },
      { id: 'u3', name: 'Unit 2A', beds: 2, baths: 2, sqft: 1050, status: 'planned', targetSalePrice: 765000 },
      { id: 'u4', name: 'Unit 2B', beds: 3, baths: 2, sqft: 1350, status: 'planned', targetSalePrice: 899000 },
      { id: 'u5', name: 'Unit 3A', beds: 2, baths: 2, sqft: 1100, status: 'planned', targetSalePrice: 799000 },
      { id: 'u6', name: 'Penthouse', beds: 3, baths: 3, sqft: 1650, status: 'planned', targetSalePrice: 1250000 },
    ],
  },
]

const initialContractors: Contractor[] = [
  { id: 'c1', name: 'Mike Torres', trade: 'General Contractor', phone: '(718) 555-0142', email: 'mike@torresbuild.com', rating: 4.5, dealId: '1', totalPaid: 18000, status: 'active' },
  { id: 'c2', name: 'Elite Electric NY', trade: 'Electrician', phone: '(347) 555-0198', email: 'info@eliteelectricny.com', rating: 5, dealId: '1', totalPaid: 6200, status: 'active' },
  { id: 'c3', name: 'Sarah Chen', trade: 'Plumber', phone: '(917) 555-0110', email: 'sarah@chenplumbing.com', rating: 4, dealId: '2', totalPaid: 4800, status: 'inactive' },
]

const initialDocuments: DocumentItem[] = [
  { id: 'd1', name: 'Purchase Agreement - 123 Main St.pdf', category: 'contract', dealId: '1', dateAdded: '2026-02-01' },
  { id: 'd2', name: 'Building Permit - Kitchen Reno.pdf', category: 'permit', dealId: '1', dateAdded: '2026-02-10' },
  { id: 'd3', name: 'Home Inspection Report.pdf', category: 'inspection', dealId: '1', dateAdded: '2026-01-28' },
  { id: 'd4', name: 'Title Deed - 456 Oak Ave.pdf', category: 'title', dealId: '2', dateAdded: '2025-11-01' },
]

const initialTasks: TimelineTask[] = [
  { id: 't1', dealId: '1', title: 'Close on property', status: 'done', dueDate: '2026-02-01' },
  { id: 't2', dealId: '1', title: 'Demo & framing', status: 'done', dueDate: '2026-03-01' },
  { id: 't3', dealId: '1', title: 'Electrical & plumbing rough-in', status: 'in-progress', dueDate: '2026-04-15' },
  { id: 't4', dealId: '1', title: 'Kitchen & bath finish', status: 'pending', dueDate: '2026-05-20' },
  { id: 't5', dealId: '1', title: 'Final walkthrough & list', status: 'pending', dueDate: '2026-06-10' },
]

const initialBudgetItems: BudgetItem[] = [
  { id: 'b1', dealId: '1', category: 'demo', label: 'Demolition & debris removal', budgeted: 8000, spent: 7500 },
  { id: 'b2', dealId: '1', category: 'electrical', label: 'Full rewire + panel', budgeted: 12000, spent: 6200 },
  { id: 'b3', dealId: '1', category: 'plumbing', label: 'Repipe + fixtures', budgeted: 10000, spent: 4800 },
  { id: 'b4', dealId: '1', category: 'finishes', label: 'Kitchen & bath finishes', budgeted: 25000, spent: 15000 },
  { id: 'b5', dealId: '1', category: 'permits', label: 'City permits & inspections', budgeted: 5000, spent: 3500 },
  { id: 'b6', dealId: '1', category: 'contingency', label: 'Contingency reserve', budgeted: 15000, spent: 5000 },
  { id: 'b7', dealId: '2', category: 'finishes', label: 'Cosmetic rehab', budgeted: 35000, spent: 38000 },
  { id: 'b8', dealId: '2', category: 'permits', label: 'Permits', budgeted: 5000, spent: 4500 },
  { id: 'b9', dealId: '2', category: 'contingency', label: 'Contingency', budgeted: 10000, spent: 7500 },
]

const initialInvestors: Investor[] = [
  { id: 'i1', dealId: '3', name: 'You (Sponsor)', type: 'equity', amount: 400000, ownershipPct: 30 },
  { id: 'i2', dealId: '3', name: 'Riverside Capital Partners', type: 'equity', amount: 800000, ownershipPct: 60, preferredReturn: 8 },
  { id: 'i3', dealId: '3', name: 'Private LP — J. Alvarez', type: 'equity', amount: 133000, ownershipPct: 10, preferredReturn: 8 },
  { id: 'i4', dealId: '3', name: 'First Metro Construction Loan', type: 'debt', amount: 2400000, interestRate: 9.5, lenderType: 'Construction Loan' },
]

export const useStore = create<DealVaultState>()(
  persist(
    (set) => ({
      deals: initialDeals,
      contractors: initialContractors,
      documents: initialDocuments,
      tasks: initialTasks,
      budgetItems: initialBudgetItems,
      analyses: [],
      investors: initialInvestors,
      settings: {
        companyName: '',
        fullName: '',
        email: '',
        currency: 'USD',
        defaultRehabBuffer: 15,
      },

      updateSettings: (updates) =>
        set((state) => ({ settings: { ...state.settings, ...updates } })),

      addInvestor: (i) =>
        set((state) => ({ investors: [...state.investors, { ...i, id: Date.now().toString() + Math.random().toString(36).slice(2, 6) }] })),
      updateInvestor: (id, updates) =>
        set((state) => ({ investors: state.investors.map((inv) => (inv.id === id ? { ...inv, ...updates } : inv)) })),
      deleteInvestor: (id) =>
        set((state) => ({ investors: state.investors.filter((inv) => inv.id !== id) })),

      addDeal: (deal) =>
        set((state) => ({
          deals: [...state.deals, { ...deal, id: Date.now().toString() }],
        })),
      updateDeal: (id, updates) =>
        set((state) => ({
          deals: state.deals.map((d) => (d.id === id ? { ...d, ...updates } : d)),
        })),
      deleteDeal: (id) =>
        set((state) => ({
          deals: state.deals.filter((d) => d.id !== id),
          budgetItems: state.budgetItems.filter((b) => b.dealId !== id),
          tasks: state.tasks.filter((t) => t.dealId !== id),
        })),

      addDealPhoto: (dealId, dataUrl) =>
        set((state) => ({
          deals: state.deals.map((d) =>
            d.id === dealId ? { ...d, photos: [...(d.photos || []), dataUrl] } : d
          ),
        })),
      removeDealPhoto: (dealId, index) =>
        set((state) => ({
          deals: state.deals.map((d) =>
            d.id === dealId ? { ...d, photos: (d.photos || []).filter((_, i) => i !== index) } : d
          ),
        })),

      addUnit: (dealId, unit) =>
        set((state) => ({
          deals: state.deals.map((d) =>
            d.id === dealId ? { ...d, units: [...(d.units || []), { ...unit, id: Date.now().toString() + Math.random().toString(36).slice(2, 6) }] } : d
          ),
        })),
      updateUnit: (dealId, unitId, updates) =>
        set((state) => ({
          deals: state.deals.map((d) =>
            d.id === dealId ? { ...d, units: (d.units || []).map((u) => (u.id === unitId ? { ...u, ...updates } : u)) } : d
          ),
        })),
      deleteUnit: (dealId, unitId) =>
        set((state) => ({
          deals: state.deals.map((d) =>
            d.id === dealId ? { ...d, units: (d.units || []).filter((u) => u.id !== unitId) } : d
          ),
        })),

      addAnalysis: (a) =>
        set((state) => ({
          analyses: [...state.analyses, { ...a, id: Date.now().toString() }],
        })),
      deleteAnalysis: (id) =>
        set((state) => ({ analyses: state.analyses.filter((a) => a.id !== id) })),
      markAnalysisConverted: (id) =>
        set((state) => ({
          analyses: state.analyses.map((a) => (a.id === id ? { ...a, converted: true } : a)),
        })),

      addBudgetItem: (b) =>
        set((state) => ({
          budgetItems: [...state.budgetItems, { ...b, id: Date.now().toString() }],
        })),
      updateBudgetItem: (id, updates) =>
        set((state) => ({
          budgetItems: state.budgetItems.map((b) => (b.id === id ? { ...b, ...updates } : b)),
        })),
      deleteBudgetItem: (id) =>
        set((state) => ({ budgetItems: state.budgetItems.filter((b) => b.id !== id) })),

      addContractor: (c) =>
        set((state) => ({
          contractors: [...state.contractors, { ...c, id: Date.now().toString() }],
        })),
      updateContractor: (id, updates) =>
        set((state) => ({
          contractors: state.contractors.map((c) => (c.id === id ? { ...c, ...updates } : c)),
        })),
      deleteContractor: (id) =>
        set((state) => ({ contractors: state.contractors.filter((c) => c.id !== id) })),

      addDocument: (d) =>
        set((state) => ({
          documents: [...state.documents, { ...d, id: Date.now().toString() }],
        })),
      deleteDocument: (id) =>
        set((state) => ({ documents: state.documents.filter((d) => d.id !== id) })),

      addTask: (t) =>
        set((state) => ({
          tasks: [...state.tasks, { ...t, id: Date.now().toString() }],
        })),
      updateTask: (id, updates) =>
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
        })),
      deleteTask: (id) =>
        set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) })),
    }),
    { name: 'dealvault-storage' }
  )
)
