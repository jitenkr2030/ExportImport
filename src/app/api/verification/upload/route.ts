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

    const { type, fileUrl, fileName } = await request.json()

    if (!type || !fileUrl || !fileName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
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

    // Create verification document
    const document = await db.verificationDocument.create({
      data: {
        type,
        fileUrl,
        fileName,
        companyId: company.id,
        status: 'PENDING'
      }
    })

    // Update company verification status if this is the first document
    const existingDocuments = await db.verificationDocument.findMany({
      where: { companyId: company.id }
    })

    if (existingDocuments.length === 1) {
      await db.company.update({
        where: { id: company.id },
        data: { verificationStatus: 'PENDING' }
      })
    }

    return NextResponse.json(document, { status: 201 })
  } catch (error) {
    console.error('Document upload error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}