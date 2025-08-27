import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3004'

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const response = await fetch(`${BACKEND_URL}/api/projects/${params.id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })

        if (!response.ok) {
            throw new Error(`Backend responded with status: ${response.status}`)
        }

        const data = await response.json()
        return NextResponse.json(data)
    } catch (error) {
        console.error('Error fetching project:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch project' },
            { status: 500 }
        )
    }
}