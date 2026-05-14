'use client'
import { Bell, Search, Wifi, WifiOff, AlertCircle } from 'lucide-react'

interface TopbarProps {
  title: string
  subtitle?: string
  connectionStatus?: 'connected' | 'disconnected' | 'needs_setup'
  demoMode?: boolean
}

const statusConfig = {
  connected: { label: 'متصل', color: 'text-green-600', bg: 'bg-green-50', Icon: Wifi },
  disconnected: { label: 'غير متصل', color: 'text-red-500', bg: 'bg-red-50', Icon: WifiOff },
  needs_setup: { label: 'يحتاج إعداد', color: 'text-amber-500', bg: 'bg-amber-50', Icon: AlertCircle },
}

export default function Topbar({ title, subtitle, connectionStatus = 'needs_setup', demoMode = true }: TopbarProps) {
  const status = statusConfig[connectionStatus]
  const StatusIcon = status.Icon

  return (
    <header className="fixed top-0 left-0 z-30 bg-white border-b border-gray-100 flex items-center justify-between px-6"
      style={{ right: 'var(--sidebar-width)', height: 'var(--topbar-height)' }}>
      
      {/* Left: Title */}
      <div>
        <h1 className="font-bold text-gray-900 text-lg leading-tight">{title}</h1>
        {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        
        {/* Demo badge */}
        {demoMode && (
          <span className="bg-amber-100 text-amber-700 text-xs font-bold px-3 py-1.5 rounded-full border border-amber-200">
            🧪 وضع التجربة
          </span>
        )}

        {/* Connection status */}
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold ${status.bg} ${status.color}`}>
          <StatusIcon className="w-3.5 h-3.5" />
          <span>{status.label}</span>
        </div>

        {/* Search */}
        <button className="w-9 h-9 rounded-xl bg-gray-50 hover:bg-gray-100 flex items-center justify-center transition-colors">
          <Search className="w-4 h-4 text-gray-500" />
        </button>

        {/* Notifications */}
        <button className="relative w-9 h-9 rounded-xl bg-gray-50 hover:bg-gray-100 flex items-center justify-center transition-colors">
          <Bell className="w-4 h-4 text-gray-500" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Avatar */}
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-sm font-bold cursor-pointer">
          م
        </div>
      </div>
    </header>
  )
}
