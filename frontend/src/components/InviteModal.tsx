import {SyntheticEvent, useState} from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Autocomplete, {createFilterOptions} from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { Box, Typography } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import axios from "axios"

const filter = createFilterOptions<string>();

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

const list: readonly any[] = [
];

export interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose: () => void;
}

type Props = {
  isOpen: boolean,
  handleClose: any,
}

function BootstrapDialogTitle(props: DialogTitleProps) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

const checkEmailType = (value : string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
}

const InvitationDialog = ({ isOpen, handleClose }: Props) => {
  
  const [mailList, setMailList] = useState<string[]>([]);
  const [isValid, setIsValid] = useState(true);

  const handleChange = (event : SyntheticEvent, newValue: string[]) => {
    setMailList(newValue);
    let flag: boolean = false;
    newValue.forEach((value) => {
      if (!checkEmailType(value) && newValue.length > 0) flag = true;
    })
    if (flag) setIsValid(false);
    else setIsValid(true);
  }

  const sendInvite = () => {
    const auth_code = localStorage.getItem("authorization_code");
    mailList.forEach((email) => {
      axios.post(`${process.env.REACT_APP_BACKEND_URL}/invite`, {email: email, owner_auth_token: auth_code}).then((result) => {
        if (result.data.invited === true){
          console.log("invited");
        }else console.log("error occured!");
      })
    }); 
  }

  return (
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={isOpen}
        fullWidth
      >
        <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
          Modal title                             
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <Typography>Invite Bots for your use.</Typography>
          <Autocomplete
            multiple
            id="tags-outlined"
            options={list}
            value = {mailList}
            onChange = {handleChange}
            getOptionLabel={(option) => option || ""}
            filterSelectedOptions
            filterOptions={(options, params) => {
              const filtered = filter(options, params);

              const { inputValue } = params;
              // Suggest the creation of a new value
              const isExisting = options.some((option) => inputValue === option);
              if (inputValue !== "" && !isExisting) {
                  filtered.push(inputValue);
              }
              return filtered;
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                error = {!isValid}
                helperText= {isValid === true ? "" : "incorrect email"}
                placeholder="name@gmail.com"
              />
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button autoFocus  onClick={sendInvite} variant="contained" endIcon={<SendIcon/>}>
            Send Invite
          </Button>
        </DialogActions>
      </BootstrapDialog>
  );
}

export default InvitationDialog;