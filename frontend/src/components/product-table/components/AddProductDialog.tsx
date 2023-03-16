import React, { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { IconButton } from "@mui/material";
import { AddBoxRounded } from "@mui/icons-material";

import ProductDescriptionPanel from "./ProductDescriptionPanel";

const AddProductDialog = (props: any) => {
    const [open, setOpen] = useState(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <IconButton onClick={handleClickOpen} style={{ display: props.hidden ? "none" : "inline-flex" }}>
                <AddBoxRounded color="primary" />
            </IconButton>
            <Dialog
                open={open}
                maxWidth="xl"
                fullWidth
                fullScreen={fullScreen}
                scroll="paper"
                aria-labelledby="scroll-dialog-title"
                aria-describedby="scroll-dialog-content"
            >
                <DialogTitle id="scroll-dialog-title">商品説明テンプレ</DialogTitle>
                <DialogContent dividers>
                    <ProductDescriptionPanel email={props.email} productName={props.name} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>近い</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default AddProductDialog;
