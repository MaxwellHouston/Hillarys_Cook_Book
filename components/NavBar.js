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
  const [user, loading] = useAuthState(auth);
  const [userAuthorized, setUserAuthorized] = useState(false);
  const route = useRouter();

  const logOut = () => {
    auth.signOut();
    route.push("/");
  }

  useEffect(() => {
    if (user) {
      setUserAuthorized(authCheck(user.uid))
    }
  }, [user])

  return (
    <nav className="flex w-full items-center justify-between border-b-2 border-black bg-slate-900 py-2 px-4 text-white">
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
            <Link href="/add">
              <button className={`${!userAuthorized && 'hidden'}`}>
                Add Recipes
              </button>
            </Link>
            <Link href="/profile">
              Profile
            </Link>
            <button onClick={logOut}>
              Log Out
            </button>
          </div>
        )}

      </div>
    </nav>
  )
}

{
  /* <nav className="flex w-full items-center justify-between border-b-2 border-black bg-slate-900 py-2 px-4 text-white">
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
        <button className={`${!userAuthorized && 'hidden'}`}>Add Recipes</button>
      </Link>
      <button>Log Out</button>
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

        <ul
          className={`${
            dropOpen ? 'block' : 'hidden'
          } absolute right-0 top-20 w-48 bg-slate-900`}
        >
          <li className="flex items-center justify-center hover:bg-slate-500">
            <Link className="py-4" href="/profile">
              Profile
            </Link>
          </li>
          <li className="flex items-center justify-center py-4 hover:cursor-pointer hover:bg-slate-500" onClick={() => {auth.signOut()}}>
            Log Out
          </li>
        </ul>

              <Image
                src={user.photoURL}
                alt="User Google avatar"
                height={40}
                width={40}
                className="cursor-pointer rounded-full hover:contrast-200"
                onClick={() => {
                  setDropOpen(!dropOpen)
                }}
              />


          <Image
            src={user.photoURL}
            alt="User Google avatar"
            height={40}
            width={40}
            className="cursor-pointer rounded-full hover:contrast-200"
            onClick={() => {setDropOpen(!dropOpen)}}
          />



          <li className="flex items-center justify-center hover:bg-slate-500">
            <Link className="py-4" href="/add">
              Add Recipes
            </Link>
          </li>


*/
}
