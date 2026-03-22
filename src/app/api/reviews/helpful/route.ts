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

    const { reviewId, isHelpful } = await request.json()

    if (!reviewId || typeof isHelpful !== 'boolean') {
      return NextResponse.json(
        { error: 'Review ID and isHelpful boolean are required' },
        { status: 400 }
      )
    }

    // Check if user already marked this review
    const existingVote = await db.reviewVote.findFirst({
      where: {
        reviewId,
        userId: session.user.id
      }
    })

    if (existingVote) {
      // Update existing vote
      const oldIsHelpful = existingVote.isHelpful
      
      await db.reviewVote.update({
        where: { id: existingVote.id },
        data: { isHelpful }
      })

      // Update review helpful count
      const helpfulChange = isHelpful ? 1 : -1
      const oldHelpfulChange = oldIsHelpful ? 1 : -1
      
      await db.review.update({
        where: { id: reviewId },
        data: {
          helpful: {
            increment: helpfulChange - oldHelpfulChange
          }
        }
      })
    } else {
      // Create new vote
      await db.reviewVote.create({
        data: {
          reviewId,
          userId: session.user.id,
          isHelpful
        }
      })

      // Update review helpful count
      await db.review.update({
        where: { id: reviewId },
        data: {
          helpful: {
            increment: isHelpful ? 1 : -1
          }
        }
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Mark helpful error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}