import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-middleware';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const authError = requireAdmin(request);
    if (authError) return authError;

    try {
        const response = await fetch(`${API_BASE_URL}/api/blog/posts/${params.id}/edit`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json(errorData, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching blog post for edit:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch blog post for editing' },
            { status: 500 }
        );
    }
}