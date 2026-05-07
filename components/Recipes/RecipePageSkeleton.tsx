export default function RecipePageSkeleton() {
  return (
    <div className="mt-4 mb-8 flex w-full flex-wrap justify-center border-2 p-10 shadow-2xl">
      <div className="mb-8 h-6 w-1/2 animate-pulse rounded bg-slate-200" />
      <div className="h-[400px] w-full animate-pulse rounded bg-slate-200" />
      <hr className="mt-10 w-full border-slate-500" />
      <div className="mt-4 h-[200px] w-full animate-pulse rounded bg-slate-200" />
      <hr className="w-full border-slate-500" />
      <div className="mt-4 h-[200px] w-full animate-pulse rounded bg-slate-200" />
    </div>
  )
}
