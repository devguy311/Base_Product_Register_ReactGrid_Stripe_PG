import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

type AlertColor = "success" | "warning" | "error" | undefined;

type Props = {
    alertType: AlertColor,
    message: string
}

const AlertBar = ({alertType, message}: Props) => {
  return (
      <Alert severity={alertType}>{message}</Alert>
  );
}

export default AlertBar;