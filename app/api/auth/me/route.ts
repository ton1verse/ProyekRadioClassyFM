import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
import prisma from '@/lib/db';

export async function GET(request: NextRequest) {
    try {
        const token = request.cookies.get('token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        const secret = new TextEncoder().encode(
            process.env.JWT_SECRET || 'fallback_secret_key_change_me'
        );

        const { payload } = await jwtVerify(token, secret);
        const userId = payload.userId as string;

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                nama: true,
                username: true,
                foto: true
            }
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error('Auth check error:', error);
        return NextResponse.json({ error: 'Authentication failed' }, { status: 401 });
    }
}
