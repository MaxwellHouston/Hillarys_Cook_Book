import { BsEggFried, BsMoonStars } from 'react-icons/bs'
import { GiSandwich, GiNachos } from 'react-icons/gi'
import { MdDinnerDining } from 'react-icons/md'
import { RiCake3Line } from 'react-icons/ri'
import { BiFoodMenu } from 'react-icons/bi'

export default function HomeTabs({ tab, setTab }) {

  return (
    <div className="flex w-full justify-center xs:justify-start">
      <button onClick={() => {setTab("All")}} className={`hover:contrast-200 mx-1 rounded-t-lg bg-slate-500 p-3 sm:p-5 ${tab === 'All' && 'shadow-[0_-4px_6px_-1px] shadow-black'}`}>
        <BiFoodMenu className="xs:text-2xl" />
      </button>
      <button onClick={() => {setTab("Breakfast")}} className={`hover:contrast-200 mx-1 rounded-t-lg bg-yellow-300 p-3 sm:p-5 ${tab === 'Breakfast' && 'shadow-[0_-4px_6px_-1px] shadow-black'}`}>
        <BsEggFried className="xs:text-2xl" />
      </button>
      <button onClick={() => {setTab("Lunch")}} className={`hover:contrast-200 mx-1 rounded-t-lg bg-red-300 p-3 sm:p-5 ${tab === 'Lunch' && 'shadow-[0_-4px_6px_-1px] shadow-black'}`}>
        <GiSandwich className="xs:text-2xl" />
      </button>
      <button onClick={() => {setTab("Dinner")}} className={`hover:contrast-200 mx-1 rounded-t-lg bg-blue-300 p-3 sm:p-5 ${tab === 'Dinner' && 'shadow-[0_-4px_6px_-1px] shadow-black'}`}>
        <MdDinnerDining className="xs:text-2xl" />
      </button>
      <button onClick={() => {setTab("Dessert")}} className={`hover:contrast-200 mx-1 rounded-t-lg bg-pink-300 p-3 sm:p-5 ${tab === 'Dessert' && 'shadow-[0_-4px_6px_-1px] shadow-black'}`}>
        <RiCake3Line className="xs:text-2xl" />
      </button>
      <button onClick={() => {setTab("Snacks")}} className={`hover:contrast-200 mx-1 rounded-t-lg bg-orange-300 p-3 sm:p-5 ${tab === 'Snacks' && 'shadow-[0_-4px_6px_-1px] shadow-black'}`}>
        <GiNachos className="xs:text-2xl" />
      </button>
      <button onClick={() => {setTab("Munchies")}} className={`hover:contrast-200 mx-1 rounded-t-lg bg-green-300 p-3 sm:p-5 ${tab === 'Munchies' && 'shadow-[0_-4px_6px_-1px] shadow-black'}`}>
        <BsMoonStars className="xs:text-2xl" />
      </button>
    </div>
  )
}

