import { Divider } from '@mui/material'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'
import BreadCrumbs from '../../components/BreadCrumb'
import Directions from '../../components/Recipes/Directions'
import Ingredients from '../../components/Recipes/Ingredients'
import RecipePageSkeleton from '../../components/Recipes/RecipePageSkeleton'
import { getImageById, getRecipeById } from '../../utilities/db'

export default function Recipe() {
  const router = useRouter()
  const [recipe, setRecipe] = useState(null)
  //const [imgSrc, setImgSrc] = useState('');

  const loadRecipe = useCallback(async () => {
    let recipeId = router.query
    try {
      const data = await getRecipeById(recipeId)
      setRecipe(data)
    } catch (error) {
      console.log(error)
    }
  }, [router.query])

  useEffect(() => {
    loadRecipe()
  }, [loadRecipe])

  return (
    <div>
      {!recipe ? (
        <RecipePageSkeleton />
      ) : (
        <div className="mt-4 mb-8 w-full rounded-2xl border-2 bg-white p-10 shadow-2xl">
          <BreadCrumbs recipeName={recipe.name} />
          <h1 className="mb-5 text-center text-5xl font-bold">
            {recipe ? recipe.name : 'Loading...'}
          </h1>
          <Image
            src={recipe.imgSrc}
            alt="recipe photo"
            priority
            width={500}
            height={500}
            className="w-full"
          />
          <hr className="my-10 border-slate-500" variant="middle" />
          <h2 className="my-3 text-center text-2xl font-bold underline">
            Ingredients
          </h2>
          <Ingredients ingredients={recipe && recipe.ingredientsList} />
          <hr className="my-10 border-slate-500" variant="middle" />
          <h2 className="my-3 text-center text-2xl font-bold underline">
            Directions
          </h2>
          <Directions directions={recipe && recipe.directionsList} />
        </div>
      )}
    </div>
  )
}
