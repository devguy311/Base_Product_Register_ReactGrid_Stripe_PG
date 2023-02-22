import React, { SyntheticEvent, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

import ProductDescriptionPanel from "../components/ProductDescriptionPanel";
import LuminaPanel from "../components/LuminaPanel";
import VerticalLinearStepper from "../components/VerticalLinearStepper";
import { Link } from "@mui/material";
import useToken from "../hooks/useToken";
import useAuthorizationCode from "../hooks/useAuthorizationCode";
import axios from "axios";

const a11yProps = (index: number) => {
    return {
        id: `product-tab-${index}`,
        "aria-controls": `product-tabpanel-${index}`,
    };
};

const HomePage = () => {
    const [tabIndex, setTabIndex] = useState(0);
    const { token, setToken } = useToken();
    const { authorizationCode, setAuthorizationCode } = useAuthorizationCode();

    const handleChange = (_event: SyntheticEvent, newValue: number) => {
        setTabIndex(newValue);
    };

    useEffect(() => {
        axios
            .post("/credentials", {
                data: {
                    accessToken: token[0],
                    refreshToken: token[1],
                    authorizationCode,
                },
            })
            .then((response) => {
                if (response.status === 201) setToken([response.data.accessToken, response.data.refreshToken]);
            })
            .catch(() => {
                setAuthorizationCode(undefined);
                setToken([undefined, undefined]);
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            {token[0] === undefined && (
                <Link
                    href={`https://api.thebase.in/1/oauth/authorize?response_type=code&client_id=6cd00fb8ffcab2dec0d1f10f7096b697&redirect_uri=http://localhost:3000/redirect`}
                >
                    認可する
                </Link>
            )}
            {token[0] !== undefined && (
                <>
                    <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                        <Tabs value={tabIndex} onChange={handleChange} aria-label="basic product tabs">
                            <Tab label="Lumina" {...a11yProps(0)} />
                            <Tab label="商品説明テンプレ" {...a11yProps(1)} />
                            <Tab label="Vertical Stepper" {...a11yProps(2)} />
                        </Tabs>
                    </Box>
                    {tabIndex === 0 && <LuminaPanel />}
                    {tabIndex === 1 && <ProductDescriptionPanel productName="にょ天狗" />}
                    {tabIndex === 2 && <VerticalLinearStepper />}
                </>
            )}
        </>
    );
};

export default HomePage;
