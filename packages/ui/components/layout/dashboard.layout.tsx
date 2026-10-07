import React from "react"
import { H2, Paragraph, Small } from "@rewardkit/packages/ui/components/typography"
import { cn } from "@rewardkit/lib/utils"

export const Dashboard = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  // min-h-screen instead of h-screen so the page can grow past the viewport
  return <div className={cn("relative min-h-[calc(100vh-50px)] flex flex-col", className)}>{children}</div>
}

export const DashboardTopContainer = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return <div className="relative w-full flex flex-col gap-0.75">{children}</div>
}

export const DashboardHeader = ({
  children,
  className
}: {
  children: React.ReactNode,
  className?: string,
}) => {
  return <div className={cn("relative w-full flex flex-col p-4 pt-6 gap-1", className)}>{children}</div>
}

export const DashboardHeaderAction = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return <div className="absolute right-4 top-4">{children}</div>
}

export const DashboardTitle = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return <H2>{children}</H2>
}

export const DashboardDescription = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return <Small>{children}</Small>
}

export const DashboardContent = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  return (
    <div className={cn("w-full relative flex flex-1 flex-col py-2 px-4", className)}>
      {children}

      {/* mt-auto pushes it to the bottom when content is short; in flow, so it never overlaps */}
      <div className="mt-auto w-full pt-6 pb-4 text-center">
        <Paragraph className="text-xs! text-muted-foreground">
          &copy; 2026, RewardKit LLP. All rights reserved
        </Paragraph>
      </div>
    </div>
  )
}
