import { NextRequest, NextResponse } from 'next/server'
import { withPermission, AuthenticatedRequest } from '@/lib/admin-middleware'
import { PERMISSIONS } from '@/app/api/auth/users/route'
import { getMaterialsStore } from '@/lib/materials-store'

export const PUT = withPermission(PERMISSIONS.MATERIALS.EDIT)(
  async (req: AuthenticatedRequest, { params }: { params: Promise<{ id: string }> }) => {
    try {
      const { id } = await params
      const materialId = parseInt(id)

      if (isNaN(materialId)) {
        return NextResponse.json({ error: 'Invalid material ID' }, { status: 400 })
      }

      const patch = await req.json()
      const store = getMaterialsStore()
      const idx = store.findIndex((m) => m.id === materialId)

      if (idx === -1) {
        return NextResponse.json({ error: 'Material not found' }, { status: 404 })
      }

      const updated = {
        ...store[idx],
        ...patch,
        updatedAt: new Date().toISOString(),
        updatedBy: req.user?.id,
      }

      store[idx] = updated

      return NextResponse.json({
        success: true,
        data: updated,
        message: 'Материал успешно обновлен',
      })
    } catch (error) {
      console.error('Material update error:', error)
      return NextResponse.json({ error: 'Ошибка при обновлении материала' }, { status: 500 })
    }
  }
)

export const DELETE = withPermission(PERMISSIONS.MATERIALS.DELETE)(
  async (req: AuthenticatedRequest, { params }: { params: Promise<{ id: string }> }) => {
    try {
      const { id } = await params
      const materialId = parseInt(id)
      
      if (isNaN(materialId)) {
        return NextResponse.json(
          { error: 'Invalid material ID' },
          { status: 400 }
        )
      }

      const store = getMaterialsStore()
      const idx = store.findIndex((m) => m.id === materialId)

      if (idx === -1) {
        return NextResponse.json({ error: 'Material not found' }, { status: 404 })
      }

      store.splice(idx, 1)

      console.log('Material deleted:', { 
        materialId, 
        deletedBy: req.user?.id,
        userRole: req.user?.role 
      })

      return NextResponse.json({
        success: true,
        message: 'Material deleted successfully'
      })

    } catch (error) {
      console.error('Material deletion error:', error)
      return NextResponse.json(
        { error: 'Ошибка при удалении материала' },
        { status: 500 }
      )
    }
  }
)
