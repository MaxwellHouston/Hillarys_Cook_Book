import Alert from '@mui/material/Alert'
import Snackbar from '@mui/material/Snackbar'
import { AlertColor } from '@mui/material/Alert'

interface AlertSnackbarProps {
  status: boolean;
  toggle: () => void;
  severity: AlertColor;
  message: string;
}

export default function AlertSnackbar({ status, toggle, severity, message }: AlertSnackbarProps) {
  return (
    <Snackbar open={status} onClose={toggle} autoHideDuration={5000}>
      <Alert severity={severity} variant="filled">
        {message}
      </Alert>
    </Snackbar>
  )
}
