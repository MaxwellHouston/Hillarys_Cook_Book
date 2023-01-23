

export default function Ingredients({ingredients}) {

    const renderIngredients = () => {
        return ingredients.map(ingredient => {

            return(
                <li key={ingredient.key} className=''>
                    {ingredient.amount !== 0 && ingredient.amount} {ingredient.measure !== 'other' && ingredient.measure} {ingredient.name}
                </li>
            )
        })
    }

    return(
        <ul className="list-disc ml-10 leading-8">
            {renderIngredients()}
        </ul>
    )
}