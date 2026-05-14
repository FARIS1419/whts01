import {
  Send, Inbox, AlertCircle, Clock, Users, MessageSquare,
  TrendingUp, Zap
} from 'lucide-react'

const stats = [
  {
    label: 'إجمالي المرسلة',
    value: '1,247',
    change: '+12%',
    positive: true,
    icon: Send,
    color: '#25D366',
    bg: '#f0fdf4',
    iconBg: '#dcfce7',
  },
  {
    label: 'إجمالي المستقبلة',
    value: '892',
    change: '+8%',
    positive: true,
    icon: Inbox,
    color: '#3b82f6',
    bg: '#eff6ff',
    iconBg: '#dbeafe',
  },
  {
    label: 'الرسائل الفاشلة',
    value: '23',
    change: '-5%',
    positive: false,
    icon: AlertCircle,
    color: '#ef4444',
    bg: '#fef2f2',
    iconBg: '#fee2e2',
  },
  {
    label: 'قيد الانتظار',
    value: '8',
    change: '0%',
    positive: true,
    icon: Clock,
    color: '#f59e0b',
    bg: '#fffbeb',
    iconBg: '#fef3c7',
  },
  {
    label: 'جهات الاتصال',
    value: '5',
    change: '+3',
    positive: true,
    icon: Users,
    color: '#8b5cf6',
    bg: '#f5f3ff',
    iconBg: '#ede9fe',
  },
  {
    label: 'محادثات مفتوحة',
    value: '3',
    change: '+1',
    positive: true,
    icon: MessageSquare,
    color: '#06b6d4',
    bg: '#ecfeff',
    iconBg: '#cffafe',
  },
  {
    label: 'معدل الرد',
    value: '78.4%',
    change: '+2.1%',
    positive: true,
    icon: TrendingUp,
    color: '#25D366',
    bg: '#f0fdf4',
    iconBg: '#dcfce7',
  },
  {
    label: 'آخر 24 ساعة',
    value: '47',
    change: 'مرسلة اليوم',
    positive: true,
    icon: Zap,
    color: '#f59e0b',
    bg: '#fffbeb',
    iconBg: '#fef3c7',
  },
]

export default function DashboardStats() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <div
          key={i}
          className="stat-card bg-white rounded-2xl p-5 border border-gray-100 shadow-sm"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center"
              style={{ background: stat.iconBg }}>
              <stat.icon size={20} style={{ color: stat.color }} />
            </div>
            <span className="text-xs font-semibold px-2 py-1 rounded-full"
              style={{
                background: stat.positive ? '#f0fdf4' : '#fef2f2',
                color: stat.positive ? '#16a34a' : '#dc2626'
              }}>
              {stat.change}
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</p>
          <p className="text-sm text-gray-500">{stat.label}</p>
        </div>
      ))}
    </div>
  )
}
