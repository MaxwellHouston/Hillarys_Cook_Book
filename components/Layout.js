import NavBar from './NavBar'

export default function Layout({ children }) {
  return (
    <div
      id="background"
      className=" flex flex-wrap justify-center bg-slate-300 font-poppins"
    >
      <NavBar />
      <main className="max-w-3xl md:w-[48rem] bg-white">{children}</main>
    </div>
  )
}

//mx-6 md:max-w-2xl md-mx-auto
