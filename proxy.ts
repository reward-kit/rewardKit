import { clerkMiddleware } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const PUBLIC_OR_RESERVED = new Set([
    'blog', 'docs', 'sitemap.xml', 'robots.txt', 'videos', 'tools',
    'terms', 'privacy', 'contact', 'login', 'signup', 'pricing',
    'onboarding', 'api', 'trpc', 'companies',
])

export default clerkMiddleware(async (auth, req) => {
    const { pathname, search } = req.nextUrl
    const segments = pathname.split('/').filter(Boolean)
    const [first, second] = segments

    if (!first || PUBLIC_OR_RESERVED.has(first) && first !== 'w') {
        return NextResponse.next()
    }

    // Performance optimization only — NOT an auth guarantee.
    // Resource-level auth.protect() calls are what actually gate access.
    const { isAuthenticated, orgSlug } = await auth()
    if (!isAuthenticated) return NextResponse.next()

    if (first === 'w') {
        // Already org-scoped — check the slug matches the active org
        if (orgSlug && second && second !== orgSlug) {
            const rest = segments.slice(2).join('/')
            return NextResponse.redirect(
                new URL(`/w/${orgSlug}${rest ? `/${rest}` : ''}${search}`, req.url)
            )
        }
        return NextResponse.next()
    }

    // Unprefixed path (e.g. /dashboard) — route it into the org scope
    if (orgSlug) {
        return NextResponse.redirect(new URL(`/w/${orgSlug}${pathname}${search}`, req.url))
    }

    return NextResponse.next()
})
export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for Clerk's auto-proxy path
        '/__clerk/:path*',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
};