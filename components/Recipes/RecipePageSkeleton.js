import { Skeleton } from '@mui/material'

export default function RecipePageSkeleton() {
  return (
    <div className="mt-4 mb-8 flex w-full flex-wrap justify-center border-2 p-10 shadow-2xl">
      <Skeleton sx={{ margin: '2rem', width: '50%' }} />
      <Skeleton variant="rectangular" width={700} height={400} />
      <hr className="mt-10 w-full border-slate-500" variant="middle" />
      <Skeleton sx={{ marginTop: 0 }} width={700} height={200} />
      <hr className="w-full border-slate-500" variant="middle" />
      <Skeleton width={700} height={200} />
    </div>
  )
}
