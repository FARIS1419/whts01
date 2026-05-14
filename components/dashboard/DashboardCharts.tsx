'use client'

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, BarChart, Bar
} from 'recharts'
import { demoChartData, demoTemplateUsage } from '@/lib/demo/data'

const dayLabels: Record<string, string> = {
  '2025-05-07': 'الأربعاء',
  '2025-05-08': 'الخميس',
  '2025-05-09': 'الجمعة',
  '2025-05-10': 'السبت',
  '2025-05-11': 'الأحد',
  '2025-05-12': 'الاثنين',
  '2025-05-13': 'الثلاثاء',
}

const pieData = [
  { name: 'مرسلة', value: 1247, color: '#25D366' },
  { name: 'مستقبلة', value: 892, color: '#3b82f6' },
  { name: 'فاشلة', value: 23, color: '#ef4444' },
]

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-100 rounded-xl shadow-lg p-3 text-sm" dir="rtl">
        <p className="font-semibold text-gray-700 mb-2">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ color: p.color }} className="font-medium">
            {p.name}: {p.value}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export default function DashboardCharts() {
  const chartData = demoChartData.map(d => ({
    ...d,
    day: dayLabels[d.date] || d.date
  }))

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Area Chart - Messages per day */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm lg:col-span-2">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-bold text-gray-800">الرسائل خلال الأسبوع</h3>
            <p className="text-sm text-gray-400 mt-0.5">آخر 7 أيام</p>
          </div>
          <div className="flex gap-4 text-xs">
            <span className="flex items-center gap-1.5"><span className="w-3 h-1.5 rounded-full inline-block" style={{ background: '#25D366' }} />مرسلة</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-1.5 rounded-full inline-block" style={{ background: '#3b82f6' }} />مستقبلة</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-1.5 rounded-full inline-block" style={{ background: '#ef4444' }} />فاشلة</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorSent" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#25D366" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#25D366" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorReceived" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="day" tick={{ fontSize: 12, fontFamily: 'Cairo', fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fontFamily: 'Cairo', fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="sent" name="مرسلة" stroke="#25D366" strokeWidth={2.5} fill="url(#colorSent)" dot={{ fill: '#25D366', r: 4 }} />
            <Area type="monotone" dataKey="received" name="مستقبلة" stroke="#3b82f6" strokeWidth={2.5} fill="url(#colorReceived)" dot={{ fill: '#3b82f6', r: 4 }} />
            <Area type="monotone" dataKey="failed" name="فاشلة" stroke="#ef4444" strokeWidth={2} fill="none" dot={{ fill: '#ef4444', r: 3 }} strokeDasharray="4 4" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Pie Chart */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <div className="mb-6">
          <h3 className="font-bold text-gray-800">توزيع الرسائل</h3>
          <p className="text-sm text-gray-400 mt-0.5">نسبة المرسلة / المستقبلة / الفاشلة</p>
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
              {pieData.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number, name: string) => [value.toLocaleString('ar-SA'), name]} />
          </PieChart>
        </ResponsiveContainer>
        <div className="space-y-2 mt-2">
          {pieData.map((item, i) => (
            <div key={i} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ background: item.color }} />
                <span className="text-gray-600">{item.name}</span>
              </div>
              <span className="font-semibold text-gray-800">{item.value.toLocaleString('ar-SA')}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Template Usage Bar Chart */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm lg:col-span-2">
        <div className="mb-6">
          <h3 className="font-bold text-gray-800">أكثر القوالب استخداماً</h3>
          <p className="text-sm text-gray-400 mt-0.5">عدد مرات الإرسال لكل قالب</p>
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={demoTemplateUsage} layout="vertical" barCategoryGap="30%">
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 12, fontFamily: 'Cairo', fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis dataKey="name" type="category" width={160} tick={{ fontSize: 11, fontFamily: 'Cairo', fill: '#64748b' }} axisLine={false} tickLine={false} />
            <Tooltip />
            <Bar dataKey="usage" name="الاستخدام" fill="#25D366" radius={[0, 6, 6, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Quick Stats */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <h3 className="font-bold text-gray-800 mb-4">إحصائيات سريعة</h3>
        <div className="space-y-4">
          {[
            { label: 'معدل التسليم', value: 96.5, color: '#25D366' },
            { label: 'معدل القراءة', value: 78.4, color: '#3b82f6' },
            { label: 'معدل الرد', value: 42.1, color: '#8b5cf6' },
          ].map((item, i) => (
            <div key={i}>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-gray-600">{item.label}</span>
                <span className="font-bold" style={{ color: item.color }}>{item.value}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{ width: `${item.value}%`, background: item.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
