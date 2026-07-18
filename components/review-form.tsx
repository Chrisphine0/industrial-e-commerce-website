"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { submitReview } from "@/app/actions/reviews"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Rating } from "@/components/ui/rating"

interface ReviewFormProps {
  productId: number
  onSubmitted?: () => void
}

export function ReviewForm({ productId, onSubmitted }: ReviewFormProps) {
  const [rating, setRating] = useState(0)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await submitReview(productId, rating, title, content)
      alert("Review submitted! Awaiting admin approval.")
      setRating(0)
      setTitle("")
      setContent("")
      onSubmitted?.()
      router.refresh()
    } catch (error) {
      alert("Error submitting review. Please make sure you're logged in.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
      <div>
        <label className="block text-sm font-medium mb-2">Rating</label>
        <Rating value={rating} onChange={setRating} />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Title</label>
        <Input 
          placeholder="Review title" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          required 
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Content</label>
        <Textarea 
          placeholder="Write your review..." 
          value={content} 
          onChange={(e) => setContent(e.target.value)} 
          required 
          rows={4} 
        />
      </div>
      <Button type="submit" disabled={loading || rating === 0}>
        {loading ? "Submitting..." : "Submit Review"}
      </Button>
    </form>
  )
}