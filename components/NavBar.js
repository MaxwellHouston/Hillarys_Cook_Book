import Link from "next/link";
import Image from "next/image";
import { auth } from '../utilities/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import SearchBar from "./SearchBar";

export default function NavBar() {

    const [user, loading] = useAuthState(auth);

    return(
        <nav className="flex justify-around items-center bg-white h-10 py-10">
            <Link href='/' >
                <button className="text-lg font-medium">Home</button>
            </Link>
            <SearchBar />
            <Link href='/add'><button>Add Recipes</button></Link>
            {!user ? 
            <Link href='/auth/login'>
                <button>Login</button>
            </Link>
            :
            <Link href='/profile'>
                <Image src={user.photoURL} height={55} width={55} className='rounded-full' />
            </Link>
            }
            
        </nav>
    )
}