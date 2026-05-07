'use client'

import { Breadcrumbs } from '@mui/material'
import Link from 'next/link'

interface BreadCrumbsProps {
  recipeName: string;
}

export default function BreadCrumbs({ recipeName }: BreadCrumbsProps) {
  return (
    <Breadcrumbs>
      <Link href="/recipes" className="hover:text-slate-900">
        Recipes
      </Link>
      <p className="underline">{recipeName}</p>
    </Breadcrumbs>
  )
}
