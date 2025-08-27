import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:30001';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const queryString = searchParams.toString();

        const response = await fetch(`${BACKEND_URL}/api/blog/posts?${queryString}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Backend responded with status: ${response.status}`);
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Blog posts API error:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch blog posts'
            },
            { status: 500 }
        );
    }
}