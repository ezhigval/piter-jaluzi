import { NextRequest, NextResponse } from 'next/server'
import { withPermission, AuthenticatedRequest } from '@/lib/admin-middleware'
import { PERMISSIONS } from '@/app/api/auth/users/route'

export const DELETE = withPermission(PERMISSIONS.REVIEWS.DELETE)(
  async (req: AuthenticatedRequest, { params }: { params: { id: string } }) => {
    try {
      const reviewId = parseInt(params.id)
      
      if (isNaN(reviewId)) {
        return NextResponse.json(
          { error: 'Invalid review ID' },
          { status: 400 }
        )
      }

      // Здесь логика удаления из БД
      console.log('Review deleted:', { 
        reviewId, 
        deletedBy: req.user?.id,
        userRole: req.user?.role 
      })

      return NextResponse.json({
        success: true,
        message: 'Review deleted successfully'
      })

    } catch (error) {
      console.error('Review deletion error:', error)
      return NextResponse.json(
        { error: 'Ошибка при удалении отзыва' },
        { status: 500 }
      )
    }
  }
)
