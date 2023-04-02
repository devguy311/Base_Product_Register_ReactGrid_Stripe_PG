import { useEffect, useState } from "react";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { Button } from "@mui/material";
import Box from '@mui/material/Box';
import axios from "axios";
import InviteModal from "./InviteModal";

const fetchInvitedBots = async () => {
    const result = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/getBots`);
    if (result.data.result === "success") return result.data.result;
    else return "error";
}

const InvitePanel = () => {
    const [botData, setBotData] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    const handleOpenModal = () => {
        setIsOpen(true);
    }

    const handleCloseModal = () => {
        setIsOpen(false);
    }

    useEffect(() => {
        fetchInvitedBots().then((fetchedData) => {
            if (fetchedData !== "error") {
                setBotData(fetchedData);
            }
        });
    }, []);

    return (
        <Box>
            <Button variant="outlined" onClick={handleOpenModal}>Invite</Button>
            <InviteModal isOpen={isOpen} handleClose={handleCloseModal}/>
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
                {botData.map((idx) => (
                    <li key={`${idx}`}>
                        <ul>
                            <ListItem key={idx}>
                                <ListItemText primary={`Item ${idx}`} />
                            </ListItem>
                        </ul>
                    </li>
                ))}
            </List>
        </Box>
    );
}

export default InvitePanel;