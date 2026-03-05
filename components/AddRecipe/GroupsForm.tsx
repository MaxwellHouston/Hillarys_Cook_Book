import { MouseEvent, useState } from 'react'
import { IoAddCircleSharp } from 'react-icons/io5'
import GroupInput from './GroupInput'
import { Group } from '../../types'

interface GroupsFormProps {
  groups: Group[];
  updateGroups: (groups: Group[]) => void;
  deleteTags: (name: string) => void;
}

export default function GroupsForm({ groups, updateGroups, deleteTags }: GroupsFormProps) {
  const [nextKey, setNextKey] = useState(1)

  const handleAddGroup = (e: MouseEvent) => {
    e.preventDefault()
    updateGroups([...groups, { id: nextKey, name: '' }])
    setNextKey(nextKey + 1)
  }

  const handleUpdateGroup = (value: string, id: number) => {
    let updatedArray = groups.map((group) => {
      if (group.id === id) {
        return { ...group, name: value }
      } else {
        return group
      }
    })
    updateGroups(updatedArray)
  }

  const handleDeleteGroup = (id: number, name: string) => {
    deleteTags(name)
    let updatedArray = groups.filter((group) => group.id !== id)
    updateGroups(updatedArray)
  }

  const renderGroupInputs = () => {
    return groups.map((group) => (
      <GroupInput
        key={group.id}
        id={group.id}
        name={group.name}
        update={handleUpdateGroup}
        remove={handleDeleteGroup}
      />
    ))
  }

  return (
    <fieldset className="my-4 flex flex-col space-y-3 xs:space-y-0 xs:flex-row w-full xs:items-center space-x-2">
      <h2 className="mr-4 font-bold">Group Tags:</h2>
      {renderGroupInputs()}
      <button className='self-end xs:self-auto' onClick={handleAddGroup}>
        <IoAddCircleSharp className="text-2xl" />
      </button>
    </fieldset>
  )
}
