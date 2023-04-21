import FavoritesContext from '../context/favoritesContext'
import FavoritesErrorAlert from './FavoritesErrorAlert'
import MobileTray from './MobileTray'
import NavBar from './NavBar'

export default function Layout({ children }) {
  return (
    <FavoritesContext>
      <div
        id="background"
        className=" flex flex-wrap justify-center bg-slate-300 font-poppins"
      >
        <NavBar />
        <main className="mt-16 w-full max-w-3xl bg-white md:w-[48rem]">
          {children}
        </main>
        <MobileTray />
        <FavoritesErrorAlert />
      </div>
    </FavoritesContext>
  )
}
