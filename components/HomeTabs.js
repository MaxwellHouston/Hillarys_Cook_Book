import { Tab, Tabs } from "@mui/material";
import { BsEggFried, BsMoonStars } from 'react-icons/bs';
import { GiSandwich, GiNachos } from 'react-icons/gi';
import { MdDinnerDining } from 'react-icons/md';
import { RiCake3Line } from 'react-icons/ri';
import { TbPlant2 } from 'react-icons/tb';
import { BiFoodMenu } from 'react-icons/bi';

export default function HomeTabs({tab, setTab}) {

    const handleTabChange = (event, newValue) => {
        setTab(newValue);
      };

    return(
        <div className="mt-32">
            <Tabs
                sx={{ borderLeft: 1, borderColor: 'divider', '.MuiTabs-indicator': {left: 0,}}}
                orientation="vertical"
                value={tab}
                onChange={handleTabChange}
            >
                <Tab className={"bg-slate-300 text-2xl text-black rounded-r-xl my-0.5 pl-3 p-0 justify-start min-w-0 w-12" + (tab === 'All' ? " shadow-sm shadow-black" : "")} icon={<BiFoodMenu className="" />} value={"All"} />
                <Tab className={"bg-yellow-300 text-2xl text-black rounded-r-xl my-0.5 pl-3 p-0 justify-start min-w-0 w-12" + (tab === 'Breakfast' ? " shadow-sm shadow-black" : "")} icon={<BsEggFried  />} value={"Breakfast"} />
                <Tab className={"bg-red-400 text-2xl text-black rounded-r-xl my-0.5 pl-3 p-0 justify-start min-w-0 w-12" + (tab === 'Lunch' ? " shadow-sm shadow-black" : "")} icon={<GiSandwich  />} value={"Lunch"} />
                <Tab className={"bg-blue-300 text-2xl text-black rounded-r-xl my-0.5 pl-3 p-0 justify-start min-w-0 w-12" + (tab === 'Dinner' ? " shadow-sm shadow-black" : "")} icon={<MdDinnerDining  />} value={"Dinner"} />
                <Tab className={"bg-pink-300 text-2xl text-black rounded-r-xl my-0.5 pl-3 p-0 justify-start min-w-0 w-12" + (tab === 'Dessert' ? " shadow-sm shadow-black" : "")} icon={<RiCake3Line  />} value={"Dessert"} />
                <Tab className={"bg-orange-300 text-2xl text-black rounded-r-xl my-0.5 pl-3 p-0 justify-start min-w-0 w-12" + (tab === 'Snacks' ? " shadow-sm shadow-black" : "")} icon={<GiNachos  />} value={"Snacks"} />
                <Tab className={"bg-green-300 text-2xl text-black rounded-r-xl my-0.5 pl-3 p-0 justify-start min-w-0 w-12" + (tab === 'Munchies' ? " shadow-sm shadow-black" : "")} icon={<BsMoonStars  />} value={"Munchies"} />
            </Tabs>
        </div>
    )
}