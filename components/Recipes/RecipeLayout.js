import Image from 'next/image';
import tortillas from '../../public/tortillas.jpg';
import cats from '../../public/cats.jpg';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import ListSubheader from '@mui/material/ListSubheader';


export default function RecipeLayout({recipes}) {


    const renderStinker = () => {
        let array = [];
        for(let i = 0; i < 10; i++) {
            array.push(
                <ImageListItem key={i}>
                    <Image src={cats} alt='tortillas' loading='lazy' />
                    <ImageListItemBar title='Flour Tortillas' subtitle='By: Hillary'/>
                </ImageListItem>
            )
        }
        return array;
    }

    return(
        <ImageList cols={3}>
            {renderStinker()}
        </ImageList>
    )
}