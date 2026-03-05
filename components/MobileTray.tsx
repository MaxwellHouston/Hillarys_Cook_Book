import { BottomNavigation, BottomNavigationAction } from '@mui/material'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../utilities/firebase'
import { AiOutlineUser } from 'react-icons/ai'
import { MdLogout } from 'react-icons/md'
import { useRouter } from 'next/router'
import { GiCookingPot } from 'react-icons/gi'
import { useEffect, useState } from 'react'
import { authCheck } from '../utilities/authCheck'
import { MdAdd } from 'react-icons/md'

export default function MobileTray() {
  const [user, loading] = useAuthState(auth)
  const [userAuthorized, setUserAuthorized] = useState(false)

  const router = useRouter()

  const recipes = () => {
    return router.push('/add')
  }
  const profile = () => {
    return router.push('/profile')
  }
  const logout = () => {
    auth.signOut()
    return router.push('/')
  }
  const login = () => {
    return router.push('/auth/login')
  }

  useEffect(() => {
    if (user) {
      setUserAuthorized(authCheck(user.uid))
    }
  }, [user])

  return (
    <div className="fixed bottom-0 left-0 w-full md:hidden">
      {userAuthorized ? (
        <BottomNavigation showLabels sx={{ backgroundColor: '#0f172a' }}>
          <BottomNavigationAction
            label="Add Recipes"
            onClick={recipes}
            sx={{ color: 'white' }}
            icon={<MdAdd className="text-xl" />}
          />
          <BottomNavigationAction
            label="Profile"
            onClick={profile}
            sx={{ color: 'white' }}
            icon={<AiOutlineUser className="text-xl" />}
          />
          <BottomNavigationAction
            label="Logout"
            onClick={logout}
            sx={{ color: 'white' }}
            icon={<MdLogout className="text-xl" />}
          />
        </BottomNavigation>
      ) : user ? (
        <BottomNavigation showLabels sx={{ backgroundColor: '#0f172a' }}>
          <BottomNavigationAction
            label="Profile"
            onClick={profile}
            sx={{ color: 'white' }}
            icon={<AiOutlineUser className="text-xl" />}
          />
          <BottomNavigationAction
            label="Logout"
            onClick={logout}
            sx={{ color: 'white' }}
            icon={<MdLogout className="text-xl" />}
          />
        </BottomNavigation>
      ) : (
        <BottomNavigation showLabels sx={{ backgroundColor: '#0f172a' }}>
          <BottomNavigationAction
            label="Recipes"
            onClick={recipes}
            sx={{ color: 'white' }}
            icon={<GiCookingPot className="text-xl" />}
          />
          <BottomNavigationAction
            label="Log in"
            onClick={login}
            sx={{ color: 'white' }}
            icon={<MdLogout className="text-xl" />}
          />
        </BottomNavigation>
      )}
    </div>
  )
}
