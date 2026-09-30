import { cn } from "@rewardkit/lib/utils";
import React from "react";

interface SpinnerProps extends React.SVGProps<SVGSVGElement> {
    color?: string;
    strokeWidth?: string;
}

export function Spinner({
    color,
    strokeWidth,
    className,
    style,
    ...props
}: SpinnerProps) {
    return (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            className={cn("text-accent", className)}
            style={{
                color: color ?? "var(--loading-accent)",
                ...style,
            }}
            {...props}
        >
            <style>
                {`
        .spinner_container {
            transform-origin: center;
            animation: spinner_rotate 2s linear infinite;
        }
        .spinner_arc {
            stroke-linecap: round;
            animation: spinner_dash 1.4s ease-in-out infinite;
        }
        @keyframes spinner_rotate {
            100% {
                transform: rotate(360deg);
            }
        }
        @keyframes spinner_dash {
            0% {
                stroke-dasharray: 1, 150;
                stroke-dashoffset: 0;
            }
            50% {
                stroke-dasharray: 48, 150;
                stroke-dashoffset: -10;
            }
            100% {
                stroke-dasharray: 1, 150;
                stroke-dashoffset: -53;
            }
        }
        `}
            </style>

            <g className="spinner_container">
                <circle
                    className="spinner_arc"
                    cx="12"
                    cy="12"
                    r="8.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={strokeWidth ?? "2"}
                />
            </g>
        </svg>
    );
}