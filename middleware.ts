import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    const { pathname } = request.nextUrl;

    // Paths accessible without auth
    const publicPaths = ['/login', '/api/auth/login', '/'];

    // Check if accessing public path
    if (publicPaths.some(path => pathname.startsWith(path))) {
        return NextResponse.next();
    }

    // Check auth for protected paths
    if (!token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
        const secret = new TextEncoder().encode(
            process.env.JWT_SECRET || 'fallback_secret_key_change_me'
        );
        await jwtVerify(token, secret);
        return NextResponse.next();
    } catch (err) {
        // Token invalid or expired
        console.error('Middleware auth error:', err);
        return NextResponse.redirect(new URL('/login', request.url));
    }
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder content if any
         */
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};
