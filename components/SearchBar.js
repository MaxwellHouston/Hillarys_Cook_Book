import { useRouter } from 'next/router'
import { useState } from 'react'
import { IoSearchSharp } from 'react-icons/io5'

export default function SearchBar() {
  const [searchInput, setSearchInput] = useState('')
  const route = useRouter()

  const submitSearch = (e) => {
    e.preventDefault()
    route.push({
      pathname: '/recipes-search',
      query: { searchParams: searchInput },
    })
  }

  return (
    <form
      onSubmit={submitSearch}
      className="flex items-center justify-between rounded-lg border-2 border-white max-w-fit w-full mx-2"
    >
      <button type="submit">
        <IoSearchSharp className="mx-2 text-2xl text-white" />
      </button>
      <input
        className="m-1 border-white bg-inherit font-thin text-white focus:outline-none"
        placeholder="Search..."
        onChange={({ target }) => {
          setSearchInput(target.value)
        }}
      />
    </form>
  )
}
