import { IoSearchSharp } from 'react-icons/io5';
import TextField from '@mui/material/TextField';
import { Box, InputAdornment } from '@mui/material';

export default function SearchBar() {

    return(
        <Box className='flex'>
            <TextField 
                label="Search" 
                variant="outlined" 
                size='small'
                InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <IoSearchSharp className='text-2xl' />
                      </InputAdornment>
                    ),
                  }} />
        </Box>
    )
}