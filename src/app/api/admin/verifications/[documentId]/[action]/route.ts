import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function POST(
  request: NextRequest,
  { params }: { params: { documentId: string, action: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { documentId, action } = params

    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      )
    }

    // Get the verification document
    const document = await db.verificationDocument.findUnique({
      where: { id: documentId },
      include: { company: true }
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
      data: { status: action === 'approve' ? 'APPROVED' : 'REJECTED' }
    })

    // Check if all documents for this company are approved
    const allDocuments = await db.verificationDocument.findMany({
      where: { companyId: document.companyId }
    })

    const allApproved = allDocuments.every(doc => doc.status === 'APPROVED')
    const anyRejected = allDocuments.some(doc => doc.status === 'REJECTED')

    // Update company verification status
    let newVerificationStatus: string
    if (allApproved) {
      newVerificationStatus = 'APPROVED'
    } else if (anyRejected) {
      newVerificationStatus = 'REJECTED'
    } else {
      newVerificationStatus = 'PENDING'
    }

    await db.company.update({
      where: { id: document.companyId },
      data: { 
        verificationStatus: newVerificationStatus,
        isVerified: newVerificationStatus === 'APPROVED'
      }
    })

    return NextResponse.json({
      document: updatedDocument,
      companyVerificationStatus: newVerificationStatus
    })
  } catch (error) {
    console.error('Verification action error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}