import TextField from '@mui/material/TextField'
import IngredientForm from './IngredientForm'
import DirectionsForm from './DirectionsForm'
import UploadFile from './UploadFile'
import { auth, db, storage } from '../../utilities/firebase'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import {
  addDoc,
  collection,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore'
import { useState } from 'react'
import AlertSnackbar from '../AlertSnackbar'
import { useAuthState } from 'react-firebase-hooks/auth'
import CategoryInput from './CategoryInput'
import GroupsForm from './GroupsForm'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
} from '@mui/material'

export default function AddForm() {
  const [user, loading] = useAuthState(auth)
  const [recipeName, setRecipeName] = useState('')
  const [recipeAuthor, setRecipeAuthor] = useState('')
  const [imgFile, setImageFile] = useState(null)
  const [category, setCategory] = useState(null)
  const [groups, setGroups] = useState([{ id: 0, name: '' }])
  const [ingredientsList, setIngredientsList] = useState([
    { key: 0, name: '', amount: '', measure: 'other', tag: null },
  ])
  const [directionsList, setDirectionsList] = useState([{ description: '' }])
  const [alert, setAlert] = useState({
    show: false,
    message: '',
    severity: 'success',
  })
  const [disableBtn, setDisableBtn] = useState(false)
  const [openConfirm, setOpenConfirm] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setOpenConfirm(true)
  }

  const handleSubmitConfirmation = () => {
    setOpenConfirm(false)
    submitRecipe()
  }

  const handleCloseConfirm = () => {
    setOpenConfirm(false)
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
    setIngredientsList([
      { key: 0, name: '', amount: '', measure: 'other', tag: null },
    ])
    setDirectionsList([{ description: '' }])
  }

  const deleteTags = (name) => {
    let updatedArray = ingredientsList.map((ingredient) => {
      if (ingredient.tag === name) {
        ingredient.tag = null
        return ingredient
      } else {
        return ingredient
      }
    })
    setIngredientsList(updatedArray)
  }

  const submitRecipe = async () => {
    setDisableBtn(true)
    let recipeObject = {
      uploader: user.displayName,
      uploaderAvatar: user.photoURL,
      name: recipeName,
      author: recipeAuthor,
      category,
      groups,
      ingredientsList,
      directionsList,
      keywordsArray: ingredientsList.map((ingredient) =>
        ingredient.name.toLowerCase(),
      ),
      imgSrc: null,
      created: serverTimestamp(),
    }
    const collectionRef = collection(db, 'recipes')
    try {
      const upload = await addDoc(collectionRef, recipeObject)
      const imageRef = ref(storage, `recipe-images/${upload.id}`)
      if (imgFile) {
        let imgSnapshot = await uploadBytes(imageRef, imgFile)
        updateDoc(upload, { imgSrc: await getDownloadURL(imgSnapshot.ref) })
      }
      setAlert({
        ...alert,
        show: true,
        severity: 'success',
        message: 'Recipe uploaded successfully!',
      })
      clearForm()
    } catch (error) {
      setAlert({
        ...alert,
        show: true,
        severity: 'error',
        message: 'Upload Failed. Try again or contact site Admin.',
      })
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
      <Dialog open={openConfirm}>
        <DialogContent>
          <DialogContentText sx={{ color: 'black' }}>
            Is your recipe ready to submit?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirm}>Go Back</Button>
          <Button onClick={handleSubmitConfirmation} autoFocus>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
      <fieldset>
        <div className="flex w-full flex-col justify-around space-y-3 xs:flex-row xs:space-y-0 md:flex-nowrap">
          <TextField
            onChange={({ target }) => setRecipeName(target.value)}
            value={recipeName}
            required
            label="Recipe Name"
            variant="outlined"
            size="small"
          />
          <TextField
            onChange={({ target }) => setRecipeAuthor(target.value)}
            value={recipeAuthor}
            required
            label="Recipe By"
            variant="outlined"
            size="small"
          />
          <CategoryInput category={category} updateCategory={setCategory} />
        </div>
        <hr className="my-8" />
        <UploadFile upload={(file) => setImageFile(file)} file={imgFile} />
        <hr className="my-8" />
        <GroupsForm
          groups={groups}
          updateGroups={setGroups}
          deleteTags={deleteTags}
        />
        <hr className="my-8" />
        <IngredientForm
          ingredientsList={ingredientsList}
          updateIngredientsList={setIngredientsList}
          groups={groups}
        />
        <hr className="my-8" />
        <DirectionsForm
          directionsList={directionsList}
          updateDirectionsList={setDirectionsList}
        />
      </fieldset>
      <hr className="my-10" />
      <div className="flex justify-center">
        <button
          className="rounded-xl bg-black p-3 text-white"
          type="submit"
          disabled={disableBtn}
        >
          Submit Recipe
        </button>
      </div>
    </form>
  )
}
