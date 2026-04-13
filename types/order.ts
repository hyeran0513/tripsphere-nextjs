export type Order = {
  id: string
  lodging_id: string
  user_id: string
  order_date: string
  payment_status: "pending" | "completed" | "cancelled"
  used_points: number
  cancel_reason?: string
  reviewed?: boolean
}
