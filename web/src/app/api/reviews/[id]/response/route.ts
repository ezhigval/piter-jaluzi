import { NextRequest, NextResponse } from 'next/server'

// PUT - обновить ответ компании на отзыв
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { response: companyResponse } = await request.json()
    
    const backendResponse = await fetch(`${process.env.API_BASE_URL}/api/reviews/${id}/response`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ response: companyResponse })
    })
    
    if (!backendResponse.ok) {
      throw new Error('Failed to update review response')
    }
    
    const updatedReview = await backendResponse.json()
    return NextResponse.json(updatedReview)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update review response' },
      { status: 500 }
    )
  }
}
