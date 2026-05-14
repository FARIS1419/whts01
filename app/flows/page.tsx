'use client'
import { useState } from 'react'
import AppLayout from '@/components/layout/AppLayout'
import { Plus, Zap, Play, Pause, Edit, Trash2, MessageSquare, Tag, UserCheck, Clock } from 'lucide-react'

const flows = [
  { id: 1, name: 'رد تلقائي على مرحبا', status: 'active', trigger: 'keyword', triggerLabel: 'كلمة مفتاحية: مرحبا, هلا', actionsCount: 1, runsCount: 234 },
  { id: 2, name: 'رسالة ترحيب للعملاء الجدد', status: 'active', trigger: 'new_contact', triggerLabel: 'عند إضافة جهة اتصال جديدة', actionsCount: 2, runsCount: 89 },
  { id: 3, name: 'متابعة عدم الرد', status: 'inactive', trigger: 'no_reply', triggerLabel: 'عند عدم الرد لمدة 24 ساعة', actionsCount: 1, runsCount: 12 },
]

const triggerIcons: Record<string, React.ReactNode> = {
  keyword: <MessageSquare className="w-4 h-4" />,
  new_contact: <UserCheck className="w-4 h-4" />,
  tag_change: <Tag className="w-4 h-4" />,
  no_reply: <Clock className="w-4 h-4" />,
}

export default function FlowsPage() {
  const [showCreate, setShowCreate] = useState(false)
  const [newFlow, setNewFlow] = useState({ name: '', trigger: 'keyword', keyword: '', action: 'send_text', content: '' })

  return (
    <AppLayout title="الفلوز / الأتمتة" subtitle="أتمتة ردودك ومتابعاتك">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 p-1 bg-white rounded-xl border border-gray-100">
          <span className="px-3 py-1.5 bg-green-500 text-white text-xs font-semibold rounded-lg">الكل ({flows.length})</span>
          <span className="px-3 py-1.5 text-gray-500 text-xs font-semibold">نشط ({flows.filter(f => f.status === 'active').length})</span>
          <span className="px-3 py-1.5 text-gray-500 text-xs font-semibold">متوقف ({flows.filter(f => f.status === 'inactive').length})</span>
        </div>
        <button onClick={() => setShowCreate(true)} className="btn-primary">
          <Plus className="w-4 h-4" /> فلو جديد
        </button>
      </div>

      {flows.length === 0 ? (
        <div className="card text-center py-16">
          <Zap className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="text-gray-500 font-medium">لا توجد فلوز بعد</p>
          <p className="text-xs text-gray-400 mt-1">أنشئ فلو لأتمتة ردودك</p>
        </div>
      ) : (
        <div className="space-y-4">
          {flows.map((flow) => (
            <div key={flow.id} className="card hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${flow.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-gray-900">{flow.name}</h3>
                      <span className={`badge text-xs ${flow.status === 'active' ? 'badge-green' : 'badge-gray'}`}>
                        {flow.status === 'active' ? '🟢 نشط' : '⭕ متوقف'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1.5 text-xs text-gray-500">
                      <span className="flex items-center gap-1 bg-gray-50 px-2.5 py-1 rounded-lg">
                        {triggerIcons[flow.trigger]}
                        <span>{flow.triggerLabel}</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                      <span>{flow.actionsCount} إجراء</span>
                      <span>·</span>
                      <span>تشغيل {flow.runsCount} مرة</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    flow.status === 'active'
                      ? 'bg-amber-50 text-amber-600 hover:bg-amber-100'
                      : 'bg-green-50 text-green-600 hover:bg-green-100'}`}>
                    {flow.status === 'active' ? <><Pause className="w-3.5 h-3.5" /> إيقاف</> : <><Play className="w-3.5 h-3.5" /> تشغيل</>}
                  </button>
                  <button className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center">
                    <Edit className="w-4 h-4 text-gray-500" />
                  </button>
                  <button className="w-8 h-8 rounded-lg hover:bg-red-50 flex items-center justify-center">
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">
            <h3 className="font-bold text-gray-900 text-lg mb-5">إنشاء فلو جديد</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1.5">اسم الفلو</label>
                <input value={newFlow.name} onChange={e => setNewFlow(p => ({...p, name: e.target.value}))}
                  className="input" placeholder="مثال: رد تلقائي على الاستفسارات" />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1.5">المشغّل (Trigger)</label>
                <select value={newFlow.trigger} onChange={e => setNewFlow(p => ({...p, trigger: e.target.value}))} className="input">
                  <option value="keyword">عند وصول رسالة تحتوي على كلمة</option>
                  <option value="new_contact">عند إضافة جهة اتصال جديدة</option>
                  <option value="tag_change">عند تغيّر الوسم</option>
                  <option value="no_reply">عند عدم الرد لمدة معينة</option>
                </select>
              </div>
              {newFlow.trigger === 'keyword' && (
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-1.5">الكلمات المفتاحية</label>
                  <input value={newFlow.keyword} onChange={e => setNewFlow(p => ({...p, keyword: e.target.value}))}
                    className="input" placeholder="مثال: مرحبا, هلا, السلام عليكم" />
                </div>
              )}
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1.5">الإجراء</label>
                <select value={newFlow.action} onChange={e => setNewFlow(p => ({...p, action: e.target.value}))} className="input">
                  <option value="send_text">إرسال رسالة نصية</option>
                  <option value="send_template">إرسال قالب</option>
                  <option value="add_tag">إضافة وسم</option>
                  <option value="assign_agent">تحويل لموظف</option>
                  <option value="wait">انتظار مدة</option>
                </select>
              </div>
              {newFlow.action === 'send_text' && (
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-1.5">نص الرسالة</label>
                  <textarea value={newFlow.content} onChange={e => setNewFlow(p => ({...p, content: e.target.value}))}
                    className="input resize-none" rows={3} placeholder="أكتب الرد التلقائي هنا..." />
                </div>
              )}
            </div>
            <div className="flex items-center gap-3 mt-6">
              <button className="btn-primary flex-1 justify-center">حفظ الفلو</button>
              <button onClick={() => setShowCreate(false)} className="btn-secondary flex-1 justify-center">إلغاء</button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  )
}
