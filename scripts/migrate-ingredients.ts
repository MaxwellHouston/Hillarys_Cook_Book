/**
 * Phase 4 migration: convert Ingredient.amount string → number,
 * add freeform flag, validate measure, add servings field to Recipe.
 *
 * Usage:
 *   npx tsx scripts/migrate-ingredients.ts --dry-run   # preview only
 *   npx tsx scripts/migrate-ingredients.ts             # write to Firestore
 *
 * A JSON backup is always written to backups/ before any changes.
 * To rollback: npx tsx scripts/rollback-migration.ts backups/<filename>.json
 */

import * as admin from 'firebase-admin'
import * as dotenv from 'dotenv'
import * as path from 'path'
import * as fs from 'fs'
import Fraction from 'fraction.js'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  }),
})

const db = admin.firestore()
const isDryRun = process.argv.includes('--dry-run')

const VALID_MEASURES = new Set([
  'tsp', 'tbsp', 'fl. oz', 'cup', 'pt', 'qt', 'gallon', 'ml', 'liter',
  'oz', 'lbs', 'gram', 'kg',
  'each', 'piece', 'clove', 'slice', 'square', 'can', 'unit',
  'other',
])

const FREEFORM_PATTERNS = [
  /to taste/i, /as needed/i, /pinch/i, /dash/i, /handful/i, /some/i,
]

function parseAmount(raw: string): { amount: number; freeform: boolean } {
  const trimmed = (raw ?? '').trim()

  // Empty or freeform indicators in the amount field
  if (!trimmed || trimmed === '0') return { amount: 0, freeform: false }

  // Check for freeform text patterns
  if (FREEFORM_PATTERNS.some((p) => p.test(trimmed))) {
    return { amount: 0, freeform: true }
  }

  try {
    const value = new Fraction(trimmed).valueOf()
    return { amount: value, freeform: false }
  } catch {
    console.warn(`  ⚠ Could not parse amount "${trimmed}" — marking freeform`)
    return { amount: 0, freeform: true }
  }
}

function isFreeformName(name: string): boolean {
  return FREEFORM_PATTERNS.some((p) => p.test(name))
}

async function run() {
  console.log(isDryRun ? '🔍 DRY RUN — no writes will occur\n' : '🚀 LIVE RUN — writing to Firestore\n')

  const snapshot = await db.collection('recipes').get()
  const allDocs = snapshot.docs

  // --- Backup ---
  const timestamp = new Date().toISOString().slice(0, 10)
  const backupPath = path.resolve(process.cwd(), `backups/recipes-${timestamp}.json`)
  const backup = allDocs.map((doc) => ({ id: doc.id, data: doc.data() }))
  fs.writeFileSync(backupPath, JSON.stringify(backup, null, 2))
  console.log(`💾 Backup written to ${backupPath}\n`)

  let updatedCount = 0
  let flaggedIngredients = 0
  const BATCH_SIZE = 500
  let batch = db.batch()
  let batchCount = 0

  for (const doc of allDocs) {
    const data = doc.data()
    const ingredients = (data.ingredientsList ?? []) as any[]

    const migratedIngredients = ingredients.map((ing: any) => {
      // If already migrated (amount is already a number), skip
      const rawAmount = typeof ing.amount === 'number' ? String(ing.amount) : (ing.amount ?? '')
      const { amount, freeform: freeformFromAmount } = parseAmount(rawAmount)
      const freeformFromName = isFreeformName(ing.name ?? '')
      const freeform = freeformFromAmount || freeformFromName

      if (freeform) flaggedIngredients++

      let measure = ing.measure ?? 'other'
      if (!VALID_MEASURES.has(measure)) {
        console.warn(`  ⚠ [${doc.id}] Unknown measure "${measure}" for "${ing.name}" → falling back to "other"`)
        measure = 'other'
      }

      return {
        key: ing.key ?? 0,
        name: ing.name ?? '',
        amount,
        measure,
        freeform,
        tag: ing.tag ?? null,
      }
    })

    const update = {
      ingredientsList: migratedIngredients,
      servings: data.servings ?? null,
    }

    console.log(`${isDryRun ? '[dry]' : '[write]'} ${doc.id} — ${data.name} (${ingredients.length} ingredients)`)

    if (!isDryRun) {
      batch.update(doc.ref, update)
      batchCount++

      if (batchCount === BATCH_SIZE) {
        await batch.commit()
        batch = db.batch()
        batchCount = 0
      }
    }

    updatedCount++
  }

  if (!isDryRun && batchCount > 0) {
    await batch.commit()
  }

  console.log(`\n✅ ${isDryRun ? 'Would update' : 'Updated'} ${updatedCount} recipes`)
  console.log(`⚠  ${flaggedIngredients} ingredients marked as freeform`)
  if (!isDryRun) console.log('\nDone. You can delete this script.')
  process.exit(0)
}

run().catch((err) => {
  console.error('Migration failed:', err)
  process.exit(1)
})
