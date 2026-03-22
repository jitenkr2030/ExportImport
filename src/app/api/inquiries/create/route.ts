import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { companyId, productId, message, quantity, budget, currency } = await request.json()

    // Validate company exists
    const company = await db.company.findUnique({
      where: { id: companyId }
    })

    if (!company) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      )
    }

    // Validate product if provided
    if (productId) {
      const product = await db.product.findUnique({
        where: { id: productId }
      })

      if (!product) {
        return NextResponse.json(
          { error: 'Product not found' },
          { status: 404 }
        )
      }
    }

    // Create inquiry
    const inquiry = await db.inquiry.create({
      data: {
        message,
        quantity: quantity || null,
        budget: budget || null,
        currency: currency || 'USD',
        senderId: session.user.id,
        companyId,
        productId: productId || null
      },
      include: {
        company: {
          select: {
            name: true,
            email: true,
            phone: true,
            whatsapp: true
          }
        },
        product: {
          select: {
            name: true
          }
        },
        sender: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json(inquiry, { status: 201 })
  } catch (error) {
    console.error('Inquiry creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}