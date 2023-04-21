import { useCallback, useEffect, useState } from 'react'
import HomeTabs from '../components/HomeTabs'
import RecipeLayout from '../components/Recipes/RecipeLayout'
import { getAllRecipes } from '../utilities/db'

export default function Recipes() {
  const [recipes, setRecipes] = useState(null)
  const [filteredRecipes, setFilteredRecipes] = useState(null)
  const [tab, setTab] = useState('All')

  const loadRecipes = useCallback(async () => {
    setRecipes(await getAllRecipes())
  }, [])

  useEffect(() => {
    loadRecipes()
  }, [loadRecipes])

  useEffect(() => {
    if (tab === 'All') {
      setFilteredRecipes(recipes)
    } else {
      setFilteredRecipes(recipes.filter((recipe) => recipe.category === tab))
    }
  }, [recipes, tab])

  return (
    <div className="flex flex-col items-center text-center sm:flex-row">
      <div className="my-10 min-h-[85vh] w-full bg-white px-2 pb-5 md:px-10">
        <h1 className="mb-4 text-3xl font-bold xs:text-6xl sm:my-8">
          {tab}
          {tab === 'All' && ' Recipes'}
        </h1>
        <HomeTabs tab={tab} setTab={setTab} />
        <hr className="mb-8 border-black" />
        <RecipeLayout recipes={filteredRecipes} />
      </div>
    </div>
  )
}
