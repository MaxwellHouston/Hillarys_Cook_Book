import { TextField } from '@mui/material'
import { ChangeEvent, MouseEvent } from 'react'
import { IoTrashSharp } from 'react-icons/io5'

interface DirectionInputProps {
  step: number;
  description: string;
  updateDescription: (step: number, input: string) => void;
  deleteDirection: (step: number) => void;
}

export default function DirectionInput({
  step,
  description,
  updateDescription,
  deleteDirection,
}: DirectionInputProps) {
  const handleDelete = (e: MouseEvent) => {
    e.preventDefault()
    deleteDirection(step)
  }

  const handleUpdate = ({ target }: ChangeEvent<HTMLInputElement>) => {
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
