import { cert, initializeApp } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"
import serviceAccount from "../service-account.json"

initializeApp({ credential: cert(serviceAccount as Parameters<typeof cert>[0]) })
const db = getFirestore()

async function main() {
  const snap = await db.collection("public_lodgings").limit(3).get()
  console.log(`샘플 ${snap.size}개:`)
  snap.docs.forEach((doc, i) => {
    console.log(`\n--- [${i}] id=${doc.id} ---`)
    console.log(JSON.stringify(doc.data(), null, 2))
  })

  // city 값 분포
  const all = await db.collection("public_lodgings").get()
  const cityCount: Record<string, number> = {}
  for (const d of all.docs) {
    const city = d.data().location?.city ?? "(없음)"
    cityCount[city] = (cityCount[city] ?? 0) + 1
  }
  console.log("\n=== city 분포 ===")
  console.log(cityCount)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
