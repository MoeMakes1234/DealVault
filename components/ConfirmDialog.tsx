'use client'

import { create } from 'zustand'
import { AlertTriangle } from 'lucide-react'
import { useEffect } from 'react'

interface ConfirmState {
  open: boolean
  title: string
  message: string
  confirmLabel: string
  onConfirm: (() => void) | null
  ask: (opts: { title?: string; message: string; confirmLabel?: string; onConfirm: () => void }) => void
  close: () => void
}

export const useConfirm = create<ConfirmState>((set) => ({
  open: false,
  title: 'Are you sure?',
  message: '',
  confirmLabel: 'Delete',
  onConfirm: null,
  ask: ({ title = 'Are you sure?', message, confirmLabel = 'Delete', onConfirm }) =>
    set({ open: true, title, message, confirmLabel, onConfirm }),
  close: () => set({ open: false, onConfirm: null }),
}))

export default function ConfirmDialog() {
  const { open, title, message, confirmLabel, onConfirm, close } = useConfirm()

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'Enter') {
        onConfirm?.()
        close()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onConfirm, close])

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-[90]" onClick={close}>
      <div className="bg-white rounded-xl p-6 w-full max-w-sm animate-slide-up" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5 text-red-500" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        </div>
        <p className="text-sm text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button onClick={close} className="btn-secondary">Cancel</button>
          <button
            onClick={() => { onConfirm?.(); close() }}
            className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-all active:scale-[0.98]"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
