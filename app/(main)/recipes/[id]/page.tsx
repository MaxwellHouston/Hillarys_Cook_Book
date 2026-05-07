'use client'

import { use } from 'react'
import Image from 'next/image'
import { useCallback, useContext, useEffect, useState } from 'react'
import BreadCrumbs from '@/components/BreadCrumb'
import Directions from '@/components/Recipes/Directions'
import Ingredients from '@/components/Recipes/Ingredients'
import RecipePageSkeleton from '@/components/Recipes/RecipePageSkeleton'
import { getRecipeById } from '@/utilities/db'
import { Favorites } from '@/context/favoritesContext'
import { HiHeart } from 'react-icons/hi'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '@/utilities/firebase'
import { Recipe } from '@/types'

const SCALE_OPTIONS = [
  { label: '½×', value: 0.5 },
  { label: '1×', value: 1 },
  { label: '2×', value: 2 },
  { label: '3×', value: 3 },
]

export default function RecipePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [user] = useAuthState(auth)
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [scale, setScale] = useState(1)
  const { isFavorite, toggleFavorite } = useContext(Favorites)!

  const loadRecipe = useCallback(async () => {
    try {
      const data = await getRecipeById({ id })
      setRecipe(data ?? null)
    } catch (error) {
      console.log(error)
    }
  }, [id])

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
            {recipe.name}
          </h1>
          <div className="relative w-full">
            <Image
              src={recipe.imgSrc!}
              alt="recipe photo"
              priority
              width={500}
              height={500}
              className="w-full"
            />
            <button onClick={() => toggleFavorite(id)}>
              <HiHeart
                className={`${
                  isFavorite(id) ? 'text-red-600' : 'text-white'
                } ${
                  !user && 'hidden'
                } absolute top-0 right-0 bg-black/25 p-2 text-7xl`}
              />
            </button>
          </div>
          <hr className="my-10 border-slate-500" />
          <div className="flex items-center justify-between">
            <h2 className="my-3 text-2xl font-bold underline">
              Ingredients
            </h2>
            <div className="flex items-center gap-1">
              {recipe.servings && (
                <span className="mr-3 text-sm text-slate-500">
                  Serves {Math.round(recipe.servings * scale)}
                </span>
              )}
              {SCALE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setScale(opt.value)}
                  className={`rounded px-2 py-1 text-sm font-medium border transition-colors ${
                    scale === opt.value
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-700 border-slate-300 hover:border-slate-500'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          <Ingredients ingredients={recipe.ingredientsList} scale={scale} />
          <hr className="my-10 border-slate-500" />
          <h2 className="my-3 text-center text-2xl font-bold underline">
            Directions
          </h2>
          <Directions directions={recipe.directionsList} />
        </div>
      )}
    </div>
  )
}
