import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const country = searchParams.get('country') || 'all'
    const category = searchParams.get('category') || 'all'
    const minPrice = parseFloat(searchParams.get('minPrice') || '0')
    const maxPrice = parseFloat(searchParams.get('maxPrice') || '10000')
    const verifiedOnly = searchParams.get('verifiedOnly') === 'true'
    const sortBy = searchParams.get('sortBy') || 'relevance'

    // Build where clauses
    const productWhere: any = {
      isActive: true,
      company: {
        isVerified: verifiedOnly ? true : undefined
      }
    }

    const companyWhere: any = {
      isVerified: verifiedOnly ? true : undefined
    }

    // Add search conditions
    if (search) {
      productWhere.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
        { company: { name: { contains: search } } }
      ]

      companyWhere.OR = [
        { name: { contains: search } },
        { description: { contains: search } }
      ]
    }

    // Add country filter
    if (country !== 'all') {
      productWhere.company = {
        ...productWhere.company,
        country: country
      }
      companyWhere.country = country
    }

    // Add price filter
    if (minPrice > 0 || maxPrice < 10000) {
      productWhere.price = {
        gte: minPrice > 0 ? minPrice : undefined,
        lte: maxPrice < 10000 ? maxPrice : undefined
      }
    }

    // Build order by
    let orderBy: any = { createdAt: 'desc' }
    
    switch (sortBy) {
      case 'newest':
        orderBy = { createdAt: 'desc' }
        break
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
      default:
        orderBy = { createdAt: 'desc' }
    }

    // Fetch products
    const products = await db.product.findMany({
      where: productWhere,
      include: {
        company: {
          select: {
            id: true,
            name: true,
            country: true,
            isVerified: true,
            logo: true,
            description: true
          }
        },
        _count: {
          select: {
            inquiries: true
          }
        }
      },
      orderBy,
      take: 20
    })

    // Fetch companies
    const companies = await db.company.findMany({
      where: companyWhere,
      include: {
        _count: {
          select: {
            products: true,
            inquiries: true,
            reviews: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 20
    })

    // Calculate ratings for companies
    const companiesWithRatings = await Promise.all(
      companies.map(async (company) => {
        const reviews = await db.review.findMany({
          where: { companyId: company.id }
        })
        
        const avgRating = reviews.length > 0
          ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
          : 0

        return {
          ...company,
          averageRating: parseFloat(avgRating.toFixed(1)),
          totalReviews: reviews.length
        }
      })
    )

    // Parse images JSON for products
    const productsWithParsedImages = products.map(product => ({
      ...product,
      images: product.images ? JSON.parse(product.images) : []
    }))

    return NextResponse.json({
      products: productsWithParsedImages,
      companies: companiesWithRatings
    })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}