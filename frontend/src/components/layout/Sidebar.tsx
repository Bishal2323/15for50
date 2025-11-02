import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { 
  BarChart3, 
  Calendar, 
  FileText, 
  Home, 
  Settings, 
  TrendingUp, 
  Users, 
  Activity,
  Shield,
  Database,
  AlertTriangle,
  Stethoscope,
  Target,
  Brain,
  Download,
  UserCheck,
  Bell
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import type { UserRole } from "../../types/user"

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  userRole: UserRole
}

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string
}

const navigationConfig = {
  athlete: [
    { title: "Dashboard", href: "/athlete", icon: Home },
    { title: "Daily Report", href: "/athlete/report", icon: FileText },
    { title: "Risk Trends", href: "/athlete/trends", icon: TrendingUp },
    { title: "Notifications", href: "/notifications", icon: Bell },
    { title: "Calendar", href: "/athlete/calendar", icon: Calendar },
    { title: "Settings", href: "/athlete/settings", icon: Settings },
  ],
  coach: [
    { title: "Dashboard", href: "/coach", icon: Home },
    { title: "Athletes", href: "/coach/athletes", icon: Users },
    { title: "Analytics", href: "/coach/analytics", icon: BarChart3 },
    { title: "Alerts", href: "/coach/alerts", icon: AlertTriangle, badge: "3" },
    { title: "Notifications", href: "/notifications", icon: Bell },
    { title: "Reports", href: "/coach/reports", icon: FileText },
    { title: "Settings", href: "/coach/settings", icon: Settings },
  ],
  physio: [
    { title: "Dashboard", href: "/physio", icon: Home },
    { title: "Patients", href: "/physio/patients", icon: Users },
    { title: "Assessments", href: "/physio/assessments", icon: Stethoscope },
    { title: "Strength Tests", href: "/physio/strength", icon: Target },
    { title: "Movement Analysis", href: "/physio/movement", icon: Brain },
    { title: "Notifications", href: "/notifications", icon: Bell },
    { title: "Reports", href: "/physio/reports", icon: FileText },
    { title: "Settings", href: "/physio/settings", icon: Settings },
  ],
  admin: [
    { title: "Dashboard", href: "/admin", icon: Home },
    { title: "User Management", href: "/admin/users", icon: UserCheck },
    { title: "System Analytics", href: "/admin/analytics", icon: BarChart3 },
    { title: "Data Export", href: "/admin/export", icon: Download },
    { title: "Security", href: "/admin/security", icon: Shield },
    { title: "Database", href: "/admin/database", icon: Database },
    { title: "Notifications", href: "/notifications", icon: Bell },
    { title: "Settings", href: "/admin/settings", icon: Settings },
  ],
}

export function Sidebar({ isOpen, onClose, userRole }: SidebarProps) {
  const location = useLocation()
  const navItems = navigationConfig[userRole] || []

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 md:hidden" 
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside className={cn(
        "fixed left-0 top-16 z-50 h-[calc(100vh-4rem)] w-64 transform border-r bg-background transition-transform duration-200 ease-in-out md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-full flex-col">
          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href
              const Icon = item.icon
              
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                    isActive 
                      ? "bg-accent text-accent-foreground" 
                      : "text-muted-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="flex-1">{item.title}</span>
                  {item.badge && (
                    <span className="ml-auto rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                      {item.badge}
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="border-t p-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Activity className="h-3 w-3" />
              <span>ACL Risk Monitor v1.0</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
