import { TextField } from "@mui/material";
import { IoTrashSharp } from 'react-icons/io5';


export default function DirectionInput({step, description, updateDescription, deleteDirection}) {

    const handleDelete = (e) => {
        e.preventDefault();
        deleteDirection(step);
    }

    const handleUpdate = ({target}) => {
        updateDescription(step, target.value);
    }

    return(
        <fieldset className="w-full py-4 flex justify-between items-center">
            <p>{step}.</p>
            <TextField className="w-1/2" multiline label='Step' value={description} onChange={handleUpdate} />
            <button onClick={handleDelete}>
                <IoTrashSharp className='text-2xl' />  
            </button>
        </fieldset>
    )
}