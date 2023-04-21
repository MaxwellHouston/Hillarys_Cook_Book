import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'
import RecipeLayout from '../components/Recipes/RecipeLayout'
import { getRecipesByKeywords } from '../utilities/db'
import BreadCrumbs from '../components/BreadCrumb'

export default function SearchResults() {
  const [recipes, setRecipes] = useState(null)
  const route = useRouter()
  const searchParams = route.query.searchParams

  const loadRecipes = useCallback(async () => {
    setRecipes(await getRecipesByKeywords(searchParams))
  }, [searchParams])

  useEffect(() => {
    loadRecipes()
  }, [loadRecipes])

  return (
    <div className="flex flex-col items-center text-center sm:flex-row">
      <div className="my-10 min-h-[85vh] w-full bg-white px-2 pb-5 md:px-10">
        <BreadCrumbs recipeName={`Search - ${searchParams}`} />
        <h1 className="mb-4 text-3xl font-bold xs:text-6xl sm:my-8">
          Search Results
        </h1>
        <hr className="mb-8 border-black" />
        <RecipeLayout recipes={recipes} />
        {recipes && recipes.length === 0 && (
          <p>
            No recipes contain the word <em>{`${searchParams}`}</em>
          </p>
        )}
      </div>
    </div>
  )
}
