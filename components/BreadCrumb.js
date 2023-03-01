import { Breadcrumbs } from '@mui/material'
import Link from 'next/link'

export default function BreadCrumbs({ recipeName }) {
  return (
    <Breadcrumbs>
      <Link href={'/recipes'} className="hover:text-slate-900">
        Recipes
      </Link>
      <p className="underline">{recipeName}</p>
    </Breadcrumbs>
  )
}
