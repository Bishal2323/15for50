import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date)
}

export function formatTime(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

export function getRiskLevel(score: number): 'safe' | 'monitor' | 'high' {
  if (score <= 30) return 'safe'
  if (score <= 70) return 'monitor'
  return 'high'
}

export function getRiskColor(level: 'safe' | 'monitor' | 'high'): string {
  switch (level) {
    case 'safe':
      return 'text-risk-safe'
    case 'monitor':
      return 'text-risk-monitor'
    case 'high':
      return 'text-risk-high'
    default:
      return 'text-gray-500'
  }
}

export function getRiskBgColor(level: 'safe' | 'monitor' | 'high'): string {
  switch (level) {
    case 'safe':
      return 'bg-green-50 border-green-200'
    case 'monitor':
      return 'bg-amber-50 border-amber-200'
    case 'high':
      return 'bg-red-50 border-red-200'
    default:
      return 'bg-gray-50 border-gray-200'
  }
}

export function getTrendIcon(trend: 'up' | 'down' | 'stable'): string {
  switch (trend) {
    case 'up':
      return '↗'
    case 'down':
      return '↘'
    case 'stable':
      return '→'
    default:
      return '→'
  }
}