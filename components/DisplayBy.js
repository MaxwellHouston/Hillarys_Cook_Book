import Stack from '@mui/material/Stack';
import Fab from '@mui/material/Fab';

export default function DisplayBy({order, setOrder}) {

    const handleOrderChange = ({target}) => {
        if(order !== target.value) setOrder(target.value);
    }

    return(
        <Stack className='p-4' direction="row" spacing={2}>
            <Fab className={order === 'recent' ? 'bg-blue-400' : ''} variant="extended" size='small' value='recent' onClick={handleOrderChange}>
                Most Recent
            </Fab>
            <Fab className={order === 'author' ? 'bg-blue-400' : ''} variant="extended" size='small' value='author' onClick={handleOrderChange}>
                By Author
            </Fab>
            <Fab className={order === 'alpha' ? 'bg-blue-400' : ''} variant="extended" size='small' value='alpha' onClick={handleOrderChange}>
                A-Z
            </Fab>
        </Stack>
    )
}