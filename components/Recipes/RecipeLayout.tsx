'use client'

import Image from 'next/image'
import Link from 'next/link'
import { HiHeart } from 'react-icons/hi'
import { useContext } from 'react'
import { Favorites } from '../../context/favoritesContext'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../../utilities/firebase'
import { Recipe } from '../../types'

interface RecipeLayoutProps {
  recipes: Recipe[] | null;
}

export default function RecipeLayout({ recipes }: RecipeLayoutProps) {
  const { toggleFavorite, isFavorite } = useContext(Favorites)!
  const [user] = useAuthState(auth)

  const renderSkeleton = () =>
    Array.from({ length: 9 }).map((_, i) => (
      <div key={i} className="overflow-hidden">
        <div className="h-[200px] w-full animate-pulse bg-slate-300" />
      </div>
    ))

  const renderRecipes = () =>
    recipes!.map((recipe) => (
      <div key={recipe.id} className="relative overflow-hidden">
        <HiHeart
          onClick={() => toggleFavorite(recipe.id)}
          className={`absolute right-0 z-10 bg-black/50 text-4xl hover:cursor-pointer ${
            isFavorite(recipe.id) ? 'text-red-600' : 'text-white'
          } ${!user && 'hidden'}`}
        />
        <Link href={`/recipes/${recipe.id}`} className="block">
          <Image
            className="h-[200px] w-full object-cover"
            src={recipe.imgSrc!}
            alt={recipe.name}
            width={500}
            height={500}
            loading="lazy"
          />
          <div className="bg-slate-800 px-2 py-1 text-left text-white">
            <p className="truncate text-sm font-semibold">{recipe.name}</p>
            <p className="truncate text-xs text-slate-300">By: {recipe.author}</p>
          </div>
        </Link>
      </div>
    ))

  return (
    <div className="grid w-full grid-cols-2 gap-1 sm:grid-cols-3">
      {recipes ? renderRecipes() : renderSkeleton()}
    </div>
  )
}
