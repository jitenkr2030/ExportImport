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

    // Get platform stats
    const [
      totalUsers,
      totalCompanies,
      totalProducts,
      totalInquiries,
      pendingVerifications,
      verifiedCompanies
    ] = await Promise.all([
      db.user.count(),
      db.company.count(),
      db.product.count(),
      db.inquiry.count(),
      db.verificationDocument.count({ where: { status: 'PENDING' } }),
      db.company.count({ where: { isVerified: true } })
    ])

    return NextResponse.json({
      totalUsers,
      totalCompanies,
      totalProducts,
      totalInquiries,
      pendingVerifications,
      verifiedCompanies
    })
  } catch (error) {
    console.error('Admin stats error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}