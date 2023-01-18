import { useState } from "react";
import { IoAddCircleSharp } from "react-icons/io5";
import GroupInput from "./GroupInput";


export default function GroupsForm({groups, updateGroups, deleteTags}) {
    
    const [nextKey, setNextKey] = useState(1);

    const handleAddGroup = (e) => {
        e.preventDefault();
        updateGroups([...groups, {id: nextKey, name: ''}]);
        setNextKey(nextKey+1);
    }

    const handleUpdateGroup = (value, id) => {
        let updatedArray = groups.map(group => {
            if(group.id === id){
                return {...group, name: value}
            } else {
                return group
            }
        });
        updateGroups(updatedArray);
    }

    const handleDeleteGroup = (id, name) => {
        deleteTags(name);
        let updatedArray = groups.filter(group => group.id !== id);
        updateGroups(updatedArray);
    }
    
    const renderGroupInputs = () => {
        return groups.map(group => <GroupInput key={group.id} id={group.id} name={group.name} update={handleUpdateGroup} remove={handleDeleteGroup} />);
    }


    return(
        <fieldset className="flex items-center my-4 space-x-2 w-full">
            <h2 className="mr-4 font-bold">Group Tags:</h2>
            {renderGroupInputs()}
            <button onClick={handleAddGroup}>
                <IoAddCircleSharp className="text-2xl" />
            </button>
        </fieldset>
    )
}