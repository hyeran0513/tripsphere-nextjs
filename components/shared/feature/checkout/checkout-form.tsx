"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { CheckCircle, Wallet } from "lucide-react"

import { PATH } from "@/constants/path"
import { useAuth } from "@/hooks/auth/use-auth"
import { usePointsQuery, calculateAvailablePoints } from "@/hooks/queries/use-points-query"
import { useCreateOrderMutation } from "@/hooks/mutations/use-order-mutation"
import { useLodgingDetailQuery } from "@/hooks/queries/use-lodging-detail-query"
import { getLodgingTypeLabel } from "@/types/lodging"
import { NoData } from "@/components/ui/no-data"

export function CheckoutForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const lodgingId = searchParams.get("lodgingId")

  const { user, isLoading: authLoading } = useAuth()
  const { data: lodging, isLoading: lodgingLoading } = useLodgingDetailQuery(lodgingId)
  const { data: points } = usePointsQuery(user?.uid ?? null)
  const createOrder = useCreateOrderMutation()

  const [orderComplete, setOrderComplete] = useState(false)

  const availablePoints = points ? calculateAvailablePoints(points) : 0
  const price = lodging?.price_point ?? 0

  const canPay = availablePoints >= price && price > 0

  const handleSubmit = async () => {
    if (!user || !lodgingId || !lodging || !canPay) return

    await createOrder.mutateAsync({
      lodging_id: lodgingId,
      user_id: user.uid,
      used_points: price,
    })

    setOrderComplete(true)
  }

  if (authLoading || lodgingLoading) {
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

  if (!lodging) {
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
        {/* 예약 숙소 정보 */}
        <div className="flex-1 space-y-6">
          <div className="card border border-base-300 bg-base-100">
            <div className="card-body gap-3">
              {/* 숙소 이름 */}
              <h3 className="card-title text-base">{lodging.name}</h3>

              {/* 숙소 설명 */}
              {lodging.description && (
                <p className="text-sm text-base-content/60">{lodging.description}</p>
              )}

              <div className="flex flex-wrap items-center gap-2">
                {/* 숙소 유형 */}
                {lodging.type && (
                  <span className="badge badge-outline">{getLodgingTypeLabel(lodging.type)}</span>
                )}

                {/* 인원 정보 */}
                <span className="badge badge-outline">
                  성인 {lodging.capacity.adults}인 / 아동 {lodging.capacity.children}인
                </span>
              </div>

              {/* 가격 정보 */}
              <div className="flex items-center gap-2">
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
