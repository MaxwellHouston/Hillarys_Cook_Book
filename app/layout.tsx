import type { Metadata } from 'next'
import '@/styles/globals.css'
import FavoritesContext from '@/context/favoritesContext'
import FavoritesErrorAlert from '@/components/FavoritesErrorAlert'
import MobileTray from '@/components/MobileTray'
import NavBar from '@/components/NavBar'

export const metadata: Metadata = {
  title: "Hillary's Cook Book",
  description: "Hillary's family cookbook",
  icons: {
    icon: '/chef-logo.png',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,700;0,800;1,400;1,700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Unbounded:wght@400;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <FavoritesContext>
          <div
            id="background"
            className="flex flex-wrap justify-center bg-slate-300 font-poppins"
          >
            <NavBar />
            {children}
            <MobileTray />
            <FavoritesErrorAlert />
          </div>
        </FavoritesContext>
      </body>
    </html>
  )
}
