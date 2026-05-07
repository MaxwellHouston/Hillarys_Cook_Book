import { MouseEvent, useState } from 'react'
import IngredientInput from './IngredientInput'
import { IoAddCircleSharp } from 'react-icons/io5'
import { Ingredient, Group } from '../../types'

interface IngredientFormProps {
  ingredientsList: Ingredient[];
  updateIngredientsList: (list: Ingredient[]) => void;
  groups: Group[];
}

export default function IngredientForm({
  ingredientsList,
  updateIngredientsList,
  groups,
}: IngredientFormProps) {
  const [nextKey, setNextKey] = useState(1)

  const addIngredient = (e: MouseEvent) => {
    e.preventDefault()
    updateIngredientsList([
      ...ingredientsList,
      { key: nextKey, name: '', amount: 0, measure: 'other', freeform: false, tag: null },
    ])
    setNextKey(nextKey + 1)
  }

  const deleteIngredient = (id: number) => {
    updateIngredientsList(ingredientsList.filter((i) => i.key !== id))
  }

  const updateValue = (id: number, value: string | number | boolean, input: string) => {
    updateIngredientsList(
      ingredientsList.map((ingredient) =>
        ingredient.key === id ? { ...ingredient, [input]: value } : ingredient
      )
    )
  }

  return (
    <fieldset>
      <h2 className="font-bold">Ingredients:</h2>
      <ul className="my-2 space-y-1">
        {ingredientsList.map((ingredient) => (
          <IngredientInput
            key={ingredient.key}
            id={ingredient.key}
            name={ingredient.name}
            amount={ingredient.amount}
            measure={ingredient.measure}
            freeform={ingredient.freeform}
            tag={ingredient.tag}
            groups={groups}
            updateValue={updateValue}
            deleteIngredient={deleteIngredient}
          />
        ))}
      </ul>
      <button className="float-right" onClick={addIngredient}>
        <IoAddCircleSharp className="text-2xl" />
      </button>
    </fieldset>
  )
}
