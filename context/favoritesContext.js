import { createContext, useState, useCallback, useEffect } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../utilities/firebase'
import { createFavorites, getFavorites, updateFavorites } from '../utilities/db'

export const Favorites = createContext(null)

export default function FavoritesContext({ children }) {
  const [favorites, setFavorites] = useState([])
  const [showError, setShowError] = useState(false)
  const [user, loading] = useAuthState(auth)

  const closeError = () => {
    setShowError(false)
    setErrorMessage('')
  }

  const isFavorite = (recipeId) => {
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

  const toggleFavorite = (recipeId) => {
    let newFavorites
    if (favorites.includes(recipeId)) {
      newFavorites = favorites.filter((fav) => fav != recipeId)
    } else {
      newFavorites = favorites
      newFavorites.push(recipeId)
    }
    updateFavorites(user.uid, newFavorites)
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
