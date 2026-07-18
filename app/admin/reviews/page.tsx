"use client"

import { getAdminReviews, moderateReview } from "@/app/actions/reviews"
import { AdminLayout } from "@/components/admin-layout"
import { Button } from "@/components/ui/button"
import { Star } from "lucide-react"
import { useTransition } from "react"
import { useEffect, useState } from "react"

interface Review {
  id: number
  userId: string
  productId: number
  rating: number
  title: string | null
  content: string | null
  isApproved: boolean | null
  helpfulCount: number | null
  unhelpfulCount: number | null
  createdAt: Date | null
  updatedAt: Date | null
}

function ModerateButton({ review, approve }: { review: Review, approve: boolean }) {
  const [isPending, startTransition] = useTransition()

  return (
    <Button 
      onClick={() => startTransition(async () => {
        await moderateReview(review.id, approve)
      })} 
      variant={approve ? "default" : "destructive"} 
      size="sm"
      disabled={isPending}
    >
      {isPending ? "Processing..." : approve ? "Approve" : "Reject"}
    </Button>
  )
}

export default function AdminReviewsPage() {
  const [pending, setPending] = useState<Review[]>([])
  const [approvedReviews, setApprovedReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const pendingData = await getAdminReviews(false) as Review[]
        const approvedData = await getAdminReviews(true) as Review[]
        setPending(pendingData)
        setApprovedReviews(approvedData)
      } catch (error) {
        console.error("Error loading reviews:", error)
      } finally {
        setLoading(false)
      }
    }
    loadReviews()
  }, [])

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold">Review Moderation</h1>

      {loading ? (
        <p className="text-muted-foreground mt-4">Loading...</p>
      ) : (
        <>
          <div className="mt-6">
            <h2 className="text-xl font-semibold">Pending ({pending.length})</h2>
            {pending.length === 0 ? (
              <p className="text-muted-foreground mt-4">No pending reviews</p>
            ) : (
              pending.map((review: Review) => (
                <div key={review.id} className="border p-4 my-2 rounded">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold">Rating:</span>
                    <div className="flex items-center">
                      {Array(5)
                        .fill(0)
                        .map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < review.rating ? 'fill-primary text-primary' : 'text-border'}`}
                          />
                        ))}
                    </div>
                  </div>
                  <p className="font-semibold">Title: {review.title}</p>
                  <p className="text-sm text-muted-foreground mb-2">by {review.userId}</p>
                  <p className="mb-4">{review.content}</p>
                  <div className="flex gap-2">
                    <ModerateButton review={review} approve={true} />
                    <ModerateButton review={review} approve={false} />
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold">Approved ({approvedReviews.length})</h2>
            {approvedReviews.length === 0 ? (
              <p className="text-muted-foreground mt-4">No approved reviews</p>
            ) : (
              approvedReviews.map((review: Review) => (
                <div key={review.id} className="border p-4 my-2 rounded bg-muted/20">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold">Rating:</span>
                    <div className="flex items-center">
                      {Array(5)
                        .fill(0)
                        .map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < review.rating ? 'fill-primary text-primary' : 'text-border'}`}
                          />
                        ))}
                    </div>
                  </div>
                  <p className="font-semibold">Title: {review.title}</p>
                  <p className="text-sm text-muted-foreground mb-2">by {review.userId}</p>
                  <p>{review.content}</p>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </AdminLayout>
  )
}