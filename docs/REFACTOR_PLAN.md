# Hillary's Cookbook — Refactor Plan

This document outlines the planned refactor in recommended execution order.
Each phase should be completed and verified before starting the next.

---

## Phase 1: TypeScript Migration

**Goal:** Add type safety across the entire codebase without changing any behavior.

### Steps

**1. Install dependencies**
```bash
npm install --save-dev typescript @types/react @types/react-dom @types/node
```
Create a `tsconfig.json` (Next.js will generate a base one when you run `next dev` after installing TypeScript).

**2. Rename files incrementally**
Convert files from `.js` to `.tsx` (components) or `.ts` (utilities, non-JSX) one at a time.
Recommended order — start with utilities since they have no JSX and are the foundation everything else depends on:

- `utilities/firebase.js` → `firebase.ts`
- `utilities/db.js` → `db.ts`
- `utilities/authCheck.js` → `authCheck.ts`
- `context/favoritesContext.js` → `favoritesContext.tsx`
- All `components/**` → `.tsx`
- All `pages/**` → `.tsx`

**3. Define shared types**
Create `types/index.ts` to hold shared data shapes used throughout the app:

```ts
export type Ingredient = {
  key: number;
  name: string;
  amount: string;
  measure: string;
  tag: string | null;
};

export type Direction = {
  description: string;
};

export type Group = {
  id: number;
  name: string;
};

export type Recipe = {
  id: string;
  name: string;
  author: string;
  uploader: string;
  uploaderAvatar: string;
  category: string | null;
  groups: Group[];
  ingredientsList: Ingredient[];
  directionsList: Direction[];
  keywordsArray: string[];
  imgSrc: string | null;
  created: any; // Firestore Timestamp — can be typed more strictly later
};

export type UserFavorites = {
  favoriteList: string[];
};
```

**4. Type the Firebase utilities**
`db.ts` functions should have typed parameters and return types using the types defined above.
Example:
```ts
export const getRecipeById = async ({ id }: { id: string }): Promise<Recipe | undefined>
```

**5. Resolve all TypeScript errors**
Run `npx tsc --noEmit` to surface errors. Fix them before moving on.
Use `strict: true` in `tsconfig.json` to catch the most issues upfront.

### Verification
- `npx tsc --noEmit` passes with zero errors
- App runs identically to before (`npm run dev`)

---

## Phase 2: Next.js App Router Migration ✅

**Goal:** Move from the Pages Router (`/pages`) to the App Router (`/app`), enabling React Server Components, better data fetching, and improved caching.

> Complete Phase 1 first. Migrating TypeScript and App Router simultaneously is error-prone.

### Key Concept Changes

| Pages Router | App Router |
|---|---|
| `getServerSideProps` / `getStaticProps` | `async` Server Components (fetch directly in component) |
| `pages/_app.tsx` | `app/layout.tsx` |
| `pages/_document.tsx` | `app/layout.tsx` (merged) |
| Client-side data fetching in component body | `"use client"` directive + hooks, or server fetch |
| `pages/api/*` | `app/api/*/route.ts` (Route Handlers) |

### Steps

**1. Upgrade Next.js**
```bash
npm install next@latest react@latest react-dom@latest
```

**2. Create the `/app` directory alongside `/pages`**
Next.js supports both routers running in parallel during migration. Use this to migrate one route at a time.

**3. Create `app/layout.tsx`**
This replaces both `_app.tsx` and `_document.tsx`. Move your global styles, font imports, and context providers here.

```tsx
// app/layout.tsx
import './globals.css';
import { FavoritesProvider } from '@/context/favoritesContext';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <FavoritesProvider>
          {children}
        </FavoritesProvider>
      </body>
    </html>
  );
}
```

**4. Migrate routes one at a time**
Create each route in `/app` then delete the corresponding file in `/pages`.

Route mapping:
- `pages/index.tsx` → `app/page.tsx`
- `pages/recipes.tsx` → `app/recipes/page.tsx`
- `pages/recipes/[id].tsx` → `app/recipes/[id]/page.tsx`
- `pages/recipes-search.tsx` → `app/recipes-search/page.tsx`
- `pages/add.tsx` → `app/add/page.tsx`
- `pages/profile.tsx` → `app/profile/page.tsx`
- `pages/auth/login.tsx` → `app/auth/login/page.tsx`
- `pages/api/hello.ts` → `app/api/hello/route.ts`

**5. Mark client components explicitly**
Any component that uses hooks (`useState`, `useEffect`, `useAuthState`, etc.) or browser APIs must have `"use client"` at the top of the file.
Components that only display data passed via props can remain server components.

**6. Move data fetching to the server where possible**
Instead of fetching recipes on the client:
```tsx
// app/recipes/page.tsx — runs on the server, no useEffect needed
import { getAllRecipes } from '@/utilities/db';

export default async function RecipesPage() {
  const recipes = await getAllRecipes();
  return <RecipeList recipes={recipes} />;
}
```

**7. Update the NavBar and Layout components**
`Layout.tsx` wraps pages in the old router. In the App Router, layout is handled by `app/layout.tsx` and nested `layout.tsx` files. Refactor accordingly.

### Verification
- All routes load correctly
- Auth flow (login, redirect) works as expected
- No pages remain in `/pages` directory (except `/pages/api` if not yet migrated)
- Delete `/pages` directory when fully migrated

---

## Phase 3: Auth & Database Fixes

**Goal:** Replace hardcoded admin UIDs with Firebase Custom Claims, and fix inefficient Firestore queries.

### Part A — Admin Auth via Firebase Custom Claims

**Problem:** `authCheck.ts` contains a hardcoded array of UIDs. This is a security risk (UIDs are in source code) and requires a code deploy to add/remove admins.

**Solution:** Firebase Custom Claims let you attach metadata like `{ role: "admin" }` to a user's auth token server-side. The client reads this from the token — no hardcoded IDs needed.

**1. Set up Firebase Admin SDK**
```bash
npm install firebase-admin
```

Create `utilities/firebaseAdmin.ts`:
```ts
import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

export const adminAuth = admin.auth();
export const adminDb = admin.firestore();
```

Store the service account credentials in `.env.local` (never commit this file).

**2. Create an API route to assign admin role**
```ts
// app/api/admin/set-role/route.ts
import { adminAuth } from '@/utilities/firebaseAdmin';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  // This endpoint should itself be protected — only callable by an existing admin
  const { uid } = await req.json();
  await adminAuth.setCustomUserClaims(uid, { role: 'admin' });
  return NextResponse.json({ success: true });
}
```

**3. Replace `authCheck` on the client**
```ts
// utilities/authCheck.ts
import { User } from 'firebase/auth';

export const isAdmin = async (user: User): Promise<boolean> => {
  const token = await user.getIdTokenResult();
  return token.claims.role === 'admin';
};
```

**4. Protect the `/add` route server-side**
In `app/add/page.tsx`, verify the token on the server using the Firebase Admin SDK before rendering the page, returning a redirect if the user is not an admin.

**5. Assign admin claims to existing admins**
Use the Firebase Admin SDK or the Firebase console to set `{ role: "admin" }` on the existing admin user accounts. After this, the hardcoded `authCheck.ts` can be deleted.

---

### Part B — Efficient Firestore Queries

**Problem:** `getAllRecipes()` is called for nearly every query, fetching the entire collection client-side then filtering in JS. This is slow and wastes Firestore read quota.

**1. Add pagination to the recipes list**
```ts
import { collection, query, orderBy, limit, startAfter, getDocs } from 'firebase/firestore';

export const getRecipesPaginated = async (lastDoc?: DocumentSnapshot, pageSize = 20) => {
  const collectionRef = collection(db, 'recipes');
  const q = lastDoc
    ? query(collectionRef, orderBy('created', 'desc'), startAfter(lastDoc), limit(pageSize))
    : query(collectionRef, orderBy('created', 'desc'), limit(pageSize));
  const snapshots = await getDocs(q);
  return {
    recipes: snapshots.docs.map((doc) => ({ ...doc.data(), id: doc.id }) as Recipe),
    lastDoc: snapshots.docs[snapshots.docs.length - 1],
  };
};
```

**2. Fix `getRecipesByArray` to use `where`**
```ts
import { where, query, collection, getDocs } from 'firebase/firestore';

export const getRecipesByArray = async (ids: string[]): Promise<Recipe[]> => {
  if (ids.length === 0) return [];
  // Firestore 'in' supports up to 30 items per query
  const collectionRef = collection(db, 'recipes');
  const q = query(collectionRef, where('__name__', 'in', ids));
  const snapshots = await getDocs(q);
  return snapshots.docs.map((doc) => ({ ...doc.data(), id: doc.id }) as Recipe);
};
```

**3. Add full-text search via Algolia**
Firestore cannot do substring or full-text search natively. The current `getRecipesByKeywords` fetches every recipe to do this in JS — it must be replaced.

- Sign up for Algolia (free tier is sufficient for this scale)
- Install: `npm install algoliasearch`
- Index your recipes collection using a Firebase Extension ("Stream Firestore to Algolia") or a Cloud Function on write
- Replace `getRecipesByKeywords` with an Algolia search call:

```ts
import algoliasearch from 'algoliasearch';

const client = algoliasearch(process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!, process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY!);
const index = client.initIndex('recipes');

export const searchRecipes = async (query: string) => {
  const { hits } = await index.search(query);
  return hits;
};
```

**4. Add Firestore security rules**
Currently your Firestore security rules are unknown, but they should enforce:
- Anyone can read recipes
- Only authenticated users with `role: "admin"` claim can write recipes

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /recipes/{recipeId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.role == 'admin';
    }
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### Verification
- Recipe list loads with pagination, not all at once
- Favorites query uses `where` instead of client-side filter
- Search is fast and returns relevant results
- Admin-only routes reject non-admin users server-side
- Firestore rules block unauthorized writes

---

## Next Steps (Future Phases)

### Drop MUI — Replace with Tailwind + shadcn/ui ✅
Completed. All MUI components replaced with Tailwind utility classes and shadcn/ui primitives. `@mui/material`, `@emotion/react`, and `@emotion/styled` removed.

---

## Phase 4: Recipe Scaling & Strict Ingredient Model

**Goal:** Enable recipes to be doubled, halved, or scaled by any factor. This requires replacing the current loosely-typed ingredient model with a strict numeric + unit system, and adding conversion logic so scaled amounts display cleanly (e.g. `1.5 cups` → `1 cup + 8 tbsp`, `3 tsp` → `1 tbsp`).

### Problems with the current model

- `amount` is a `string` — impossible to do arithmetic on `"1/2"` or `"1 1/4"` without parsing
- `measure` is a `string` — no type safety, no conversion table, typos silently accepted
- `Recipe` has no `servings` field — scaling has no reference baseline

---

### Step 1 — Install libraries

```bash
npm install fraction.js convert-units
npm install --save-dev @types/convert-units
```

- **`fraction.js`** — parses and formats fractions (`"1 1/4"` ↔ `1.25`, `0.667` → `"2/3"`)
- **`convert-units`** — unit conversion table for volume and weight (tsp → tbsp → cup → fl oz, oz → lb, ml → l, g → kg)

---

### Step 2 — Define strict types

Replace the loose `Ingredient` type in `types/index.ts`:

```ts
export type VolumeUnit = 'tsp' | 'tbsp' | 'fl. oz' | 'cup' | 'pt' | 'qt' | 'gallon' | 'ml' | 'liter'
export type WeightUnit = 'oz' | 'lbs' | 'gram' | 'kg'
export type CountUnit = 'each' | 'piece' | 'clove' | 'slice' | 'square' | 'can' | 'unit'
export type OtherUnit = 'other'

export type MeasureUnit = VolumeUnit | WeightUnit | CountUnit | OtherUnit

export type Ingredient = {
  key: number;
  name: string;
  amount: number;       // was string — stored as decimal (1/2 → 0.5)
  measure: MeasureUnit; // was string
  freeform: boolean;    // true for "to taste", "as needed", "pinch", etc.
  tag: string | null;
}

// Add servings to Recipe
export type Recipe = {
  // ...existing fields
  servings: number | null;  // null = unknown/unspecified
}
```

**`freeform` behaviour:** when `freeform: true`, the ingredient's `amount` and `measure` are ignored during scaling. The display shows just the ingredient name (e.g. `"Salt — to taste"`). The Add Recipe form gets a "To taste" toggle that sets `freeform: true` and clears `amount`/`measure`.

---

### Step 3 — Build the scaling utilities (`utilities/scaling.ts`)

No unit conversion — scaling multiplies the amount only. `1.5 cups` stays `1.5 cups`. This keeps the logic simple and predictable.

```ts
import Fraction from 'fraction.js'

// Parse a fraction string entered by a user into a number
// "1/2" → 0.5, "1 1/4" → 1.25, "2" → 2
export const parseFraction = (input: string): number => {
  return new Fraction(input).valueOf()
}

// Format a decimal as a readable fraction string for display
// 0.5 → "1/2", 0.75 → "3/4", 1.5 → "1 1/2", 2.0 → "2"
export const formatAmount = (value: number): string => {
  return new Fraction(value).toFraction(true)
}

// Scale an amount by a factor — unit never changes
// freeform ingredients pass through unscaled
export const scaleIngredient = (ingredient: Ingredient, factor: number): string => {
  if (ingredient.freeform) return 'to taste'
  return `${formatAmount(ingredient.amount * factor)} ${ingredient.measure}`
}
```

> **No dependency on `convert-units`** — skip that install.

---

### Step 4 — Scaling UI on the recipe page

Add a scale selector to `app/(main)/recipes/[id]/page.tsx`:

```tsx
const SCALE_OPTIONS = [
  { label: '½×', value: 0.5 },
  { label: '1×', value: 1 },
  { label: '2×', value: 2 },
  { label: '3×', value: 3 },
]

const [scale, setScale] = useState(1)
```

Render a button group below the recipe title. Pass `scale` down to `<Ingredients>` which uses `scaleIngredient()` on each amount before display.

Scaling is **display-only** — the stored Firestore data never changes. If the recipe has `servings`, show `"Serves {recipe.servings * scale}"`.

---

### Step 5 — Update the Add Recipe form

- Amount input: accepts decimals **or** fraction strings (`"1/2"`, `"1 1/4"`). On blur, parse with `parseFraction()` and store as a number.
- Measure: already a `<select>` — update options to match `MeasureUnit` union exactly.
- Servings: add a new numeric input field.

---

### Step 6 — Migrate existing Firestore data

Write a one-off migration script (similar to `bootstrap-admins.ts`) using the Admin SDK. Run in **dry-run mode first** to preview all changes before writing anything.

**Migration logic:**

1. Fetch all recipes via Admin SDK
2. For each ingredient, parse `amount` string → number:
   - `"1/2"` → `0.5`, `"1 1/4"` → `1.25`, `"2"` → `2`
   - `"to taste"` / `""` / unparseable → `amount: 0, freeform: true`
3. Validate `measure` against `MeasureUnit` — unknown values → `measure: 'other'`, logged for review
4. Set `freeform: false` on all other ingredients
5. Add `servings: null` to all recipes
6. Write via Admin SDK batch writes (max 500 docs/batch)

**Rollback plan:**

Before writing any changes, the script exports the current state of every recipe to a timestamped JSON backup file (e.g. `backups/recipes-2026-05-07.json`). If anything goes wrong:

```ts
// rollback script reads the backup and restores all docs via batch writes
npx tsx scripts/rollback-migration.ts backups/recipes-2026-05-07.json
```

The backup file must be committed (or at minimum kept locally) before the migration runs. `backups/` should be added to `.gitignore` since it may contain recipe content you don't want in the repo — keep it in a safe local location instead.

**Execution order:**
```bash
# 1. Preview changes, no writes
npx tsx scripts/migrate-ingredients.ts --dry-run

# 2. Review the output log — check freeform flags and measure fallbacks

# 3. Run for real
npx tsx scripts/migrate-ingredients.ts

# 4. Verify a few recipes in the app, then delete the scripts
```

---

### Verification

- Doubling a recipe shows all amounts × 2 with clean fraction display
- `3 tsp` scales to `1 tbsp` (not `3 tsp × 2 = 6 tsp`)
- `1/2 cup` halved displays as `1/4 cup`
- Amounts like `"to taste"` are handled gracefully (displayed as-is, not scaled)
- Add form accepts `"1 1/4"` as input and stores `1.25`
- TypeScript rejects any `measure` value not in `MeasureUnit`

---

### React Native Mobile App
With the web app stable and the Firebase backend solid, a React Native app is the natural next step for a native mobile experience.

- Use **Expo** to bootstrap the project — it integrates cleanly with Firebase and allows you to share TypeScript types and utility logic from the web project
- Structure the monorepo with a shared `packages/` directory for types and Firebase utilities, a `apps/web` directory for the Next.js app, and `apps/mobile` for the Expo app
- The Firebase SDK works identically in React Native, so `db.ts` functions transfer directly
- Auth in React Native uses `expo-auth-session` for Google login or Firebase's React Native auth package
- Consider **Turborepo** or **pnpm workspaces** to manage the monorepo build

Recommended tool: `create-turbo` to scaffold the monorepo once you are ready to start the mobile phase.
