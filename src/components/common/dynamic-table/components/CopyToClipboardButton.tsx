import React from "react";
import { useState } from "react";
import { Badge, IconButton, Snackbar } from "@mui/material";
import { CopyAll } from "@mui/icons-material";

const CopyToClipboardButton = (props: any) => {
    const [open, setOpen] = useState(false);

    const handleClick = () => {
        setOpen(true);
        navigator.clipboard.writeText(props.textToCopy);
    };

    return (
        <>
            <IconButton onClick={handleClick} color="primary" disabled={props.disabled}>
                {!props.disabled && (
                    <Badge badgeContent={props.textToCopy.replace(/[\u0080-\u10FFFF]/g, "x").length} color="primary">
                        <CopyAll />
                    </Badge>
                )}
                {props.disabled && <CopyAll />}
            </IconButton>
            <Snackbar
                message="コピーしましたね!"
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
                autoHideDuration={2000}
                onClose={() => setOpen(false)}
                open={open}
            />
        </>
    );
};

export default CopyToClipboardButton;
