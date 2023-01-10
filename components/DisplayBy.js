import Stack from '@mui/material/Stack';
import Fab from '@mui/material/Fab';

export default function DisplayBy({active, handleChange}) {

    return(
        <Stack className='p-4' direction="row" spacing={2}>
            <Fab variant="extended" size='small'>
                Most Recent
            </Fab>
            <Fab variant="extended" size='small'>
                By Author
            </Fab>
            <Fab variant="extended" size='small'>
                A-Z
            </Fab>
        </Stack>
    )
}