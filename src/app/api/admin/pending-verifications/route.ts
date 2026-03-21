import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const documents = await db.verificationDocument.findMany({
      where: {
        status: 'PENDING'
      },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            country: true,
            logo: true
          }
        }
      },
      orderBy: { createdAt: 'asc' }
    })

    return NextResponse.json(documents)
  } catch (error) {
    console.error('Get pending verifications error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}