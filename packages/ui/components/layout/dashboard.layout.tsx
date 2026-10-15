import React from "react"
import { H2, H3, Paragraph, Small } from "@rewardkit/packages/ui/components/typography"
import { cn } from "@rewardkit/lib/utils"
import { Image } from "../image"

export const Dashboard = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  return <div className={cn("relative min-h-[calc(100vh-50px)] max-w-5xl mx-auto flex flex-col", className)}>{children}</div>
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
  return <div className={cn("relative w-full flex flex-wrap flex-col p-3.5 py-3.25 gap-1", className)}>{children}</div>
}

export const DashboardHeaderAction = ({
  children,
  className
}: {
  children: React.ReactNode,
  className?: string,
}) => {
  return <div className={cn("sm:absolute right-4 top-4", className)}>{children}</div>
}

export const DashboardTitle = ({
  children,
  className
}: {
  children: React.ReactNode,
  className?: string,
}) => {
  return <H3 className={cn(className)}>{children}</H3>
}

export const DashboardDescription = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return <Small>{children}</Small>
}

export const DashboardContent = ({
  children,
  className,
  showFooter = false,
  isLoading = false,
  loadingSkeleton
}: {
  children: React.ReactNode,
  className?: string,
  showFooter?: boolean,
  isLoading?: boolean,
  loadingSkeleton?: React.ReactNode
}) => {
  return (
    <div className={cn("relative flex flex-1 flex-col py-2.5 px-3", className)}>
      {isLoading ? (
        <div className="flex-1 flex flex-col h-full w-full">
          {loadingSkeleton ?? (
            <div className="flex-1 flex flex-col items-center justify-center gap-3 max-w-[calc(100vw-24.15rem)] w-full max-h-[calc(100vh-6rem)]">
              <div className="relative overflow-hidden rounded-xl">
                <Image src="/svg/rewardKit_emblem.svg" className="w-12 grayscale brightness-120 opacity-35" alt="rewardkit" />
                <div className="absolute inset-0 -translate-x-full animate-shine bg-linear-to-r from-transparent via-white/40 to-transparent pointer-events-none" />
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-1 flex-col">
          {children}
        </div>
      )}

      {showFooter && (
        <div className="mt-auto w-full pt-6 pb-4 text-center">
          <Paragraph className="text-xs! text-muted-foreground">
            &copy; 2026, RewardKit LLP. All rights reserved
          </Paragraph>
        </div>
      )}
    </div>
  )
}