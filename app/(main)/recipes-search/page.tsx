'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import RecipeLayout from '@/components/Recipes/RecipeLayout'
import { getRecipesByKeywords } from '@/utilities/db'
import BreadCrumbs from '@/components/BreadCrumb'
import { Recipe } from '@/types'

function SearchResultsContent() {
  const [recipes, setRecipes] = useState<Recipe[] | null>(null)
  const searchParams = useSearchParams()
  const query = searchParams.get('searchParams') ?? undefined

  const loadRecipes = useCallback(async () => {
    if (query) {
      setRecipes(await getRecipesByKeywords(query))
    }
  }, [query])

  useEffect(() => {
    loadRecipes()
  }, [loadRecipes])

  return (
    <div className="flex flex-col items-center text-center sm:flex-row">
      <div className="my-10 min-h-[85vh] w-full bg-white px-2 pb-5 md:px-10">
        <BreadCrumbs recipeName={`Search - ${query}`} />
        <h1 className="mb-4 text-3xl font-bold xs:text-6xl sm:my-8">
          Search Results
        </h1>
        <hr className="mb-8 border-black" />
        <RecipeLayout recipes={recipes} />
        {recipes && recipes.length === 0 && (
          <p>
            No recipes contain the word <em>{query}</em>
          </p>
        )}
      </div>
    </div>
  )
}

export default function SearchResults() {
  return (
    <Suspense>
      <SearchResultsContent />
    </Suspense>
  )
}
