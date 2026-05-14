'use client'
import AppLayout from '@/components/layout/AppLayout'
import { Send, MessageSquare, XCircle, Clock, Users, MessageCircle, TrendingUp, Activity, ArrowUp, ArrowDown } from 'lucide-react'
import { AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

const stats = [
  { label: 'إجمالي المرسلة', value: '12,847', change: '+12%', up: true, icon: Send, bg: 'bg-green-50', iconColor: 'text-green-600' },
  { label: 'إجمالي المستقبلة', value: '8,234', change: '+8%', up: true, icon: MessageSquare, bg: 'bg-blue-50', iconColor: 'text-blue-600' },
  { label: 'الرسائل الفاشلة', value: '142', change: '-3%', up: false, icon: XCircle, bg: 'bg-red-50', iconColor: 'text-red-500' },
  { label: 'قيد الانتظار', value: '38', change: '+2', up: false, icon: Clock, bg: 'bg-amber-50', iconColor: 'text-amber-500' },
  { label: 'جهات الاتصال', value: '3,421', change: '+45', up: true, icon: Users, bg: 'bg-purple-50', iconColor: 'text-purple-600' },
  { label: 'محادثات مفتوحة', value: '89', change: '+12', up: true, icon: MessageCircle, bg: 'bg-teal-50', iconColor: 'text-teal-600' },
  { label: 'معدل الرد', value: '87%', change: '+3%', up: true, icon: TrendingUp, bg: 'bg-indigo-50', iconColor: 'text-indigo-600' },
  { label: 'آخر 24 ساعة', value: '423', change: '+18%', up: true, icon: Activity, bg: 'bg-pink-50', iconColor: 'text-pink-600' },
]

const messagesByDay = [
  { day: 'السبت', sent: 420, received: 280 },
  { day: 'الأحد', sent: 380, received: 310 },
  { day: 'الاثنين', sent: 550, received: 420 },
  { day: 'الثلاثاء', sent: 490, received: 380 },
  { day: 'الأربعاء', sent: 620, received: 450 },
  { day: 'الخميس', sent: 580, received: 410 },
  { day: 'الجمعة', sent: 320, received: 240 },
]

const pieData = [
  { name: 'مرسلة', value: 12847, color: '#25D366' },
  { name: 'مستقبلة', value: 8234, color: '#128C7E' },
  { name: 'فاشلة', value: 142, color: '#ef4444' },
]

const topContacts = [
  { name: 'أحمد محمد', count: 234, avatar: 'أ' },
  { name: 'نورة السالم', count: 189, avatar: 'ن' },
  { name: 'فهد الحربي', count: 156, avatar: 'ف' },
  { name: 'سارة العمري', count: 134, avatar: 'س' },
]

const topTemplates = [
  { name: 'ترحيب_جديد', count: 1240, pct: 85 },
  { name: 'تأكيد_طلب', count: 987, pct: 68 },
  { name: 'عرض_خاص', count: 823, pct: 57 },
  { name: 'تذكير_موعد', count: 612, pct: 42 },
]

const recentMessages = [
  { contact: 'فهد الحربي', text: 'السلام عليكم، أريد الاستفسار', time: 'منذ 30 د' },
  { contact: 'نورة السالم', text: 'ممتاز، شكراً للمتابعة', time: 'منذ 3 س' },
  { contact: 'أحمد محمد', text: 'شكراً جزيلاً، متى يصل الطلب؟', time: 'منذ 30 د' },
]

export default function DashboardPage() {
  return (
    <AppLayout title="لوحة التحكم" subtitle="نظرة عامة على أداء المنصة">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="card hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${stat.iconColor}`} />
                </div>
                <span className={`text-xs font-semibold flex items-center gap-1 ${stat.up ? 'text-green-600' : 'text-red-500'}`}>
                  {stat.up ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                  {stat.change}
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">الرسائل حسب اليوم</h3>
            <span className="text-xs text-gray-400 bg-gray-50 px-3 py-1 rounded-full">آخر 7 أيام</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={messagesByDay} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gSent" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#25D366" stopOpacity={0.2}/><stop offset="95%" stopColor="#25D366" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="gRec" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#128C7E" stopOpacity={0.2}/><stop offset="95%" stopColor="#128C7E" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fontFamily: 'Cairo' }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ fontFamily: 'Cairo', fontSize: 12, borderRadius: 8 }} />
              <Legend wrapperStyle={{ fontFamily: 'Cairo', fontSize: 12 }} />
              <Area type="monotone" dataKey="sent" name="مرسلة" stroke="#25D366" strokeWidth={2} fill="url(#gSent)" />
              <Area type="monotone" dataKey="received" name="مستقبلة" stroke="#128C7E" strokeWidth={2} fill="url(#gRec)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="font-bold text-gray-900 mb-4">توزيع الرسائل</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ fontFamily: 'Cairo', fontSize: 12, borderRadius: 8 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {pieData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }}></span>
                  <span className="text-gray-600">{item.name}</span>
                </div>
                <span className="font-semibold text-gray-800">{item.value.toLocaleString('ar')}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="card">
          <h3 className="font-bold text-gray-900 mb-4">أكثر جهات الاتصال تفاعلاً</h3>
          <div className="space-y-3">
            {topContacts.map((c, i) => (
              <div key={c.name} className="flex items-center gap-3">
                <span className="text-xs text-gray-400 w-4">{i + 1}</span>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-sm font-bold">{c.avatar}</div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-700">{c.name}</p>
                  <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1">
                    <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${(c.count / 234) * 100}%` }}></div>
                  </div>
                </div>
                <span className="text-xs font-bold text-gray-600">{c.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="font-bold text-gray-900 mb-4">أكثر القوالب استخداماً</h3>
          <div className="space-y-4">
            {topTemplates.map((t) => (
              <div key={t.name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-700 font-medium">{t.name}</span>
                  <span className="text-xs font-bold text-gray-600">{t.count.toLocaleString('ar')}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-gradient-to-r from-green-500 to-teal-500 h-2 rounded-full" style={{ width: `${t.pct}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">آخر الرسائل</h3>
            <a href="/inbox" className="text-xs text-green-600 font-semibold hover:underline">عرض الكل</a>
          </div>
          <div className="space-y-3">
            {recentMessages.map((msg, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 cursor-pointer">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-400 to-green-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">{msg.contact[0]}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-gray-800">{msg.contact}</p>
                    <span className="text-xs text-gray-400">{msg.time}</span>
                  </div>
                  <p className="text-xs text-gray-500 truncate mt-0.5">{msg.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
