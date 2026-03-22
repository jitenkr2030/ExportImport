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
    const limit = parseInt(searchParams.get('limit') || '20')

    // Build where clause
    let whereClause: any = {}

    if (search) {
      whereClause.OR = [
        { name: { contains: search } },
        { description: { contains: search } }
      ]
    }

    if (country && country !== 'all') {
      whereClause.country = country
    }

    if (verified === 'true') {
      whereClause.isVerified = true
    }

    // Build order clause
    let orderBy: any = { createdAt: 'desc' }
    
    switch (sort) {
      case 'verified':
        orderBy = [
          { isVerified: 'desc' },
          { createdAt: 'desc' }
        ]
        break
      case 'newest':
        orderBy = { createdAt: 'desc' }
        break
      case 'oldest':
        orderBy = { createdAt: 'asc' }
        break
      default:
        orderBy = { createdAt: 'desc' }
    }

    // Get companies with product count
    const companies = await db.company.findMany({
      where: whereClause,
      include: {
        _count: {
          select: {
            products: {
              where: { isActive: true }
            },
            inquiries: true
          }
        }
      },
      orderBy,
      take: limit
    })

    return NextResponse.json(companies)
  } catch (error) {
    console.error('Get companies error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}