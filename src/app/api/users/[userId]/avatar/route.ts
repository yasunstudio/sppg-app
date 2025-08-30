import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { userId } = await params
    const formData = await request.formData()
    const avatar = formData.get('avatar') as string

    // Update user avatar in database
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { 
        avatar: avatar || null 
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true
      }
    })

    return NextResponse.json({
      success: true,
      user: updatedUser
    })

  } catch (error) {
    console.error('Avatar update error:', error)
    return NextResponse.json(
      { error: 'Failed to update avatar' },
      { status: 500 }
    )
  }
}
