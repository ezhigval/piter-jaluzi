import { NextRequest, NextResponse } from 'next/server'
import { withPermission, AuthenticatedRequest } from '@/lib/admin-middleware'
import { PERMISSIONS } from '@/app/api/auth/users/route'
import { listPages, updatePage } from '@/lib/pages-store-persistent'

export const GET = withPermission(PERMISSIONS.CONTENT.READ)(
  async (req: AuthenticatedRequest) => {
    try {
      console.log('Pages fetched by:', { 
        userId: req.user?.id, 
        role: req.user?.role 
      })

      const pages = await listPages()
      
      return NextResponse.json({
        success: true,
        data: pages,
        total: pages.length
      })

    } catch (error) {
      console.error('Pages fetch error:', error)
      return NextResponse.json(
        { error: 'Ошибка при получении страниц' },
        { status: 500 }
      )
    }
  }
)

export const PUT = withPermission(PERMISSIONS.CONTENT.EDIT)(
  async (req: AuthenticatedRequest) => {
    try {
      const { pageId, blocks, title, description } = await req.json()
      
      if (!pageId) {
        return NextResponse.json(
          { error: 'ID страницы обязателен' },
          { status: 400 }
        )
      }

      const updated = await updatePage({
        pageId,
        title,
        description,
        blocks,
        modifiedBy: req.user?.id || 'unknown',
      })

      if (!updated) {
        return NextResponse.json(
          { error: 'Страница не найдена' },
          { status: 404 }
        )
      }

      console.log('Page updated:', { 
        pageId, 
        updatedBy: req.user?.id,
        blocksCount: blocks?.length 
      })

      return NextResponse.json({
        success: true,
        data: updated,
        message: 'Страница успешно обновлена'
      })

    } catch (error) {
      console.error('Page update error:', error)
      return NextResponse.json(
        { error: 'Ошибка при обновлении страницы' },
        { status: 500 }
      )
    }
  }
)
