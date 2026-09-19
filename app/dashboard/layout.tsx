import Sidebar from '@/components/Sidebar'
import PageTransition from '@/components/PageTransition'
import GlobalSearch from '@/components/GlobalSearch'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="lg:pl-64">
        {/* Top bar with global search (desktop) */}
        <div className="hidden lg:flex items-center h-14 px-8 border-b border-gray-100 bg-white/70 backdrop-blur sticky top-0 z-20">
          <GlobalSearch />
        </div>
        <div className="pt-16 lg:pt-0">
          <PageTransition>{children}</PageTransition>
        </div>
      </div>
    </div>
  )
}
