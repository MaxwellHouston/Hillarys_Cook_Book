/**
 * Migrate recipe images from Firebase Storage to Cloudinary.
 *
 * For each recipe whose imgSrc points to firebasestorage.googleapis.com:
 *   1. Downloads the image from Firebase Storage
 *   2. Uploads it to Cloudinary
 *   3. Updates imgSrc in Firestore with the new Cloudinary URL
 *
 * Usage:
 *   npx tsx scripts/migrate-images-to-cloudinary.ts --dry-run   # preview only
 *   npx tsx scripts/migrate-images-to-cloudinary.ts             # live run
 *
 * A JSON backup of all affected recipes is written to backups/ before any writes.
 */

import * as admin from 'firebase-admin'
import * as dotenv from 'dotenv'
import * as path from 'path'
import * as fs from 'fs'
import { v2 as cloudinary } from 'cloudinary'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  }),
})

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const db = admin.firestore()
const isDryRun = process.argv.includes('--dry-run')

async function run() {
  console.log(isDryRun ? '🔍 DRY RUN — no writes will occur\n' : '🚀 LIVE RUN — writing to Firestore + Cloudinary\n')

  const snapshot = await db.collection('recipes').get()
  const toMigrate = snapshot.docs.filter((doc) => {
    const src: string | null = doc.data().imgSrc ?? null
    return src && src.includes('firebasestorage.googleapis.com')
  })

  console.log(`Found ${toMigrate.length} recipes with Firebase Storage images\n`)

  if (toMigrate.length === 0) {
    console.log('Nothing to migrate.')
    process.exit(0)
  }

  // Backup
  const timestamp = new Date().toISOString().slice(0, 10)
  const backupPath = path.resolve(process.cwd(), `backups/pre-cloudinary-migration-${timestamp}.json`)
  fs.mkdirSync(path.dirname(backupPath), { recursive: true })
  fs.writeFileSync(backupPath, JSON.stringify(toMigrate.map((d) => ({ id: d.id, data: d.data() })), null, 2))
  console.log(`💾 Backup written to ${backupPath}\n`)

  let succeeded = 0
  let failed = 0

  for (const doc of toMigrate) {
    const { name, imgSrc } = doc.data()
    console.log(`[${doc.id}] ${name}`)
    console.log(`  Firebase URL: ${imgSrc}`)

    if (isDryRun) {
      console.log(`  → would upload to Cloudinary\n`)
      continue
    }

    try {
      const result = await cloudinary.uploader.upload(imgSrc, {
        folder: 'cookbook',
        public_id: doc.id,
        overwrite: true,
      })
      const newUrl = result.secure_url
      console.log(`  ✓ Cloudinary URL: ${newUrl}`)
      await doc.ref.update({ imgSrc: newUrl })
      succeeded++
    } catch (err: any) {
      console.error(`  ✗ Failed: ${err.message}`)
      failed++
    }

    console.log()
  }

  console.log(`\n✅ Migrated: ${succeeded}`)
  if (failed > 0) console.log(`❌ Failed:   ${failed} — check output above, re-run to retry`)
  if (!isDryRun) console.log('\nDone. You can delete this script once all images are migrated.')
  process.exit(0)
}

run().catch((err) => {
  console.error('Migration failed:', err)
  process.exit(1)
})
