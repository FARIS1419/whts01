'use client'
import { useState } from 'react'
import AppLayout from '@/components/layout/AppLayout'
import { Plus, Search, RefreshCw, Eye, Edit, Trash2 } from 'lucide-react'

const templates = [
  { id: 1, name: 'ترحيب_جديد', language: 'ar', category: 'MARKETING', status: 'approved', body: 'أهلاً {{1}}! 👋 مرحباً بك في {{2}}. نحن هنا لخدمتك على مدار الساعة.', variables: ['اسم العميل', 'اسم الشركة'] },
  { id: 2, name: 'تأكيد_طلب', language: 'ar', category: 'UTILITY', status: 'approved', body: 'عزيزي {{1}}، تم تأكيد طلبك رقم {{2}} بنجاح ✅ سيتم التوصيل خلال {{3}} أيام.', variables: ['اسم العميل', 'رقم الطلب', 'مدة التوصيل'] },
  { id: 3, name: 'عرض_خاص', language: 'ar', category: 'MARKETING', status: 'approved', body: '🎉 عرض خاص لك {{1}}! احصل على خصم {{2}}% على جميع المنتجات.', variables: ['اسم العميل', 'نسبة الخصم'] },
  { id: 4, name: 'تذكير_موعد', language: 'ar', category: 'UTILITY', status: 'pending', body: 'تذكير: لديك موعد غداً {{1}} الساعة {{2}}. للتأكيد تواصل معنا.', variables: ['التاريخ', 'الوقت'] },
]

const categoryLabel: Record<string, string> = { MARKETING: 'تسويق', UTILITY: 'خدمة', AUTHENTICATION: 'مصادقة' }
const categoryColor: Record<string, string> = { MARKETING: 'badge-blue', UTILITY: 'badge-green', AUTHENTICATION: 'badge-yellow' }

export default function TemplatesPage() {
  const [search, setSearch] = useState('')
  const [preview, setPreview] = useState<typeof templates[0] | null>(null)
  const [showCreate, setShowCreate] = useState(false)

  const filtered = templates.filter(t => t.name.includes(search))

  const renderBody = (body: string) =>
    body.replace(/{{(\d+)}}/g, (_, n) => `<span class="bg-amber-100 text-amber-700 px-1 rounded font-semibold text-xs">{{${n}}}</span>`)

  return (
    <AppLayout title="القوالب" subtitle={`${templates.length} قالب`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="بحث في القوالب..." className="pr-9 pl-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-500 w-60" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-secondary"><RefreshCw className="w-4 h-4" /> مزامنة من WhatsApp</button>
          <button onClick={() => setShowCreate(true)} className="btn-primary"><Plus className="w-4 h-4" /> قالب جديد</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.map((t) => (
          <div key={t.id} className="card hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-bold text-gray-900">{t.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`badge text-xs ${categoryColor[t.category]}`}>{categoryLabel[t.category]}</span>
                  <span className="badge-gray text-xs">{t.language === 'ar' ? 'عربي' : t.language}</span>
                  {t.status === 'approved'
                    ? <span className="badge-green text-xs">✓ معتمد</span>
                    : <span className="badge-yellow text-xs">⏳ انتظار</span>}
                </div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => setPreview(t)} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center"><Eye className="w-4 h-4 text-gray-500" /></button>
                <button className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center"><Edit className="w-4 h-4 text-gray-500" /></button>
                <button className="w-8 h-8 rounded-lg hover:bg-red-50 flex items-center justify-center"><Trash2 className="w-4 h-4 text-red-400" /></button>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 mb-3">
              <p className="text-sm text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: renderBody(t.body) }} />
            </div>
            {t.variables.length > 0 && (
              <div>
                <p className="text-xs text-gray-500 mb-1.5">المتغيرات:</p>
                <div className="flex flex-wrap gap-1">
                  {t.variables.map((v, i) => (
                    <span key={i} className="badge bg-amber-50 text-amber-700 text-xs">
                      {`{{${i + 1}}}`} = {v}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Preview Modal */}
      {preview && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setPreview(null)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-gray-900 mb-4">معاينة القالب: {preview.name}</h3>
            <div style={{ background: '#efeae2' }} className="rounded-xl p-4">
              <div className="bubble-out p-3 max-w-xs">
                <p className="text-sm text-gray-800 leading-relaxed" dangerouslySetInnerHTML={{ __html: renderBody(preview.body) }} />
                <p className="text-xs text-gray-400 mt-1.5 text-left">12:00 ✓✓</p>
              </div>
            </div>
            <button onClick={() => setPreview(null)} className="mt-4 w-full btn-secondary justify-center">إغلاق</button>
          </div>
        </div>
      )}
    </AppLayout>
  )
}
