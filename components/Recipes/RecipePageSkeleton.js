import { Skeleton } from "@mui/material";


export default function RecipePageSkeleton() {

    return(
        <div className="w-full border-2 p-10 mt-4 mb-8 shadow-2xl flex flex-wrap justify-center">
            <Skeleton sx={{margin: '2rem', width: '50%'}} />
            <Skeleton variant="rectangular" width={700} height={400} />
            <hr className="mt-10 w-full border-slate-500" variant="middle" />
            <Skeleton sx={{marginTop: 0}} width={700} height={200} />
            <hr className="w-full border-slate-500" variant="middle" />
            <Skeleton width={700} height={200} />
        </div>
    )
}