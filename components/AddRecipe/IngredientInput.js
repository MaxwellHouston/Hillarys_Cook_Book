import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import Autocomplete from '@mui/material/Autocomplete';
import { IoTrashSharp } from 'react-icons/io5';
import IngredientGroupTags from './IngredientGroupTags';

export default function IngredientInput({id, name, amount, measure, tag, groups, updateValue, deleteIngredient}) {

    const handleNameChange = ({target}) => {
        updateValue(id, target.value, 'name');
    }
    const handleAmountChange = ({target}) => {
        updateValue(id, target.value, 'amount');
    }
    const handleMeasureChange = (event, values) => {
        updateValue(id, values, 'measure');
    }
    const handleTagChange = (value) => {
        updateValue(id, value, 'tag');
    }

    const handleDelete = (e) => {
        e.preventDefault();
        deleteIngredient(id);
    }

    const measurementOptions = ['none', 'cup', 'tbsp', 'tsp', 'fl. oz', 'pt', 'qt', 'gallon', 'slice', 'lbs', 'oz', 'clove', 'piece', 'square', 'other' ]

    return(
        <fieldset className='w-full p-4 flex space-x-5'>
            <TextField label="Ingredient" variant="outlined" size='small' value={name} onChange={handleNameChange} />    
            <TextField className='w-1/6' label="Amount" variant="outlined" size='small' value={amount} onChange={handleAmountChange} />                 
            <Autocomplete
                className='w-1/6'
                size='small'
                includeInputInList
                disableClearable
                options={measurementOptions}
                renderInput={(params) => <TextField {...params} label='Measurement' />} 
                value={measure}
                onChange={handleMeasureChange}
            />
            <IngredientGroupTags groups={groups} tag={tag} update={handleTagChange} />

            <button onClick={handleDelete}>
                <IoTrashSharp className='text-2xl' />  
            </button> 
        </fieldset>
    )
}
