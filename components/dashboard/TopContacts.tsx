import { Users, ChevronLeft, MessageSquare } from 'lucide-react'
import Link from 'next/link'
import { demoTopContacts } from '@/lib/demo/data'

const colors = ['#25D366', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444']

export default function TopContacts() {
  const max = demoTopContacts[0]?.messages || 1

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between p-5 border-b border-gray-50">
        <div className="flex items-center gap-2">
          <Users size={18} style={{ color: '#3b82f6' }} />
          <h3 className="font-bold text-gray-800">أكثر جهات الاتصال تفاعلاً</h3>
        </div>
        <Link href="/contacts" className="text-sm font-medium flex items-center gap-1"
          style={{ color: '#3b82f6' }}>
          عرض الكل <ChevronLeft size={14} />
        </Link>
      </div>
      <div className="p-5 space-y-4">
        {demoTopContacts.map((contact, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className="text-xs font-bold text-gray-400 w-4">{i + 1}</span>
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
              style={{ background: colors[i] }}>
              {contact.name[0]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <p className="font-semibold text-gray-800 text-sm truncate">{contact.name}</p>
                <div className="flex items-center gap-1 text-xs text-gray-500 flex-shrink-0 mr-2">
                  <MessageSquare size={11} />
                  {contact.messages}
                </div>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${(contact.messages / max) * 100}%`, background: colors[i] }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
