import { z } from "zod"

export const profileSchema = z.object({
  nickname: z
    .string()
    .min(1, "닉네임을 입력해주세요.")
    .max(20, "닉네임은 20자 이내로 입력해주세요."),
  username: z.string().min(1, "이름을 입력해주세요.").max(30, "이름은 30자 이내로 입력해주세요."),
  phone: z
    .string()
    .min(1, "전화번호를 입력해주세요.")
    .regex(/^01[016789]-?\d{3,4}-?\d{4}$/, "전화번호 형식이 올바르지 않습니다."),
})

export type ProfileSchema = z.infer<typeof profileSchema>
