import { cert, initializeApp } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"
import serviceAccount from "../service-account.json"

initializeApp({ credential: cert(serviceAccount as Parameters<typeof cert>[0]) })
const db = getFirestore()

async function main() {
  const all = await db.collection("public_lodgings").get()
  const typeCount: Record<string, number> = {}
  for (const d of all.docs) {
    const t = d.data().type ?? "(없음)"
    typeCount[t] = (typeCount[t] ?? 0) + 1
  }
  console.log("=== type 분포 ===")
  console.log(typeCount)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
