import Alert from '@mui/material/Alert';
import LinearProgress from '@mui/material/LinearProgress';
import Snackbar from '@mui/material/Snackbar';  

export default function AlertSnackbar({status, toggle, severity, message}) {
    return (
        <Snackbar open={status} onClose={toggle} autoHideDuration={5000}>
            <Alert severity={severity} variant="filled">
                {message}
            </Alert> 
        </Snackbar>
    )
}





