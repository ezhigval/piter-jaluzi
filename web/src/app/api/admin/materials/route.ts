import { NextRequest, NextResponse } from 'next/server'
import { withPermission, AuthenticatedRequest } from '@/lib/admin-middleware'
import { PERMISSIONS } from '@/app/api/auth/users/route'
import { getMaterialsStore } from '@/lib/materials-store'

// Реалистичные данные материалов берутся из общего in-memory хранилища

// Защищенный эндпоинт для получения материалов
export const GET = withPermission(PERMISSIONS.MATERIALS.READ)(
  async (req: AuthenticatedRequest) => {
    try {
      const materialsData = getMaterialsStore()
      console.log('Materials fetched by:', { 
        userId: req.user?.id, 
        role: req.user?.role,
        permissions: req.user?.permissions 
      })

      return NextResponse.json({
        success: true,
        data: materialsData,
        total: materialsData.length,
        user: req.user
      })

    } catch (error) {
      console.error('Materials fetch error:', error)
      return NextResponse.json(
        { error: 'Ошибка при получении материалов' },
        { status: 500 }
      )
    }
  }
)

// Защищенный эндпоинт для добавления материалов
export const POST = withPermission(PERMISSIONS.MATERIALS.EDIT)(
  async (req: AuthenticatedRequest) => {
    try {
      const materialsData = getMaterialsStore()
      const materialData = await req.json()
      
      // Валидация данных
      if (!materialData.name || !materialData.category) {
        return NextResponse.json(
          { error: 'Название и категория обязательны' },
          { status: 400 }
        )
      }

      // Создание нового материала
      const newMaterial = {
        id: Date.now(),
        ...materialData,
        createdAt: new Date().toISOString(),
        createdBy: req.user?.id,
        active: true
      }

      materialsData.push(newMaterial)

      console.log('Material created:', { 
        material: newMaterial, 
        user: req.user 
      })

      return NextResponse.json({
        success: true,
        data: newMaterial,
        message: 'Материал успешно добавлен'
      })

    } catch (error) {
      console.error('Material creation error:', error)
      return NextResponse.json(
        { error: 'Ошибка при создании материала' },
        { status: 500 }
      )
    }
  }
)
