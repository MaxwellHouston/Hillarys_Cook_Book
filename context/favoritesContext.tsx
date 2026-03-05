import { createContext, useState, useCallback, useEffect, ReactNode } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../utilities/firebase'
import { createFavorites, getFavorites, updateFavorites } from '../utilities/db'
import { FavoritesContextType } from '../types'

export const Favorites = createContext<FavoritesContextType | null>(null)

export default function FavoritesContext({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([])
  const [showError, setShowError] = useState(false)
  const [user, loading] = useAuthState(auth)

  const closeError = () => {
    setShowError(false)
  }

  const isFavorite = (recipeId: string): boolean => {
    return favorites.includes(recipeId)
  }

  const loadFavorites = useCallback(async () => {
    if (!user) return
    try {
      const userData = await getFavorites(user.uid)
      if (!userData) {
        await createFavorites(user.uid)
        loadFavorites()
      } else {
        setFavorites(userData.favoriteList)
      }
    } catch (err) {
      console.log(err)
      setShowError(true)
    }
  }, [user])

  const toggleFavorite = (recipeId: string) => {
    let newFavorites: string[]
    if (favorites.includes(recipeId)) {
      newFavorites = favorites.filter((fav) => fav != recipeId)
    } else {
      newFavorites = [...favorites, recipeId]
    }
    updateFavorites(user!.uid, newFavorites)
    loadFavorites()
  }

  useEffect(() => {
    if (user) {
      loadFavorites()
    }
  }, [user, loadFavorites])

  return (
    <Favorites.Provider
      value={{
        favorites,
        loadFavorites,
        toggleFavorite,
        isFavorite,
        showError,
        closeError,
      }}
    >
      {children}
    </Favorites.Provider>
  )
}
