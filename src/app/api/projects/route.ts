import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3004'

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const featured = searchParams.get('featured')

        let backendUrl = `${BACKEND_URL}/api/projects`
        if (featured) {
            backendUrl += `?featured=${featured}`
        }

        const response = await fetch(backendUrl, {
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
        console.error('Error fetching projects:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch projects' },
            { status: 500 }
        )
    }
}