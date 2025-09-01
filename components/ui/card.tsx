import * as React from 'react'

export function Card({ className = '', children }: React.PropsWithChildren<{ className?: string }>) {
  return <div className={`rounded-xl border border-white/10 bg-white/5 ${className}`}>{children}</div>
}
export function CardHeader({ className = '', children }: React.PropsWithChildren<{ className?: string }>) {
  return <div className={`px-5 pt-4 ${className}`}>{children}</div>
}
export function CardTitle({ className = '', children }: React.PropsWithChildren<{ className?: string }>) {
  return <div className={`text-lg font-semibold ${className}`}>{children}</div>
}
export function CardContent({ className = '', children }: React.PropsWithChildren<{ className?: string }>) {
  return <div className={`px-5 pb-5 ${className}`}>{children}</div>
}
