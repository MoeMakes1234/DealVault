'use client'

import { useToast } from '@/lib/toast'
import { CheckCircle, XCircle, Info, X } from 'lucide-react'

const config = {
  success: { icon: CheckCircle, class: 'bg-green-50 border-green-200 text-green-800', iconClass: 'text-green-500' },
  error: { icon: XCircle, class: 'bg-red-50 border-red-200 text-red-800', iconClass: 'text-red-500' },
  info: { icon: Info, class: 'bg-blue-50 border-blue-200 text-blue-800', iconClass: 'text-blue-500' },
}

export default function Toaster() {
  const toasts = useToast((s) => s.toasts)
  const dismiss = useToast((s) => s.dismiss)

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => {
        const c = config[t.type]
        const Icon = c.icon
        return (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-center gap-3 pl-4 pr-3 py-3 rounded-lg border shadow-lg animate-slide-up ${c.class}`}
            style={{ minWidth: 280, maxWidth: 400 }}
          >
            <Icon className={`w-5 h-5 shrink-0 ${c.iconClass}`} />
            <span className="text-sm font-medium flex-1">{t.message}</span>
            <button onClick={() => dismiss(t.id)} className="text-current opacity-40 hover:opacity-100 transition-opacity">
              <X className="w-4 h-4" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
