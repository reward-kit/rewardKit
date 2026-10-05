import * as React from "react"
import { cn } from "@rewardkit/lib/utils"

const headingStyle = 'font-stack'

export function H1({ children, className }: { children?: React.ReactNode, className?: string }) {
  return (
    <h1 className={cn(headingStyle, "scroll-m-20 text-balance text-2xl tracking-tighter font-semibold", className)}>
      {children}
    </h1>
  )
}

export function H2({ children, className }: { children?: React.ReactNode, className?: string }) {
  return (
    <h2 className={cn(headingStyle, "text-[1.55rem] font-semibold tracking-tight leading-9 text-balance", className)}>
      {children}
    </h2>
  )
}

export function H3({ children, className }: { children?: React.ReactNode, className?: string }) {
  return (
    <h3 className={cn(headingStyle, "scroll-m-20 font-stack text-xl font-medium tracking-tight", className)}>
      {children}
    </h3>
  )
}

export function H4({ children, className }: { children?: React.ReactNode, className?: string }) {
  return (
    <h4 className={cn(headingStyle, "scroll-m-20 text-base font-medium tracking-tight", className)}>
      {children}
    </h4>
  )
}

export function H5({ children, className }: { children?: React.ReactNode, className?: string }) {
  return (
    <h5 className={cn(headingStyle, 'scroll-m-20 font-medium tracking-tight', className)}>
      {children}
    </h5>
  )
}

export function Paragraph({ children, className }: { children?: React.ReactNode, className?: string }) {
  return (
    <p className={cn("text-foreground font-medium tracking-tight", className)}>
      {children}
    </p>
  )
}

export function Small({ children, title, className }: { children?: React.ReactNode, title?: string, className?: string }) {
  return (
    <p className={cn("text-sm font-medium tracking-tight text-muted-foreground ", className)} title={title}>
      {children}
    </p>
  )
}

export const ExtraSmall = ({ children, className }: { children?: React.ReactNode, className?: string }) => {
  return (
    <p className={cn("text-xs", className)}>{children}</p>
  )
}

export function Lead({ children, className }: { children?: React.ReactNode, className?: string }) {
  return (
    <p className={cn("text-muted-foreground tracking-tight  text-base/8!", className)}>
      {children}
    </p>
  )
}

