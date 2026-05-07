import { Input } from '@/components/ui/input'
import { ChangeEvent } from 'react'
import { IoCloseSharp } from 'react-icons/io5'

interface GroupInputProps {
  id: number;
  name: string;
  update: (value: string, id: number) => void;
  remove: (id: number, name: string) => void;
}

export default function GroupInput({ id, name, update, remove }: GroupInputProps) {
  const handleUpdate = ({ target }: ChangeEvent<HTMLInputElement>) => {
    update(target.value, id)
  }

  return (
    <div className="relative xs:w-1/4">
      <Input
        className="pr-8"
        size={undefined}
        value={name}
        onChange={handleUpdate}
        placeholder="Group name"
      />
      <button
        type="button"
        onClick={() => remove(id, name)}
        className="absolute right-1 top-1/2 -translate-y-1/2"
      >
        <IoCloseSharp className="cursor-pointer rounded-full p-1 text-2xl hover:bg-slate-200" />
      </button>
    </div>
  )
}
