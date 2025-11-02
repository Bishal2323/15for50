import { AlertTriangle, CheckCircle, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

interface RiskIndicatorProps {
  score: number
  size?: 'sm' | 'md' | 'lg'
  showProgress?: boolean
  showIcon?: boolean
  className?: string
}

export function RiskIndicator({ 
  score, 
  size = 'md', 
  showProgress = false, 
  showIcon = true,
  className 
}: RiskIndicatorProps) {
  const getRiskLevel = (score: number) => {
    if (score <= 30) return 'safe'
    if (score <= 70) return 'monitor'
    return 'high'
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'safe': return 'text-safe'
      case 'monitor': return 'text-monitor'
      case 'high': return 'text-high'
      default: return 'text-muted-foreground'
    }
  }

  const getRiskBgColor = (level: string) => {
    switch (level) {
      case 'safe': return 'bg-safe/10 border-safe/20'
      case 'monitor': return 'bg-monitor/10 border-monitor/20'
      case 'high': return 'bg-high/10 border-high/20'
      default: return 'bg-muted'
    }
  }

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'safe': return CheckCircle
      case 'monitor': return AlertCircle
      case 'high': return AlertTriangle
      default: return AlertCircle
    }
  }

  const getRiskText = (level: string) => {
    switch (level) {
      case 'safe': return 'Safe'
      case 'monitor': return 'Monitor'
      case 'high': return 'High Risk'
      default: return 'Unknown'
    }
  }

  const level = getRiskLevel(score)
  const Icon = getRiskIcon(level)
  
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2'
  }

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  }

  return (
    <div className={cn("space-y-2", className)}>
      <div className={cn(
        "inline-flex items-center gap-2 rounded-full border font-medium",
        sizeClasses[size],
        getRiskBgColor(level),
        getRiskColor(level)
      )}>
        {showIcon && <Icon className={iconSizes[size]} />}
        <span>{getRiskText(level)}</span>
        <span className="font-bold">{score}%</span>
      </div>
      
      {showProgress && (
        <div className="space-y-1">
          <Progress 
            value={score} 
            className={cn(
              "h-2",
              level === 'safe' && "[&>div]:bg-safe",
              level === 'monitor' && "[&>div]:bg-monitor", 
              level === 'high' && "[&>div]:bg-high"
            )}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0%</span>
            <span>100%</span>
          </div>
        </div>
      )}
    </div>
  )
}