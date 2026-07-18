-- Create comparisons table for product comparison feature
CREATE TABLE IF NOT EXISTS comparisons (
  id SERIAL PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  "product_ids" JSON NOT NULL,
  "createdAt" TIMESTAMP DEFAULT NOW() NOT NULL,
  "updatedAt" TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Add missing columns to reviews table if they don't exist
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS "helpful_count" INTEGER DEFAULT 0;
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS "unhelpful_count" INTEGER DEFAULT 0;

-- Rename text column to content if needed
ALTER TABLE reviews RENAME COLUMN IF EXISTS "text" TO "content";

-- Rename approved to is_approved if needed
ALTER TABLE reviews RENAME COLUMN IF EXISTS approved TO "is_approved";