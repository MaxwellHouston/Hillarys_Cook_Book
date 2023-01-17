import { Autocomplete, TextField } from "@mui/material";
import { useEffect, useState } from "react";


export default function IngredientGroupTags({groups, tag, update}) {

    const [groupList, setGroupList] = useState([]);

    const handleTagChange = (event, values) => {
        console.log(event)
        update(values);
    }

    useEffect(() => {
        setGroupList(
            groups.map(group => group.name)
        );
        console.log('helppppp meeeee')
    }, [groups])

    return(
        <Autocomplete
            className="w-1/4"
            size='small'
            includeInputInList
            disableClearable
            options={groupList}
            renderInput={(params) => <TextField {...params} label='Tags' />} 
            value={tag}
            onChange={handleTagChange}
        />
    )
}