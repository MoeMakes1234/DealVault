import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Deal {
  id: string
  address: string
  acquisitionPrice: number
  budget: number
  spent: number
  status: 'planning' | 'in-progress' | 'completed'
  expectedProfit: number
  saleTarget?: number
  startDate?: string
  targetCompletionDate?: string
  notes?: string
  photos?: string[]
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
  settings: Settings

  updateSettings: (updates: Partial<Settings>) => void

  addDeal: (deal: Omit<Deal, 'id'>) => void
  updateDeal: (id: string, updates: Partial<Deal>) => void
  deleteDeal: (id: string) => void
  addDealPhoto: (dealId: string, dataUrl: string) => void
  removeDealPhoto: (dealId: string, index: number) => void

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
    expectedProfit: 85000,
    saleTarget: 410000,
    startDate: '2026-02-01',
    targetCompletionDate: '2026-06-15',
  },
  {
    id: '2',
    address: '456 Oak Ave, Queens NY',
    acquisitionPrice: 180000,
    budget: 50000,
    spent: 50000,
    status: 'completed',
    expectedProfit: 62000,
    saleTarget: 292000,
    startDate: '2025-11-01',
    targetCompletionDate: '2026-02-01',
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

export const useStore = create<DealVaultState>()(
  persist(
    (set) => ({
      deals: initialDeals,
      contractors: initialContractors,
      documents: initialDocuments,
      tasks: initialTasks,
      budgetItems: initialBudgetItems,
      analyses: [],
      settings: {
        companyName: '',
        fullName: '',
        email: '',
        currency: 'USD',
        defaultRehabBuffer: 15,
      },

      updateSettings: (updates) =>
        set((state) => ({ settings: { ...state.settings, ...updates } })),

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
