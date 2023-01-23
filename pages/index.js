import DisplayBy from '../components/DisplayBy';
import RecipeLayout from '../components/Recipes/RecipeLayout';

export default function Home() {
  return (
      <div className='text-center'>
        <h2>Recipe Book</h2>
        <div className='border-2 border-black p-5 w-full'>
          <DisplayBy />
          <RecipeLayout />
        </div> 
      </div>
  )
}
