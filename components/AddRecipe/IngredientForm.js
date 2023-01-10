import { useState } from 'react';
import IngredientInput from './IngredientInput';
import { IoAddCircleSharp } from 'react-icons/io5';

export default function IngredientForm({ingredientsList, updateIngredientsList}) {

    const [nextKey, setNextKey] = useState(1);

    const addIngredient = (e) => {
        e.preventDefault();
        updateIngredientsList([...ingredientsList, {key: nextKey, name: '', amount: 0, fraction: 0, measure: 'cups'} ]);
        setNextKey(nextKey+1);
    }
    
    const deleteIngredient = (id) => {
        let updatedList = ingredientsList.filter(ingredient => ingredient.key !== id);
        updateIngredientsList(updatedList);
    }

    const updateValue = (id, value, input) => {
        let updatedlist = ingredientsList.map(ingredient => {
            if(ingredient.key === id){
                return {...ingredient, [input]: value}
            } else {
                return ingredient;
            }
        });
        updateIngredientsList(updatedlist);
    }

    const renderIngredients = () => {
        let list = ingredientsList.map(ingredient => 
        <IngredientInput 
            key={ingredient.key} 
            id={ingredient.key}
            name={ingredient.name}
            amount={ingredient.amount}
            fraction={ingredient.fraction}
            measure={ingredient.measure}
            updateValue={updateValue}
            deleteIngredient={deleteIngredient} 
        />
        )
        return list;
    }
    return(
        <fieldset>
            <h2>Ingredients</h2>
            <ul>
                {renderIngredients()}
            </ul>
            <button className='float-right' onClick={addIngredient}>
                <IoAddCircleSharp className='text-2xl' />
            </button>
        </fieldset>
    )
}