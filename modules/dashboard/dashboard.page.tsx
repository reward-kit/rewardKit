"use client"

import { usePrograms } from '@rewardkit/packages/features/program/hooks/useProgram'
import React from 'react'

export const DashboardPage = () => {
    const { programs } = usePrograms()
    return (
        <div>DashboardPage</div>
    )
}
