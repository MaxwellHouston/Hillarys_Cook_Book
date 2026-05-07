import { Input } from '@/components/ui/input'
import { IoTrashSharp } from 'react-icons/io5'
import IngredientGroupTags from './IngredientGroupTags'
import { ChangeEvent, MouseEvent, SyntheticEvent } from 'react'
import { Group } from '../../types'

interface IngredientInputProps {
  id: number;
  name: string;
  amount: string;
  measure: string;
  tag: string | null;
  groups: Group[];
  updateValue: (id: number, value: string, input: string) => void;
  deleteIngredient: (id: number) => void;
}

const measurementOptions = [
  'other', 'cup', 'tbsp', 'tsp', 'fl. oz', 'pt', 'qt', 'gallon',
  'slice', 'lbs', 'oz', 'clove', 'piece', 'square', 'each', 'can',
  'unit', 'liter', 'ml', 'gram',
]

export default function IngredientInput({
  id, name, amount, measure, tag, groups, updateValue, deleteIngredient,
}: IngredientInputProps) {
  return (
    <fieldset className="flex flex-col space-y-3 md:flex-row md:space-y-0 md:space-x-5 md:p-4 w-full">
      <Input
        placeholder="Ingredient"
        value={name}
        onChange={({ target }: ChangeEvent<HTMLInputElement>) => updateValue(id, target.value, 'name')}
      />
      <Input
        className="md:w-1/6"
        placeholder="Amount"
        value={amount}
        onChange={({ target }: ChangeEvent<HTMLInputElement>) => updateValue(id, target.value, 'amount')}
      />
      <select
        className="md:w-1/6 h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
        value={measure}
        onChange={(e) => updateValue(id, e.target.value, 'measure')}
      >
        {measurementOptions.map((m) => (
          <option key={m} value={m}>{m}</option>
        ))}
      </select>
      <IngredientGroupTags groups={groups} tag={tag} update={(v) => updateValue(id, v, 'tag')} />
      <button type="button" onClick={(e: MouseEvent) => { e.preventDefault(); deleteIngredient(id) }}>
        <IoTrashSharp className="text-2xl" />
      </button>
    </fieldset>
  )
}
