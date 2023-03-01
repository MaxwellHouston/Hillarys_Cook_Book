import Link from 'next/link'
import Image from 'next/image'
import logo from '../utilities/photos/chef-logo.png'
import { auth } from '../utilities/firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import SearchBar from './SearchBar'

export default function NavBar() {
  const [user, loading] = useAuthState(auth)

  return (
    <nav className="flex w-full items-center justify-between bg-slate-900 py-2 px-4 text-white border-b-2 border-black">
      <Link href="/">
        <Image src={logo} alt="Chef hat" height={70} width={70} />
      </Link>
      <div className="mr-5 flex max-w-fit items-center justify-around space-x-10">
        <SearchBar />
        {!user ? (
          <Link href="/auth/login">
            <button>Login</button>
          </Link>
        ) : (
          <div className="flex max-w-fit items-center justify-between space-x-10">
            <Link href="/favorites" className="hidden sm:block">
              <button className="py-3">Favorites</button>
            </Link>
            <Link href="/add">
              <button className="py-3">Add Recipes</button>
            </Link>
            <Link href="/profile">
              <Image
                src={user.photoURL}
                alt="User Google avatar"
                height={40}
                width={40}
                className="rounded-full"
              />
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
