import NavBar from "./NavBar";

export default function Layout({children}) {
    return(
        <div id='background' className=" font-poppins">
            <NavBar />
            <main className="mx-5">
                {children}
            </main>
        </div>
    )
}

//mx-6 md:max-w-2xl md-mx-auto