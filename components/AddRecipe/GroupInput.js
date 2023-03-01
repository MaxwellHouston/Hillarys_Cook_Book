import { InputAdornment, OutlinedInput } from '@mui/material'
import { IoCloseSharp } from 'react-icons/io5'

export default function GroupInput({ id, name, update, remove }) {
  const handleUpdate = ({ target }) => {
    update(target.value, id)
  }

  const handleDelete = () => {
    remove(id, name)
  }

  return (
    <OutlinedInput
      className="xs:w-1/4 pr-1"
      size="small"
      value={name}
      onChange={handleUpdate}
      endAdornment={
        <InputAdornment position="end">
          <button onClick={handleDelete}>
            <IoCloseSharp className="cursor-pointer rounded-full p-1 text-2xl hover:bg-slate-200" />
          </button>
        </InputAdornment>
      }
    />
  )
}
