import { SyntheticEvent, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import axios from "axios";
import { Backdrop, Button, Card, CardActionArea, CardActions, CardContent, CircularProgress, Grid, Stack, Typography } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";

import SettingPanel from "../components/SettingPanel";
import ProductPanel from "../components/ProductPanel";
import TopRightButtons from "../components/TopRightButtons";
import { LoadingStatus, PaymentStatus, User } from "../types/index.d";
import useToken from "../hooks/useToken";
import useAuthorizationCode from "../hooks/useAuthorizationCode";
import getStripe from "../lib/getStripe";
import InvitePanel from "../components/InvitePanel";
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
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
    const [authorizedBot, setAuthorizedBot] = useState(false);
    const [botAuthToken, setBotAuthToken] = useState(localStorage.getItem("bot_auth_token"));
    const [loadingButton, SetLoadingButton] = useState(true);

    const checkPayment = (email: string, done: () => void) => {
        axios
            .post(`${process.env.REACT_APP_BACKEND_URL}/stripe/check`, { email }, {
                headers: { 'Authorization': `Bearer ${botAuthToken}` }
            })
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
                successUrl: `${process.env.REACT_APP_BACKEND_URL}/stripe/success?session_id={CHECKOUT_SESSION_ID}&bot_auth_token=Bearer ${botAuthToken}`,
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
        setBotAuthToken(localStorage.getItem("bot_auth_token"));
        axios
            .post(`${process.env.REACT_APP_BACKEND_URL}/credentials`, {
                accessToken,
                refreshToken: token[1],
                authorizationCode,
            }, {
                headers: { 'Authorization': `Bearer ${botAuthToken}` }
            })
            .then((response) => {
                console.log(response);
                if (response.status === 201) {
                    setToken([response.data.accessToken, response.data.refreshToken]);
                    accessToken = response.data.accessToken;
                }

                axios
                    .get(`${process.env.REACT_APP_BACKEND_URL}/me`, {
                        headers: {
                            Authorization: `Bearer ${botAuthToken}`
                        },
                        params: {
                            accessToken,
                        },
                    })
                    .then((response) => {
                        setUser(response.data.user);
                        email = response.data.user.mail_address;
                        localStorage.setItem("email", email);
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
            {(loadingStatus === LoadingStatus.LOADED && token[0] === undefined) ? (
                <Grid container alignItems="center" style={{ height: '100vh' }} spacing={2} justifyContent={"center"}>
                    <Grid item>
                        <Button style={{ width: '180px' }} size="large" variant="contained"
                            href={`https://api.thebase.in/1/oauth/authorize?response_type=code&client_id=${process.env.REACT_APP_CLIENT_ID}&redirect_uri=${window.location.origin}/redirect&scope=read_users_mail%20write_items`}
                            startIcon={<AdminPanelSettingsIcon />}
                        >
                            マネージャー
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button style={{ width: '180px' }} size="large" href="/signin" variant="contained" startIcon={<SupervisorAccountIcon />}>
                            登録者
                        </Button>
                    </Grid>
                </Grid>
            ) : ""}

            {loadingStatus === LoadingStatus.LOADED && token[0] !== undefined && paymentStatus === PaymentStatus.UNPAID && (

                <Grid container alignItems="center" style={{ height: '100vh' }} spacing={2} justifyContent={"center"}>
                    <Grid item>
                        <Card sx={{ maxWidth: 345 }} >
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
                                    variant="contained"
                                    onClick={() => handlePaymentCheckout("yearly")}
                                    disabled={!isYearlyButtonLoading && isMonthlyButtonLoading}
                                >
                                    払う
                                </LoadingButton>
                            </CardActions>
                        </Card>
                    </Grid>
                    <Grid item>
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
                                    variant="contained"
                                    onClick={() => handlePaymentCheckout("monthly")}
                                    disabled={!isMonthlyButtonLoading && isYearlyButtonLoading}
                                >
                                    払う
                                </LoadingButton>
                            </CardActions>
                        </Card>
                    </Grid>
                </Grid>
            )}
            {loadingStatus === LoadingStatus.LOADED && token[0] !== undefined && paymentStatus !== PaymentStatus.UNPAID && (
                <>
                    <Box sx={{ borderBottom: 1, borderColor: "divider", display: 'flex', justifyContent: 'space-between' }}>
                        <Tabs value={tabIndex} onChange={handleChange} aria-label="basic product tabs">
                            <Tab label="設定" {...a11yProps(0)} />
                            <Tab label="アパレル" {...a11yProps(1)} />
                            <Tab label="シューズ" {...a11yProps(2)} />
                            <Tab label="バッグ・財布" {...a11yProps(3)} />
                            <Tab label="ドレス" {...a11yProps(4)} />
                            <Tab label="水着" {...a11yProps(5)} />
                            <Tab label="テンプレート 1" {...a11yProps(6)} />
                            <Tab label="テンプレート 2" {...a11yProps(7)} />
                            <Tab label="テンプレート 3" {...a11yProps(8)} />
                            <Tab label="テンプレート 4" {...a11yProps(9)} />
                            <Tab label="テンプレート 5" {...a11yProps(10)} />
                            {!botAuthToken ? <Tab label="商品登録者" {...a11yProps(11)} /> : ""}
                        </Tabs>
                        <TopRightButtons isBot={botAuthToken} />
                    </Box>
                    {tabIndex === 0 && <SettingPanel user={user} />}
                    {tabIndex === 1 && <ProductPanel email={user?.mail_address} no={0} tabName={"アパレル"} />}
                    {tabIndex === 2 && <ProductPanel email={user?.mail_address} no={1} tabName={"シューズ"} />}
                    {tabIndex === 3 && <ProductPanel email={user?.mail_address} no={2} tabName={"バッグ・財布"} />}
                    {tabIndex === 4 && <ProductPanel email={user?.mail_address} no={3} tabName={"ドレス"} />}
                    {tabIndex === 5 && <ProductPanel email={user?.mail_address} no={4} tabName={"水着"} />}
                    {tabIndex === 6 && <ProductPanel email={user?.mail_address} no={5} tabName={"テンプレート 1"} />}
                    {tabIndex === 7 && <ProductPanel email={user?.mail_address} no={6} tabName={"テンプレート 2"} />}
                    {tabIndex === 8 && <ProductPanel email={user?.mail_address} no={7} tabName={"テンプレート 3"} />}
                    {tabIndex === 9 && <ProductPanel email={user?.mail_address} no={8} tabName={"テンプレート 4"} />}
                    {tabIndex === 10 && <ProductPanel email={user?.mail_address} no={9} tabName={"テンプレート 5"} />}
                    {tabIndex === 11 && <InvitePanel />}
                </>
            )}
        </>
    );
};

export default HomePage;
