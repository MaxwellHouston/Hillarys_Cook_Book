import { FcGoogle } from 'react-icons/fc'
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { auth } from '../../utilities/firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export default function Login() {
  const route = useRouter()
  const [user, loading] = useAuthState(auth)
  const [pushCalled, setPushCalled] = useState(false)

  //Google Login
  const googleProvider = new GoogleAuthProvider()
  const GoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider)
      setPushCalled(true)
      route.push('/profile')
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (pushCalled) return
    if (user) {
      setPushCalled(true)
      route.push('/profile')
    }
  }, [user, route, pushCalled])

  return (
    <div className="flex h-[92vh] w-full items-center bg-slate-300">
      <div className="flex flex-wrap justify-center border border-x-0 border-black bg-white p-10 text-center shadow-xl md:rounded-lg md:border-x">
        <h2 className="mb-4 w-full py-4 text-2xl font-medium">
          Login with Google to leave comments and save recipes!
        </h2>
        <button
          onClick={GoogleLogin}
          className="w-75 flex gap-5 rounded-lg bg-black p-4 align-middle font-medium text-white shadow-md shadow-slate-900 hover:bg-slate-700 active:translate-y-1 active:translate-x-1 active:shadow-none"
        >
          <FcGoogle className="text-2xl" />
          Login with Google
        </button>
      </div>
    </div>
  )
}
