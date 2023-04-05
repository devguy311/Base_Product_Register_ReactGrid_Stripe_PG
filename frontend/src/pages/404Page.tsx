import { ArrowBack } from '@mui/icons-material';
import { Box, Button, Container, SvgIcon, Typography } from '@mui/material';

const ErrorPage = () => {
    return (
        <>
            <Box
                sx={{
                    marginTop: 15,
                    alignItems: 'center',
                    display: 'flex',
                    flexGrow: 1,
                    minHeight: '100%'
                }}
            >
                <Container maxWidth="md">
                    <Box
                        sx={{
                            alignItems: 'center',
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                    >
                        <Box
                            sx={{
                                mb: 3,
                                textAlign: 'center'
                            }}
                        >
                            <img
                                alt="Under development"
                                src="/error-404.png"
                                style={{
                                    display: 'inline-block',
                                    maxWidth: '100%',
                                    width: 400
                                }}
                            />
                        </Box>
                        <Typography
                            align="center"
                            sx={{ mb: 3 }}
                            variant="h4"
                        >
                            404: お探しのページはここにありません
                        </Typography>
                        <Typography
                            align="center"
                            color="text.secondary"
                            variant="body1"
                        >
                            怪しげなルートを試したか、間違ってここに来たかのどちらかです。
                            Wいずれにしても、ナビを使ってみてください
                        </Typography>
                        <Button
                            href="/"
                            startIcon={<ArrowBack />}
                            sx={{ mt: 3 }}
                            variant="contained"
                        >
                            ダホームに戻る
                        </Button>
                    </Box>
                </Container>
            </Box>
        </>
    )
}

export default ErrorPage;