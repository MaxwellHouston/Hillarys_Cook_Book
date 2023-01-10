import { auth } from '../utilities/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/router';
import { useEffect } from 'react';


export default function Profile() {

    const route = useRouter();
    const [user, loading] = useAuthState(auth);

    const checkUser = async () => {
        if(loading) return;
        if(!user) return route.push('/auth/login');
    }

    const logOut = () => {
        auth.signOut();
        route.push('/');
    }

    useEffect(() => {
        checkUser();
    }, [user, loading])

    return(
        <div className='flex flex-wrap justify-around'>
            <h2>{user ? user.displayName : 'User'}'s Saved Recipes</h2>
            <button onClick={logOut}>Sign Out</button>
            <ul className='w-full'>
                <li>Recipe 1</li>
                <li>Recipe 2</li>
                <li>Recipe 3</li>
                <li>Recipe 4</li>
                <li>Recipe 5</li>
            </ul>
        </div>
    )
}