"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { SidebarMenuButton } from "@rewardkit/packages/ui/components/sidebar";

export function ThemeToggle() {
    const { resolvedTheme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    if (!mounted) return <div className="size-8" />;

    return (
        <SidebarMenuButton
            type="button"
            aria-label="Toggle theme"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
        >
            {resolvedTheme === "dark" ? "☀️" : "🌙"}
        </SidebarMenuButton>
    );
}