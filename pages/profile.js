import { auth } from '../utilities/firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useRouter } from 'next/router'
import { useCallback, useContext, useEffect, useState } from 'react'
import { getRecipesByArray } from '../utilities/db'
import RecipeLayout from '../components/Recipes/RecipeLayout'
import { Favorites } from '../context/favoritesContext'

export default function Profile() {
  const [recipes, setRecipes] = useState([])
  const route = useRouter()
  const [user, loading] = useAuthState(auth)

  const { favorites } = useContext(Favorites)

  const checkUser = useCallback(async () => {
    if (loading) return
    if (!user) return route.push('/auth/login')
  }, [loading, route, user])

  const loadRecipes = useCallback(async () => {
    setRecipes(await getRecipesByArray(favorites))
  }, [favorites])

  useEffect(() => {
    checkUser()
  }, [checkUser])

  useEffect(() => {
    loadRecipes()
  }, [loadRecipes])

  return (
    <div className="flex flex-wrap justify-around p-7">
      <h2 className="mb-7 text-3xl font-extrabold">
        {user ? user.displayName : 'User'}&apos;s Saved Recipes
      </h2>
      <RecipeLayout recipes={recipes} />
    </div>
  )
}
