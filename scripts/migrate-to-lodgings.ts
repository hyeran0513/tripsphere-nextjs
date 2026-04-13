/**
 * accommodations + rooms → public_lodgings 단일 모델 전환 마이그레이션
 *
 * 실행: npx tsx scripts/migrate-to-lodgings.ts
 * 드라이런: npx tsx scripts/migrate-to-lodgings.ts --dry
 *
 * 동작:
 * 1. 구 `carts`, `orders`, `reviews` 컬렉션의 모든 문서 삭제
 *    (room_id / accommodation_id 외래키가 이미 의미 없음)
 * 2. 구 `accommodations`, `rooms` 컬렉션의 모든 문서 삭제
 * 3. `public_lodgings`는 건드리지 않음
 */

import { cert, initializeApp } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"
import serviceAccount from "../service-account.json"

const DRY_RUN = process.argv.includes("--dry")

initializeApp({
  credential: cert(serviceAccount as Parameters<typeof cert>[0]),
})

const db = getFirestore()

const COLLECTIONS_TO_WIPE = ["carts", "orders", "reviews", "accommodations", "rooms"] as const

async function wipeCollection(name: string) {
  const snapshot = await db.collection(name).get()
  if (snapshot.empty) {
    console.log(`  [${name}] 비어있음, 스킵`)
    return
  }

  console.log(`  [${name}] ${snapshot.size}개 문서 발견`)

  if (DRY_RUN) {
    console.log(`  [${name}] (드라이런) 삭제 스킵`)
    return
  }

  // Firestore batch write 한계: 500개
  const docs = snapshot.docs
  for (let i = 0; i < docs.length; i += 500) {
    const batch = db.batch()
    for (const doc of docs.slice(i, i + 500)) {
      batch.delete(doc.ref)
    }
    await batch.commit()
  }
  console.log(`  [${name}] ${snapshot.size}개 삭제 완료`)
}

async function main() {
  console.log(`=== 마이그레이션 시작 ${DRY_RUN ? "(드라이런)" : ""} ===`)

  // 안전 체크: public_lodgings가 실제로 존재하는지 확인
  const lodgingsSnap = await db.collection("public_lodgings").limit(1).get()
  if (lodgingsSnap.empty) {
    console.error("❌ public_lodgings 컬렉션이 비어있습니다. 중단합니다.")
    process.exit(1)
  }
  const totalLodgings = (await db.collection("public_lodgings").count().get()).data().count
  console.log(`✅ public_lodgings: ${totalLodgings}개 문서 존재`)

  for (const name of COLLECTIONS_TO_WIPE) {
    await wipeCollection(name)
  }

  console.log(`=== 마이그레이션 완료 ===`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
