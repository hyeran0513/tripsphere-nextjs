"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Wallet, Plus } from "lucide-react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { addDoc, collection } from "firebase/firestore"

import { PATH } from "@/constants/path"
import { useAuth } from "@/hooks/auth/use-auth"
import { usePointsQuery, calculateAvailablePoints } from "@/hooks/queries/use-points-query"
import { db } from "@/lib/firebase/client"

export function PointsPageContent() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const { data: points, isLoading } = usePointsQuery(user?.uid ?? null)
  const queryClient = useQueryClient()
  const [amount, setAmount] = useState("")

  const addPoints = useMutation({
    mutationFn: async (value: number) => {
      await addDoc(collection(db, "points"), {
        user_id: user!.uid,
        title: "포인트 충전",
        description: `${value.toLocaleString()}P 충전`,
        points: value,
        type: "add",
        received_date: new Date().toISOString(),
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["points", user!.uid] })
      setAmount("")
    },
  })

  const handleSubmit = () => {
    const value = Number(amount)
    if (value > 0) addPoints.mutate(value)
  }

  if (authLoading || isLoading) {
    return (
      <div className="mx-auto max-w-6xl space-y-4 p-4">
        <div className="skeleton h-8 w-40" />
        <div className="skeleton h-32 w-full rounded-lg" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-base-content/50">
        <Wallet className="mb-3 size-12" />
        <p className="text-lg font-medium">로그인이 필요합니다</p>
        <button
          type="button"
          className="btn btn-primary btn-sm mt-4"
          onClick={() => router.push(PATH.LOGIN)}
        >
          로그인하기
        </button>
      </div>
    )
  }

  const available = points ? calculateAvailablePoints(points) : 0

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4">
      <h1 className="text-2xl font-bold">포인트</h1>

      {/* 보유 포인트 */}
      <div className="card border border-base-300 bg-base-100">
        <div className="card-body items-center text-center">
          <Wallet className="size-8 text-primary" />
          <p className="text-sm text-base-content/60">보유 포인트</p>
          <p className="text-3xl font-bold text-primary">{available.toLocaleString()}P</p>
        </div>
      </div>

      {/* 충전 */}
      <div className="card border border-base-300 bg-base-100">
        <div className="card-body gap-4">
          <h3 className="font-semibold">포인트 충전</h3>
          <div className="flex gap-2">
            <input
              type="number"
              className="input input-bordered flex-1"
              placeholder="충전할 포인트를 입력하세요"
              value={amount}
              min={1}
              onChange={(e) => setAmount(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
            <button
              type="button"
              className="btn btn-primary"
              disabled={!amount || Number(amount) <= 0 || addPoints.isPending}
              onClick={handleSubmit}
            >
              <Plus className="size-4" />
              {addPoints.isPending ? "충전 중..." : "충전"}
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {[5000, 10000, 50000, 100000].map((v) => (
              <button
                key={v}
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => setAmount(String(v))}
              >
                +{v.toLocaleString()}P
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 내역 */}
      {points && points.length > 0 && (
        <div className="card border border-base-300 bg-base-100">
          <div className="card-body gap-3">
            <h3 className="font-semibold">포인트 내역</h3>
            <div className="flex flex-col divide-y divide-base-200">
              {[...points]
                .sort(
                  (a, b) =>
                    new Date(b.received_date).getTime() - new Date(a.received_date).getTime()
                )
                .map((p) => (
                  <div key={p.id} className="flex items-center justify-between py-3">
                    <div>
                      <p className="text-sm font-medium">{p.title}</p>
                      <p className="text-xs text-base-content/50">{p.description}</p>
                      <p className="text-xs text-base-content/40">
                        {new Date(p.received_date).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`font-semibold ${p.type === "add" ? "text-success" : "text-error"}`}
                    >
                      {p.type === "add" ? "+" : "-"}
                      {p.points.toLocaleString()}P
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
