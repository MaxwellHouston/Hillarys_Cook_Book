'use client'

import { useCallback, useEffect, useState } from 'react'
import { QueryDocumentSnapshot } from 'firebase/firestore'
import HomeTabs from '@/components/HomeTabs'
import RecipeLayout from '@/components/Recipes/RecipeLayout'
import { getRecipesPaginated } from '@/utilities/db'
import { Recipe } from '@/types'

export default function Recipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [cursor, setCursor] = useState<QueryDocumentSnapshot | null>(null)
  const [hasMore, setHasMore] = useState(false)
  const [loading, setLoading] = useState(false)
  const [tab, setTab] = useState('All')

  const category = tab === 'All' ? undefined : tab

  const loadPage = useCallback(async (cat?: string, cur?: QueryDocumentSnapshot | null) => {
    setLoading(true)
    const page = await getRecipesPaginated(cat, cur)
    setRecipes((prev) => (cur ? [...prev, ...page.recipes] : page.recipes))
    setCursor(page.cursor)
    setHasMore(page.hasMore)
    setLoading(false)
  }, [])

  // Reset and reload when tab changes
  useEffect(() => {
    setRecipes([])
    setCursor(null)
    loadPage(category)
  }, [tab]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex flex-col items-center text-center sm:flex-row">
      <div className="my-10 min-h-[85vh] w-full bg-white px-2 pb-5 md:px-10">
        <h1 className="mb-4 text-3xl font-bold xs:text-6xl sm:my-8">
          {tab}
          {tab === 'All' && ' Recipes'}
        </h1>
        <HomeTabs tab={tab} setTab={setTab} />
        <hr className="mb-8 border-black" />
        <RecipeLayout recipes={recipes} />
        {hasMore && (
          <button
            onClick={() => loadPage(category, cursor)}
            disabled={loading}
            className="mt-8 rounded-lg border border-black px-6 py-2 font-semibold hover:bg-slate-100 disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Load more'}
          </button>
        )}
      </div>
    </div>
  )
}
