import Image from 'next/image'
import ImageList from '@mui/material/ImageList'
import ImageListItem from '@mui/material/ImageListItem'
import ImageListItemBar from '@mui/material/ImageListItemBar'
import Link from 'next/link'
import { HiHeart } from 'react-icons/hi'
import { useContext } from 'react'
import { Favorites } from '../../context/favoritesContext'
import { useRouter } from 'next/router'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../../utilities/firebase'
import { useMediaQuery } from '@mui/material'

export default function RecipeLayout({ recipes }) {
  const { toggleFavorite, isFavorite } = useContext(Favorites)
  const [user, loading] = useAuthState(auth)
  const router = useRouter()
  const breadCrumbData =
    router.pathname === '/recipes-search'
      ? { search: router.query.searchParams }
      : null
  const matches = useMediaQuery('(min-width: 600px)')

  const renderSkeleton = () => {
    let array = []
    for (let i = 0; i < 9; i++) {
      array.push(
        <ImageListItem key={i} className="overflow-hidden">
          <div className="h-[200px] w-[200px] animate-pulse bg-slate-300"></div>
        </ImageListItem>,
      )
    }
    return array
  }

  const renderRecipes = () => {
    return recipes.map((recipe) => {
      return (
        <ImageListItem key={recipe.id} className="relative overflow-hidden">
          <HiHeart
            onClick={() => {
              toggleFavorite(recipe.id)
            }}
            className={`absolute right-0 bg-black/50 text-4xl hover:cursor-pointer ${
              isFavorite(recipe.id) ? 'text-red-600' : 'text-white'
            } ${!user && 'hidden'}`}
          />
          <Link
            href={{ pathname: `recipes/${recipe.id}`, query: breadCrumbData }}
            className="flex min-h-[200px]"
          >
            <Image
              className="object-center"
              src={recipe.imgSrc}
              alt={recipe.name}
              width={500}
              height={500}
              loading="lazy"
            />
          </Link>
          <ImageListItemBar
            title={recipe.name}
            subtitle={`By: ${recipe.author}`}
          />
        </ImageListItem>
      )
    })
  }

  return (
    <ImageList className="w-full" cols={matches ? 3 : 2} rowHeight={200}>
      {recipes ? renderRecipes() : renderSkeleton()}
    </ImageList>
  )
}
