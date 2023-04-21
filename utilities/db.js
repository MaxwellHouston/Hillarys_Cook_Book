import { collection, doc, getDoc, getDocs, setDoc } from 'firebase/firestore'
import { getDownloadURL, list, ref } from 'firebase/storage'
import { db, storage } from './firebase'

export const getRecipeById = async ({ id }) => {
  const docRef = doc(db, 'recipes', id)
  const snapShot = await getDoc(docRef)
  return snapShot.data()
}

export const getRecipesByArray = async (arr) => {
  const collectionRef = collection(db, 'recipes')
  const snapshots = await getDocs(collectionRef)
  const docs = snapshots.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
  const filteredRecipes = docs.filter((doc) => arr.includes(doc.id))
  return filteredRecipes
}

export const getAllRecipes = async () => {
  const collectionRef = collection(db, 'recipes')
  const snapshots = await getDocs(collectionRef)
  const docs = snapshots.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
  return docs
}

export const getImageById = async ({ id }) => {
  const imageRef = ref(storage, `recipe-images/`)
  const docs = await list(imageRef)
  const imgDoc = docs.items.filter((item) => item.name === id)
  if (imgDoc.length !== 0) {
    return await getDownloadURL(imgDoc[0])
  } else {
    return false
  }
}

export const getRecipesByKeywords = async (search) => {
  const collectionRef = collection(db, 'recipes')
  const snapshots = await getDocs(collectionRef)
  const docs = snapshots.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
  const filteredNames = docs.filter(
    (doc) => doc.name.toLowerCase().indexOf(search.toLowerCase()) != -1,
  )
  const filteredKeywords = docs.filter((doc) => {
    const hitArray = []
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

export const updateFavorites = async (userId, favoriteList) => {
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

export const getFavorites = async (userId) => {
  const docRef = doc(db, 'users', userId)
  const snapShot = await getDoc(docRef)
  return snapShot.data()
}

export const createFavorites = async (userId) => {
  const docRef = doc(db, 'users', userId)
  const snapShot = await getDoc(docRef)
  if (!snapShot.data()) {
    await setDoc(doc(db, 'users', userId), {
      favoriteList: [],
    })
  }
  return true
}
