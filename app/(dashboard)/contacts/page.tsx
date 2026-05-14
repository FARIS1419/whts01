'use client'
import { useState } from 'react'
import AppLayout from '@/components/layout/AppLayout'
import { Search, Plus, Edit, Trash2, Eye, Filter, Download, Upload } from 'lucide-react'

const contacts = [
  { id: 1, name: 'أحمد محمد', phone: '+966501111111', email: 'ahmed@example.com', tags: ['عميل', 'مهم'], status: 'active', source: 'manual', lastMsg: 'منذ ساعتين' },
  { id: 2, name: 'سارة العمري', phone: '+966502222222', email: 'sara@example.com', tags: ['عميلة'], status: 'active', source: 'webhook', lastMsg: 'منذ 5 ساعات' },
  { id: 3, name: 'خالد الزهراني', phone: '+966503333333', email: null, tags: ['محتمل'], status: 'active', source: 'manual', lastMsg: 'منذ يوم' },
  { id: 4, name: 'نورة السالم', phone: '+966504444444', email: 'noura@example.com', tags: ['VIP', 'عميلة'], status: 'active', source: 'import', lastMsg: 'منذ 3 ساعات' },
  { id: 5, name: 'فهد الحربي', phone: '+966505555555', email: null, tags: ['جديد'], status: 'active', source: 'webhook', lastMsg: 'منذ 30 دقيقة' },
  { id: 6, name: 'ريم القحطاني', phone: '+966506666666', email: 'reem@example.com', tags: ['عميلة', 'مهم'], status: 'inactive', source: 'manual', lastMsg: 'منذ 6 ساعات' },
]

const sourceBadge = (s: string) => {
  const map: Record<string, string> = { manual: 'يدوي', webhook: 'واتساب', import: 'استيراد', api: 'API' }
  return <span className="badge-blue">{map[s] || s}</span>
}

const statusBadge = (s: string) => s === 'active'
  ? <span className="badge-green">نشط</span>
  : <span className="badge-gray">غير نشط</span>

export default function ContactsPage() {
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)

  const filtered = contacts.filter(c => c.name.includes(search) || c.phone.includes(search))

  return (
    <AppLayout title="جهات الاتصال" subtitle={`${contacts.length} جهة اتصال`}>
      
      {/* Header Actions */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="بحث بالاسم أو الرقم..."
              className="pr-9 pl-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-500 w-64" />
          </div>
          <button className="btn-secondary gap-2">
            <Filter className="w-4 h-4" /> فلتر
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-secondary">
            <Upload className="w-4 h-4" /> استيراد CSV
          </button>
          <button className="btn-secondary">
            <Download className="w-4 h-4" /> تصدير
          </button>
          <button onClick={() => setShowModal(true)} className="btn-primary">
            <Plus className="w-4 h-4" /> إضافة جهة اتصال
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-right px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase">الاسم</th>
              <th className="text-right px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase">رقم الجوال</th>
              <th className="text-right px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase">الوسوم</th>
              <th className="text-right px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase">الحالة</th>
              <th className="text-right px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase">المصدر</th>
              <th className="text-right px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase">آخر تواصل</th>
              <th className="text-right px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-400 to-teal-500 flex items-center justify-center text-white text-sm font-bold">
                      {c.name[0]}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{c.name}</p>
                      {c.email && <p className="text-xs text-gray-400">{c.email}</p>}
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-sm text-gray-600 font-mono">{c.phone}</td>
                <td className="px-5 py-4">
                  <div className="flex flex-wrap gap-1">
                    {c.tags.map(tag => <span key={tag} className="badge-green text-xs">{tag}</span>)}
                  </div>
                </td>
                <td className="px-5 py-4">{statusBadge(c.status)}</td>
                <td className="px-5 py-4">{sourceBadge(c.source)}</td>
                <td className="px-5 py-4 text-xs text-gray-500">{c.lastMsg}</td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-1">
                    <button className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center" title="عرض">
                      <Eye className="w-4 h-4 text-gray-500" />
                    </button>
                    <button className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center" title="تعديل">
                      <Edit className="w-4 h-4 text-gray-500" />
                    </button>
                    <button className="w-8 h-8 rounded-lg hover:bg-red-50 flex items-center justify-center" title="حذف">
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">لا توجد نتائج</p>
          </div>
        )}
      </div>

      {/* Add Contact Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h3 className="font-bold text-gray-900 text-lg mb-5">إضافة جهة اتصال جديدة</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1.5">الاسم <span className="text-red-500">*</span></label>
                <input className="input" placeholder="الاسم الكامل" />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1.5">رقم الجوال <span className="text-red-500">*</span></label>
                <input className="input" placeholder="+966XXXXXXXXX" dir="ltr" />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1.5">البريد الإلكتروني</label>
                <input className="input" placeholder="example@email.com" dir="ltr" />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1.5">الوسوم</label>
                <input className="input" placeholder="مثال: عميل، مهم (مفصولة بفاصلة)" />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1.5">ملاحظات</label>
                <textarea className="input resize-none" rows={3} placeholder="ملاحظات إضافية..." />
              </div>
            </div>
            <div className="flex items-center gap-3 mt-6">
              <button className="btn-primary flex-1 justify-center">حفظ</button>
              <button onClick={() => setShowModal(false)} className="btn-secondary flex-1 justify-center">إلغاء</button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  )
}

function Users({ className }: { className?: string }) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
}
