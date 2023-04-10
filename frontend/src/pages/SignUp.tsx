import { useEffect, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
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

const SignUp = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [pwdRequired, setPwdRequired] = useState(0);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    };

    const handleOnChange = (event: any) => {
        setPassword(event.target.value);
    }

    const signup = async () => {
        setPwdRequired(password === '' ? 1 : password.length < 8 ? 2 : 0);
        if (email === '' || password === '' || password.length < 8) return false;
        const result = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/bots/signup`, {email: email, password: password});
        if (result.data.status === "okay"){
            localStorage.setItem("bot_auth_token", result.data.token);
            navigate("/");
        }
    }

    useEffect(() => {
        const storedEmail = localStorage.getItem("bot_email");
        if (storedEmail !== undefined && storedEmail !== null && storedEmail !== ""){
            setEmail(storedEmail);
        }
        else navigate("/404");
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
                    サインアップ
                    </Typography>
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    InputProps={{ readOnly: true }}
                                    id="email"
                                    label="メールアドレス"
                                    name="email"
                                    value={email}
                                    autoComplete="email"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="password"
                                    label="パスワード"
                                    type="password"
                                    id="password"
                                    autoComplete="new-password"
                                    error={pwdRequired > 0}
                                    helperText={pwdRequired === 1 ? '必須項目です。' : pwdRequired === 2 ? '8文字以上でなければなりません。' : ''}
                                    value={password}
                                    onChange={handleOnChange}
                                />
                            </Grid>
                        </Grid>
                        <Button
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            onClick={signup}
                        >
                            サインアップ
                        </Button>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Link href="signin" variant="body2">
                                すでにアカウントをお持ちですか？ ログイン
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

export default SignUp;