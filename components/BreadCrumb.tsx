'use client'

import Link from 'next/link'

interface BreadCrumbsProps {
  recipeName: string;
}

export default function BreadCrumbs({ recipeName }: BreadCrumbsProps) {
  return (
    <nav className="flex items-center gap-2 text-sm text-slate-500">
      <Link href="/recipes" className="hover:text-slate-900">
        Recipes
      </Link>
      <span>/</span>
      <p className="underline text-slate-900">{recipeName}</p>
    </nav>
  )
}
