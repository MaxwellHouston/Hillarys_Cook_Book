import Card from '@mui/material/Card';
import Image from 'next/image';
import tortillas from '../../public/tortillas.jpg';

export default function RecipeCard() {

    return(
        <Card variant="outlined" className='w-1/5 h-32 text-center shadow-xl bg-black text-white flex flex-wrap justify-center items-center '>
            <h2 className='w-full'>Flour Tortillas</h2>
            <Image src={tortillas} alt='tortillas' className='w-full' />
            <p className='relative bottom-1/4 bg-slate-700/50 w-full'>By: Hillary</p>
        </Card>
    )
}