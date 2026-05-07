/**
 * Rollback script — restores all recipe documents from a JSON backup.
 *
 * Usage:
 *   npx tsx scripts/rollback-migration.ts backups/recipes-2026-05-07.json
 */

import * as admin from 'firebase-admin'
import * as dotenv from 'dotenv'
import * as path from 'path'
import * as fs from 'fs'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  }),
})

const db = admin.firestore()
const backupFile = process.argv[2]

if (!backupFile) {
  console.error('Usage: npx tsx scripts/rollback-migration.ts <backup-file>')
  process.exit(1)
}

async function rollback() {
  const backupPath = path.resolve(process.cwd(), backupFile)
  if (!fs.existsSync(backupPath)) {
    console.error(`Backup file not found: ${backupPath}`)
    process.exit(1)
  }

  const records: { id: string; data: any }[] = JSON.parse(fs.readFileSync(backupPath, 'utf-8'))
  console.log(`📦 Restoring ${records.length} recipes from ${backupFile}\n`)

  const BATCH_SIZE = 500
  let batch = db.batch()
  let count = 0

  for (const record of records) {
    const ref = db.collection('recipes').doc(record.id)
    batch.set(ref, record.data)
    count++

    if (count % BATCH_SIZE === 0) {
      await batch.commit()
      batch = db.batch()
      console.log(`  Restored ${count}/${records.length}...`)
    }
  }

  if (count % BATCH_SIZE !== 0) {
    await batch.commit()
  }

  console.log(`\n✅ Rollback complete — ${count} recipes restored.`)
  process.exit(0)
}

rollback().catch((err) => {
  console.error('Rollback failed:', err)
  process.exit(1)
})
