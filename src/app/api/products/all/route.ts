import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const country = searchParams.get('country')
    const category = searchParams.get('category')
    const verified = searchParams.get('verified')
    const sort = searchParams.get('sort') || 'relevance'
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const limit = parseInt(searchParams.get('limit') || '20')

    // Build where clause
    let whereClause: any = {
      isActive: true,
      company: {
        isVerified: verified === 'true' ? true : undefined
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
      if (whereClause.company) {
        whereClause.company.country = country
      } else {
        whereClause.company = { country }
      }
    }

    // Price filtering
    if (minPrice || maxPrice) {
      whereClause.price = {}
      if (minPrice) {
        whereClause.price.gte = parseFloat(minPrice)
      }
      if (maxPrice) {
        whereClause.price.lte = parseFloat(maxPrice)
      }
    }

    // Build order clause
    let orderBy: any = { createdAt: 'desc' }
    
    switch (sort) {
      case 'price_low':
        orderBy = { price: 'asc' }
        break
      case 'price_high':
        orderBy = { price: 'desc' }
        break
      case 'verified':
        orderBy = [
          { company: { isVerified: 'desc' } },
          { createdAt: 'desc' }
        ]
        break
      case 'newest':
        orderBy = { createdAt: 'desc' }
        break
      default:
        orderBy = { createdAt: 'desc' }
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
      orderBy,
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