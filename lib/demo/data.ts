import { DEMO_ORG_ID, DEMO_WA_ACCOUNT_ID } from '@/types'

export const isDemoMode = (): boolean => {
  return process.env.DEMO_MODE === 'true' || process.env.NEXT_PUBLIC_DEMO_MODE === 'true'
}

export const demoStats = {
  totalSent: 1247,
  totalReceived: 892,
  totalFailed: 23,
  totalPending: 8,
  totalContacts: 5,
  openConversations: 3,
  replyRate: 78.4,
  last24h: { sent: 47, received: 31 }
}

export const demoChartData = [
  { date: '2025-05-07', sent: 45, received: 32, failed: 2 },
  { date: '2025-05-08', sent: 62, received: 41, failed: 1 },
  { date: '2025-05-09', sent: 38, received: 28, failed: 3 },
  { date: '2025-05-10', sent: 71, received: 55, failed: 0 },
  { date: '2025-05-11', sent: 84, received: 63, failed: 4 },
  { date: '2025-05-12', sent: 56, received: 47, failed: 1 },
  { date: '2025-05-13', sent: 47, received: 31, failed: 2 },
]

export const demoTopContacts = [
  { name: 'أحمد محمد السعيد', messages: 34, phone: '966501234567' },
  { name: 'نورة سالم العتيبي', messages: 28, phone: '966504567890' },
  { name: 'فاطمة علي الزهراني', messages: 22, phone: '966502345678' },
  { name: 'محمد عبدالله القحطاني', messages: 18, phone: '966503456789' },
  { name: 'خالد يوسف الغامدي', messages: 15, phone: '966505678901' },
]

export const demoTemplateUsage = [
  { name: 'ترحيب بالعملاء الجدد', usage: 145 },
  { name: 'عرض خاص', usage: 98 },
  { name: 'تذكير بالموعد', usage: 67 },
  { name: 'تأكيد الطلب', usage: 43 },
]
