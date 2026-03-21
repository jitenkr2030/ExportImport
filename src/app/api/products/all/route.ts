import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const country = searchParams.get('country')
    const category = searchParams.get('category')
    const limit = parseInt(searchParams.get('limit') || '20')

    // Build where clause
    let whereClause: any = {
      isActive: true,
      company: {
        isVerified: true // Only show products from verified companies
      }
    }

    if (search) {
      whereClause.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
        { company: { name: { contains: search } } }
      ]
    }

    if (country && country !== 'all') {
      whereClause.company = {
        ...whereClause.company,
        country: country
      }
    }

    // Get products with company information
    const products = await db.product.findMany({
      where: whereClause,
      include: {
        company: {
          select: {
            id: true,
            name: true,
            country: true,
            isVerified: true,
            logo: true,
            description: true,
            _count: {
              select: {
                reviews: true
              }
            }
          }
        },
        _count: {
          select: {
            inquiries: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit
    })

    // Calculate company ratings and parse images
    const productsWithParsedImages = await Promise.all(
      products.map(async (product) => {
        const companyReviews = await db.review.findMany({
          where: { companyId: product.company.id }
        })
        
        const avgRating = companyReviews.length > 0
          ? companyReviews.reduce((sum, review) => sum + review.rating, 0) / companyReviews.length
          : 0

        return {
          ...product,
          company: {
            ...product.company,
            averageRating: parseFloat(avgRating.toFixed(1)),
            totalReviews: companyReviews.length
          },
          images: product.images ? JSON.parse(product.images) : []
        }
      })
    )

    return NextResponse.json(productsWithParsedImages)
  } catch (error) {
    console.error('Get all products error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}