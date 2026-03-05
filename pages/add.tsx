import { useRouter } from 'next/router'
import { useAuthState } from 'react-firebase-hooks/auth'
import AddForm from '../components/AddRecipe/AddForm'
import { authCheck } from '../utilities/authCheck'
import { auth } from '../utilities/firebase'
import { BiErrorAlt } from 'react-icons/bi'

export default function Add() {
  const [user, loading] = useAuthState(auth)
  const isAuthorized = user ? authCheck(user.uid) : false
  const route = useRouter()

  if (!isAuthorized) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-slate-300">
        <div className="flex w-2/3 flex-col items-center rounded-xl bg-red-600 p-8 text-white text-center">
          <BiErrorAlt className='text-5xl my-5' />
          <p>You are not authorized to view this page.</p>
          <p>Please contact the site administrator to request access.</p>
          <button onClick={() => {route.back()}} className='bg-white text-black font-bold my-5 py-3 px-5 rounded-lg'>Go Back</button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-wrap">
      <h1 className=" my-8 w-full text-center text-4xl font-bold">
        Add Recipe
      </h1>
      <AddForm />
    </div>
  )
}
