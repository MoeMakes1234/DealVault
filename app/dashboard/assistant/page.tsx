'use client'

import { useState, useRef, useEffect } from 'react'
import { Sparkles, Send, AlertCircle, Loader2 } from 'lucide-react'
import { useStore } from '@/lib/store'

interface ChatMessage {
  role: 'user' | 'assistant' | 'error'
  content: string
}

const suggestions = [
  'Which of my deals is most at risk of going over budget?',
  'Summarize my portfolio like an investor update.',
  'Which contractor should I use again, and which should I avoid?',
  "What's my average expected margin across active deals?",
]

export default function AssistantPage() {
  const deals = useStore((s) => s.deals)
  const contractors = useStore((s) => s.contractors)

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content:
        "Hi, I'm your DealVault AI assistant. I can see your live deal pipeline and contractor data — ask me anything about your portfolio, budgets, or risks.",
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const send = async (text: string) => {
    if (!text.trim() || loading) return
    const userMsg: ChatMessage = { role: 'user', content: text }
    setMessages((m) => [...m, userMsg])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          deals,
          contractors: contractors.map((c) => ({
            name: c.name,
            trade: c.trade,
            totalPaid: c.totalPaid,
            rating: c.rating,
          })),
        }),
      })
      const data = await res.json()
      if (data.error) {
        setMessages((m) => [...m, { role: 'error', content: data.error }])
      } else {
        setMessages((m) => [...m, { role: 'assistant', content: data.reply }])
      }
    } catch (err) {
      setMessages((m) => [...m, { role: 'error', content: 'Network error reaching the assistant. Try again.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container-max py-8 flex flex-col h-[calc(100vh-2rem)] lg:h-screen">
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-500 rounded-lg flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">AI Assistant</h1>
        </div>
        <p className="text-gray-500 text-sm mt-1">
          Ask questions about your deals, budgets, and contractors — answered from your live portfolio data.
        </p>
      </div>

      <div className="card flex-1 flex flex-col overflow-hidden p-0">
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {m.role === 'error' ? (
                <div className="max-w-lg bg-amber-50 border border-amber-200 text-amber-800 rounded-lg px-4 py-3 text-sm flex gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{m.content}</span>
                </div>
              ) : (
                <div
                  className={`max-w-lg rounded-lg px-4 py-3 text-sm whitespace-pre-wrap ${
                    m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {m.content}
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-500 rounded-lg px-4 py-3 text-sm flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" /> Thinking...
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {messages.length <= 1 && (
          <div className="px-6 pb-4 flex flex-wrap gap-2">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="text-xs px-3 py-1.5 rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault()
            send(input)
          }}
          className="border-t border-gray-100 p-4 flex gap-2"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your deals, budgets, or contractors..."
            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-40"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  )
}
