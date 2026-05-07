import { Ingredient } from '../../types'
import { formatAmount } from '../../utilities/scaling'

interface IngredientsProps {
  ingredients: Ingredient[];
  scale?: number;
}

export default function Ingredients({ ingredients, scale = 1 }: IngredientsProps) {
  return (
    <ul className="ml-10 list-disc leading-8">
      {ingredients.map((ingredient) => {
        if (ingredient.freeform) {
          return (
            <li key={ingredient.key}>
              {ingredient.name} — <span className="italic text-slate-500">to taste</span>
            </li>
          )
        }
        const scaledAmount = ingredient.amount > 0 ? formatAmount(ingredient.amount * scale) : ''
        const unit = ingredient.measure !== 'other' ? ingredient.measure : ''
        return (
          <li key={ingredient.key}>
            {scaledAmount} {unit} {ingredient.name}
          </li>
        )
      })}
    </ul>
  )
}
