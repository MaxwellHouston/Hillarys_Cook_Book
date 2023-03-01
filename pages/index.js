import Link from 'next/link'
import { useRouter } from 'next/router'
import { auth } from '../utilities/firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import { Button, Divider } from '@mui/material'
import { useEffect } from 'react'

export default function Home() {
  const [user, loading] = useAuthState(auth)
  const route = useRouter()

  useEffect(() => {
    if (user) route.push('/recipes')
  }, [user, route])

  return (
    <div className="flex w-full text-center justify-center bg-[url('/cookbook-background.jpg')] bg-cover bg-center">
      <div className="my-10 flex min-h-[85vh] items-center justify-center ">
        <div className="flex h-1/2 w-1/2 -translate-y-12 flex-wrap justify-center items-center border-2 p-6">
          <h1 className="my-5 w-full font-[Unbounded] xs:text-3xl md:text-5xl font-bold text-white">
            Hillary&apos;s Cookbook
          </h1>
          <div className="w-full">
            <Link href="/recipes" className="w-full">
              <button className='bg-red-700 hover:bg-red-400 active:translate-y-1 active:translate-x-1 active:shadow-none xs:text-base text-sm text-white font-bold p-3 rounded-xl border shadow-xl shadow-black'>Start Cooking</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
