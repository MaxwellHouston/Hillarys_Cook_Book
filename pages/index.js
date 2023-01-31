import Link from "next/link";
import { useRouter } from 'next/router';
import { auth } from '../utilities/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Divider } from "@mui/material";
import { useEffect } from "react";

export default function Home() {

  const [user, loading] = useAuthState(auth);
  const route = useRouter();

  useEffect(() => {
    if(user) route.push('/recipes');
  },[user, route])

  return (
      <div className='flex text-center w-full'>
        <div className="border-2 border-black rounded-2xl my-10 w-[50vw] max-w-[700px] shadow-2xl min-h-[85vh] flex items-center justify-center bg-cover bg-center bg-[url('/cookbook-background.jpg')]">
          <div className="w-1/2 border-2 p-6 h-1/2 flex flex-wrap justify-center -translate-y-12">
            <h1 className='text-4xl font-bold my-5 w-full text-white font-[Unbounded]'>Hillary&apos;s Cookbook</h1>
            <div className="w-1/2">
              <Link href='/recipes' className="w-full">
                <button className="bg-white p-2 rounded-xl shadow-2xl shadow-black">Start Cooking</button>
              </Link>
              <Divider variant="middle" className="text-white border-white my-5" sx={{ "&::before, &::after": {borderColor: "white"}}}>Or</Divider>
              <Link href='/auth/login' className="text-white underline">Log in</Link>
            </div>
          </div>
        </div>
      </div>
  )
}
