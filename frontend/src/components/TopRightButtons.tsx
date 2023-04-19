import { useState } from "react";
import { Button, Box, Typography, Modal } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const TopRightButtons = () => {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const handleClose = () => {
        setOpen(false);
        window.location.reload();
    }
    const [amount, setAmount] = useState(0);

    const logout = () => {
        localStorage.clear();
        navigate("/");
        window.location.reload();
    }
    const cancelSubscription = async () => {
        const email = localStorage.getItem("email");
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/stripe/cancel`, { email: email }, {
            headers: { 'Authorization': `Bearer ${null}` }
        });
        if (response.data.result === 'success') {
            setAmount(response.data.amount);
            setOpen(true);
        }
    }
    return (
        <>
            <Button onClick={cancelSubscription}>購読のキャンセル</Button>
            <Button onClick={logout}>ログアウト</Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                    お金が返金されました。
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    返金された量 ： {amount}￥
                    </Typography>
                </Box>
            </Modal>
        </>
    );
};

export default TopRightButtons;
