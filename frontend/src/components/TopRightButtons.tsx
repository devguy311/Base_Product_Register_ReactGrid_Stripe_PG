import { useState } from "react";
import { Button, Box, Typography, Modal } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import LoadingButton from '@mui/lab/LoadingButton';

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

const TopRightButtons = (props: any) => {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [decision, setDecision] = useState(false);
    const handleNo = () => {
        setDecision(false);
    }
    const handleOpen = () => {
        setDecision(true);
    }
    const handleClose = () => {
        setOpen(false);
        window.location.reload();
    }
    const [amount, setAmount] = useState(0);
    const [loading, setLoading] = useState(false);

    const logout = () => {
        localStorage.clear();
        window.location.href = !props.isBot ? `https://api.thebase.in/1/users/logout?response_type=code&client_id=${process.env.REACT_APP_CLIENT_ID}&redirect_uri=${window.location.origin}/redirect&scope=read_users_mail%20write_items` : "/signin";
    }
    const cancelSubscription = async () => {
        setDecision(false);
        setLoading(true);
        const email = localStorage.getItem("email");
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/stripe/cancel`, { email: email }, {
            headers: { 'Authorization': `Bearer ${null}` }
        });
        if (response.data.result === 'success') {
            setAmount(response.data.amount);
            setOpen(true);
            setLoading(false);
        }
    }
    return (
        <>
            <Button onClick={logout}>ログアウト</Button>
            {!props.isBot ? <LoadingButton sx={{position: 'absolute', right: '0%', marginTop: '7px'}} onClick={handleOpen} loading={loading} >購読のキャンセル</LoadingButton> : ""}
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

            <Modal
                open={decision}
                onClose={handleNo}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={{ ...style }}>
                    本当にサブスクリプションをキャンセルしますか？
                    <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'row' }}>
                        <Button variant="contained" onClick={cancelSubscription}>はい</Button>
                        <Button variant="contained" onClick={handleNo} sx={{ marginLeft: '8px' }}>いいえ</Button>
                    </div>
                </Box>
            </Modal>
        </>
    );
};

export default TopRightButtons;
