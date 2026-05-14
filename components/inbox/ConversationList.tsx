'use client'

import { useState } from 'react'
import { Search, Filter } from 'lucide-react'

interface ConversationListProps {
  conversations: any[]
  selectedId?: string
  onSelect: (conv: any) => void
}

const statusColors: Record<string, { dot: string; label: string }> = {
  open: { dot: '#25D366', label: 'مفتوح' },
  pending: { dot: '#f59e0b', label: 'معلق' },
  closed: { dot: '#6b7280', label: 'مغلق' },
  resolved: { dot: '#3b82f6', label: 'محلول' },
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const h = Math.floor(diff / 3600000)
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'الآن'
  if (m < 60) return `${m}د`
  if (h < 24) return `${h}س`
  return `${Math.floor(h / 24)}ي`
}

export default function ConversationList({ conversations, selectedId, onSelect }: ConversationListProps) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'open' | 'pending' | 'closed'>('all')

  const filtered = conversations.filter(c => {
    const matchSearch = c.contact.name.includes(search) || c.contact.phone.includes(search)
    const matchFilter = filter === 'all' || c.status === filter
    return matchSearch && matchFilter
  })

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <h2 className="font-bold text-gray-800 mb-3">المحادثات</h2>
        <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-2 mb-3">
          <Search size={14} className="text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="بحث في المحادثات..."
            className="bg-transparent text-sm flex-1 text-gray-600"
            style={{ outline: 'none', border: 'none' }}
          />
        </div>
        {/* Filters */}
        <div className="flex gap-1">
          {(['all', 'open', 'pending', 'closed'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="text-xs px-2.5 py-1 rounded-lg font-medium transition-all"
              style={{
                background: filter === f ? '#25D366' : '#f3f4f6',
                color: filter === f ? 'white' : '#6b7280',
              }}
            >
              {{ all: 'الكل', open: 'مفتوح', pending: 'معلق', closed: 'مغلق' }[f]}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="flex items-center justify-center h-40 text-gray-400 text-sm">
            لا توجد محادثات
          </div>
        ) : (
          filtered.map((conv) => {
            const st = statusColors[conv.status] || statusColors.open
            const isSelected = conv.id === selectedId
            return (
              <button
                key={conv.id}
                onClick={() => onSelect(conv)}
                className="w-full flex items-center gap-3 p-4 border-b border-gray-50 text-right transition-all"
                style={{
                  background: isSelected ? '#f0fdf4' : 'transparent',
                  borderRight: isSelected ? '3px solid #25D366' : '3px solid transparent',
                }}
              >
                <div className="relative flex-shrink-0">
                  <div className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold"
                    style={{ background: 'linear-gradient(135deg, #25D366, #128C7E)' }}>
                    {conv.contact.name[0]}
                  </div>
                  <span className="absolute -bottom-0.5 -left-0.5 w-3 h-3 rounded-full border-2 border-white"
                    style={{ background: st.dot }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className="font-semibold text-gray-800 text-sm truncate">{conv.contact.name}</p>
                    <span className="text-xs text-gray-400 flex-shrink-0">{timeAgo(conv.last_message_at)}</span>
                  </div>
                  <p className="text-xs text-gray-500 truncate">{conv.last_message_text}</p>
                </div>
                {conv.unread_count > 0 && (
                  <span className="w-5 h-5 rounded-full text-white text-xs font-bold flex items-center justify-center flex-shrink-0"
                    style={{ background: '#25D366' }}>
                    {conv.unread_count}
                  </span>
                )}
              </button>
            )
          })
        )}
      </div>
    </div>
  )
}
