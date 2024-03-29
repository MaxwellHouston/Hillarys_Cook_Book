import { TextField } from '@mui/material'
import { IoTrashSharp } from 'react-icons/io5'

export default function DirectionInput({
  step,
  description,
  updateDescription,
  deleteDirection,
}) {
  const handleDelete = (e) => {
    e.preventDefault()
    deleteDirection(step)
  }

  const handleUpdate = ({ target }) => {
    updateDescription(step, target.value)
  }

  return (
    <fieldset className="flex w-full items-center justify-between p-4">
      <p>{step}.</p>
      <TextField
        className="w-2/3"
        multiline
        label="Step"
        value={description}
        onChange={handleUpdate}
      />
      <button onClick={handleDelete}>
        <IoTrashSharp className="text-2xl" />
      </button>
    </fieldset>
  )
}
