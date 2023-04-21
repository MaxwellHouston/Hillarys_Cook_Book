import { Breadcrumbs } from '@mui/material'
import Link from 'next/link'
import { useRouter } from 'next/router'

export default function BreadCrumbs({ recipeName }) {
  const router = useRouter()

  return (
    <Breadcrumbs>
      <Link href={'/recipes'} className="hover:text-slate-900">
        Recipes
      </Link>
      {router.query.search && (
        <Link
          href={{
            pathname: '/recipes-search',
            query: { searchParams: router.query.search },
          }}
          className="hover:text-slate-900"
        >
          {`Search-${router.query.search}`}
        </Link>
      )}
      <p className="underline">{recipeName}</p>
    </Breadcrumbs>
  )
}
