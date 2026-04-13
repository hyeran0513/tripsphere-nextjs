"use client"

import { Heart, MapPin, Phone, Star, Users } from "lucide-react"
import { useRouter } from "next/navigation"

import { PATH } from "@/constants/path"
import { useAuth } from "@/hooks/auth/use-auth"
import {
  useAddToCartMutation,
  useRemoveFromCartMutation,
} from "@/hooks/mutations/use-cart-mutation"
import { useCartQuery } from "@/hooks/queries/use-cart-query"
import { useLodgingDetailQuery } from "@/hooks/queries/use-lodging-detail-query"
import { useReviewsQuery } from "@/hooks/queries/use-reviews-query"
import { useToast } from "@/hooks/use-toast"
import { ToastContainer } from "@/components/ui/toast"
import { NoData } from "@/components/ui/no-data"
import { getLodgingTypeLabel } from "@/types/lodging"
import { LodgingImages } from "./lodging-images"
import { ReviewList } from "./review-list"

type LodgingDetailProps = {
  lodgingId: string
}

export function LodgingDetail({ lodgingId }: LodgingDetailProps) {
  const router = useRouter()
  const { user } = useAuth()
  const { data: lodging, isLoading } = useLodgingDetailQuery(lodgingId)
  const { data: reviews } = useReviewsQuery(lodgingId)
  const { data: cartItems } = useCartQuery(user?.uid ?? null)
  const addToCart = useAddToCartMutation()
  const removeFromCart = useRemoveFromCartMutation(user?.uid ?? "")
  const { toasts, show } = useToast()

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl space-y-6 p-4">
        <div className="skeleton h-72 w-full rounded-lg sm:h-96" />
        <div className="skeleton h-8 w-1/2" />
        <div className="skeleton h-5 w-1/3" />
        <div className="skeleton h-32 w-full rounded-lg" />
      </div>
    )
  }

  if (!lodging) {
    return <NoData title="숙소를 찾을 수 없습니다." />
  }

  const avgRating =
    lodging.total_rating && lodging.review_count
      ? (lodging.total_rating / lodging.review_count).toFixed(1)
      : null

  const isSoldOut = lodging.stock === 0
  const cartItem = cartItems?.find((item) => item.lodging_id === lodging.id)
  const isInCart = !!cartItem

  const handleToggleWish = () => {
    if (!user) {
      router.push(PATH.LOGIN)
      return
    }

    if (isInCart) {
      removeFromCart.mutate(cartItem.id)
      show("찜 목록에서 해제되었습니다")
    } else {
      addToCart.mutate({ lodging_id: lodging.id, user_id: user.uid })
      show("찜 목록에 추가되었습니다")
    }
  }

  const handleBook = () => {
    if (!user) {
      router.push(PATH.LOGIN)
      return
    }
    const params = new URLSearchParams({ lodgingId: lodging.id })
    router.push(`${PATH.CHECKOUT}?${params.toString()}`)
  }

  return (
    <>
      <div className="mx-auto max-w-6xl space-y-8 p-4">
        {/* 이미지 */}
        <LodgingImages images={lodging.images ?? []} name={lodging.name} />

        {/* 기본 정보 */}
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-4">
            {/* 타입 */}
            <div>
              {lodging.type && (
                <span className="badge badge-outline badge-sm mb-2">
                  {getLodgingTypeLabel(lodging.type)}
                </span>
              )}
              <h1 className="text-2xl font-bold">{lodging.name}</h1>
            </div>

            {/* 평점 */}
            {avgRating && (
              <div className="flex items-center gap-1 text-warning">
                <Star className="size-5 fill-current" />
                <span className="text-lg font-semibold">{avgRating}</span>
                <span className="text-sm text-base-content/50">({lodging.review_count})</span>
              </div>
            )}
          </div>

          {/* 위치 */}
          <p className="flex items-center gap-1 text-sm text-base-content/60">
            <MapPin className="size-4" />
            {lodging.location?.city} {lodging.location?.sub_city} {lodging.location?.place_name}
          </p>

          {/* 인원 */}
          <p className="flex items-center gap-1 text-sm text-base-content/60">
            <Users className="size-4" />
            성인 {lodging.capacity.adults}인 / 아동 {lodging.capacity.children}인
          </p>

          {/* 설명 */}
          {lodging.description && <p className="text-base-content/80">{lodging.description}</p>}

          {/* 호스트 연락처 */}
          {lodging.host?.contact && (
            <div className="flex flex-wrap gap-4 text-sm text-base-content/60">
              <span className="flex items-center gap-1">
                <Phone className="size-3.5" />
                {lodging.host.contact}
              </span>
            </div>
          )}
        </div>

        <div className="divider" />

        {/* 예약 박스 */}
        <section className="card border border-base-300 bg-base-100">
          <div className="card-body gap-4">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <div className="text-sm text-base-content/60">가격</div>
                <div className="text-3xl font-bold">{lodging.price_point.toLocaleString()}원</div>
              </div>
              <div className={`text-sm font-medium ${isSoldOut ? "text-error" : "text-primary"}`}>
                {isSoldOut ? "매진" : `남은 객실 ${lodging.stock}개`}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                className="btn btn-primary flex-1"
                disabled={isSoldOut}
                onClick={handleBook}
              >
                예약하기
              </button>

              <button
                type="button"
                className="btn btn-ghost"
                disabled={addToCart.isPending || removeFromCart.isPending}
                onClick={handleToggleWish}
                title={isInCart ? "찜 해제" : "찜하기"}
              >
                <Heart
                  className={`size-5 ${isInCart ? "fill-red-500 text-red-500" : "text-base-content/40"}`}
                />
              </button>
            </div>
          </div>
        </section>

        <div className="divider" />

        {/* 리뷰 */}
        <section>
          <h2 className="mb-4 text-xl font-bold">
            리뷰 {reviews && reviews.length > 0 && `(${reviews.length})`}
          </h2>
          <ReviewList reviews={reviews ?? []} />
        </section>
      </div>

      <ToastContainer toasts={toasts} />
    </>
  )
}
