import { QueryDocumentSnapshot, collection, doc, getDoc, getDocs, limit, orderBy, query, setDoc, startAfter, where } from 'firebase/firestore'
import { getDownloadURL, list, ref } from 'firebase/storage'
import { db, storage } from './firebase'
import { Recipe, UserFavorites } from '../types'

const PAGE_SIZE = 20

export type RecipePage = {
  recipes: Recipe[]
  cursor: QueryDocumentSnapshot | null
  hasMore: boolean
}

export const getRecipeById = async ({ id }: { id: string }): Promise<Recipe | undefined> => {
  const docRef = doc(db, 'recipes', id)
  const snapShot = await getDoc(docRef)
  return snapShot.data() as Recipe | undefined
}

export const getRecipesByArray = async (arr: string[]): Promise<Recipe[]> => {
  if (arr.length === 0) return []
  const collectionRef = collection(db, 'recipes')
  const q = query(collectionRef, where('__name__', 'in', arr))
  const snapshots = await getDocs(q)
  return snapshots.docs.map((doc) => ({ ...doc.data(), id: doc.id }) as Recipe)
}

export const getRecipesPaginated = async (
  category?: string,
  cursor?: QueryDocumentSnapshot | null,
): Promise<RecipePage> => {
  const collectionRef = collection(db, 'recipes')
  const constraints = [
    ...(category ? [where('category', '==', category)] : []),
    orderBy('created', 'desc'),
    limit(PAGE_SIZE),
    ...(cursor ? [startAfter(cursor)] : []),
  ]
  const q = query(collectionRef, ...constraints)
  const snapshots = await getDocs(q)
  const recipes = snapshots.docs.map((doc) => ({ ...doc.data(), id: doc.id }) as Recipe)
  return {
    recipes,
    cursor: snapshots.docs[snapshots.docs.length - 1] ?? null,
    hasMore: snapshots.docs.length === PAGE_SIZE,
  }
}

export const getImageById = async ({ id }: { id: string }): Promise<string | false> => {
  const imageRef = ref(storage, `recipe-images/`)
  const docs = await list(imageRef)
  const imgDoc = docs.items.filter((item) => item.name === id)
  if (imgDoc.length !== 0) {
    return await getDownloadURL(imgDoc[0])
  } else {
    return false
  }
}

export const getRecipesByKeywords = async (search: string): Promise<Recipe[]> => {
  const collectionRef = collection(db, 'recipes')
  const snapshots = await getDocs(collectionRef)
  const docs = snapshots.docs.map((doc) => ({ ...doc.data(), id: doc.id }) as Recipe)
  const filteredNames = docs.filter(
    (doc) => doc.name.toLowerCase().indexOf(search.toLowerCase()) != -1,
  )
  const filteredKeywords = docs.filter((doc) => {
    const hitArray: string[] = []
    doc.keywordsArray.forEach((keyword) => {
      if (keyword.toLowerCase().indexOf(search.toLowerCase()) != -1) {
        hitArray.push(keyword)
      }
    })
    return hitArray.length > 0
  })
  const idList = filteredKeywords.map((recipe) => recipe.id)
  filteredNames.forEach((recipe) => {
    if (!idList.includes(recipe.id)) {
      filteredKeywords.unshift(recipe)
      idList.push(recipe.id)
    }
  })
  return filteredKeywords
}

export const updateFavorites = async (userId: string, favoriteList: string[]): Promise<boolean> => {
  try {
    await setDoc(doc(db, 'users', userId), {
      favoriteList,
    })
    return true
  } catch (err) {
    console.log(err)
    return false
  }
}

export const getFavorites = async (userId: string): Promise<UserFavorites | undefined> => {
  const docRef = doc(db, 'users', userId)
  const snapShot = await getDoc(docRef)
  return snapShot.data() as UserFavorites | undefined
}

export const createFavorites = async (userId: string): Promise<boolean> => {
  const docRef = doc(db, 'users', userId)
  const snapShot = await getDoc(docRef)
  if (!snapShot.data()) {
    await setDoc(doc(db, 'users', userId), {
      favoriteList: [],
    })
  }
  return true
}
