import React, { SyntheticEvent, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import axios from "axios";
import { Backdrop, Card, CardActionArea, CardActions, CardContent, CircularProgress, Link, Stack, Typography } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";

import ProductPanel from "../components/ProductPanel";
import { LoadingStatus, PaymentStatus, User } from "../types";
import useToken from "../hooks/useToken";
import useAuthorizationCode from "../hooks/useAuthorizationCode";
import getStripe from "../lib/getStripe";

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

    const checkPayment = (email: string, done: () => void) => {
        axios
            .post(`${process.env.REACT_APP_BACKEND_URL}/stripe/check`, { email })
            .then((response) => {
                if (response.data.result === "success")
                    setPaymentStatus(response.data.interval === "month" ? PaymentStatus.PAID_MONTHLY : PaymentStatus.PAID_YEARLY);
            })
            .finally(() => done());
    };

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
                successUrl: `${process.env.REACT_APP_BACKEND_URL}/stripe/success?session_id={CHECKOUT_SESSION_ID}`,
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
        let email: string;

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
                        email = response.data.user.mail_address;
                        if (email === undefined) alert("メールアドレスないですね！");
                    })
                    .catch(() => {
                        alert("おっと、ユザーがないですね！");
                    })
                    .finally(() => {
                        checkPayment(email, () => setLoadingStatus(LoadingStatus.LOADED));
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
                    href={`https://api.thebase.in/1/oauth/authorize?response_type=code&client_id=${process.env.REACT_APP_CLIENT_ID}&redirect_uri=${window.location.origin}/redirect&scope=read_users_mail%20write_items`}
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
                                    ５３，７８４円。　／　年
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
                                    ４，９８０円。　／　月
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
                            {/* <Tab
                                style={{
                                    backgroundImage: `url(${user?.background})`,
                                    backgroundRepeat: user?.repeat_background ? "repeat" : "no-repeat",
                                }}
                            ></Tab> */}
                        </Tabs>
                    </Box>
                    {tabIndex === 0 && <ProductPanel email={user?.mail_address} />}
                </>
            )}
        </>
    );
};

export default HomePage;
