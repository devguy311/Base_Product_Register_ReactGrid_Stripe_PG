import { useEffect, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

function Copyright(props: any) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="https://mui.com/">
                Oriental Wind
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const theme = createTheme();

const SignIn = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [mailRequired, setMailRequired] = useState(0);
    const [pwdRequired, setPwdRequired] = useState(0);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
    };

    const checkEmailType = (value: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value);
    }

    const handleOnPasswordChange = (event: any) => {
        setPassword(event.target.value);
    }

    const handleOnEmailChange = (event: any) => {
        setEmail(event.target.value);
    }

    const signin = async () => {
        setMailRequired(email === '' ? 1 : 0);
        setPwdRequired(password === '' ? 1 : password.length < 8 ? 2 : 0);
        if (!checkEmailType(email)){
            setMailRequired(2);
            return false;
        }
        if (email === '' || password === '' || password.length < 8) return false;
        const result = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/bots/signin`, { email: email, password: password });
        if (result.data.status === "okay") {
            console.log("Okay");
            localStorage.setItem("bot_auth_token", result.data.token);
            navigate("/");
        } else if (result.data.status === "not exist") { setMailRequired(3)}
        else setMailRequired(3);
    }

    useEffect(() => {
    }, []);

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        ログイン
                    </Typography>
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                {mailRequired === 3 ? <Typography color={'red'}>ユーザー名またはパスワードが間違っています。</Typography> : ""}
                                <TextField
                                    fullWidth
                                    required
                                    id="email"
                                    label="メールアドレス"
                                    name="email"
                                    value={email}
                                    error={mailRequired > 0 && mailRequired < 3}
                                    helperText={mailRequired === 1 ? '必須項目です。' : mailRequired === 2 ? '無効な形式です。' : ''}
                                    onChange={handleOnEmailChange}
                                    autoComplete="email"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    error={pwdRequired > 0}
                                    helperText={pwdRequired === 1 ? '必須項目です。' : pwdRequired === 2 ? '8文字以上でなければなりません。' : ''}
                                    name="password"
                                    label="パスワード"
                                    type="password"
                                    id="password"
                                    autoComplete="new-password"
                                    value={password}
                                    onChange={handleOnPasswordChange}
                                />
                            </Grid>
                        </Grid>
                        <Button
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            onClick={signin}
                        >
                            ログイン
                        </Button>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Link href="signup" variant="body2">
                                    まだ登録していませんか？ サインアップ
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
                <Copyright sx={{ mt: 5 }} />
            </Container>
        </ThemeProvider>
    );
}

export default SignIn;