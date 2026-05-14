'use client'
import { useState } from 'react'
import AppLayout from '@/components/layout/AppLayout'
import { Plus, Send, Users, Clock, CheckCheck, Eye, BarChart2 } from 'lucide-react'

const campaigns = [
  { id: 1, name: 'حملة العروض الرمضانية', status: 'completed', total: 150, sent: 148, delivered: 142, read: 98, failed: 2, replies: 23, time: 'منذ يومين' },
  { id: 2, name: 'حملة ترحيب العملاء الجدد', status: 'sending', total: 45, sent: 23, delivered: 20, read: 15, failed: 0, replies: 5, time: 'منذ ساعة' },
  { id: 3, name: 'تذكير المواعيد - أبريل', status: 'draft', total: 0, sent: 0, delivered: 0, read: 0, failed: 0, replies: 0, time: 'منذ 30 دقيقة' },
]

const statusBadge: Record<string, React.ReactNode> = {
  completed: <span className="badge-green">مكتملة</span>,
  sending: <span className="badge-blue">جاري الإرسال</span>,
  scheduled: <span className="badge-yellow">مجدولة</span>,
  draft: <span className="badge-gray">مسودة</span>,
  failed: <span className="badge-red">فشلت</span>,
}

export default function BroadcastPage() {
  const [showCreate, setShowCreate] = useState(false)
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({ name: '', tags: [], template: '', schedule: 'now', scheduledAt: '' })
  const [showConfirm, setShowConfirm] = useState(false)

  return (
    <AppLayout title="إطلاق الرسائل" subtitle="إدارة حملات الرسائل الجماعية">
      <div className="flex items-center justify-between mb-6">
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'إجمالي الحملات', value: campaigns.length, icon: BarChart2, color: 'text-blue-600 bg-blue-50' },
            { label: 'قيد التشغيل', value: campaigns.filter(c => c.status === 'sending').length, icon: Send, color: 'text-green-600 bg-green-50' },
            { label: 'مكتملة', value: campaigns.filter(c => c.status === 'completed').length, icon: CheckCheck, color: 'text-teal-600 bg-teal-50' },
          ].map((s) => (
            <div key={s.label} className="card flex items-center gap-3 py-3">
              <div className={`w-9 h-9 rounded-xl ${s.color} flex items-center justify-center`}>
                <s.icon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">{s.value}</p>
                <p className="text-xs text-gray-500">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
        <button onClick={() => setShowCreate(true)} className="btn-primary">
          <Plus className="w-4 h-4" /> حملة جديدة
        </button>
      </div>

      <div className="space-y-4">
        {campaigns.map((c) => (
          <div key={c.id} className="card">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-gray-900">{c.name}</h3>
                  {statusBadge[c.status]}
                </div>
                <p className="text-xs text-gray-400 mt-1">{c.time}</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center"><Eye className="w-4 h-4 text-gray-500" /></button>
              </div>
            </div>
            {c.status !== 'draft' && (
              <>
                <div className="flex items-center gap-6 text-sm mb-3">
                  <div className="flex items-center gap-2"><Users className="w-4 h-4 text-gray-400" /><span className="text-gray-600">{c.total} مستقبل</span></div>
                </div>
                <div className="grid grid-cols-5 gap-3">
                  {[
                    { label: 'مرسلة', value: c.sent, color: 'bg-blue-500' },
                    { label: 'مستلمة', value: c.delivered, color: 'bg-teal-500' },
                    { label: 'مقروءة', value: c.read, color: 'bg-green-500' },
                    { label: 'ردود', value: c.replies, color: 'bg-purple-500' },
                    { label: 'فاشلة', value: c.failed, color: 'bg-red-400' },
                  ].map((stat) => (
                    <div key={stat.label} className="text-center">
                      <div className="text-lg font-bold text-gray-900">{stat.value}</div>
                      <div className="text-xs text-gray-500">{stat.label}</div>
                      <div className="h-1 rounded-full bg-gray-100 mt-1.5">
                        <div className={`${stat.color} h-1 rounded-full`} style={{ width: `${c.total ? (stat.value / c.total) * 100 : 0}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
            {c.status === 'draft' && (
              <div className="flex items-center gap-3">
                <button onClick={() => setShowConfirm(true)} className="btn-primary text-sm">
                  <Send className="w-3.5 h-3.5" /> إطلاق الحملة
                </button>
                <button className="btn-secondary text-sm">
                  <Clock className="w-3.5 h-3.5" /> جدولة
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Create Campaign Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-gray-900 text-lg">حملة جديدة</h3>
              <div className="flex items-center gap-2">
                {[1, 2, 3].map(s => (
                  <div key={s} className={`w-8 h-1.5 rounded-full ${step >= s ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                ))}
              </div>
            </div>

            {step === 1 && (
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-700">1. معلومات الحملة</h4>
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-1.5">اسم الحملة <span className="text-red-500">*</span></label>
                  <input className="input" placeholder="مثال: حملة العيد الوطني" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-1.5">اختيار الجمهور</label>
                  <select className="input">
                    <option>جميع جهات الاتصال (6)</option>
                    <option>وسم: عميل</option>
                    <option>وسم: VIP</option>
                    <option>وسم: جديد</option>
                  </select>
                </div>
                <div className="bg-green-50 border border-green-100 rounded-xl p-3 text-sm text-green-700 flex items-center gap-2">
                  <Users className="w-4 h-4" /> الإجمالي المتوقع: <strong>6 مستقبلين</strong>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-700">2. القالب والرسالة</h4>
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-1.5">قالب WhatsApp <span className="text-red-500">*</span></label>
                  <select className="input">
                    <option value="">اختر قالباً...</option>
                    <option value="welcome">ترحيب_جديد</option>
                    <option value="offer">عرض_خاص</option>
                    <option value="order">تأكيد_طلب</option>
                  </select>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <p className="text-xs text-gray-500 mb-2">معاينة الرسالة:</p>
                  <p className="text-sm text-gray-800">أهلاً <span className="bg-amber-100 text-amber-700 px-1 rounded text-xs">{'{{1}}'}</span>! 👋 مرحباً بك في <span className="bg-amber-100 text-amber-700 px-1 rounded text-xs">{'{{2}}'}</span>.</p>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-700">3. وقت الإرسال</h4>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-3 border border-green-500 bg-green-50 rounded-xl cursor-pointer">
                    <input type="radio" name="time" defaultChecked className="accent-green-600" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">إرسال الآن</p>
                      <p className="text-xs text-gray-500">إرسال فوري لجميع المستقبلين</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl cursor-pointer hover:border-green-300">
                    <input type="radio" name="time" className="accent-green-600" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">جدولة لاحقاً</p>
                      <p className="text-xs text-gray-500">حدد وقت محدد للإرسال</p>
                    </div>
                  </label>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 mt-6">
              {step < 3 ? (
                <button onClick={() => setStep(s => s + 1)} className="btn-primary flex-1 justify-center">التالي</button>
              ) : (
                <button onClick={() => { setShowCreate(false); setShowConfirm(true); setStep(1); }} className="btn-primary flex-1 justify-center">
                  <Send className="w-4 h-4" /> تأكيد الإطلاق
                </button>
              )}
              {step > 1 && <button onClick={() => setStep(s => s - 1)} className="btn-secondary px-5">السابق</button>}
              <button onClick={() => { setShowCreate(false); setStep(1); }} className="btn-secondary px-5">إلغاء</button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Send className="w-7 h-7 text-green-600" />
            </div>
            <h3 className="font-bold text-gray-900 text-lg">تأكيد إطلاق الحملة</h3>
            <p className="text-sm text-gray-500 mt-2 mb-5">سيتم إرسال الرسالة إلى <strong className="text-gray-900">6 مستقبلين</strong>. هل أنت متأكد؟</p>
            <div className="flex items-center gap-3">
              <button onClick={() => setShowConfirm(false)} className="btn-primary flex-1 justify-center">نعم، أطلق</button>
              <button onClick={() => setShowConfirm(false)} className="btn-secondary flex-1 justify-center">إلغاء</button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  )
}
