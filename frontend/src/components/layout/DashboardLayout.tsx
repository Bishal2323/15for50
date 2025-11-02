import { useState } from "react"
import { Header } from "./Header"
import { Sidebar } from "./Sidebar"
import type { UserRole } from "../../types/user"

interface DashboardLayoutProps {
  children: React.ReactNode
  userRole: UserRole
  userName: string
}

export function DashboardLayout({ children, userRole, userName }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleMenuClick = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const handleSidebarClose = () => {
    setSidebarOpen(false)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header 
        onMenuClick={handleMenuClick}
        userRole={userRole}
        userName={userName}
      />
      
      <div className="flex">
        <Sidebar 
          isOpen={sidebarOpen}
          onClose={handleSidebarClose}
          userRole={userRole}
        />
        
        <main className="flex-1 md:ml-64">
          <div className="container mx-auto p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}