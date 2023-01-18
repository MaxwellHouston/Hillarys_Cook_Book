import TextField from '@mui/material/TextField';
import Divider from '@mui/material/Divider';
import IngredientForm from './IngredientForm';
import DirectionsForm from './DirectionsForm';
import UploadFile from './UploadFile';
import { auth, db, storage } from '../../utilities/firebase';
import { ref, uploadBytes} from 'firebase/storage';
import { addDoc, collection } from 'firebase/firestore';
import { useState } from 'react';
import AlertSnackbar from '../AlertSnackbar';
import { useAuthState } from 'react-firebase-hooks/auth';
import CategoryInput from './CategoryInput';
import GroupsForm from './GroupsForm';


export default function AddForm() {
    const [user, loading] = useAuthState(auth);
    const [recipeName, setRecipeName] = useState('');
    const [recipeAuthor, setRecipeAuthor] = useState('');
    const [imgFile, setImageFile] = useState(null);
    const [category, setCategory] = useState(null);
    const [groups, setGroups] = useState([{id: 0, name: ''}]);
    const [ingredientsList, setIngredientsList] = useState([{key: 0, name: '', amount: '', measure: 'other', tag: null}]);
    const [directionsList, setDirectionsList] = useState([{description: ''}]);
    const [alert, setAlert] = useState({show: false, message: '', severity: 'success' });

    const closeAlert = () => {
        setAlert({show: false, message: '', severity: 'success' });
    }

    const clearForm = () => {
        setRecipeName('');
        setRecipeAuthor('');
        setImageFile(null);
        setCategory(null);
        setGroups([{id: 0, name: ''}]);
        setIngredientsList([{key: 0, name: '', amount: '', measure: 'other', tag: null}]);
        setDirectionsList([{description: ''}]);
    }

    const deleteTags = (name) => {
        let updatedArray = ingredientsList.map(ingredient => {
            if(ingredient.tag === name){
                ingredient.tag = null;
                return ingredient
            } else {
                return ingredient
            }
        });
        setIngredientsList(updatedArray);
    }

    const submitRecipe = async (e) => {
        e.preventDefault();
        const keywordsArray = ingredientsList.map(ingredient => ingredient.name);
        let recipeObject = {
            uploader: user.displayName,
            uploaderAvatar: user.photoURL,
            name: recipeName,
            author: recipeAuthor,
            category,
            groups,
            ingredientsList,
            directionsList,
            keywordsArray,
            created: new Date().getTime()
        }
        const collectionRef = collection(db, 'recipes');
        
        try {
            const upload = await addDoc(collectionRef, recipeObject);
            const imageRef = ref(storage, `recipe-images/${upload.id}`);
            if(imgFile) await uploadBytes(imageRef, imgFile);
            setAlert({...alert, show: true, severity: 'success', message: 'Recipe uploaded successfully!' });
            clearForm();
        } catch (error) {
            setAlert({...alert, show: true, severity: 'error', message: 'Upload Failed. Try again or contact site Admin.'});
            console.log(error);
        }
    }

    return(
        <form onSubmit={submitRecipe} className='border-2 border-black rounded-xl p-10 mb-10'>
            <AlertSnackbar status={alert.show} toggle={closeAlert} severity={alert.severity} message={alert.message} />
            <fieldset>
                <div className='flex w-full justify-around'>
                    <TextField onChange={({target}) => setRecipeName(target.value)} value={recipeName} required label="Recipe Name" variant="outlined" size='small' />
                    <TextField onChange={({target}) => setRecipeAuthor(target.value)} value={recipeAuthor} required  label="Recipe By" variant="outlined" size='small' />
                    <CategoryInput category={category} updateCategory={setCategory} />
                </div>
                <Divider className='my-8' variant="middle" />
                <UploadFile upload={(file) => setImageFile(file)} file={imgFile} />
                <Divider className='my-8' variant="middle" />
                <GroupsForm groups={groups} updateGroups={setGroups} deleteTags={deleteTags} />
                <Divider className='my-8' variant="middle" />
                <IngredientForm ingredientsList={ingredientsList} updateIngredientsList={setIngredientsList} groups={groups} />
                <Divider className='my-8' variant="middle" />
                <DirectionsForm directionsList={directionsList} updateDirectionsList={setDirectionsList} />
            </fieldset>
            <Divider className='my-10' variant="middle" />
            <div className='flex justify-center'>
                <button className='bg-black text-white p-3 rounded-xl' type='submit'>Submit Recipe</button>
            </div>
        </form>
    )
}
