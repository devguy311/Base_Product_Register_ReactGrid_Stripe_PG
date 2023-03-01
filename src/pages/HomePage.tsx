import React, { SyntheticEvent, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { Backdrop, CircularProgress, Link } from "@mui/material";
import axios from "axios";

import ProductPanel from "../components/ProductPanel";
import useToken from "../hooks/useToken";
import useAuthorizationCode from "../hooks/useAuthorizationCode";
import { LoadingStatus } from "../components/common/LoadingStatus.d";

const a11yProps = (index: number) => {
    return {
        id: `product-tab-${index}`,
        "aria-controls": `product-tabpanel-${index}`,
    };
};

const HomePage = () => {
    const [loadingStatus, setLoadingStatus] = useState(LoadingStatus.LOADING);
    const [tabIndex, setTabIndex] = useState(0);
    const { token, setToken } = useToken();
    const { authorizationCode, setAuthorizationCode } = useAuthorizationCode();

    const handleChange = (_event: SyntheticEvent, newValue: number) => {
        setTabIndex(newValue);
    };

    useEffect(() => {
        axios
            .post("/credentials", {
                accessToken: token[0],
                refreshToken: token[1],
                authorizationCode,
            })
            .then((response) => {
                if (response.status === 201) setToken([response.data.accessToken, response.data.refreshToken]);
            })
            .catch(() => {
                setAuthorizationCode(undefined);
                setToken([undefined, undefined]);
            })
            .finally(() => setLoadingStatus(LoadingStatus.LOADED));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            {loadingStatus === LoadingStatus.LOADING && (
                <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open>
                    <CircularProgress color="inherit" />
                </Backdrop>
            )}
            {loadingStatus === LoadingStatus.LOADED && token[0] === undefined && (
                <Link
                    href={`https://api.thebase.in/1/oauth/authorize?response_type=code&client_id=${
                        process.env.REACT_APP_CLIENT_ID || "6cd00fb8ffcab2dec0d1f10f7096b697"
                    }&redirect_uri=${process.env.REACT_APP_URL || "http://localhost:3000"}/redirect&scope=write_items`}
                >
                    認可する
                </Link>
            )}
            {loadingStatus === LoadingStatus.LOADED && token[0] !== undefined && (
                <>
                    <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                        <Tabs value={tabIndex} onChange={handleChange} aria-label="basic product tabs">
                            <Tab label="サンプル" {...a11yProps(0)} />
                        </Tabs>
                    </Box>
                    {tabIndex === 0 && <ProductPanel />}
                </>
            )}
        </>
    );
};

export default HomePage;
