export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="mt-16 w-full max-w-3xl bg-white md:w-[48rem]">
      {children}
    </main>
  )
}
