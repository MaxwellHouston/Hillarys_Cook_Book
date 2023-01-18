import { InputAdornment, OutlinedInput } from "@mui/material";
import { IoCloseSharp } from "react-icons/io5";

export default function GroupInput({id, name, update, remove}) {

    const handleUpdate = ({target}) => {
        update(target.value, id);
    }

    const handleDelete = () => {
        remove(id, name);
    }

    return (
        <OutlinedInput
            className="w-1/4 pr-1" 
            size='small' 
            value={name} 
            onChange={handleUpdate}
            endAdornment={
                <InputAdornment position="end">
                    <button onClick={handleDelete}>
                        <IoCloseSharp className="text-2xl p-1 rounded-full cursor-pointer hover:bg-slate-200" />
                    </button>
                </InputAdornment>
            } />
    )
}