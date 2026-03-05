import { Autocomplete, TextField } from '@mui/material'
import { SyntheticEvent } from 'react'

interface CategoryInputProps {
  category: string | null;
  updateCategory: (value: string | null) => void;
}

export default function CategoryInput({ category, updateCategory }: CategoryInputProps) {
  const handleCategoryChange = (_event: SyntheticEvent, values: string) => {
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
        value={category ?? undefined}
        onChange={handleCategoryChange}
      />
    </div>
  )
}
