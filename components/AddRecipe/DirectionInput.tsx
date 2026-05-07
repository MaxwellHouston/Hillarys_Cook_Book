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

  const handleUpdate = ({ target }: ChangeEvent<HTMLTextAreaElement>) => {
    updateDescription(step, target.value)
  }

  return (
    <fieldset className="flex w-full items-center justify-between p-4">
      <p>{step}.</p>
      <textarea
        className="w-2/3 rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        placeholder="Step"
        value={description}
        onChange={handleUpdate}
        rows={2}
      />
      <button onClick={handleDelete}>
        <IoTrashSharp className="text-2xl" />
      </button>
    </fieldset>
  )
}
