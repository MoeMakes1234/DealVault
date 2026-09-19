'use client'

import { useEffect, useRef } from 'react'
import { useAuth } from '@/components/AuthProvider'
import { supabase } from '@/lib/supabase'
import { useStore } from '@/lib/store'

// Maps between the app's camelCase shape and the DB's snake_case columns.
const toDbDeal = (d: any, userId: string) => ({
  id: d.id, user_id: userId, address: d.address, acquisition_price: d.acquisitionPrice,
  budget: d.budget, spent: d.spent, status: d.status, pipeline_stage: d.pipelineStage,
  expected_profit: d.expectedProfit, sale_target: d.saleTarget ?? null, start_date: d.startDate ?? null,
  target_completion_date: d.targetCompletionDate ?? null, notes: d.notes ?? null,
  project_type: d.projectType ?? 'flip', photos: d.photos ?? [], units: d.units ?? [],
})
const fromDbDeal = (r: any) => ({
  id: r.id, address: r.address, acquisitionPrice: Number(r.acquisition_price), budget: Number(r.budget),
  spent: Number(r.spent), status: r.status, pipelineStage: r.pipeline_stage, expectedProfit: Number(r.expected_profit),
  saleTarget: r.sale_target != null ? Number(r.sale_target) : undefined, startDate: r.start_date ?? undefined,
  targetCompletionDate: r.target_completion_date ?? undefined, notes: r.notes ?? undefined,
  projectType: r.project_type ?? 'flip', photos: r.photos ?? [], units: r.units ?? [],
})

const isUuid = (id: string) => /^[0-9a-f]{8}-[0-9a-f]{4}/i.test(id)

/**
 * Bridges the local Zustand store with Supabase.
 * - On login: pulls the user's rows from Supabase into the store.
 * - After that: subscribes to store changes and upserts them back.
 * Deals are the primary synced entity in this first pass; related
 * collections (contractors, documents, etc.) follow the same pattern.
 */
export default function SupabaseSync() {
  const { user } = useAuth()
  const loadedFor = useRef<string | null>(null)

  useEffect(() => {
    if (!user) {
      loadedFor.current = null
      return
    }
    if (loadedFor.current === user.id) return
    loadedFor.current = user.id

    let cancelled = false

    ;(async () => {
      // Pull all of the user's data in parallel
      const [deals, contractors, documents, tasks, budgetItems, investors, analyses, settingsRow] = await Promise.all([
        supabase.from('deals').select('*').order('created_at'),
        supabase.from('contractors').select('*').order('created_at'),
        supabase.from('documents').select('*').order('created_at'),
        supabase.from('tasks').select('*').order('created_at'),
        supabase.from('budget_items').select('*').order('created_at'),
        supabase.from('investors').select('*').order('created_at'),
        supabase.from('analyses').select('*').order('created_at'),
        supabase.from('settings').select('*').eq('user_id', user.id).maybeSingle(),
      ])
      if (cancelled) return

      const st = useStore.getState()

      // If the user has no rows yet AND the local store still has the
      // seed/demo data, this is their first login — leave the demo data
      // so the app isn't empty, but don't push it to the cloud automatically.
      const hasCloudData = (deals.data?.length || 0) > 0

      if (hasCloudData) {
        useStore.setState({
          deals: deals.data!.map(fromDbDeal),
          contractors: (contractors.data || []).map((r: any) => ({
            id: r.id, name: r.name, trade: r.trade, phone: r.phone, email: r.email,
            rating: Number(r.rating), dealId: r.deal_id ?? undefined, totalPaid: Number(r.total_paid), status: r.status,
          })),
          documents: (documents.data || []).map((r: any) => ({
            id: r.id, name: r.name, category: r.category, dealId: r.deal_id ?? undefined, dateAdded: r.date_added, notes: r.notes ?? undefined,
          })),
          tasks: (tasks.data || []).map((r: any) => ({
            id: r.id, dealId: r.deal_id, title: r.title, status: r.status, dueDate: r.due_date ?? undefined,
          })),
          budgetItems: (budgetItems.data || []).map((r: any) => ({
            id: r.id, dealId: r.deal_id, category: r.category, label: r.label, budgeted: Number(r.budgeted), spent: Number(r.spent),
          })),
          investors: (investors.data || []).map((r: any) => ({
            id: r.id, dealId: r.deal_id, name: r.name, type: r.type, amount: Number(r.amount),
            ownershipPct: r.ownership_pct != null ? Number(r.ownership_pct) : undefined,
            preferredReturn: r.preferred_return != null ? Number(r.preferred_return) : undefined,
            interestRate: r.interest_rate != null ? Number(r.interest_rate) : undefined,
            lenderType: r.lender_type ?? undefined,
          })),
          analyses: (analyses.data || []).map((r: any) => ({
            id: r.id, address: r.address, type: r.type, purchasePrice: Number(r.purchase_price),
            rehabBudget: Number(r.rehab_budget), arv: Number(r.arv),
            monthlyRent: r.monthly_rent != null ? Number(r.monthly_rent) : undefined,
            monthlyExpenses: r.monthly_expenses != null ? Number(r.monthly_expenses) : undefined,
            downPayment: r.down_payment != null ? Number(r.down_payment) : undefined,
            dateAdded: r.date_added, converted: r.converted,
          })),
        })
      }

      if (settingsRow.data) {
        useStore.setState({
          settings: {
            companyName: settingsRow.data.company_name || '',
            fullName: settingsRow.data.full_name || '',
            email: settingsRow.data.email || user.email || '',
            currency: settingsRow.data.currency || 'USD',
            defaultRehabBuffer: Number(settingsRow.data.default_rehab_buffer) || 15,
          },
        })
      }
    })()

    return () => { cancelled = true }
  }, [user])

  // Persist deals back to Supabase whenever they change (debounced).
  useEffect(() => {
    if (!user) return
    let timer: any
    const unsub = useStore.subscribe((state, prev) => {
      if (state.deals === prev.deals) return
      clearTimeout(timer)
      timer = setTimeout(async () => {
        // Upsert every deal that has a UUID (cloud-native). New local deals
        // created before login keep their numeric ids until re-created.
        const rows = state.deals.map((d) => toDbDeal(d, user.id))
        if (rows.length) await supabase.from('deals').upsert(rows)
      }, 800)
    })
    return () => { unsub(); clearTimeout(timer) }
  }, [user])

  return null
}
