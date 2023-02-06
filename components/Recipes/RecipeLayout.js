import Image from 'next/image'
import tortillas from '../../public/tortillas.jpg'
import cats from '../../public/cats.jpg'
import ImageList from '@mui/material/ImageList'
import ImageListItem from '@mui/material/ImageListItem'
import ImageListItemBar from '@mui/material/ImageListItemBar'
import ListSubheader from '@mui/material/ListSubheader'
import Link from 'next/link'

export default function RecipeLayout({ recipes }) {
  const renderStinker = () => {
    let array = []
    for (let i = 0; i < 10; i++) {
      array.push(
        <ImageListItem key={i}>
          <Image src={cats} alt="tortillas" loading="lazy" />
          <ImageListItemBar title="Flour Tortillas" subtitle="By: Hillary" />
        </ImageListItem>,
      )
    }
    return array
  }

  const renderRecipes = () => {
    return recipes.map((recipe) => {
      return (
        <ImageListItem key={recipe.id} className="overflow-hidden">
          <Link href={`recipes/${recipe.id}`} className="flex min-h-[200px]">
            <Image
              className="object-center"
              src={recipe.imgSrc}
              alt={recipe.name}
              width={500}
              height={500}
              loading="lazy"
            />
            <ImageListItemBar
              title={recipe.name}
              subtitle={`By: ${recipe.author}`}
            />
          </Link>
        </ImageListItem>
      )
    })
  }

  return (
    <ImageList cols={3} rowHeight={200}>
      {renderRecipes()}
    </ImageList>
  )
}
