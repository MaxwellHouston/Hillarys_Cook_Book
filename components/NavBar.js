import Link from 'next/link'
import Image from 'next/image'
import logo from '../utilities/photos/chef-logo.png'
import { auth } from '../utilities/firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import SearchBar from './SearchBar'
import { authCheck } from '../utilities/authCheck'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

export default function NavBar() {
  const [user, loading] = useAuthState(auth)
  const [userAuthorized, setUserAuthorized] = useState(false)
  const route = useRouter()

  const logOut = () => {
    auth.signOut()
    route.push('/')
  }

  useEffect(() => {
    if (user) {
      setUserAuthorized(authCheck(user.uid))
    }
  }, [user])

  return (
    <nav className="fixed top-0 z-50 flex h-14 w-full items-center justify-between border-b-2 border-black bg-slate-900 py-2 px-4 text-white md:h-auto">
      <Link href="/recipes" className="flex h-12 max-w-md mr-5 md:h-auto md:w-auto">
        <Image src={logo} alt="Chef hat" height={70} width={70} />
      </Link>
      <div className="flex max-w-fit items-center justify-around sm:space-x-10 md:mr-5">
        <SearchBar />
        {!user ? (
          <Link href="/auth/login" className="hidden md:block">
            <button>Login</button>
          </Link>
        ) : (
          <div>
            <div className="hidden max-w-fit items-center justify-between space-x-10 md:flex">
              <Link href="/add">
                <button className={`${!userAuthorized && 'hidden'}`}>
                  Add Recipes
                </button>
              </Link>
              <Link href="/profile">Profile</Link>
              <button onClick={logOut}>Log Out</button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
