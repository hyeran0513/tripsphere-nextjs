export type Order = {
  id: string
  room_id: string
  user_id: string
  order_date: string
  payment_status: "pending" | "completed" | "cancelled"
  used_points: number
  cancel_reason?: string
  selectedTime?: string
  duration?: {
    hours?: number
    minutes?: number
  }
}
