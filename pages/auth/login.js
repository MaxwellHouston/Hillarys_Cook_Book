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
    <div className="mt-32 rounded-lg p-10 shadow-xl">
      <h2 className="py-4 text-2xl font-medium">
        Login with Google to leave comments and save recipes!
      </h2>
      <button
        onClick={GoogleLogin}
        className="w-75 flex gap-5 rounded-lg bg-black p-4 align-middle font-medium text-white"
      >
        <FcGoogle className="text-2xl" />
        Login with Google
      </button>
    </div>
  )
}
