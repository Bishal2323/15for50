import { Bell, Menu, Search, User, LogOut, Trash2, MessageCircle } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import type { UserRole } from "../../types/user"
import { useUserStore } from "@/store/userStore"
import { useNavigate } from "react-router-dom"
import { NotificationDropdown } from "@/components/notifications/NotificationDropdown"
import { ComposeMessageModal } from "@/components/messages/ComposeMessageModal"
import { useRealTimeNotifications } from "@/hooks/useRealTimeNotifications"
import { deleteMyAccount } from "@/lib/api"

interface HeaderProps {
  onMenuClick: () => void
  userRole: UserRole
  userName: string
}

export function Header({ onMenuClick, userRole, userName }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [notificationOpen, setNotificationOpen] = useState(false)
  const [composeOpen, setComposeOpen] = useState(false)
  const [composeRecipient, setComposeRecipient] = useState<'coach' | 'physio'>('coach')
  const [composeRecipientUserId, setComposeRecipientUserId] = useState<string | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const logout = useUserStore((s) => s.logout)
  const navigate = useNavigate()
  const { totalCount } = useRealTimeNotifications()

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!dropdownRef.current) return
      const target = e.target as Node
      if (!dropdownRef.current.contains(target)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [])

  const handleLogout = () => {
    logout()
    setMenuOpen(false)
    navigate('/login')
  }

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure you want to delete your account? This cannot be undone.')) return
    try {
      await deleteMyAccount()
      // Clear local session
      handleLogout()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete account')
    }
  }

  const handleContactCoach = () => {
    setComposeRecipient('coach')
    setComposeRecipientUserId(null)
    setComposeOpen(true)
    setMenuOpen(false)
  }

  const handleContactPhysio = () => {
    setComposeRecipient('physio')
    setComposeRecipientUserId(null)
    setComposeOpen(true)
    setMenuOpen(false)
  }

  const formatDisplayName = (name: string) => {
    if (!name) return ''
    if (name.includes('@')) {
      const base = name.split('@')[0].replace(/[._-]+/g, ' ')
      return base
        .split(' ')
        .filter(Boolean)
        .map(part => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ')
    }
    return name
  }

  const displayName = formatDisplayName(userName)
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'athlete': return 'bg-blue-100 text-blue-800'
      case 'coach': return 'bg-green-100 text-green-800'
      case 'physio': return 'bg-purple-100 text-purple-800'
      case 'admin': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Left section */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className="md:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">ACL</span>
            </div>
            <h1 className="text-xl font-semibold text-foreground">
              Risk Monitor
            </h1>
          </div>
        </div>

        {/* Center section - Search */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search athletes, reports, assessments..."
              className="pl-10 w-full"
            />
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <div className="relative">
            <Button 
              variant="ghost" 
              size="sm" 
              className="relative" 
              onClick={() => setNotificationOpen(!notificationOpen)}
            >
              <Bell className="h-5 w-5" />
              {totalCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                >
                  {totalCount > 99 ? '99+' : totalCount}
                </Badge>
              )}
            </Button>
            <NotificationDropdown 
              isOpen={notificationOpen} 
              onClose={() => setNotificationOpen(false)} 
              onReply={(userId: string) => {
                setComposeRecipientUserId(userId)
                setComposeOpen(true)
              }}
            />
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-3 relative" ref={dropdownRef}>
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-foreground">{displayName}</p>
              <Badge
                variant="secondary"
                className={`text-xs ${getRoleColor(userRole)}`}
              >
                {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
              </Badge>
            </div>

            <Avatar className="h-8 w-8 cursor-pointer" onClick={() => setMenuOpen((o) => !o)}>
              <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${userName}`} />
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>

            {menuOpen && (
              <div className="absolute right-0 top-10 w-56 rounded-md border bg-popover shadow-md py-1">
                {/* My Profile (athlete) */}
                {userRole === 'athlete' && (
                  <button
                    onClick={() => { setMenuOpen(false); navigate('/athlete/profile') }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted"
                  >
                    <User className="h-4 w-4" />
                    My Profile
                  </button>
                )}
                <button
                  onClick={handleContactCoach}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted"
                >
                  <MessageCircle className="h-4 w-4" />
                  Contact Coach
                </button>
                <button
                  onClick={handleContactPhysio}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted"
                >
                  <MessageCircle className="h-4 w-4" />
                  Contact Physiotherapist
                </button>
                <div className="my-1 border-t" />
                <button
                  onClick={handleDeleteAccount}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-muted"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Account
                </button>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
    <ComposeMessageModal 
      open={composeOpen} 
      onClose={() => { setComposeOpen(false); setComposeRecipientUserId(null); }} 
      recipient={composeRecipient} 
      recipientUserId={composeRecipientUserId || undefined}
      titleOverride={composeRecipientUserId ? 'Reply to Athlete' : undefined}
    />
    </>
  )
}
