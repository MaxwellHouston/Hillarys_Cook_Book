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

## Phase 2: Next.js App Router Migration

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

### Drop MUI — Replace with Tailwind + shadcn/ui
Once the above phases are stable, MUI can be removed to significantly reduce bundle size and unify the styling system under Tailwind.

- Install shadcn/ui: `npx shadcn-ui@latest init`
- Replace MUI components one-by-one: `TextField` → shadcn `Input`, `Button` → shadcn `Button`, `Dialog` → shadcn `Dialog`, etc.
- Remove `@mui/material`, `@emotion/react`, `@emotion/styled` from `package.json`
- This phase is safe to do incrementally — MUI and shadcn/ui can coexist temporarily

### React Native Mobile App
With the web app stable and the Firebase backend solid, a React Native app is the natural next step for a native mobile experience.

- Use **Expo** to bootstrap the project — it integrates cleanly with Firebase and allows you to share TypeScript types and utility logic from the web project
- Structure the monorepo with a shared `packages/` directory for types and Firebase utilities, a `apps/web` directory for the Next.js app, and `apps/mobile` for the Expo app
- The Firebase SDK works identically in React Native, so `db.ts` functions transfer directly
- Auth in React Native uses `expo-auth-session` for Google login or Firebase's React Native auth package
- Consider **Turborepo** or **pnpm workspaces** to manage the monorepo build

Recommended tool: `create-turbo` to scaffold the monorepo once you are ready to start the mobile phase.
