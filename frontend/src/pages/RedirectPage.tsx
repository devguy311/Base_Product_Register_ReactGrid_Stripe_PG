import axios from "axios";
import { useEffect } from "react";
import { useNavigate, useSearchParams, useParams } from "react-router-dom";

import useAuthorizationCode from "../hooks/useAuthorizationCode";

const RedirectPage = (props: any) => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const {invite_id} = useParams();
    const { setAuthorizationCode } = useAuthorizationCode();

    useEffect(() => {
        const code = searchParams.get("code");
        if (invite_id !== undefined && invite_id !== null && invite_id !== "") {
            axios.get(`${process.env.REACT_APP_BACKEND_URL}/invited/${invite_id}`).then((response) => {
                if (response.data.info === "Invalid") console.log("Invalid Request!");
                else if (response.data.info === "already registered") console.log("Already registered!");
                else if (response.data.info === "okay") {
                    localStorage.setItem("invite_id", invite_id);
                    localStorage.setItem("bot_email", response.data.email);
                    navigate("/signup");
                }
            });
        }
        if (code !== undefined && code !== null && code !== "") setAuthorizationCode(code);
        navigate("/");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <>ちょっと待てくださいよ。。。</>;
};

export default RedirectPage;
