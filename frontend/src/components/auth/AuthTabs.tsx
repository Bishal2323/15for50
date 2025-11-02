import { Link, useLocation } from "react-router-dom"

interface AuthTabsProps {
  active?: 'login' | 'signup'
}

export function AuthTabs(props: AuthTabsProps) {
  const location = useLocation()
  const path = location.pathname
  const active = props.active || (path.includes('/signup') ? 'signup' : 'login')

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="grid grid-cols-2 bg-secondary rounded-md p-1">
        <Link
          to="/login"
          className={`text-center py-2 text-sm rounded-md transition-colors ${active === 'login' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
        >
          Login
        </Link>
        <Link
          to="/signup"
          className={`text-center py-2 text-sm rounded-md transition-colors ${active === 'signup' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
        >
          Signup
        </Link>
      </div>
    </div>
  )
}