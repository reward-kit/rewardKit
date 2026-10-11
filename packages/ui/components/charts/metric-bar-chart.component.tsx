"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts"

import { cn } from "@rewardkit/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@rewardkit/packages/ui/components/card"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@rewardkit/packages/ui/components/chart"

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

export type MetricSeries<TData extends object> = {
    /** Key in each data row that holds this metric's numeric value. Keep it alphanumeric (used as a CSS variable name). */
    key: Extract<keyof TData, string>
    /** Label shown in the tab and the tooltip. */
    label: string
    /** Bar color. Defaults to `var(--chart-N)` by series order. */
    color?: string
    /** Formats the tab total, the bar labels and the tooltip value. Defaults to `String`. */
    valueFormatter?: (value: number) => string
    /** Overrides the tab total. By default it is the sum of this metric across all rows. */
    total?: number
}

export type MetricBarChartProps<TData extends object> = Omit<
    React.ComponentProps<typeof Card>,
    "title" | "children"
> & {
    title: React.ReactNode
    description?: React.ReactNode
    data: TData[]
    /** Key used for the x axis (e.g. "month"). */
    xKey: Extract<keyof TData, string>
    series: MetricSeries<TData>[]

    /** Uncontrolled: initially selected metric. Defaults to the first series. */
    defaultSeriesKey?: string
    /** Controlled: selected metric. Pair with `onSeriesKeyChange`. */
    seriesKey?: string
    onSeriesKeyChange?: (key: string) => void

    /** Format x axis ticks, e.g. `(v) => v.slice(0, 3)`. */
    xTickFormatter?: (value: string) => string
    /** Format the tooltip heading, e.g. `(v) => `${v} 2026``. */
    tooltipLabelFormatter?: (value: string) => React.ReactNode
    showGrid?: boolean
    /** Value labels above each bar. Turn off for dense charts (12+ bars). */
    showValueLabels?: boolean
    barRadius?: number | [number, number, number, number]

    /** Extra props for the underlying ChartContainer (className, id, ...). */
    chartContainerProps?: Omit<React.ComponentProps<typeof ChartContainer>, "config" | "children">

    headerClassName?: string
    titleClassName?: string
    tabsClassName?: string
    tabClassName?: string
    contentClassName?: string
}

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export function MetricBarChart<TData extends object>({
    title,
    description,
    data,
    xKey,
    series,
    defaultSeriesKey,
    seriesKey,
    onSeriesKeyChange,
    xTickFormatter = (value) => String(value),
    tooltipLabelFormatter,
    showGrid = true,
    showValueLabels = true,
    barRadius = 4,
    chartContainerProps,
    headerClassName,
    titleClassName,
    tabsClassName,
    tabClassName,
    contentClassName,
    className,
    ...cardProps
}: MetricBarChartProps<TData>) {
    // controlled / uncontrolled selected metric
    const [internalKey, setInternalKey] = React.useState(defaultSeriesKey ?? series[0]?.key)
    const isControlled = seriesKey !== undefined
    const requestedKey = isControlled ? seriesKey : internalKey
    const active = series.find((s) => s.key === requestedKey) ?? series[0]

    const select = (key: string) => {
        if (!isControlled) setInternalKey(key)
        onSeriesKeyChange?.(key)
    }

    const config = React.useMemo(
        () =>
            series.reduce<ChartConfig>((acc, s, i) => {
                acc[s.key] = { label: s.label, color: s.color ?? `var(--chart-${(i % 5) + 1})` }
                return acc
            }, {}),
        [series],
    )

    const totals = React.useMemo(
        () =>
            Object.fromEntries(
                series.map((s) => [
                    s.key,
                    s.total ?? data.reduce((sum, row) => sum + (Number(row[s.key]) || 0), 0),
                ]),
            ) as Record<string, number>,
        [series, data],
    )

    if (!active) return null

    const format = (s: MetricSeries<TData>, value: number) =>
        (s.valueFormatter ?? String)(value)

    return (
        <Card className={cn("w-full gap-0 bg-transparent overflow-hidden py-0", className)} {...cardProps}>
            <CardHeader
                className={cn(
                    "flex flex-col items-stretch gap-0 border-b p-0 mb-0 pb-0! sm:flex-row",
                    headerClassName,
                )}
            >
                <div className={cn("flex flex-1 flex-col justify-center gap-1 px-6 py-4", titleClassName)}>
                    <CardTitle className="text-sm">{title}</CardTitle>
                    {description && (
                        <CardDescription className="text-xs text-muted-foreground">
                            {description}
                        </CardDescription>
                    )}
                </div>

                <div
                    role="tablist"
                    aria-label="Metrics"
                    className={cn("flex border-t sm:border-t-0", tabsClassName)}
                >
                    {series.map((s) => {
                        const isActive = s.key === active.key
                        return (
                            <button
                                key={s.key}
                                type="button"
                                role="tab"
                                aria-selected={isActive}
                                data-active={isActive}
                                onClick={() => select(s.key)}
                                className={cn(
                                    "flex flex-1 flex-col cursor-pointer justify-center gap-1 border-l px-6 py-3 text-left transition-colors",
                                    "first:border-l-0 sm:min-w-32 sm:flex-none sm:first:border-l",
                                    "hover:bg-muted/30 data-[active=true]:bg-muted/60",
                                    "focus-visible:ring-ring/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset",
                                    tabClassName,
                                )}
                            >
                                <span className="text-xs text-muted-foreground">{s.label}</span>
                                <span className="text-xl font-medium leading-none tabular-nums sm:text-2xl">
                                    {format(s, totals[s.key] ?? 0)}
                                </span>
                            </button>
                        )
                    })}
                </div>
            </CardHeader>

            <CardContent className={cn("px-2 py-6 sm:px-6", contentClassName)}>
                <ChartContainer
                    {...chartContainerProps}
                    config={config}
                    className={cn("aspect-auto h-64 w-full", chartContainerProps?.className)}
                >
                    <BarChart accessibilityLayer data={data} margin={{ top: 24, left: 12, right: 12 }}>
                        {showGrid && <CartesianGrid vertical={false} />}
                        <XAxis
                            dataKey={xKey}
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={xTickFormatter}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={
                                <ChartTooltipContent
                                    indicator="dot"
                                    className="min-w-40 gap-2.5"
                                    labelFormatter={
                                        tooltipLabelFormatter
                                            ? (value) => (
                                                <span className="text-xs font-medium">
                                                    {tooltipLabelFormatter(String(value))}
                                                </span>
                                            )
                                            : undefined
                                    }
                                    formatter={(value) => (
                                        <div className="flex w-full items-center justify-between gap-2">
                                            <div className="flex items-center gap-1.5">
                                                <div
                                                    className="h-2.5 w-2.5 shrink-0 rounded-xs"
                                                    style={{ background: `var(--color-${active.key})` }}
                                                />
                                                <span className="text-muted-foreground">{active.label}</span>
                                            </div>
                                            <span className="font-semibold text-foreground tabular-nums">
                                                {format(active, Number(value))}
                                            </span>
                                        </div>
                                    )}
                                />
                            }
                        />
                        <Bar
                            dataKey={active.key}
                            fill={`var(--color-${active.key})`}
                            radius={barRadius}
                        >
                            {showValueLabels && (
                                <LabelList
                                    position="top"
                                    offset={8}
                                    fontSize={12}
                                    className="fill-foreground"
                                    formatter={(value) => format(active, Number(value))}
                                />
                            )}
                        </Bar>
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}