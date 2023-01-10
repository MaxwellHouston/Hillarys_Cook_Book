import TextField from '@mui/material/TextField';
import Divider from '@mui/material/Divider';
import uuid from 'react-uuid';
import IngredientForm from './IngredientForm';
import DirectionsForm from './DirectionsForm';
import UploadFile from './UploadFile';
import { db, storage } from '../../utilities/firebase';
import { ref, uploadBytes} from 'firebase/storage';
import { addDoc, collection } from 'firebase/firestore';
import { useState } from 'react';
import AlertSnackbar from '../AlertSnackbar';


export default function AddForm() {
    const [recipeName, setRecipeName] = useState('');
    const [recipeAuthor, setRecipeAuthor] = useState('');
    const [imgFile, setImageFile] = useState(null);
    const [ingredientsList, setIngredientsList] = useState([{key: 0, name: '', amount: 0, fraction: 0, measure: 'cups'}]);
    const [directionsList, setDirectionsList] = useState([{description: ''}]);
    const [alert, setAlert] = useState({show: false, message: '', severity: '' });

    const updateIngredientsList = (updatedList) => {
        setIngredientsList(updatedList);
    }
    const updateDirectionsList = (updatedList) => {
        setDirectionsList(updatedList);
    }

    const closeAlert = () => {
        setAlert({show: false, message: '', severity: '' });
    }

    const submitRecipe = async (e) => {
        e.preventDefault();
        let recipeId = uuid();
        let recipeObject = {
            id: recipeId,
            name: recipeName,
            author: recipeAuthor,
            ingredientsArray: ingredientsList,
            directionsArray: directionsList
        }
        const collectionRef = collection(db, 'recipes');
        const imageRef = ref(storage, `recipe-images/${recipeId}`);
        try {
            await addDoc(collectionRef, recipeObject);
            await uploadBytes(imageRef, imgFile);
            setAlert({...alert, show: true, severity: 'success', message: 'Recipe uploaded successfully!' });
        } catch (error) {
            setAlert({...alert, show: true, severity: 'error', message: 'Upload Failed. Try again or contact site Admin.'});
            console.log(error);
        }
    }

    return(
        <form onSubmit={submitRecipe}>
            <AlertSnackbar status={alert.show} toggle={closeAlert} severity={alert.severity} message={alert.message} />
            <fieldset>
                <TextField onChange={({target}) => setRecipeName(target.value) } required label="Recipe Name" variant="outlined" />
                <TextField onChange={({target}) => setRecipeAuthor(target.value)} required  label="Recipe By" variant="outlined" />
                <UploadFile upload={(file) => setImageFile(file)} />
            </fieldset>
            <Divider className='my-5' variant="middle" />
            <IngredientForm ingredientsList={ingredientsList} updateIngredientsList={updateIngredientsList} />
            <Divider className='my-5' variant="middle" />
            <DirectionsForm directionsList={directionsList} updateDirectionsList={updateDirectionsList} />
            <button type='submit'>Submit Recipe</button>
        </form>
    )
}