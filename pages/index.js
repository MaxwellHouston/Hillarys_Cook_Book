import Link from 'next/link'
import { useRouter } from 'next/router'
import { auth } from '../utilities/firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import { Divider } from '@mui/material'
import { useEffect } from 'react'

export default function Home() {
  const [user, loading] = useAuthState(auth)
  const route = useRouter()

  useEffect(() => {
    if (user) route.push('/recipes')
  }, [user, route])

  return (
    <div className="flex w-full text-center">
      <div className="my-10 flex min-h-[85vh] w-[50vw] max-w-[700px] items-center justify-center rounded-2xl border-2 border-black bg-[url('/cookbook-background.jpg')] bg-cover bg-center shadow-2xl">
        <div className="flex h-1/2 w-1/2 -translate-y-12 flex-wrap justify-center border-2 p-6">
          <h1 className="my-5 w-full font-[Unbounded] text-4xl font-bold text-white">
            Hillary&apos;s Cookbook
          </h1>
          <div className="w-1/2">
            <Link href="/recipes" className="w-full">
              <button className="rounded-xl bg-white p-2 shadow-2xl shadow-black">
                Start Cooking
              </button>
            </Link>
            <Divider
              variant="middle"
              className="my-5 border-white text-white"
              sx={{ '&::before, &::after': { borderColor: 'white' } }}
            >
              Or
            </Divider>
            <Link href="/auth/login" className="text-white underline">
              Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
