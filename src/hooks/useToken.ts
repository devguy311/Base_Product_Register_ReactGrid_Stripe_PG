import { useState } from "react";

const useToken = () => {
    const getToken = (): [string | undefined, string | undefined] => {
        let accessToken =
            localStorage.getItem("access_token") === "undefined" || localStorage.getItem("access_token") === null
                ? undefined
                : (localStorage.getItem("access_token") as string);
        const refreshToken =
            localStorage.getItem("refresh_token") === "undefined" || localStorage.getItem("refresh_token") === null
                ? undefined
                : (localStorage.getItem("refresh_token") as string);

        return [accessToken, refreshToken];
    };

    const [token, setToken] = useState(getToken());

    const saveToken = (newToken: [string | undefined, string | undefined]) => {
        if (newToken[0] === undefined) localStorage.removeItem("access_token");
        else localStorage.setItem("access_token", newToken[0]);

        if (newToken[1] === undefined) localStorage.removeItem("refresh_token");
        else localStorage.setItem("refresh_token", newToken[1]);
        setToken(newToken);
    };

    return {
        token,
        setToken: saveToken,
    };
};

export default useToken;
