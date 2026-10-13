import { AppBootGate } from "@rewardkit/packages/features/app/app-boot-gate"
import type { ReactNode } from "react"

export default function Layout({ children }: { children: ReactNode }) {
    return <AppBootGate>{children}</AppBootGate>
}