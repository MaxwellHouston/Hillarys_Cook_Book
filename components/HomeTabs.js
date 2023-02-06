import { Tab, Tabs } from '@mui/material'
import { BsEggFried, BsMoonStars } from 'react-icons/bs'
import { GiSandwich, GiNachos } from 'react-icons/gi'
import { MdDinnerDining } from 'react-icons/md'
import { RiCake3Line } from 'react-icons/ri'
import { TbPlant2 } from 'react-icons/tb'
import { BiFoodMenu } from 'react-icons/bi'

export default function HomeTabs({ tab, setTab }) {
  const handleTabChange = (event, newValue) => {
    setTab(newValue)
  }

  return (
    <div className="mt-32">
      <Tabs
        sx={{
          borderLeft: 1,
          borderColor: 'divider',
          '.MuiTabs-indicator': { left: 0 },
          '.MuiTabs-flexContainer': { width: '50px' },
        }}
        orientation="vertical"
        value={tab}
        onChange={handleTabChange}
      >
        <Tab
          className={
            'my-0.5 w-12 min-w-0 justify-start rounded-r-xl bg-white p-0 pl-3 text-2xl text-black' +
            (tab === 'All' ? ' shadow-sm shadow-black' : '')
          }
          icon={<BiFoodMenu className="" />}
          value={'All'}
        />
        <Tab
          className={
            'my-0.5 w-12 min-w-0 justify-start rounded-r-xl bg-yellow-300 p-0 pl-3 text-2xl text-black' +
            (tab === 'Breakfast' ? ' shadow-sm shadow-black' : '')
          }
          icon={<BsEggFried />}
          value={'Breakfast'}
        />
        <Tab
          className={
            'my-0.5 w-12 min-w-0 justify-start rounded-r-xl bg-red-400 p-0 pl-3 text-2xl text-black' +
            (tab === 'Lunch' ? ' shadow-sm shadow-black' : '')
          }
          icon={<GiSandwich />}
          value={'Lunch'}
        />
        <Tab
          className={
            'my-0.5 w-12 min-w-0 justify-start rounded-r-xl bg-blue-300 p-0 pl-3 text-2xl text-black' +
            (tab === 'Dinner' ? ' shadow-sm shadow-black' : '')
          }
          icon={<MdDinnerDining />}
          value={'Dinner'}
        />
        <Tab
          className={
            'my-0.5 w-12 min-w-0 justify-start rounded-r-xl bg-pink-300 p-0 pl-3 text-2xl text-black' +
            (tab === 'Dessert' ? ' shadow-sm shadow-black' : '')
          }
          icon={<RiCake3Line />}
          value={'Dessert'}
        />
        <Tab
          className={
            'my-0.5 w-12 min-w-0 justify-start rounded-r-xl bg-orange-300 p-0 pl-3 text-2xl text-black' +
            (tab === 'Snacks' ? ' shadow-sm shadow-black' : '')
          }
          icon={<GiNachos />}
          value={'Snacks'}
        />
        <Tab
          className={
            'my-0.5 w-12 min-w-0 justify-start rounded-r-xl bg-green-300 p-0 pl-3 text-2xl text-black' +
            (tab === 'Munchies' ? ' shadow-sm shadow-black' : '')
          }
          icon={<BsMoonStars />}
          value={'Munchies'}
        />
      </Tabs>
    </div>
  )
}
