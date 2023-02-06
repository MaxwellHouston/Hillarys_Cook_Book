import { Divider } from '@mui/material'
import { useCallback, useEffect, useState } from 'react'
import DisplayBy from '../components/DisplayBy'
import HomeTabs from '../components/HomeTabs'
import RecipeLayout from '../components/Recipes/RecipeLayout'
import { getAllRecipes } from '../utilities/db'

export default function Recipes() {
  const [recipes, setRecipes] = useState(null)
  const [filteredRecipes, setFilteredRecipes] = useState(null)
  const [order, setOrder] = useState('recent')
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
    <div className="flex text-center">
      <div className="my-10 min-h-[85vh] w-full rounded-2xl border-2 border-slate-700 bg-white px-10 pb-5 shadow-2xl shadow-black">
        <h1 className="my-5 text-6xl font-bold">{tab}</h1>
        <Divider className="my-8" variant="middle" />
        <RecipeLayout recipes={filteredRecipes} />
      </div>
      <HomeTabs tab={tab} setTab={setTab} />
    </div>
  )
}
