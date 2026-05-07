'use client'

import { Input } from '@/components/ui/input'
import { IoTrashSharp } from 'react-icons/io5'
import IngredientGroupTags from './IngredientGroupTags'
import { ChangeEvent, MouseEvent, useState } from 'react'
import { Group, MeasureUnit } from '../../types'
import { parseFraction, formatAmount, MEASURE_UNITS } from '../../utilities/scaling'

interface IngredientInputProps {
  id: number;
  name: string;
  amount: number;
  measure: MeasureUnit;
  freeform: boolean;
  tag: string | null;
  groups: Group[];
  updateValue: (id: number, value: string | number | boolean, input: string) => void;
  deleteIngredient: (id: number) => void;
}

export default function IngredientInput({
  id, name, amount, measure, freeform, tag, groups, updateValue, deleteIngredient,
}: IngredientInputProps) {
  // Display the amount as a fraction string while editing
  const [amountInput, setAmountInput] = useState(amount > 0 ? formatAmount(amount) : '')

  const handleAmountBlur = () => {
    const parsed = parseFraction(amountInput)
    if (parsed !== null) {
      updateValue(id, parsed, 'amount')
      setAmountInput(formatAmount(parsed))
    } else {
      // Reset to last valid value
      setAmountInput(amount > 0 ? formatAmount(amount) : '')
    }
  }

  const handleFreeformToggle = () => {
    updateValue(id, !freeform, 'freeform')
    if (!freeform) {
      setAmountInput('')
      updateValue(id, 0, 'amount')
    }
  }

  return (
    <fieldset className="flex flex-col space-y-3 md:flex-row md:space-y-0 md:space-x-3 md:p-4 w-full items-center">
      <Input
        placeholder="Ingredient"
        value={name}
        onChange={({ target }: ChangeEvent<HTMLInputElement>) => updateValue(id, target.value, 'name')}
      />
      {freeform ? (
        <span className="text-sm text-slate-500 italic md:w-1/3 shrink-0">to taste</span>
      ) : (
        <>
          <Input
            className="md:w-1/6"
            placeholder="Amount (e.g. 1/2)"
            value={amountInput}
            onChange={({ target }: ChangeEvent<HTMLInputElement>) => setAmountInput(target.value)}
            onBlur={handleAmountBlur}
          />
          <select
            className="md:w-1/6 h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
            value={measure}
            onChange={(e) => updateValue(id, e.target.value, 'measure')}
          >
            {MEASURE_UNITS.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
          <IngredientGroupTags groups={groups} tag={tag} update={(v) => updateValue(id, v, 'tag')} />
        </>
      )}
      <label className="flex items-center gap-1 text-xs text-slate-500 shrink-0 cursor-pointer">
        <input
          type="checkbox"
          checked={freeform}
          onChange={handleFreeformToggle}
          className="cursor-pointer"
        />
        To taste
      </label>
      <button type="button" onClick={(e: MouseEvent) => { e.preventDefault(); deleteIngredient(id) }}>
        <IoTrashSharp className="text-2xl" />
      </button>
    </fieldset>
  )
}
