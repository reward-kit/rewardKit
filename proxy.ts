import { clerkMiddleware } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export default clerkMiddleware(async (auth) => {

    // Performance optimization only — NOT an auth guarantee.
    // Resource-level auth.protect() calls are what actually gate access.
    const { isAuthenticated } = await auth()
    if (!isAuthenticated) return NextResponse.next()


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