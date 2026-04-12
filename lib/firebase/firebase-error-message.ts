export function getFirebaseErrorMessage(error: unknown): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof (error as any).code === "string"
  ) {
    const code = (error as any).code as string

    switch (code) {
      case "auth/email-already-in-use":
        return "이미 사용 중인 이메일입니다."

      case "auth/invalid-email":
        return "유효하지 않은 이메일입니다."

      case "auth/user-not-found":
        return "존재하지 않는 사용자입니다."

      case "auth/wrong-password":
        return "비밀번호가 올바르지 않습니다."

      case "auth/invalid-credential":
      case "auth/invalid-login-credentials":
        return "이메일 또는 비밀번호가 올바르지 않습니다."

      case "auth/weak-password":
        return "비밀번호가 너무 약합니다."

      case "auth/too-many-requests":
        return "요청이 너무 많습니다. 잠시 후 다시 시도해주세요."

      case "auth/network-request-failed":
        return "네트워크 오류가 발생했습니다."

      default:
        return "알 수 없는 오류가 발생했습니다."
    }
  }

  return "알 수 없는 오류가 발생했습니다."
}
