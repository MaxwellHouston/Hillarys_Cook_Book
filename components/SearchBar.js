import { IoSearchSharp } from 'react-icons/io5'

export default function SearchBar() {
  return (
    <fieldset className="hidden items-center justify-between rounded-lg border-2 border-white md:flex">
      <IoSearchSharp className="mx-2 text-2xl text-white" />
      <input
        className="m-1 border-white bg-inherit font-thin text-white focus:outline-none"
        placeholder="Search..."
      />
    </fieldset>
  )
}
