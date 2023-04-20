import { SyntheticEvent, useState } from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { Typography } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import axios from "axios";
import type { RootState } from '../store/store';
import { useDispatch } from 'react-redux';
import { invited } from '../redux/inviteReducer';
import LoadingButton from '@mui/lab/LoadingButton';

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

const checkEmailType = (value: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
}

const InvitationDialog = ({ isOpen, handleClose }: Props) => {
  const dispatch = useDispatch();
  const [backdrop, setBackdrop] = useState(false);

  const [mailList, setMailList] = useState<string[]>([]);
  const [isValid, setIsValid] = useState(true);

  const handleChange = (event: SyntheticEvent, newValue: string[]) => {
    setMailList(newValue);
    let flag: boolean = false;
    newValue.forEach((value) => {
      if (!checkEmailType(value) && newValue.length > 0) flag = true;
    })
    if (flag) setIsValid(false);
    else setIsValid(true);
  }

  const sendInvite = () => {
    setBackdrop(true);
    const auth_code = localStorage.getItem("refresh_token");
    const owner_email = localStorage.getItem("email");
    mailList.forEach((email) => {
      const data = { email: email, owner_refresh_token: auth_code, owner_email: owner_email };
      axios.post(`${process.env.REACT_APP_BACKEND_URL}/invite`, data).then(() => {
        dispatch(invited());
        setBackdrop(false);
        handleCloseModal();
      })
    });
  }

  const handleCloseModal = () => {
    setMailList([]);
    handleClose();
  }

  return (
    <>
      <BootstrapDialog
        onClose={handleCloseModal}
        aria-labelledby="customized-dialog-title"
        open={isOpen}
        fullWidth
      >
        <BootstrapDialogTitle id="customized-dialog-title" onClose={handleCloseModal}>
          招待ダイアログ
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <Typography>アイテム登録のためにユーザーを招待する</Typography>
          <Autocomplete
            multiple
            id="tags-outlined"
            options={list}
            value={mailList}
            onChange={handleChange}
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
                error={!isValid}
                helperText={isValid === true ? "" : "incorrect email"}
                placeholder="name@gmail.com"
              />
            )}
          />
        </DialogContent>
        <DialogActions>
          <LoadingButton autoFocus onClick={sendInvite} loading={backdrop} loadingPosition='end' variant="contained" endIcon={<SendIcon />}>
            招待を送る
          </LoadingButton>
        </DialogActions>
      </BootstrapDialog>
    </>
  );
}

export default InvitationDialog;