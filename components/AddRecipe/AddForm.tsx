'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
} from '@/components/ui/dialog'
import IngredientForm from './IngredientForm'
import DirectionsForm from './DirectionsForm'
import UploadFile from './UploadFile'
import { auth, db, storage } from '../../utilities/firebase'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { addDoc, collection, serverTimestamp, updateDoc } from 'firebase/firestore'
import { FormEvent, useState } from 'react'
import AlertSnackbar from '../AlertSnackbar'
import { useAuthState } from 'react-firebase-hooks/auth'
import CategoryInput from './CategoryInput'
import GroupsForm from './GroupsForm'
import { Ingredient, Direction, Group } from '../../types'

type AlertSeverity = 'success' | 'error'

export default function AddForm() {
  const [user] = useAuthState(auth)
  const [recipeName, setRecipeName] = useState('')
  const [recipeAuthor, setRecipeAuthor] = useState('')
  const [imgFile, setImageFile] = useState<File | null>(null)
  const [category, setCategory] = useState<string | null>(null)
  const [groups, setGroups] = useState<Group[]>([{ id: 0, name: '' }])
  const [ingredientsList, setIngredientsList] = useState<Ingredient[]>([
    { key: 0, name: '', amount: '', measure: 'other', tag: null },
  ])
  const [directionsList, setDirectionsList] = useState<Direction[]>([{ description: '' }])
  const [alert, setAlert] = useState<{ show: boolean; message: string; severity: AlertSeverity }>({
    show: false,
    message: '',
    severity: 'success',
  })
  const [disableBtn, setDisableBtn] = useState(false)
  const [openConfirm, setOpenConfirm] = useState(false)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setOpenConfirm(true)
  }

  const handleSubmitConfirmation = () => {
    setOpenConfirm(false)
    submitRecipe()
  }

  const closeAlert = () => {
    setAlert({ show: false, message: '', severity: 'success' })
  }

  const clearForm = () => {
    setRecipeName('')
    setRecipeAuthor('')
    setImageFile(null)
    setCategory(null)
    setGroups([{ id: 0, name: '' }])
    setIngredientsList([{ key: 0, name: '', amount: '', measure: 'other', tag: null }])
    setDirectionsList([{ description: '' }])
  }

  const deleteTags = (name: string) => {
    setIngredientsList(ingredientsList.map((ingredient) =>
      ingredient.tag === name ? { ...ingredient, tag: null } : ingredient
    ))
  }

  const submitRecipe = async () => {
    setDisableBtn(true)
    const recipeObject = {
      uploader: user!.displayName,
      uploaderAvatar: user!.photoURL,
      name: recipeName,
      author: recipeAuthor,
      category,
      groups,
      ingredientsList,
      directionsList,
      keywordsArray: ingredientsList.map((i) => i.name.toLowerCase()),
      imgSrc: null as string | null,
      created: serverTimestamp(),
    }
    try {
      const upload = await addDoc(collection(db, 'recipes'), recipeObject)
      const imageRef = ref(storage, `recipe-images/${upload.id}`)
      if (imgFile) {
        const imgSnapshot = await uploadBytes(imageRef, imgFile)
        updateDoc(upload, { imgSrc: await getDownloadURL(imgSnapshot.ref) })
      }
      setAlert({ show: true, severity: 'success', message: 'Recipe uploaded successfully!' })
      clearForm()
    } catch (error) {
      setAlert({ show: true, severity: 'error', message: 'Upload Failed. Try again or contact site Admin.' })
      console.log(error)
    }
    setDisableBtn(false)
  }

  return (
    <form onSubmit={handleSubmit} className="mb-16 md:mb-8 p-4 md:p-10">
      <AlertSnackbar
        status={alert.show}
        toggle={closeAlert}
        severity={alert.severity}
        message={alert.message}
      />
      <Dialog open={openConfirm} onOpenChange={setOpenConfirm}>
        <DialogContent>
          <p className="text-black">Is your recipe ready to submit?</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenConfirm(false)}>Go Back</Button>
            <Button onClick={handleSubmitConfirmation}>Submit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <fieldset>
        <div className="flex w-full flex-col justify-around space-y-3 xs:flex-row xs:space-y-0 md:flex-nowrap md:gap-4">
          <div className="flex flex-col gap-1">
            <Label htmlFor="recipeName">Recipe Name <span className="text-red-500">*</span></Label>
            <Input
              id="recipeName"
              required
              value={recipeName}
              onChange={({ target }) => setRecipeName(target.value)}
              placeholder="Recipe Name"
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="recipeAuthor">Recipe By <span className="text-red-500">*</span></Label>
            <Input
              id="recipeAuthor"
              required
              value={recipeAuthor}
              onChange={({ target }) => setRecipeAuthor(target.value)}
              placeholder="Recipe By"
            />
          </div>
          <CategoryInput category={category} updateCategory={setCategory} />
        </div>
        <hr className="my-8" />
        <UploadFile upload={(file: File | null) => setImageFile(file)} file={imgFile} />
        <hr className="my-8" />
        <GroupsForm groups={groups} updateGroups={setGroups} deleteTags={deleteTags} />
        <hr className="my-8" />
        <IngredientForm
          ingredientsList={ingredientsList}
          updateIngredientsList={setIngredientsList}
          groups={groups}
        />
        <hr className="my-8" />
        <DirectionsForm directionsList={directionsList} updateDirectionsList={setDirectionsList} />
      </fieldset>
      <hr className="my-10" />
      <div className="flex justify-center">
        <button
          className="rounded-xl bg-black p-3 text-white disabled:opacity-50"
          type="submit"
          disabled={disableBtn}
        >
          Submit Recipe
        </button>
      </div>
    </form>
  )
}
