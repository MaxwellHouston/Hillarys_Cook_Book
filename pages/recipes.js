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
    <div className="flex flex-col items-center sm:flex-row text-center">
      <div className="my-10 min-h-[85vh] w-full bg-white px-2 md:px-10 pb-5">
        <h1 className="mb-4 sm:my-8 text-3xl xs:text-6xl font-bold">{tab}{tab==='All' && ' Recipes'}</h1>
        <HomeTabs tab={tab} setTab={setTab} />
        <hr className="mb-8 border-black" />
        <RecipeLayout recipes={filteredRecipes} />
      </div>
      
    </div>
  )
}
