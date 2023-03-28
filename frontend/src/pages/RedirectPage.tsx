import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import useAuthorizationCode from "../hooks/useAuthorizationCode";

const RedirectPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { setAuthorizationCode } = useAuthorizationCode();

    useEffect(() => {
        const code = searchParams.get("code");
        if (code !== undefined && code !== null && code !== "") setAuthorizationCode(code);
        navigate("/");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <>ちょっと待てくださいよ。。。</>;
};

export default RedirectPage;
