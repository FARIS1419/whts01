import { MessageSquare, ChevronLeft } from 'lucide-react'
import Link from 'next/link'

const conversations = [
  { id: 1, name: 'أحمد محمد السعيد', phone: '+966 50 123 4567', msg: 'شكراً جزيلاً، سأراجع العرض', time: 'منذ ساعتين', unread: 2, status: 'open' },
  { id: 2, name: 'نورة سالم العتيبي', phone: '+966 50 456 7890', msg: 'أريد الاشتراك في الباقة المميزة', time: 'منذ 3 ساعات', unread: 3, status: 'open' },
  { id: 3, name: 'فاطمة علي الزهراني', phone: '+966 50 234 5678', msg: 'هل يمكنني الاستفسار عن المنتج؟', time: 'منذ 5 ساعات', unread: 0, status: 'pending' },
  { id: 4, name: 'محمد عبدالله القحطاني', phone: '+966 50 345 6789', msg: 'متى سيكون متاحاً؟', time: 'أمس', unread: 1, status: 'pending' },
]

const statusMap: Record<string, { label: string; color: string; bg: string }> = {
  open: { label: 'مفتوح', color: '#16a34a', bg: '#dcfce7' },
  pending: { label: 'معلق', color: '#d97706', bg: '#fef3c7' },
  closed: { label: 'مغلق', color: '#6b7280', bg: '#f3f4f6' },
}

export default function RecentConversations() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between p-5 border-b border-gray-50">
        <div className="flex items-center gap-2">
          <MessageSquare size={18} style={{ color: '#25D366' }} />
          <h3 className="font-bold text-gray-800">آخر المحادثات</h3>
        </div>
        <Link href="/inbox" className="text-sm font-medium flex items-center gap-1"
          style={{ color: '#25D366' }}>
          عرض الكل <ChevronLeft size={14} />
        </Link>
      </div>
      <div className="divide-y divide-gray-50">
        {conversations.map((conv) => {
          const st = statusMap[conv.status]
          return (
            <Link key={conv.id} href="/inbox"
              className="flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors cursor-pointer">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #25D366, #128C7E)' }}>
                {conv.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <p className="font-semibold text-gray-800 text-sm truncate">{conv.name}</p>
                  <span className="text-xs text-gray-400 flex-shrink-0 mr-2">{conv.time}</span>
                </div>
                <p className="text-xs text-gray-500 truncate">{conv.msg}</p>
              </div>
              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                {conv.unread > 0 && (
                  <span className="w-5 h-5 rounded-full text-white text-xs font-bold flex items-center justify-center"
                    style={{ background: '#25D366' }}>
                    {conv.unread}
                  </span>
                )}
                <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{ background: st.bg, color: st.color }}>
                  {st.label}
                </span>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
