'use client'

import { useState } from 'react'
import { Plus, Trash2, X, Check, Circle, Clock3 } from 'lucide-react'
import { useStore, TimelineTask } from '@/lib/store'

const statusStyle: Record<TimelineTask['status'], string> = {
  done: 'bg-green-100 text-green-700 border-green-200',
  'in-progress': 'bg-blue-100 text-blue-700 border-blue-200',
  pending: 'bg-gray-100 text-gray-500 border-gray-200',
}

const statusIcon: Record<TimelineTask['status'], any> = {
  done: Check,
  'in-progress': Clock3,
  pending: Circle,
}

export default function TimelinePage() {
  const deals = useStore((s) => s.deals)
  const tasks = useStore((s) => s.tasks)
  const addTask = useStore((s) => s.addTask)
  const updateTask = useStore((s) => s.updateTask)
  const deleteTask = useStore((s) => s.deleteTask)

  const [selectedDeal, setSelectedDeal] = useState(deals[0]?.id || '')
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [dueDate, setDueDate] = useState('')

  const dealTasks = tasks
    .filter((t) => t.dealId === selectedDeal)
    .sort((a, b) => (a.dueDate || '').localeCompare(b.dueDate || ''))

  const cycleStatus = (task: TimelineTask) => {
    const order: TimelineTask['status'][] = ['pending', 'in-progress', 'done']
    const next = order[(order.indexOf(task.status) + 1) % order.length]
    updateTask(task.id, { status: next })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedDeal) return
    addTask({ dealId: selectedDeal, title, status: 'pending', dueDate: dueDate || undefined })
    setTitle('')
    setDueDate('')
    setShowForm(false)
  }

  return (
    <div className="container-max py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Timeline</h1>
          <p className="text-gray-500 text-sm mt-1">Visual project milestones and task tracking.</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          disabled={!selectedDeal}
          className="bg-blue-600 text-white px-4 py-2.5 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors font-medium text-sm disabled:opacity-40"
        >
          <Plus className="w-4 h-4" />
          Add Task
        </button>
      </div>

      {/* Deal selector tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {deals.map((d) => (
          <button
            key={d.id}
            onClick={() => setSelectedDeal(d.id)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              selectedDeal === d.id ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {d.address}
          </button>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50" onClick={() => setShowForm(false)}>
          <form onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()} className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold">Add Task</h3>
              <button type="button" onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Task</label>
                <input
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Drywall & paint"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Due Date</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
              <button type="submit" className="btn-primary">Add</button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        {!selectedDeal ? (
          <p className="text-center text-gray-500 py-12">Add a deal first to build its timeline.</p>
        ) : dealTasks.length === 0 ? (
          <p className="text-center text-gray-500 py-12">No tasks yet for this deal.</p>
        ) : (
          <div className="relative pl-6">
            <div className="absolute left-[9px] top-1 bottom-1 w-px bg-gray-200" />
            <div className="space-y-6">
              {dealTasks.map((task) => {
                const Icon = statusIcon[task.status]
                return (
                  <div key={task.id} className="relative flex items-start gap-4">
                    <button
                      onClick={() => cycleStatus(task)}
                      className={`absolute -left-6 w-4.5 h-4.5 rounded-full border flex items-center justify-center ${statusStyle[task.status]}`}
                      style={{ width: 18, height: 18 }}
                      title="Click to cycle status"
                    >
                      <Icon className="w-3 h-3" />
                    </button>
                    <div className="flex-1 flex items-center justify-between border border-gray-100 rounded-lg px-4 py-3 hover:shadow-sm transition-shadow">
                      <div>
                        <p className="font-medium text-gray-900">{task.title}</p>
                        {task.dueDate && <p className="text-xs text-gray-500 mt-0.5">Due {task.dueDate}</p>}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusStyle[task.status]}`}>
                          {task.status.replace('-', ' ')}
                        </span>
                        <button onClick={() => deleteTask(task.id)} className="text-gray-400 hover:text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
