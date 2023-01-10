import Head from 'next/head'
import DisplayBy from '../components/DisplayBy';
import FavoriteBar from '../components/FavoriteRecipes/FavoriteBar';
import RecipeLayout from '../components/Recipes/RecipeLayout';

export default function Home() {
  return (
      <div className='text-center'>
        <h2>Favorites</h2>
        <FavoriteBar />
        <h2>Recipes</h2> 
        <DisplayBy />
        <RecipeLayout />
      </div>
  )
}
