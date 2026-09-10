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

interface DealVaultState {
  deals: Deal[]
  contractors: Contractor[]
  documents: DocumentItem[]
  tasks: TimelineTask[]

  addDeal: (deal: Omit<Deal, 'id'>) => void
  updateDeal: (id: string, updates: Partial<Deal>) => void
  deleteDeal: (id: string) => void

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

export const useStore = create<DealVaultState>()(
  persist(
    (set) => ({
      deals: initialDeals,
      contractors: initialContractors,
      documents: initialDocuments,
      tasks: initialTasks,

      addDeal: (deal) =>
        set((state) => ({
          deals: [...state.deals, { ...deal, id: Date.now().toString() }],
        })),
      updateDeal: (id, updates) =>
        set((state) => ({
          deals: state.deals.map((d) => (d.id === id ? { ...d, ...updates } : d)),
        })),
      deleteDeal: (id) =>
        set((state) => ({ deals: state.deals.filter((d) => d.id !== id) })),

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
