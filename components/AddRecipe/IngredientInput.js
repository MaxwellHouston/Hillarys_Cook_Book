import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import { IoTrashSharp } from 'react-icons/io5';

export default function IngredientInput({id, name, amount, fraction, measure, updateValue, deleteIngredient}) {

    const handleNameChange = ({target}) => {
        updateValue(id, target.value, 'name');
    }
    const handleAmountChange = ({target}) => {
        updateValue(id, target.value, 'amount');
    }
    const handleMeasureChange = ({target}) => {
        updateValue(id, target.value, 'measure');
    }
    const handleFractionChange = ({target}) => {
        updateValue(id, target.value, 'fraction');
    }

    const handleDelete = (e) => {
        e.preventDefault();
        deleteIngredient(id);
    }

    return(
        <fieldset className='w-full py-4 flex'>
            <TextField id="outlined-basic" label="Name" variant="outlined" size='small' value={name} onChange={handleNameChange} />    
            <TextField id="outlined-basic" label="Amount" variant="outlined" size='small' value={amount} onChange={handleAmountChange} />               
            <InputLabel id='fraction'>Add Fraction</InputLabel>
            <Select labelId='fraction' label='fraction' value={fraction} onChange={handleFractionChange} size='small'>
                <MenuItem value={0}>0</MenuItem>
                <MenuItem value={.25}>1/4</MenuItem>
                <MenuItem value={.33}>1/3</MenuItem>
                <MenuItem value={.50}>1/2</MenuItem>
                <MenuItem value={.66}>2/3</MenuItem>    
                <MenuItem value={.75}>3/4</MenuItem>
            </Select>    
            <InputLabel id='measurement'>Measurement</InputLabel>
            <Select labelId='measurement' label='Measurement' value={measure} onChange={handleMeasureChange} size='small'>
                <MenuItem value={'cups'}>Cups</MenuItem>
                <MenuItem value={'tbsp'}>Tbsp</MenuItem>
                <MenuItem value={'tsp'}>Tsp</MenuItem>
            </Select>
            <button onClick={handleDelete}>
                <IoTrashSharp className='text-2xl' />  
            </button> 
        </fieldset>
    )
}
