import { useEffect, useState, cloneElement } from "react";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { Button, IconButton, ListItemAvatar, Typography } from "@mui/material";
import Box from '@mui/material/Box';
import axios from "axios";
import InviteModal from "./InviteModal";
import { styled } from '@mui/material/styles';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import DeleteIcon from '@mui/icons-material/Delete';
import PositionedSnackbar from "./Alert";
import Avatar from '@mui/material/Avatar';
import { AlertColor } from '@mui/material';

const Demo = styled('div')(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
}));

const InvitePanel = () => {
    const [botData, setBotData] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [showSnackBar, setShowSnackBar] = useState(false);
    const [snackMessage, setSnackMessage] = useState("");
    const [alertType, setAlertType] = useState<AlertColor>("success");

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
        if (result.data.result === "success"){
            setBotData(result.data.bots);
            return true;
        }
        else return false;
    }

    useEffect(() => {
        setBotList();
    }, [botData]);

    const deleteBot = async (email: string) => {
        const owner = localStorage.getItem("email");
        const result = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/deleteBots`, {
            params: {
                email: owner
            }
        });
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
        <Box>
            <PositionedSnackbar type={alertType} open={showSnackBar} message={snackMessage} />
            <Demo>
                <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                    {botData && botData.map((botData: jsonType, idx) => (
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
            <List
                sx={{
                    width: '100%',
                    maxWidth: 360,
                    bgcolor: 'background.paper',
                    position: 'relative',
                    overflow: 'auto',
                    maxHeight: 300,
                    '& ul': { padding: 0 },
                }}
                subheader={<li />}
            >
                {/* {botData.map((idx) => (
                    <li key={`${idx}`}>
                        <ul>
                            <ListItem key={idx}>
                                <ListItemText primary={`Item ${idx}`} />
                            </ListItem>
                        </ul>
                    </li>
                ))} */}
            </List>
        </Box>
    );
}

export default InvitePanel;