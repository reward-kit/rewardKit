import React from "react"
import { H2, Small } from "@rewardkit/packages/ui/components/typography"
import { cn } from "@rewardkit/lib/utils"

export const Dashboard = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return <div className="flex flex-col">{children}</div>
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
  return <div className={cn("relative w-full flex flex-col gap-1", className)}>{children}</div>
}

export const DashboardHeaderAction = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return <div className="absolute right-4 top-2">{children}</div>
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

export const DashboardContent = ({
  children,
  className
}: {
  children: React.ReactNode,
  className?: string,
}) => {
  return <div className={cn("w-full py-4 px-4", className)}>{children}</div>
}
