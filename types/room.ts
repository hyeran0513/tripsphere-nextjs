export type Room = {
  id: string
  accommodation_id: string
  name: string
  description?: string
  capacity: {
    adults: number
    children: number
  }
  images?: string[]
  original_price: number
  discount_rate: number
  stock: number
  availability: boolean
  check_in: string | { seconds: number; nanoseconds: number }
  check_out: string | { seconds: number; nanoseconds: number }
  stay_type: string
  type: string
  services?: string[]
  room_group_id?: string
}

/** stay_type을 한글 라벨로 변환 */
export function getStayTypeLabel(stayType: string): string {
  if (stayType === "stay") return "숙박"
  if (stayType === "day_use") return "대실"
  return stayType
}

/** 할인 적용된 최종 가격 계산 */
export function getDiscountedPrice(room: Room): number {
  return Math.round(room.original_price * (1 - room.discount_rate / 100))
}

/** Firestore Timestamp 또는 문자열을 시간 문자열로 변환 */
export function formatRoomTime(value: string | { seconds: number; nanoseconds: number }): string {
  if (typeof value === "string") return value
  const date = new Date(value.seconds * 1000)
  return date.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit", hour12: false })
}
