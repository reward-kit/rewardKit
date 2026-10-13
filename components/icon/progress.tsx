import React from "react"

type FillCircleIconProps = {
    /** 0 = empty, 1 = full. Fills from the bottom. */
    fill?: number
    size?: number
    className?: string
}

export const FillCircleIcon = ({ fill = 0, size = 18, className }: FillCircleIconProps) => {
    const id = React.useId()
    const f = Math.min(1, Math.max(0, fill))
    const innerTop = 4
    const innerHeight = 8 // inner circle diameter (r = 4, centered at 8,8)

    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
            className={className}
        >
            <circle cx="8" cy="8" r="6.25" stroke="currentColor" strokeWidth="1.5" />
            {f > 0 && (
                <>
                    <clipPath id={id}>
                        <circle cx="8" cy="8" r="4" />
                    </clipPath>
                    <rect
                        x="4"
                        y={innerTop + innerHeight * (1 - f)}
                        width="8"
                        height={innerHeight * f}
                        fill="currentColor"
                        clipPath={`url(#${id})`}
                    />
                </>
            )}
        </svg>
    )
}