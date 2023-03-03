import React, { SyntheticEvent, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import axios from "axios";
import { Backdrop, Card, CardActionArea, CardActions, CardContent, CircularProgress, Link, Stack, Typography } from "@mui/material";

import ProductPanel from "../components/ProductPanel";
import useToken from "../hooks/useToken";
import useAuthorizationCode from "../hooks/useAuthorizationCode";
import { LoadingStatus } from "../components/common/LoadingStatus.d";
import { PaymentStatus } from "../components/common/PaymentStatus.d";
import { User } from "../components/common/User.d";
import getStripe from "../components/lib/getStripe";
import LoadingButton from "@mui/lab/LoadingButton";

const a11yProps = (index: number) => {
    return {
        id: `product-tab-${index}`,
        "aria-controls": `product-tabpanel-${index}`,
    };
};

const HomePage = () => {
    const [loadingStatus, setLoadingStatus] = useState(LoadingStatus.LOADING);
    const [paymentStatus, setPaymentStatus] = useState(PaymentStatus.UNPAID);
    const [isYearlyButtonLoading, setIsYearlyButtonLoading] = useState(false);
    const [isMonthlyButtonLoading, setIsMonthlyButtonLoading] = useState(false);
    const [tabIndex, setTabIndex] = useState(0);
    const [user, setUser] = useState<User>();
    const { token, setToken } = useToken();
    const { authorizationCode, setAuthorizationCode } = useAuthorizationCode();

    const handleChange = (_event: SyntheticEvent, newValue: number) => {
        setTabIndex(newValue);
    };

    const handlePaymentCheckout = async (paymentType: "yearly" | "monthly") => {
        const stripe = await getStripe();
        if (stripe === null) setPaymentStatus(PaymentStatus.UNPAID);
        else {
            paymentType === "yearly" ? setIsYearlyButtonLoading(true) : setIsMonthlyButtonLoading(true);
            const { error } = await stripe.redirectToCheckout({
                lineItems: [
                    {
                        price: paymentType === "yearly" ? process.env.REACT_APP_STRIPE_PRICE_ID_YEARLY : process.env.REACT_APP_STRIPE_PRICE_ID_MONTHLY,
                        quantity: 1,
                    },
                ],
                locale: "ja",
                mode: "subscription",
                successUrl: `${window.location.origin}`,
                cancelUrl: `${window.location.origin}`,
                customerEmail: user?.mail_address,
            });
            console.warn(error);
            setIsYearlyButtonLoading(false);
            setIsMonthlyButtonLoading(false);
        }
    };

    useEffect(() => {
        let accessToken = token[0];
        axios
            .post(`${process.env.REACT_APP_BACKEND_URL}/credentials`, {
                accessToken,
                refreshToken: token[1],
                authorizationCode,
            })
            .then((response) => {
                if (response.status === 201) {
                    setToken([response.data.accessToken, response.data.refreshToken]);
                    accessToken = response.data.accessToken;
                }

                axios
                    .get(`${process.env.REACT_APP_BACKEND_URL}/me`, {
                        params: {
                            accessToken,
                        },
                    })
                    .then((response) => {
                        setUser(response.data.user);
                        if (response.data.user.mail_address === undefined) alert("メールアドレスないですね！");
                    })
                    .catch(() => {
                        alert("おっと、ユザーがないですね！");
                    })
                    .finally(() => {
                        // setTimeout(checkPayment, 1000);
                        // setTimeout(handlePaymentCheckout, 1000);
                        setLoadingStatus(LoadingStatus.LOADED);
                    });
            })
            .catch(() => {
                setAuthorizationCode(undefined);
                setToken([undefined, undefined]);
                setLoadingStatus(LoadingStatus.LOADED);
            });
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
                    href={`https://api.thebase.in/1/oauth/authorize?response_type=code&client_id=${process.env.REACT_APP_CLIENT_ID}&redirect_uri=${window.location.origin}/redirect&scope=write_items`}
                >
                    認可する
                </Link>
            )}
            {loadingStatus === LoadingStatus.LOADED && token[0] !== undefined && paymentStatus === PaymentStatus.UNPAID && (
                <Stack direction="row" spacing={2}>
                    <Card sx={{ maxWidth: 345 }}>
                        <CardActionArea>
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                    製品購入
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    800円。 / 年
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                        <CardActions>
                            <LoadingButton
                                size="small"
                                loading={isYearlyButtonLoading}
                                color="primary"
                                onClick={() => handlePaymentCheckout("yearly")}
                                disabled={!isYearlyButtonLoading && isMonthlyButtonLoading}
                            >
                                払う
                            </LoadingButton>
                        </CardActions>
                    </Card>

                    <Card sx={{ maxWidth: 345 }}>
                        <CardActionArea>
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                    製品購入
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    100円。 / 月
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                        <CardActions>
                            <LoadingButton
                                size="small"
                                loading={isMonthlyButtonLoading}
                                color="primary"
                                onClick={() => handlePaymentCheckout("monthly")}
                                disabled={!isMonthlyButtonLoading && isYearlyButtonLoading}
                            >
                                払う
                            </LoadingButton>
                        </CardActions>
                    </Card>
                </Stack>
            )}
            {loadingStatus === LoadingStatus.LOADED && token[0] !== undefined && paymentStatus !== PaymentStatus.UNPAID && (
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
