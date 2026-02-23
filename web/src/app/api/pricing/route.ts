import { NextRequest, NextResponse } from 'next/server'
import { withPermission, AuthenticatedRequest } from '@/lib/admin-middleware'
import { PERMISSIONS } from '@/app/api/auth/users/route'

// Временное хранилище настроек ценообразования (в проде - БД)
let pricingConfig = {
  frameMarkup: 0.3,
  productionMarkup: 0.5,
  minAreaM2: 0.5,
  installationFee: 1500,
  measurementFee: 800,
  materialBasePrice: 800,
  complexityFactor: 1.2
}

export async function GET() {
  try {
    return NextResponse.json(pricingConfig)
  } catch (error) {
    console.error('Pricing fetch error:', error)
    return NextResponse.json(
      { error: 'Ошибка при получении настроек ценообразования' },
      { status: 500 }
    )
  }
}

export const PUT = withPermission(PERMISSIONS.PRICING.EDIT)(
  async (req: AuthenticatedRequest) => {
    try {
      const newConfig = await req.json()
      
      // Валидация данных
      const requiredFields = ['frameMarkup', 'productionMarkup', 'installationFee', 'measurementFee']
      for (const field of requiredFields) {
        if (typeof newConfig[field] !== 'number' || newConfig[field] < 0) {
          return NextResponse.json(
            { error: `Invalid ${field} value` },
            { status: 400 }
          )
        }
      }

      // Обновление конфигурации
      pricingConfig = { ...pricingConfig, ...newConfig }
      
      console.log('Pricing config updated:', { 
        newConfig, 
        updatedBy: req.user?.id,
        userRole: req.user?.role 
      })

      return NextResponse.json({
        success: true,
        data: pricingConfig
      })

    } catch (error) {
      console.error('Pricing update error:', error)
      return NextResponse.json(
        { error: 'Ошибка при обновлении настроек ценообразования' },
        { status: 500 }
      )
    }
  }
)
