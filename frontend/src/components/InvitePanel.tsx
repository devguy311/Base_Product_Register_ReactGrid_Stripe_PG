import { useEffect, useState } from "react";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { Button, IconButton, ListItemAvatar, Backdrop, CircularProgress } from "@mui/material";
import Box from '@mui/material/Box';
import axios from "axios";
import InviteModal from "./InviteModal";
import { styled } from '@mui/material/styles';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import DeleteIcon from '@mui/icons-material/Delete';
import PositionedSnackbar from "./Alert";
import Avatar from '@mui/material/Avatar';
import { AlertColor } from '@mui/material';
import { useSelector } from 'react-redux'
import type { RootState } from "../store/store";

const Demo = styled('div')(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
}));

const InvitePanel = () => {
    const [botData, setBotData] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [showSnackBar, setShowSnackBar] = useState(false);
    const [snackMessage, setSnackMessage] = useState("");
    const [alertType, setAlertType] = useState<AlertColor>("success");
    const inviteStatus = useSelector((state: RootState) => state.inviter.state);
    const [backdrop, setBackdrop] = useState(false);

    const handleOpenModal = () => {
        setIsOpen(true);
    }

    const handleCloseModal = () => {
        setIsOpen(false);
    }

    const setBotList = async () => {
        const email = localStorage.getItem('email');
        const result = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/getBots`, {
            params: {
                email: email
            }
        });
        if (result.data.result === "success") {
            setBotData(result.data.bots);
            return true;
        }
        else return false;
    }

    useEffect(() => {
        setBotList();
    }, [inviteStatus]);

    const deleteBot = async (email: string) => {
        setBackdrop(true);
        const owner = localStorage.getItem("email");
        const result = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/deleteBots`, {
            params: {
                owner: owner,
                email: email
            }
        });
        setBackdrop(false);
        if (result.data.status === 'okay') {
            setAlertType("success");
            setShowSnackBar(!showSnackBar);
            setSnackMessage("正常に削除されました！");
            setTimeout(() => {
                setShowSnackBar(false);
            }, 5000);
        }
        else {
            setAlertType("error");
            setShowSnackBar(!showSnackBar);
            setSnackMessage("エラーが発生しました！");
            setTimeout(() => {
                setShowSnackBar(false);
            }, 5000);
        }
        setBotList();
    }

    type jsonType = {
        email: string
    }

    return (
        <>
            <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open = {backdrop}>
                <CircularProgress color="inherit" />
            </Backdrop>
            <Box>
                <PositionedSnackbar type={alertType} open={showSnackBar} message={snackMessage} />
                <Demo>
                    <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                        {botData.length > 0 && botData.map((botData: jsonType, idx) => (
                            <ListItem
                                sx={{ borderColor: '#123456' }}
                                secondaryAction={
                                    <IconButton edge="end" aria-label="delete" color="primary" onClick={() => deleteBot(botData.email)}>
                                        <DeleteIcon />
                                    </IconButton>
                                }
                                key={idx}
                            >
                                <ListItemAvatar>
                                    <Avatar>
                                        <SupervisorAccountIcon color="primary" />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={botData.email}
                                />
                            </ListItem>
                        ))}
                    </List>
                </Demo>
                <Button variant="contained" onClick={handleOpenModal}>招待</Button>
                <InviteModal isOpen={isOpen} handleClose={handleCloseModal} />
            </Box>
        </>
    );
}

export default InvitePanel;