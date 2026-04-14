"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { CheckCircle, Maximize2, Users, Wallet } from "lucide-react"

import { PATH } from "@/constants/path"
import { useAuth } from "@/hooks/auth/use-auth"
import { usePointsQuery, calculateAvailablePoints } from "@/hooks/queries/use-points-query"
import { useCreateOrderMutation } from "@/hooks/mutations/use-order-mutation"
import { useLodgingDetailQuery } from "@/hooks/queries/use-lodging-detail-query"
import { useRoomDetailQuery } from "@/hooks/queries/use-room-detail-query"
import { getLodgingTypeLabel } from "@/types/lodging"
import { NoData } from "@/components/ui/no-data"

export function CheckoutForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const roomId = searchParams.get("roomId")

  const { user, isLoading: authLoading } = useAuth()
  const { data: room, isLoading: roomLoading } = useRoomDetailQuery(roomId)
  const { data: lodging, isLoading: lodgingLoading } = useLodgingDetailQuery(
    room?.accommodation_id ?? null
  )
  const { data: points } = usePointsQuery(user?.uid ?? null)
  const createOrder = useCreateOrderMutation()

  const [orderComplete, setOrderComplete] = useState(false)

  const availablePoints = points ? calculateAvailablePoints(points) : 0
  const price = room?.price_point ?? 0

  const canPay = availablePoints >= price && price > 0

  // 결제 버튼 클릭 시 예약 생성
  const handleSubmit = async () => {
    if (!user || !room || !lodging || !canPay) return

    await createOrder.mutateAsync({
      lodging_id: room.accommodation_id,
      room_id: room.id,
      user_id: user.uid,
      used_points: price,
    })

    setOrderComplete(true)
  }

  // 로딩 중일 때 스케쥴러 표시
  if (authLoading || roomLoading || lodgingLoading) {
    return (
      <div className="mx-auto max-w-6xl space-y-4 p-4">
        <div className="skeleton h-8 w-40" />
        <div className="skeleton h-48 w-full rounded-lg" />
        <div className="skeleton h-32 w-full rounded-lg" />
      </div>
    )
  }

  // 로그인 안 되어 있을 때 로그인 페이지로 이동
  if (!user) {
    router.push(PATH.LOGIN)
    return null
  }

  // 숙소 또는 객실 정보가 없을 때 홈으로 이동
  if (!room || !lodging) {
    return (
      <NoData title="예약 정보를 찾을 수 없습니다.">
        <button
          type="button"
          className="btn btn-primary btn-sm mt-4"
          onClick={() => router.push(PATH.HOME)}
        >
          홈으로
        </button>
      </NoData>
    )
  }

  // 예약 완료 시 완료 메시지 표시
  if (orderComplete) {
    return (
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-center py-20">
        {/* 예약 완료 아이콘 */}
        <CheckCircle className="mb-4 size-16 text-success" />

        {/* 예약 완료 메시지 */}
        <h2 className="text-2xl font-bold">예약이 완료되었습니다!</h2>

        {/* 사용된 포인트 */}
        <p className="mt-2 text-base-content/60">
          {price.toLocaleString()} 포인트가 사용되었습니다.
        </p>

        <div className="mt-6 flex gap-3">
          {/* 예약 내역 보기 */}
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => router.push(PATH.ORDERS)}
          >
            예약 내역 보기
          </button>

          {/* 홈으로 이동 */}
          <button type="button" className="btn btn-ghost" onClick={() => router.push(PATH.HOME)}>
            홈으로
          </button>
        </div>
      </div>
    )
  }

  // 예약 폼 표시
  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4">
      <h1 className="text-2xl font-bold">결제하기</h1>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        {/* 예약 숙소/객실 정보 */}
        <div className="flex-1 space-y-6">
          <div className="card border border-base-300 bg-base-100">
            <div className="card-body gap-3">
              {/* 숙소 이름 */}
              <div>
                <div className="text-xs text-base-content/60">{lodging.name}</div>
                <h3 className="card-title text-base">{room.name}</h3>
              </div>

              {/* 객실 설명 */}
              {room.description && (
                <p className="text-sm text-base-content/60">{room.description}</p>
              )}

              <div className="flex flex-wrap items-center gap-2">
                {/* 숙소 유형 */}
                {lodging.type && (
                  <span className="badge badge-outline">{getLodgingTypeLabel(lodging.type)}</span>
                )}

                {/* 객실 타입 */}
                {room.type && <span className="badge badge-outline">{room.type}</span>}

                {/* 인원 정보 */}
                <span className="badge badge-outline">
                  <Users className="mr-1 size-3" />
                  기준 {room.capacity.adults}인 / 최대 {room.max_capacity}인
                </span>

                {/* 크기 */}
                {room.size?.pyeong && (
                  <span className="badge badge-outline">
                    <Maximize2 className="mr-1 size-3" />
                    {room.size.pyeong}평
                  </span>
                )}
              </div>

              {/* 가격 정보 */}
              <div className="flex items-center gap-2">
                {room.original_price && room.original_price > room.price_point && (
                  <span className="text-sm text-base-content/40 line-through">
                    {room.original_price.toLocaleString()}원
                  </span>
                )}
                <span className="text-lg font-bold">{price.toLocaleString()}원</span>
              </div>
            </div>
          </div>
        </div>

        {/* 결제 정보 사이드바 */}
        <aside className="w-full shrink-0 lg:w-80">
          <div className="sticky top-20 space-y-4">
            <div className="card border border-base-300 bg-base-100">
              <div className="card-body gap-4">
                <h3 className="font-semibold">결제 정보</h3>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1 text-base-content/70">
                    <Wallet className="size-4" />
                    보유 포인트
                  </span>
                  <span className="font-semibold">{availablePoints.toLocaleString()}P</span>
                </div>

                <div className="divider my-0" />

                <div className="flex items-center justify-between">
                  <span className="text-base-content/70">결제 금액</span>
                  <span className="text-lg font-bold text-primary">{price.toLocaleString()}P</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-base-content/70">결제 후 잔액</span>
                  <span className="font-semibold">
                    {(availablePoints - price).toLocaleString()}P
                  </span>
                </div>

                {!canPay && (
                  <div className="alert alert-error">
                    <span>포인트가 부족합니다.</span>
                  </div>
                )}

                <button
                  type="button"
                  className="btn btn-primary btn-block btn-lg"
                  disabled={!canPay || createOrder.isPending}
                  onClick={handleSubmit}
                >
                  {createOrder.isPending ? "결제 중..." : `${price.toLocaleString()}P 결제하기`}
                </button>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
