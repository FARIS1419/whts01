'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, MessageSquare, Users, Zap,
  Send, FileText, ClipboardList, Settings, ChevronLeft,
  MessageCircle
} from 'lucide-react'

const navItems = [
  { href: '/dashboard', label: 'لوحة التحكم', icon: LayoutDashboard },
  { href: '/inbox', label: 'صندوق الوارد', icon: MessageSquare, badge: 4 },
  { href: '/contacts', label: 'جهات الاتصال', icon: Users },
  { href: '/flows', label: 'الفلوز / الأتمتة', icon: Zap },
  { href: '/broadcast', label: 'إطلاق الرسائل', icon: Send },
  { href: '/templates', label: 'القوالب', icon: FileText },
  { href: '/logs', label: 'سجل الرسائل', icon: ClipboardList },
]

const settingsItems = [
  { href: '/settings', label: 'الإعدادات', icon: Settings },
  { href: '/settings/whatsapp', label: 'إعدادات WhatsApp API', icon: MessageCircle },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed right-0 top-0 h-full bg-white border-l border-gray-100 shadow-sm z-40"
      style={{ width: 'var(--sidebar-width)' }}>
      
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-gray-100">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #25D366, #128C7E)' }}>
          <MessageCircle className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="font-bold text-gray-900 text-sm leading-tight">WhatsApp CRM</p>
          <p className="text-xs text-gray-400">منصة الرسائل</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="p-3 space-y-1 overflow-y-auto" style={{ height: 'calc(100vh - 180px)' }}>
        <p className="text-xs font-semibold text-gray-400 px-4 pt-2 pb-1 uppercase tracking-wide">القائمة</p>
        
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link key={item.href} href={item.href}
              className={`nav-link ${isActive ? 'active' : ''}`}>
              <Icon className="icon" />
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className="bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {item.badge}
                </span>
              )}
              {isActive && <ChevronLeft className="w-4 h-4 opacity-50" />}
            </Link>
          )
        })}

        <p className="text-xs font-semibold text-gray-400 px-4 pt-4 pb-1 uppercase tracking-wide">الإعدادات</p>
        
        {settingsItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link key={item.href} href={item.href}
              className={`nav-link ${isActive ? 'active' : ''}`}>
              <Icon className="icon" />
              <span className="flex-1">{item.label}</span>
              {isActive && <ChevronLeft className="w-4 h-4 opacity-50" />}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100 bg-white">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-sm font-bold">
            م
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-700 truncate">المدير</p>
            <p className="text-xs text-gray-400 truncate">owner</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
