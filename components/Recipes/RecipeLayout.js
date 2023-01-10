import Image from 'next/image';
import tortillas from '../../public/tortillas.jpg';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import ListSubheader from '@mui/material/ListSubheader';


export default function RecipeLayout() {


    const renderImages = () => {
        let array = [];
        for(let i = 0; i < 10; i++) {
            array.push(
                <ImageListItem key={i}>
                    <Image src={tortillas} loading='lazy' />
                    <ImageListItemBar title='Flour Tortillas' subtitle='By: Hillary'/>
                </ImageListItem>
            )
        }
        return array;
    }

    return(
        <ImageList cols={3}>
            {renderImages()}
        </ImageList>
    )
}