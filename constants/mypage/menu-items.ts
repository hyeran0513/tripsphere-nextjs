import { ClipboardList, Heart, UserPen, Wallet } from "lucide-react"

import { PATH } from "@/constants/path"

export const MENU_ITEMS = [
  { label: "포인트 내역", href: PATH.POINTS, icon: Wallet },
  { label: "예약 내역", href: PATH.ORDERS, icon: ClipboardList },
  { label: "찜 목록", href: PATH.CART, icon: Heart },
  { label: "회원정보 수정", href: PATH.PROFILE, icon: UserPen },
]
