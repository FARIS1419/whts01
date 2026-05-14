'use client'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

interface AppLayoutProps {
  children: React.ReactNode
  title: string
  subtitle?: string
}

export default function AppLayout({ children, title, subtitle }: AppLayoutProps) {
  const demoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true' || true

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Topbar title={title} subtitle={subtitle} demoMode={demoMode} />
      <main style={{
        marginRight: 'var(--sidebar-width)',
        marginTop: 'var(--topbar-height)',
        minHeight: 'calc(100vh - var(--topbar-height))',
        padding: '24px',
      }}>
        <div className="fade-in">
          {children}
        </div>
      </main>
    </div>
  )
}
