import { IoSearchSharp } from 'react-icons/io5';

export default function SearchBar() {

    return(
      <fieldset className='md:flex items-center justify-between border-2 border-white rounded-lg hidden'>
        <IoSearchSharp className='text-2xl text-white mx-2' />
        <input className='bg-inherit text-white m-1 border-white focus:outline-none font-thin' placeholder='Search...'/>
      </fieldset>
    )
}
