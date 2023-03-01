import { FcGoogle } from 'react-icons/fc'
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { auth } from '../../utilities/firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function Login() {
  const route = useRouter()
  const [user, loading] = useAuthState(auth)

  //Google Login
  const googleProvider = new GoogleAuthProvider()
  const GoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider)
      route.push('/profile')
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (user) route.push('/profile')
  }, [user, route])

  return (
    <div className='h-[92vh] bg-slate-300 w-full flex items-center'>
      <div className="flex flex-wrap justify-center text-center md:rounded-lg p-10 border border-black border-x-0 md:border-x bg-white shadow-xl">
        <h2 className="py-4 text-2xl font-medium w-full mb-4">
          Login with Google to leave comments and save recipes!
        </h2>
        <button
          onClick={GoogleLogin}
          className="w-75 flex gap-5 rounded-lg bg-black hover:bg-slate-700 shadow-md shadow-slate-900 active:translate-y-1 active:translate-x-1 active:shadow-none p-4 align-middle font-medium text-white"
        >
          <FcGoogle className="text-2xl" />
          Login with Google
        </button>
      </div>
    </div>
  )
}
