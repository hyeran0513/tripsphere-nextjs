import { z } from "zod"

export const signUpSchema = z
  .object({
    email: z.string().min(1, "이메일을 입력해주세요.").email("이메일 형식이 아닙니다."),
    password: z
      .string()
      .min(8, "비밀번호는 8자 이상이어야 합니다.")
      .max(100, "비밀번호가 너무 깁니다."),
    confirmPassword: z.string().min(1, "비밀번호 확인을 입력해주세요."),
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
