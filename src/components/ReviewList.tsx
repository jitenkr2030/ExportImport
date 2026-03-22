'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Star, MessageSquare, ThumbsUp, ThumbsDown, Send } from 'lucide-react'

interface Review {
  id: string
  rating: number
  comment: string
  createdAt: string
  user: {
    name: string
    email: string
    avatar?: string
  }
  helpful: number
  isHelpful: boolean | null
}

interface ReviewListProps {
  companyId: string
  companyName: string
  showWriteReview?: boolean
  maxReviews?: number
}

export default function ReviewList({ 
  companyId, 
  companyName, 
  showWriteReview = true,
  maxReviews = 10 
}: ReviewListProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [userReview, setUserReview] = useState<Review | null>(null)
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: ''
  })
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'highest' | 'lowest'>('newest')

  useEffect(() => {
    fetchReviews()
  }, [companyId, sortBy])

  const fetchReviews = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/reviews/company/${companyId}?sortBy=${sortBy}&limit=${maxReviews}`)
      if (response.ok) {
        const data = await response.json()
        setReviews(data.reviews || [])
        setUserReview(data.userReview || null)
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess('')

    if (!reviewForm.comment.trim()) {
      setError('Please write a review comment')
      setIsLoading(false)
      return
    }

    try {
      const url = userReview 
        ? '/api/reviews/update'
        : '/api/reviews/create'
      
      const response = await fetch(url, {
        method: userReview ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          companyId,
          rating: reviewForm.rating,
          comment: reviewForm.comment,
          ...(userReview && { reviewId: userReview.id })
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(userReview ? 'Review updated successfully!' : 'Review submitted successfully!')
        setReviewForm({ rating: 5, comment: '' })
        setShowReviewForm(false)
        fetchReviews()
        
        setTimeout(() => setSuccess(''), 3000)
      } else {
        setError(data.error || 'Failed to submit review')
      }
    } catch (error) {
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleHelpful = async (reviewId: string, isHelpful: boolean) => {
    try {
      const response = await fetch('/api/reviews/helpful', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reviewId, isHelpful }),
      })

      if (response.ok) {
        setReviews(prev => 
          prev.map(review => 
            review.id === reviewId 
              ? { 
                  ...review, 
                  isHelpful,
                  helpful: review.helpful + (isHelpful ? 1 : -1)
                } 
              : review
          )
        )
      }
    } catch (error) {
      console.error('Failed to mark review as helpful:', error)
    }
  }

  const renderStars = (rating: number, size = 'sm') => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-${size === 'sm' ? '4' : '5'} h-${size === 'sm' ? '4' : '5'} ${
              star <= rating 
                ? 'fill-yellow-400 text-yellow-400' 
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    )
  }

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : '0.0'

  if (isLoading && reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="text-gray-600 mt-4">Loading reviews...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Review Summary */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-3">
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                <span>{averageRating}</span>
                <span className="text-gray-500">({reviews.length} reviews)</span>
              </CardTitle>
              <CardDescription>Customer reviews for {companyName}</CardDescription>
            </div>
            {showWriteReview && (
              <Button 
                onClick={() => setShowReviewForm(!showReviewForm)}
                variant={userReview ? 'outline' : 'default'}
              >
                {userReview ? 'Update Review' : 'Write Review'}
              </Button>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Review Form */}
      {showReviewForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {userReview ? 'Update Your Review' : 'Write a Review'}
            </CardTitle>
            <CardDescription>
              Share your experience with {companyName}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitReview} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="bg-green-50 border-green-200">
                  <AlertDescription className="text-green-800">{success}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label>Rating</Label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewForm(prev => ({ ...prev, rating: star }))}
                      className="transition-colors"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= reviewForm.rating 
                            ? 'fill-yellow-400 text-yellow-400 hover:text-yellow-500' 
                            : 'text-gray-300 hover:text-yellow-400'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="comment">Your Review</Label>
                <Textarea
                  id="comment"
                  placeholder="Share your experience with this company..."
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                  rows={4}
                  required
                />
              </div>

              <div className="flex space-x-3">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1"
                >
                  {isLoading ? 'Submitting...' : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      {userReview ? 'Update Review' : 'Submit Review'}
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowReviewForm(false)
                    setReviewForm({ rating: 5, comment: '' })
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Reviews Yet</h3>
              <p className="text-gray-600 mb-4">
                Be the first to share your experience with {companyName}
              </p>
              {showWriteReview && (
                <Button onClick={() => setShowReviewForm(true)}>
                  Write First Review
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Sort Options */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                {reviews.length} reviews
              </span>
              <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="highest">Highest Rated</SelectItem>
                  <SelectItem value="lowest">Lowest Rated</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Review Items */}
            {reviews.map((review) => (
              <Card key={review.id}>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <Avatar>
                      <AvatarImage src={review.user.avatar || ''} alt={review.user.name} />
                      <AvatarFallback>
                        {review.user.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-gray-900">
                              {review.user.name}
                            </span>
                            {userReview?.id === review.id && (
                              <Badge variant="secondary" className="text-xs">Your Review</Badge>
                            )}
                          </div>
                          <div className="flex items-center space-x-2 mt-1">
                            {renderStars(review.rating)}
                            <span className="text-sm text-gray-500">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-gray-700 mb-3">{review.comment}</p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          Was this review helpful?
                        </span>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleHelpful(review.id, true)}
                            disabled={review.isHelpful === true}
                            className={`flex items-center space-x-1 text-sm ${
                              review.isHelpful === true
                                ? 'text-green-600'
                                : 'text-gray-500 hover:text-green-600'
                            }`}
                          >
                            <ThumbsUp className="w-4 h-4" />
                            <span>{review.helpful}</span>
                          </button>
                          <button
                            onClick={() => handleHelpful(review.id, false)}
                            disabled={review.isHelpful === false}
                            className={`flex items-center space-x-1 text-sm ${
                              review.isHelpful === false
                                ? 'text-red-600'
                                : 'text-gray-500 hover:text-red-600'
                            }`}
                          >
                            <ThumbsDown className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </>
        )}
      </div>
    </div>
  )
}