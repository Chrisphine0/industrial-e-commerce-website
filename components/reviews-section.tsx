'use client'

import { useEffect, useState } from 'react'
import { Star, ThumbsUp, ThumbsDown } from 'lucide-react'
import { Rating } from '@/components/ui/rating'
import { Button } from '@/components/ui/button'
import { ReviewForm } from '@/components/review-form'
import { getProductReviews, voteReview } from '@/app/actions/reviews'

interface Review {
  id: number
  userId: string
  productId: number
  rating: number
  title?: string
  content?: string
  isApproved: boolean
  helpfulCount: number
  unhelpfulCount: number
  createdAt: Date | null
  updatedAt: Date | null
}

interface ReviewsSectionProps {
  productId: number
  avgRating: string
  reviewCount: number
}

export function ReviewsSection({ productId, avgRating, reviewCount }: ReviewsSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const data = await getProductReviews(productId)
        setReviews(data as Review[])
      } catch (error) {
        console.error('Failed to load reviews:', error)
      }
    }
    loadReviews()
  }, [productId])

  const handleVote = async (reviewId: number, vote: 'helpful' | 'unhelpful') => {
    try {
      await voteReview(reviewId, vote)
      setReviews(reviews.map(r => 
        r.id === reviewId 
          ? { ...r, [vote === 'helpful' ? 'helpfulCount' : 'unhelpfulCount']: r[vote === 'helpful' ? 'helpfulCount' : 'unhelpfulCount'] + 1 }
          : r
      ))
    } catch (error) {
      console.error('Failed to vote:', error)
    }
  }

  return (
    <div className="mt-12 pt-8 border-t border-border">
      <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
      
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center">
          {Array(5).fill(0).map((_, i) => (
            <Star key={i} className={`h-5 w-5 ${i < Math.floor(parseFloat(avgRating)) ? 'fill-primary text-primary' : 'text-border'}`} />
          ))}
        </div>
        <span className="text-muted-foreground">({reviewCount} reviews)</span>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
        <ReviewForm productId={productId.toString()} />
      </div>

      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="border-b pb-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex">
                {Array(5).fill(0).map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'fill-primary text-primary' : 'text-border'}`} />
                ))}
              </div>
              <span className="font-semibold">{review.title}</span>
            </div>
            <p className="text-sm text-muted-foreground mb-2">by {review.userId}</p>
            <p className="mb-2">{review.content}</p>
            <div className="flex gap-4 text-sm">
              <button onClick={() => handleVote(review.id, 'helpful')} className="flex items-center gap-1 hover:text-primary">
                <ThumbsUp className="h-4 w-4" />
                {review.helpfulCount}
              </button>
              <button onClick={() => handleVote(review.id, 'unhelpful')} className="flex items-center gap-1 hover:text-primary">
                <ThumbsDown className="h-4 w-4" />
                {review.unhelpfulCount}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}