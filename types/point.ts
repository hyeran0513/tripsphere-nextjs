export type Point = {
  id: string
  user_id: string
  title: string
  description: string
  points: number
  type: "add" | "used"
  received_date: string
}
