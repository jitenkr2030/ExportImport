import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user's company
    const company = await db.company.findUnique({
      where: { userId: session.user.id }
    })

    if (!company) {
      return NextResponse.json(
        { error: 'Company profile required' },
        { status: 400 }
      )
    }

    // Get inquiries for the company
    const inquiries = await db.inquiry.findMany({
      where: { companyId: company.id },
      include: {
        sender: {
          select: {
            name: true,
            email: true
          }
        },
        product: {
          select: {
            name: true,
            images: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Parse product images
    const inquiriesWithParsedImages = inquiries.map(inquiry => ({
      ...inquiry,
      product: inquiry.product ? {
        ...inquiry.product,
        images: inquiry.product.images ? JSON.parse(inquiry.product.images) : []
      } : null
    }))

    return NextResponse.json(inquiriesWithParsedImages)
  } catch (error) {
    console.error('Get inquiries error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}