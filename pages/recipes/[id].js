import Image from 'next/image'
import { useRouter } from 'next/router'
import { useCallback, useContext, useEffect, useState } from 'react'
import BreadCrumbs from '../../components/BreadCrumb'
import Directions from '../../components/Recipes/Directions'
import Ingredients from '../../components/Recipes/Ingredients'
import RecipePageSkeleton from '../../components/Recipes/RecipePageSkeleton'
import { getRecipeById } from '../../utilities/db'
import { Favorites } from '../../context/favoritesContext'
import { HiHeart } from 'react-icons/hi'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../../utilities/firebase'

export default function Recipe() {
  const [user, loading] = useAuthState(auth)
  const router = useRouter()
  const [recipe, setRecipe] = useState(null)
  const { isFavorite, toggleFavorite } = useContext(Favorites)
  const recipeId = router.query

  const loadRecipe = useCallback(async () => {
    try {
      const data = await getRecipeById(recipeId)
      setRecipe(data)
    } catch (error) {
      console.log(error)
    }
  }, [recipeId])

  useEffect(() => {
    loadRecipe()
  }, [loadRecipe])

  return (
    <div>
      {!recipe ? (
        <RecipePageSkeleton />
      ) : (
        <div className="mt-4 w-full p-10 pb-16 shadow-2xl">
          <BreadCrumbs recipeName={recipe.name} />
          <h1 className="my-5 text-center text-5xl font-bold">
            {recipe ? recipe.name : 'Loading...'}
          </h1>
          <div className="relative w-full">
            <Image
              src={recipe.imgSrc}
              alt="recipe photo"
              priority
              width={500}
              height={500}
              className="w-full"
            />
            <button
              onClick={() => {
                toggleFavorite(recipeId.id)
              }}
            >
              <HiHeart
                className={`${
                  isFavorite(recipeId.id) ? 'text-red-600' : 'text-white'
                } ${
                  !user && 'hidden'
                } absolute top-0 right-0 bg-black/25 p-2 text-7xl`}
              />
            </button>
          </div>
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
