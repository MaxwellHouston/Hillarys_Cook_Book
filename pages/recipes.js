import { useCallback, useEffect, useState } from 'react';
import DisplayBy from '../components/DisplayBy';
import HomeTabs from '../components/HomeTabs';
import RecipeLayout from '../components/Recipes/RecipeLayout';
import { getAllRecipes } from '../utilities/db';

export default function Recipes() {
    const [recipes, setRecipes] = useState([]);
    const [order, setOrder] = useState('recent');
    const [tab, setTab] = useState('All');
  
    const loadRecipes = useCallback(async () => {
      setRecipes(await getAllRecipes());
    }, []);
  
    useEffect(() => {
      loadRecipes();
    }, [loadRecipes]);
  
    return (
        <div className='flex text-center'>
          <div className='border-2 border-slate-300 rounded-2xl my-10  shadow-2xl px-10 pb-5 w-full'>
            <h1 className='text-6xl font-bold my-5'>{tab}</h1>
            <DisplayBy order={order} setOrder={setOrder} />
            <RecipeLayout recipes={recipes} />
          </div>
          <HomeTabs tab={tab} setTab={setTab} /> 
        </div>
    )
    
}