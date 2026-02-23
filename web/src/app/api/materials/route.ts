import { NextRequest, NextResponse } from 'next/server'
import { getMaterialsStore } from '@/lib/materials-store'

// GET - получить все материалы
export async function GET() {
  try {
    const store = getMaterialsStore()
    if (Array.isArray(store) && store.length > 0) {
      return NextResponse.json(store)
    }

    if (process.env.API_BASE_URL) {
      const response = await fetch(`${process.env.API_BASE_URL}/api/catalog`)
      const materials = await response.json()
      return NextResponse.json(materials)
    }

    return NextResponse.json([])
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch materials' },
      { status: 500 }
    )
  }
}

// POST - добавить новый материал
export async function POST(request: NextRequest) {
  try {
    const material = await request.json()
    
    const response = await fetch(`${process.env.API_BASE_URL}/api/materials`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(material)
    })
    
    if (!response.ok) {
      throw new Error('Failed to create material')
    }
    
    const newMaterial = await response.json()
    return NextResponse.json(newMaterial)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create material' },
      { status: 500 }
    )
  }
}
