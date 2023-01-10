import { FcGoogle } from 'react-icons/fc';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../../utilities/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/router';
import { useEffect } from 'react';



export default function Login() {
    const route = useRouter();
    const [user, loading] = useAuthState(auth);  

    //Google Login
    const googleProvider = new GoogleAuthProvider();
    const GoogleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            route.push("/profile");
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if(user) route.push('/profile');
    },[user])

    return(
        <div className='shadow-xl mt-32 p-10 rounded-lg'>
            <h2 className='text-2xl font-medium py-4'>Login with Google to leave comments and save recipes!</h2>
            <button onClick={GoogleLogin} className='text-white bg-black w-75 font-medium rounded-lg flex align-middle p-4 gap-5'>
                <FcGoogle className='text-2xl' />
                Login with Google
            </button>
        </div>
    )
}