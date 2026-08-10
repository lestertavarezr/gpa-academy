import Sidebar from '@/components/layout/Sidebar'
import Toasts from '@/components/ui/Toast'
import { StoreProvider } from '@/lib/store'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <StoreProvider>
      <div className="flex h-screen bg-os-bg bg-grid overflow-hidden">
        <Sidebar />
        <main className="flex-1 ml-60 overflow-y-auto">
          {children}
        </main>
        <Toasts />
      </div>
    </StoreProvider>
  )
}
