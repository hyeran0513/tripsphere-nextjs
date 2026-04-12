import { z } from "zod"

export const signUpSchema = z
  .object({
    email: z.string().min(1, "이메일을 입력해주세요.").email("이메일 형식이 아닙니다."),
    password: z
      .string()
      .min(8, "비밀번호는 8자 이상이어야 합니다.")
      .max(100, "비밀번호가 너무 깁니다."),
    confirmPassword: z.string().min(1, "비밀번호 확인을 입력해주세요."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["confirmPassword"],
  })

export type SignUpSchema = z.infer<typeof signUpSchema>

export const loginSchema = z.object({
  email: z.string().min(1, "이메일을 입력해주세요.").email("이메일 형식이 아닙니다."),
  password: z.string().min(1, "비밀번호를 입력해주세요."),
})

export type LoginSchema = z.infer<typeof loginSchema>
