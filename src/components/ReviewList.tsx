'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Star, MessageSquare } from 'lucide-react'
import ReviewForm from './ReviewForm'

interface ReviewListProps {
  companyId: string
  companyName: string
}

export default function ReviewList({ companyId, companyName }: ReviewListProps) {
  const [reviews, setReviews] = useState<any[]>([])
  const [averageRating, setAverageRating] = useState(0)
  const [totalReviews, setTotalReviews] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchReviews()
  }, [companyId])

  const fetchReviews = async () => {
    try {
      const response = await fetch(`/api/reviews/company?companyId=${companyId}`)
      if (response.ok) {
        const data = await response.json()
        setReviews(data.reviews)
        setAverageRating(data.averageRating)
        setTotalReviews(data.totalReviews)
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="text-gray-600 mt-2">Loading reviews...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Customer Reviews</span>
            <Badge variant="outline">
              {totalReviews} {totalReviews === 1 ? 'Review' : 'Reviews'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">
                {averageRating.toFixed(1)}
              </div>
              <div className="flex space-x-1">
                {renderStars(averageRating)}
              </div>
            </div>
            <div className="flex-1">
              <div className="text-sm text-gray-600 mb-2">
                Based on {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
              </div>
              <ReviewForm
                companyId={companyId}
                companyName={companyName}
                onReviewSubmitted={fetchReviews}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">No reviews yet.</p>
            <p className="text-sm text-gray-500 mb-4">
              Be the first to share your experience with {companyName}
            </p>
            <ReviewForm
              companyId={companyId}
              companyName={companyName}
              onReviewSubmitted={fetchReviews}
            />
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <Avatar>
                    <AvatarImage src={review.user.email} alt={review.user.name} />
                    <AvatarFallback>
                      {review.user.name?.slice(0, 2).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {review.user.name}
                        </h4>
                        <div className="flex items-center space-x-2 mt-1">
                          {renderStars(review.rating)}
                          <span className="text-sm text-gray-500">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    {review.comment && (
                      <p className="text-gray-700">{review.comment}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {/* Add Review Button at Bottom */}
          <div className="text-center pt-4">
            <ReviewForm
              companyId={companyId}
              companyName={companyName}
              onReviewSubmitted={fetchReviews}
            />
          </div>
        </div>
      )}
    </div>
  )
}