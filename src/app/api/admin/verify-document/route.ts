import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { documentId, status } = await request.json()

    if (!['APPROVED', 'REJECTED'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      )
    }

    // Get the document with company
    const document = await db.verificationDocument.findUnique({
      where: { id: documentId },
      include: {
        company: true
      }
    })

    if (!document) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      )
    }

    // Update document status
    const updatedDocument = await db.verificationDocument.update({
      where: { id: documentId },
      data: { status }
    })

    // If approved, update company verification status
    if (status === 'APPROVED') {
      await db.company.update({
        where: { id: document.companyId },
        data: { verificationStatus: 'APPROVED', isVerified: true }
      })
    } else if (status === 'REJECTED') {
      await db.company.update({
        where: { id: document.companyId },
        data: { verificationStatus: 'REJECTED', isVerified: false }
      })
    }

    return NextResponse.json(updatedDocument)
  } catch (error) {
    console.error('Verify document error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}