"use client"

import { useCallback, useEffect } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

type Options<T extends string> = {
    /** Query param name. Default: "tab" */
    param?: string
    /** Default tab. Default: first value */
    defaultValue?: T
}

export function useUrlTab<T extends string>(values: readonly T[], options: Options<T> = {}) {
    const { param = 'tab' } = options
    const defaultValue = options.defaultValue ?? values[0]

    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const raw = searchParams.get(param)
    const activeTab = (values as readonly string[]).includes(raw ?? '') ? (raw as T) : defaultValue

    const setTab = useCallback(
        (value: string) => {
            const params = new URLSearchParams(searchParams.toString())
            params.set(param, value)
            router.replace(`${pathname}?${params.toString()}`, { scroll: false })
        },
        [router, pathname, searchParams, param]
    )

    // Missing or invalid param -> write the default into the URL
    useEffect(() => {
        if (raw !== activeTab) setTab(activeTab)
    }, [raw, activeTab, setTab])

    return [activeTab, setTab] as const
}