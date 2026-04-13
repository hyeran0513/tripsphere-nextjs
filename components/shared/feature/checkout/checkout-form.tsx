"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { CheckCircle, Wallet } from "lucide-react"

import { PATH } from "@/constants/path"
import { useAuth } from "@/hooks/auth/use-auth"
import { usePointsQuery, calculateAvailablePoints } from "@/hooks/queries/use-points-query"
import { useCreateOrderMutation } from "@/hooks/mutations/use-order-mutation"
import { useRoomDetailQuery } from "@/hooks/queries/use-room-detail-query"
import { getDiscountedPrice, formatDiscountRate, getStayTypeLabel } from "@/types/room"
import { NoData } from "@/components/ui/no-data"

export function CheckoutForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const roomId = searchParams.get("roomId")
  const bookingType = searchParams.get("type")

  const { user, isLoading: authLoading } = useAuth()
  const { data: room, isLoading: roomLoading } = useRoomDetailQuery(roomId)
  const { data: points } = usePointsQuery(user?.uid ?? null)
  const createOrder = useCreateOrderMutation()

  const [selectedTime, setSelectedTime] = useState("14:00")
  const [duration, setDuration] = useState(4)
  const [orderComplete, setOrderComplete] = useState(false)

  const availablePoints = points ? calculateAvailablePoints(points) : 0
  const price = room ? getDiscountedPrice(room) : 0

  const canPay = availablePoints >= price && price > 0

  const handleSubmit = async () => {
    if (!user || !roomId || !room || !canPay) return

    await createOrder.mutateAsync({
      room_id: roomId,
      user_id: user.uid,
      used_points: price,
      selectedTime: room.stay_type === "day_use" ? selectedTime : undefined,
      duration: room.stay_type === "day_use" ? { hours: duration, minutes: 0 } : undefined,
    })

    setOrderComplete(true)
  }

  if (authLoading || roomLoading) {
    return (
      <div className="mx-auto max-w-6xl space-y-4 p-4">
        <div className="skeleton h-8 w-40" />
        <div className="skeleton h-48 w-full rounded-lg" />
        <div className="skeleton h-32 w-full rounded-lg" />
      </div>
    )
  }

  if (!user) {
    router.push(PATH.LOGIN)
    return null
  }

  if (!room || !bookingType) {
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

  if (orderComplete) {
    return (
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-center py-20">
        <CheckCircle className="mb-4 size-16 text-success" />
        <h2 className="text-2xl font-bold">예약이 완료되었습니다!</h2>
        <p className="mt-2 text-base-content/60">
          {price.toLocaleString()} 포인트가 사용되었습니다.
        </p>
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => router.push(PATH.ORDERS)}
          >
            예약 내역 보기
          </button>
          <button type="button" className="btn btn-ghost" onClick={() => router.push(PATH.HOME)}>
            홈으로
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4">
      <h1 className="text-2xl font-bold">결제하기</h1>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        {/* 예약 객실 정보 */}
        <div className="flex-1 space-y-6">
          {/* 객실 정보 */}
          <div className="card border border-base-300 bg-base-100">
            <div className="card-body gap-3">
              {/* 객실 이름 */}
              <h3 className="card-title text-base">{room.name}</h3>

              {/* 객실 설명 */}
              {room.description && (
                <p className="text-sm text-base-content/60">{room.description}</p>
              )}

              <div className="flex items-center gap-2">
                {/* 숙박 유형 */}
                <span className="badge badge-outline">{getStayTypeLabel(room.stay_type)}</span>

                {/* 인원 정보 */}
                <span className="badge badge-outline">
                  성인 {room.capacity.adults}인 / 아동 {room.capacity.children}인
                </span>
              </div>

              {/* 가격 정보 */}
              <div className="flex items-center gap-2">
                {room.discount_rate > 0 && (
                  <>
                    {/* 할인율 */}
                    <span className="badge badge-error badge-sm font-bold">
                      {formatDiscountRate(room.discount_rate)}
                    </span>

                    {/* 원래 가격 */}
                    <span className="text-sm text-base-content/40 line-through">
                      {room.original_price.toLocaleString()}원
                    </span>
                  </>
                )}

                {/* 결제 가격 */}
                <span className="text-lg font-bold">{price.toLocaleString()}원</span>
              </div>
            </div>
          </div>

          {/* 대실 옵션 */}
          {room.stay_type === "day_use" && (
            <div className="card border border-base-300 bg-base-100">
              <div className="card-body gap-4">
                <h3 className="font-semibold">대실 옵션</h3>

                <div className="form-control">
                  {/* 입실 시간 라벨 */}
                  <label className="label" htmlFor="selectedTime">
                    <span className="label-text">입실 시간</span>
                  </label>

                  {/* 입실 시간 입력 필드 */}
                  <input
                    id="selectedTime"
                    type="time"
                    className="input input-bordered w-full"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                  />
                </div>

                <div className="form-control">
                  {/* 이용 시간 라벨 */}
                  <label className="label" htmlFor="duration">
                    <span className="label-text">이용 시간</span>
                  </label>

                  {/* 이용 시간 선택 필드 */}
                  <select
                    id="duration"
                    className="select select-bordered w-full"
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                  >
                    {[2, 3, 4, 5, 6].map((h) => (
                      <option key={h} value={h}>
                        {h}시간
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 결제 정보 사이드바 */}
        <aside className="w-full shrink-0 lg:w-80">
          <div className="sticky top-20 space-y-4">
            {/* 포인트 결제 */}
            <div className="card border border-base-300 bg-base-100">
              <div className="card-body gap-4">
                <h3 className="font-semibold">결제 정보</h3>

                <div className="flex items-center justify-between">
                  {/* 보유 포인트 라벨 */}
                  <span className="flex items-center gap-1 text-base-content/70">
                    <Wallet className="size-4" />
                    보유 포인트
                  </span>

                  {/* 보유 포인트 값 */}
                  <span className="font-semibold">{availablePoints.toLocaleString()}P</span>
                </div>

                {/* 구분선 */}
                <div className="divider my-0" />

                {/* 결제 금액 라벨 */}
                <div className="flex items-center justify-between">
                  <span className="text-base-content/70">결제 금액</span>
                  <span className="text-lg font-bold text-primary">{price.toLocaleString()}P</span>
                </div>

                {/* 결제 후 잔액 라벨 */}
                <div className="flex items-center justify-between">
                  <span className="text-base-content/70">결제 후 잔액</span>
                  <span className="font-semibold">
                    {(availablePoints - price).toLocaleString()}P
                  </span>
                </div>

                {/* 포인트 부족 경고 */}
                {!canPay && (
                  <div className="alert alert-error">
                    <span>포인트가 부족합니다.</span>
                  </div>
                )}

                {/* 결제 버튼 */}
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
