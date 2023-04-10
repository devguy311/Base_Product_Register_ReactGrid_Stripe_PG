import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const TopRightButtons = () => {
    const navigate = useNavigate();
    const logout = () => {
        localStorage.clear();
        navigate("/");
        window.location.reload();
    }
    return (
        <>
            <Button onClick={logout}>ログアウト</Button>
        </>
    );
};

export default TopRightButtons;
