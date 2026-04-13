"use client"

import { useState } from "react"
import Image from "next/image"
import { Camera, ChevronLeft, ChevronRight, X } from "lucide-react"

import { Modal } from "@/components/ui/modal"

type AccommodationImagesProps = {
  images: string[]
  name: string
}

function ImageSlideModal({
  images,
  name,
  initialIndex,
  onClose,
}: {
  images: string[]
  name: string
  initialIndex: number
  onClose: () => void
}) {
  const [current, setCurrent] = useState(initialIndex)

  const prev = () => setCurrent((c) => (c === 0 ? images.length - 1 : c - 1))
  const next = () => setCurrent((c) => (c === images.length - 1 ? 0 : c + 1))

  return (
    <Modal
      open
      onClose={onClose}
      boxClassName="w-[91.6667%] max-w-4xl p-0"
      backdropClassName="bg-black/70"
    >
      <button
        type="button"
        className="btn btn-circle btn-sm absolute right-3 top-3 z-10"
        onClick={onClose}
      >
        <X className="size-4" />
      </button>

      <div className="relative aspect-video w-full">
        <Image
          src={images[current]}
          alt={`${name} ${current + 1}`}
          fill
          className="object-contain bg-black"
          sizes="(max-width: 896px) 100vw, 896px"
          unoptimized
        />

        {images.length > 1 && (
          <>
            {/* 이전 버튼 */}
            <button
              type="button"
              className="btn btn-circle btn-sm absolute left-3 top-1/2 -translate-y-1/2 bg-base-100/80"
              onClick={prev}
            >
              <ChevronLeft className="size-4" />
            </button>

            {/* 다음 버튼 */}
            <button
              type="button"
              className="btn btn-circle btn-sm absolute right-3 top-1/2 -translate-y-1/2 bg-base-100/80"
              onClick={next}
            >
              <ChevronRight className="size-4" />
            </button>
          </>
        )}
      </div>

      {/* 사진 인덱스 표시 */}
      <div className="flex items-center justify-center gap-2 py-3">
        <span className="text-sm text-base-content/60">
          {current + 1} / {images.length}
        </span>
      </div>
    </Modal>
  )
}

export function AccommodationImages({ images, name }: AccommodationImagesProps) {
  const [showModal, setShowModal] = useState(false)
  const [modalIndex, setModalIndex] = useState(0)

  if (images.length === 0) {
    return (
      <div className="flex h-72 items-center justify-center rounded-lg bg-base-200 text-base-content/30">
        이미지 없음
      </div>
    )
  }

  const openModal = (index: number) => {
    setModalIndex(index)
    setShowModal(true)
  }

  // 최대 4개 이미지 표시용
  const img0 = images[0]
  const img1 = images[1]
  const img2 = images[2]
  const img3 = images[3]

  return (
    <>
      <div className="relative overflow-hidden rounded-lg">
        <div className="flex h-80 gap-1 sm:h-[28rem]">
          <button
            type="button"
            className="relative h-full flex-1 cursor-pointer overflow-hidden"
            onClick={() => openModal(0)}
          >
            <Image
              src={img0}
              alt={`${name} 1`}
              fill
              className="object-cover transition-transform hover:scale-105"
              sizes="33vw"
              unoptimized
            />
          </button>

          <div className="flex h-full flex-1 flex-col gap-1">
            <button
              type="button"
              className="relative h-1/2 w-full cursor-pointer overflow-hidden"
              onClick={() => openModal(img1 ? 1 : 0)}
            >
              {img1 ? (
                <Image
                  src={img1}
                  alt={`${name} 2`}
                  fill
                  className="object-cover transition-transform hover:scale-105"
                  sizes="33vw"
                  unoptimized
                />
              ) : (
                <div className="h-full w-full bg-base-200" />
              )}
            </button>

            <button
              type="button"
              className="relative h-1/2 w-full cursor-pointer overflow-hidden"
              onClick={() => openModal(img2 ? 2 : 0)}
            >
              {img2 ? (
                <Image
                  src={img2}
                  alt={`${name} 3`}
                  fill
                  className="object-cover transition-transform hover:scale-105"
                  sizes="33vw"
                  unoptimized
                />
              ) : (
                <div className="h-full w-full bg-base-200" />
              )}
            </button>
          </div>

          <button
            type="button"
            className="relative h-full flex-1 cursor-pointer overflow-hidden"
            onClick={() => openModal(img3 ? 3 : 0)}
          >
            {img3 ? (
              <Image
                src={img3}
                alt={`${name} 4`}
                fill
                className="object-cover transition-transform hover:scale-105"
                sizes="33vw"
                unoptimized
              />
            ) : (
              <div className="h-full w-full bg-base-200" />
            )}
          </button>
        </div>

        {/* 사진 전체 보기 버튼 */}
        {images.length > 1 && (
          <button
            type="button"
            className="btn btn-sm absolute bottom-3 right-3 gap-1 bg-base-100/90 shadow"
            onClick={() => openModal(0)}
          >
            <Camera className="size-4" />
            사진 전체 보기 ({images.length})
          </button>
        )}
      </div>

      {showModal && (
        <ImageSlideModal
          images={images}
          name={name}
          initialIndex={modalIndex}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  )
}
