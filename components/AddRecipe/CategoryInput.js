import { Autocomplete, TextField } from '@mui/material'

export default function CategoryInput({ category, updateCategory }) {
  const handleCategoryChange = (event, values) => {
    updateCategory(values)
  }

  const categories = [
    'Breakfast',
    'Lunch',
    'Dinner',
    'Dessert',
    'Snack',
    'Sauces/Marinades',
  ]

  return (
    <div className="min-w-[10rem]">
      <Autocomplete
        size="small"
        includeInputInList
        disableClearable
        options={categories}
        renderInput={(params) => (
          <TextField {...params} label="Category" required />
        )}
        value={category}
        onChange={handleCategoryChange}
      />
    </div>
  )
}
