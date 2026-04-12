"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"

type AccommodationImagesProps = {
  images: string[]
  name: string
}

export function AccommodationImages({ images, name }: AccommodationImagesProps) {
  const [current, setCurrent] = useState(0)

  if (images.length === 0) {
    return (
      <div className="flex h-72 items-center justify-center rounded-lg bg-base-200 text-base-content/30">
        이미지 없음
      </div>
    )
  }

  const prev = () => setCurrent((c) => (c === 0 ? images.length - 1 : c - 1))
  const next = () => setCurrent((c) => (c === images.length - 1 ? 0 : c + 1))

  return (
    <div className="relative h-72 w-full overflow-hidden rounded-lg sm:h-96">
      <Image
        src={images[current]}
        alt={`${name} ${current + 1}`}
        fill
        className="object-cover"
        sizes="100vw"
        unoptimized
      />

      {images.length > 1 && (
        <>
          <button
            type="button"
            className="btn btn-circle btn-sm absolute left-3 top-1/2 -translate-y-1/2 bg-base-100/80"
            onClick={prev}
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            type="button"
            className="btn btn-circle btn-sm absolute right-3 top-1/2 -translate-y-1/2 bg-base-100/80"
            onClick={next}
          >
            <ChevronRight className="size-4" />
          </button>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
            <span className="badge badge-neutral badge-sm">
              {current + 1} / {images.length}
            </span>
          </div>
        </>
      )}
    </div>
  )
}
