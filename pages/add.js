import AddForm from '../components/AddRecipe/AddForm'

export default function Add() {
  return (
    <div className='flex flex-wrap'>
      <h1 className=" text-center w-full my-8 text-4xl font-bold">
        Add Recipe
      </h1>
      <AddForm />
    </div>
  )
}
