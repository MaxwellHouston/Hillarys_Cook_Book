'use client'

import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../utilities/firebase'
import { AiOutlineUser } from 'react-icons/ai'
import { MdLogout } from 'react-icons/md'
import { useRouter } from 'next/navigation'
import { GiCookingPot } from 'react-icons/gi'
import { useEffect, useState } from 'react'
import { isAdmin } from '../utilities/authCheck'
import { MdAdd } from 'react-icons/md'

function TrayButton({ label, icon, onClick }: { label: string; icon: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-1 flex-col items-center justify-center gap-1 py-2 text-white text-xs"
    >
      <span className="text-xl">{icon}</span>
      {label}
    </button>
  )
}

export default function MobileTray() {
  const [user] = useAuthState(auth)
  const [userAuthorized, setUserAuthorized] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (user) {
      isAdmin(user).then(setUserAuthorized)
    }
  }, [user])

  return (
    <div className="fixed bottom-0 left-0 w-full bg-slate-900 border-t border-slate-700 flex md:hidden">
      {userAuthorized ? (
        <>
          <TrayButton label="Add Recipes" icon={<MdAdd />} onClick={() => router.push('/add')} />
          <TrayButton label="Profile" icon={<AiOutlineUser />} onClick={() => router.push('/profile')} />
          <TrayButton label="Logout" icon={<MdLogout />} onClick={() => { auth.signOut(); router.push('/') }} />
        </>
      ) : user ? (
        <>
          <TrayButton label="Profile" icon={<AiOutlineUser />} onClick={() => router.push('/profile')} />
          <TrayButton label="Logout" icon={<MdLogout />} onClick={() => { auth.signOut(); router.push('/') }} />
        </>
      ) : (
        <>
          <TrayButton label="Recipes" icon={<GiCookingPot />} onClick={() => router.push('/recipes')} />
          <TrayButton label="Log in" icon={<MdLogout />} onClick={() => router.push('/auth/login')} />
        </>
      )}
    </div>
  )
}
