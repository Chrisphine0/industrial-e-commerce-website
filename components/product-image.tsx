'use client'

import { useState } from 'react'

interface ProductImageProps {
  src?: string
  alt: string
  className?: string
}

export function ProductImage({ src, alt, className }: ProductImageProps) {
  const [imgSrc, setImgSrc] = useState(src || '/placeholder.jpg')

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={() => setImgSrc('/placeholder.jpg')}
    />
  )
}