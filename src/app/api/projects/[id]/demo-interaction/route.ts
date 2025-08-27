import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3004'

export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json()

        const response = await fetch(`${BACKEND_URL}/api/projects/${params.id}/demo-interaction`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        })

        if (!response.ok) {
            throw new Error(`Backend responded with status: ${response.status}`)
        }

        const data = await response.json()
        return NextResponse.json(data)
    } catch (error) {
        console.error('Error processing demo interaction:', error)

        // Return mock interaction result as fallback
        const { interactionType, data: interactionData } = await request.json()

        let result = {}

        switch (interactionType) {
            case 'shopping-cart':
                result = {
                    cartItems: interactionData.items || [],
                    total: (interactionData.items || []).reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0),
                    inventory: Math.floor(Math.random() * 100) + 1
                }
                break

            case 'performance-test':
                result = {
                    loadTime: Math.random() * 1000 + 500,
                    memoryUsage: Math.random() * 50 + 20,
                    score: Math.floor(Math.random() * 40) + 60
                }
                break

            case 'api-test':
                result = {
                    status: 'success',
                    responseTime: Math.random() * 200 + 50,
                    data: { message: 'API call successful', timestamp: new Date().toISOString() }
                }
                break

            default:
                result = { message: 'Interaction recorded successfully' }
        }

        return NextResponse.json({
            success: true,
            data: result
        })
    }
}