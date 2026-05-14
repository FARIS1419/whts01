'use client'
import { useState } from 'react'
import AppLayout from '@/components/layout/AppLayout'
import { Search, Send, Paperclip, Smile, MoreVertical, Phone, Check, CheckCheck, Clock, AlertCircle, Tag, FileText } from 'lucide-react'

const conversations = [
  { id: 1, name: 'فهد الحربي', phone: '+966505555555', lastMsg: 'السلام عليكم، أريد الاستفسار', time: '12:30', unread: 3, status: 'open', avatar: 'ف' },
  { id: 2, name: 'أحمد محمد', phone: '+966501111111', lastMsg: 'شكراً جزيلاً، متى يصل الطلب؟', time: '10:15', unread: 1, status: 'open', avatar: 'أ' },
  { id: 3, name: 'نورة السالم', phone: '+966504444444', lastMsg: 'ممتاز، شكراً للمتابعة', time: '09:40', unread: 0, status: 'open', avatar: 'ن' },
  { id: 4, name: 'سارة العمري', phone: '+966502222222', lastMsg: 'حسناً، سأنتظر ردكم', time: 'أمس', unread: 0, status: 'pending', avatar: 'س' },
  { id: 5, name: 'خالد الزهراني', phone: '+966503333333', lastMsg: 'هل العرض لا يزال متاحاً؟', time: 'أمس', unread: 0, status: 'open', avatar: 'خ' },
  { id: 6, name: 'ريم القحطاني', phone: '+966506666666', lastMsg: 'شكراً على الخدمة الممتازة', time: '2 يوم', unread: 0, status: 'closed', avatar: 'ر' },
]

const chatMessages = [
  { id: 1, dir: 'out', text: 'أهلاً وسهلاً! 👋 كيف يمكنني مساعدتك؟', time: '12:00', status: 'read' },
  { id: 2, dir: 'in', text: 'السلام عليكم، أريد الاستفسار عن طلبي', time: '12:15', status: 'received' },
  { id: 3, dir: 'out', text: 'بالتأكيد، ما رقم طلبك؟', time: '12:18', status: 'read' },
  { id: 4, dir: 'in', text: 'الطلب رقم 98765', time: '12:20', status: 'received' },
  { id: 5, dir: 'out', text: 'طلبك قيد التجهيز ✅ سيتم الشحن غداً', time: '12:25', status: 'delivered' },
  { id: 6, dir: 'in', text: 'السلام عليكم، أريد الاستفسار', time: '12:30', status: 'received' },
]

const statusIcon = (s: string) => {
  if (s === 'read') return <CheckCheck className="w-3.5 h-3.5 text-blue-500" />
  if (s === 'delivered') return <CheckCheck className="w-3.5 h-3.5 text-gray-400" />
  if (s === 'sent') return <Check className="w-3.5 h-3.5 text-gray-400" />
  if (s === 'pending') return <Clock className="w-3.5 h-3.5 text-gray-300" />
  if (s === 'failed') return <AlertCircle className="w-3.5 h-3.5 text-red-500" />
  return null
}

const convStatusBadge = (s: string) => {
  if (s === 'open') return <span className="badge-green">مفتوح</span>
  if (s === 'closed') return <span className="badge-gray">مغلق</span>
  return <span className="badge-yellow">انتظار</span>
}

export default function InboxPage() {
  const [selected, setSelected] = useState(conversations[0])
  const [message, setMessage] = useState('')
  const [search, setSearch] = useState('')

  const filtered = conversations.filter(c =>
    c.name.includes(search) || c.phone.includes(search)
  )

  return (
    <AppLayout title="صندوق الوارد" subtitle="إدارة جميع محادثاتك">
      <div className="flex gap-0 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden" style={{ height: 'calc(100vh - 130px)' }}>
        
        {/* Conversations List */}
        <div className="w-80 flex-shrink-0 border-l border-gray-100 flex flex-col">
          <div className="p-4 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="بحث في المحادثات..."
                className="w-full pr-9 pl-3 py-2.5 bg-gray-50 rounded-xl text-sm border-0 outline-none focus:ring-2 focus:ring-green-500" />
            </div>
          </div>
          <div className="overflow-y-auto flex-1">
            {filtered.map((conv) => (
              <div key={conv.id}
                onClick={() => setSelected(conv)}
                className={`flex items-start gap-3 p-4 cursor-pointer hover:bg-gray-50 border-b border-gray-50 transition-colors ${selected.id === conv.id ? 'bg-green-50 border-r-4 border-r-green-500' : ''}`}>
                <div className="relative flex-shrink-0">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-teal-400 to-green-600 flex items-center justify-center text-white font-bold">
                    {conv.avatar}
                  </div>
                  {conv.unread > 0 && (
                    <span className="absolute -top-1 -left-1 w-5 h-5 bg-green-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                      {conv.unread}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className="text-sm font-semibold text-gray-800 truncate">{conv.name}</p>
                    <span className="text-xs text-gray-400 flex-shrink-0">{conv.time}</span>
                  </div>
                  <p className="text-xs text-gray-500 truncate">{conv.lastMsg}</p>
                  <div className="mt-1">{convStatusBadge(conv.status)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Window */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-green-600 flex items-center justify-center text-white font-bold">
                {selected.avatar}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{selected.name}</p>
                <p className="text-xs text-gray-400">{selected.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {convStatusBadge(selected.status)}
              <button className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center">
                <Phone className="w-4 h-4 text-gray-500" />
              </button>
              <button className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center">
                <Tag className="w-4 h-4 text-gray-500" />
              </button>
              <button className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center">
                <MoreVertical className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3" style={{ background: '#efeae2' }}>
            {chatMessages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.dir === 'out' ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-xs lg:max-w-md px-4 py-2.5 shadow-sm ${msg.dir === 'out' ? 'bubble-out' : 'bubble-in'}`}>
                  <p className="text-sm text-gray-800 leading-relaxed">{msg.text}</p>
                  <div className={`flex items-center gap-1 mt-1 ${msg.dir === 'out' ? 'justify-end' : 'justify-start'}`}>
                    <span className="text-xs text-gray-400">{msg.time}</span>
                    {msg.dir === 'out' && statusIcon(msg.status)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-100 bg-white">
            <div className="flex items-center gap-2">
              <button className="w-9 h-9 rounded-xl hover:bg-gray-100 flex items-center justify-center flex-shrink-0">
                <Paperclip className="w-4 h-4 text-gray-500" />
              </button>
              <button className="w-9 h-9 rounded-xl hover:bg-gray-100 flex items-center justify-center flex-shrink-0">
                <FileText className="w-4 h-4 text-gray-500" />
              </button>
              <div className="flex-1 relative">
                <input value={message} onChange={e => setMessage(e.target.value)}
                  placeholder="اكتب رسالتك..."
                  className="w-full px-4 py-2.5 bg-gray-50 rounded-xl text-sm border border-gray-200 outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  onKeyDown={e => e.key === 'Enter' && setMessage('')}
                />
              </div>
              <button className="w-9 h-9 rounded-xl hover:bg-gray-100 flex items-center justify-center flex-shrink-0">
                <Smile className="w-4 h-4 text-gray-500" />
              </button>
              <button onClick={() => setMessage('')}
                className="w-10 h-10 rounded-xl bg-green-500 hover:bg-green-600 flex items-center justify-center flex-shrink-0 transition-colors shadow-sm">
                <Send className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Contact Panel */}
        <div className="w-72 flex-shrink-0 border-r border-gray-100 overflow-y-auto p-4 space-y-4">
          <div className="text-center pt-2">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal-400 to-green-600 flex items-center justify-center text-white text-2xl font-bold mx-auto">
              {selected.avatar}
            </div>
            <p className="font-bold text-gray-900 mt-3">{selected.name}</p>
            <p className="text-sm text-gray-500">{selected.phone}</p>
            <div className="mt-2">{convStatusBadge(selected.status)}</div>
          </div>
          <div className="border-t border-gray-100 pt-4">
            <p className="text-xs font-semibold text-gray-500 mb-2 uppercase">الوسوم</p>
            <div className="flex flex-wrap gap-1.5">
              {['عميل', 'مهم', 'VIP'].map(tag => (
                <span key={tag} className="badge-green text-xs">{tag}</span>
              ))}
              <button className="badge bg-gray-100 text-gray-500 text-xs hover:bg-gray-200">+ إضافة</button>
            </div>
          </div>
          <div className="border-t border-gray-100 pt-4">
            <p className="text-xs font-semibold text-gray-500 mb-2 uppercase">ملاحظات</p>
            <textarea placeholder="أضف ملاحظة..." rows={3}
              className="w-full px-3 py-2 bg-gray-50 rounded-xl text-sm border border-gray-100 outline-none resize-none focus:ring-2 focus:ring-green-500" />
            <button className="mt-2 text-xs text-green-600 font-semibold hover:underline">حفظ الملاحظة</button>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
