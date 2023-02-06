import Card from '@mui/material/Card'
import Image from 'next/image'
import tortillas from '../../public/tortillas.jpg'

export default function RecipeCard() {
  return (
    <Card
      variant="outlined"
      className="flex h-32 w-1/5 flex-wrap items-center justify-center bg-black text-center text-white shadow-xl "
    >
      <h2 className="w-full">Flour Tortillas</h2>
      <Image src={tortillas} alt="tortillas" className="w-full" />
      <p className="relative bottom-1/4 w-full bg-slate-700/50">By: Hillary</p>
    </Card>
  )
}
