import Link from "next/link";
import Image from "next/image";
import logo from '../utilities/photos/chef-logo.png';
import { auth } from '../utilities/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import SearchBar from "./SearchBar";

export default function NavBar() {

    const [user, loading] = useAuthState(auth);

    return(
        <nav className="flex justify-between items-center text-white bg-slate-900 py-2 px-4 w-full">
            <Link href='/' >
                <Image src={logo} alt='Chef hat' height={70} width={70} />
            </Link>
            <div className="flex justify-around items-center max-w-fit space-x-10 mr-5">
                <SearchBar />
                {!user ? 
                    <Link href='/auth/login'>
                        <button>Login</button>
                    </Link>
                    :
                    <div className="flex items-center justify-between max-w-fit space-x-10">
                        <Link href='/favorites' className="hidden sm:block">
                            <button className="py-3">Favorites</button>
                        </Link>
                        <Link href='/add'>
                            <button className="py-3">Add Recipes</button>
                        </Link>
                        <Link href='/profile'>
                            <Image src={user.photoURL} alt='User Google avatar' height={40} width={40} className='rounded-full' />
                        </Link>
                    </div>

                }
            </div>



            
        </nav>
    )
} 