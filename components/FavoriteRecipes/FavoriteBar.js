import Stack from '@mui/material/Stack'
import RecipeCard from '../Recipes/RecipeCard'

export default function FavoriteBar() {
  return (
    <Stack className="border-y-2 p-5" direction="row" spacing={2}>
      <RecipeCard />
    </Stack>
  )
}
