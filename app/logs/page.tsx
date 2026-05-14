'use client'
import { useState } from 'react'
import AppLayout from '@/components/layout/AppLayout'
import { Search, Filter, ArrowUpRight, ArrowDownLeft, CheckCheck, Check, Clock, AlertCircle } from 'lucide-react'

const logs = [
  { id: 1, contact: 'فهد الحربي', phone: '+966505555555', dir: 'incoming', type: 'text', content: 'السلام عليكم، أريد الاستفسار', status: 'received', msgId: 'wamid.abc123', time: 'منذ 30 د', error: null },
  { id: 2, contact: 'أحمد محمد', phone: '+966501111111', dir: 'outgoing', type: 'text', content: 'طلبك قيد التجهيز ✅', status: 'read', msgId: 'wamid.def456', time: 'منذ 2 س', error: null },
  { id: 3, contact: 'نورة السالم', phone: '+966504444444', dir: 'outgoing', type: 'template', content: 'ترحيب_جديد', status: 'delivered', msgId: 'wamid.ghi789', time: 'منذ 3 س', error: null },
  { id: 4, contact: 'خالد الزهراني', phone: '+966503333333', dir: 'outgoing', type: 'text', content: 'مرحباً، هل تحتاج مساعدة؟', status: 'failed', msgId: null, time: 'منذ 5 س', error: 'Invalid phone number' },
  { id: 5, contact: 'سارة العمري', phone: '+966502222222', dir: 'incoming', type: 'text', content: 'حسناً، سأنتظر ردكم', status: 'received', msgId: 'wamid.jkl012', time: 'منذ 6 س', error: null },
]

const statusUI = (s: string) => ({
  read: <span className="flex items-center gap-1 text-blue-600 text-xs font-medium"><CheckCheck className="w-3.5 h-3.5" /> مقروء</span>,
  delivered: <span className="flex items-center gap-1 text-gray-500 text-xs font-medium"><CheckCheck className="w-3.5 h-3.5" /> مُسلَّم</span>,
  sent: <span className="flex items-center gap-1 text-gray-400 text-xs font-medium"><Check className="w-3.5 h-3.5" /> مُرسَل</span>,
  pending: <span className="flex items-center gap-1 text-gray-300 text-xs font-medium"><Clock className="w-3.5 h-3.5" /> انتظار</span>,
  failed: <span className="flex items-center gap-1 text-red-500 text-xs font-medium"><AlertCircle className="w-3.5 h-3.5" /> فشل</span>,
  received: <span className="flex items-center gap-1 text-green-600 text-xs font-medium"><Check className="w-3.5 h-3.5" /> مستقبل</span>,
}[s] || <span>{s}</span>)

export default function LogsPage() {
  const [search, setSearch] = useState('')
  const [filterDir, setFilterDir] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')

  const filtered = logs.filter(l => {
    if (search && !l.contact.includes(search) && !l.content.includes(search)) return false
    if (filterDir !== 'all' && l.dir !== filterDir) return false
    if (filterStatus !== 'all' && l.status !== filterStatus) return false
    return true
  })

  return (
    <AppLayout title="سجل الرسائل" subtitle="جميع الرسائل المرسلة والمستقبلة">
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="بحث..." className="pr-9 pl-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-500 w-52" />
        </div>
        <select value={filterDir} onChange={e => setFilterDir(e.target.value)} className="input w-40">
          <option value="all">كل الاتجاهات</option>
          <option value="outgoing">مرسلة</option>
          <option value="incoming">مستقبلة</option>
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="input w-40">
          <option value="all">كل الحالات</option>
          <option value="read">مقروء</option>
          <option value="delivered">مُسلَّم</option>
          <option value="failed">فشل</option>
          <option value="pending">انتظار</option>
        </select>
        <span className="text-xs text-gray-500 mr-auto">{filtered.length} رسالة</span>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-right px-5 py-3.5 text-xs font-semibold text-gray-500">جهة الاتصال</th>
              <th className="text-right px-5 py-3.5 text-xs font-semibold text-gray-500">الاتجاه</th>
              <th className="text-right px-5 py-3.5 text-xs font-semibold text-gray-500">النوع</th>
              <th className="text-right px-5 py-3.5 text-xs font-semibold text-gray-500">المحتوى</th>
              <th className="text-right px-5 py-3.5 text-xs font-semibold text-gray-500">الحالة</th>
              <th className="text-right px-5 py-3.5 text-xs font-semibold text-gray-500">الوقت</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((l) => (
              <tr key={l.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3.5">
                  <p className="text-sm font-semibold text-gray-800">{l.contact}</p>
                  <p className="text-xs text-gray-400 font-mono">{l.phone}</p>
                </td>
                <td className="px-5 py-3.5">
                  {l.dir === 'outgoing'
                    ? <span className="flex items-center gap-1 text-blue-600 text-xs font-medium"><ArrowUpRight className="w-3.5 h-3.5" /> صادر</span>
                    : <span className="flex items-center gap-1 text-green-600 text-xs font-medium"><ArrowDownLeft className="w-3.5 h-3.5" /> وارد</span>}
                </td>
                <td className="px-5 py-3.5">
                  <span className="badge-gray text-xs">{l.type === 'text' ? 'نص' : l.type === 'template' ? 'قالب' : l.type}</span>
                </td>
                <td className="px-5 py-3.5">
                  <p className="text-sm text-gray-700 max-w-xs truncate">{l.content}</p>
                  {l.error && <p className="text-xs text-red-500 mt-0.5">{l.error}</p>}
                </td>
                <td className="px-5 py-3.5">{statusUI(l.status)}</td>
                <td className="px-5 py-3.5 text-xs text-gray-400">{l.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppLayout>
  )
}
