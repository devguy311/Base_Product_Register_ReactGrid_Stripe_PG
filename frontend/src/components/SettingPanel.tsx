import { ChangeEvent, SyntheticEvent, useEffect, useState } from "react";
import axios from "axios";
import { Typography, TextField, LinearProgress, Button, Box } from "@mui/material";
import Grid from "@mui/material/Grid";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";

import { LoadingStatus } from "../types/index.d";

const filter = createFilterOptions<string>();

const SettingPanel = (props: any) => {
    const [loadingStatus, setLoadingStatus] = useState(LoadingStatus.LOADING);
    const [header, setHeader] = useState("");
    const [footer, setFooter] = useState("");
    const [itemList, setItemList] = useState<string[]>([]);
    const [colorList, setColorList] = useState<string[]>([]);
    const [itemBaseList, setItemBaseList] = useState<string[]>([]);
    const [colorBaseList, setColorBaseList] = useState<string[]>([]);
    const [isSaving, setIsSaving] = useState(false);

    const handleSubmit = () => {
        setIsSaving(true);
        axios
            .post(`${process.env.REACT_APP_BACKEND_URL}/product/info`, {
                email: props.user.mail_address,
                itemList,
                colorList,
                header,
                footer,
            })
            .finally(() => setIsSaving(false));
    };

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/product`, { params: { email: props.user.mail_address } }).then((response) => {
            const productInfo = response.data.productInfo;
            if (response.data.productInfo !== undefined) {
                setHeader(productInfo.header);
                setFooter(productInfo.footer);
                let split = productInfo.items.split(",\t");
                setItemList(split);
                setItemBaseList(split);
                split = productInfo.colors.split(",\t");
                setColorList(split);
                setColorBaseList(split);
            }
            setLoadingStatus(LoadingStatus.LOADED);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleItemList = (_event: SyntheticEvent, newValue: string[]) => {
        setItemList(newValue);
    };

    const handleColorList = (_event: SyntheticEvent, newValue: string[]) => {
        setColorList(newValue);
    };

    const handleHeader = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setHeader(e.target.value);
    };

    const handleFooter = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setFooter(e.target.value);
    };

    return (
        <>
            {loadingStatus === LoadingStatus.LOADING && <LinearProgress />}
            {loadingStatus === LoadingStatus.LOADED && (
                <>
                    <Grid container spacing={2} sx={{ mt: 2, pl: 1, pr: 1 }}>
                        <Grid item xs={6}>
                            <Grid item xs={12} sx={{ mb: 2 }}>
                                <Box
                                    style={{
                                        textAlign: "center",
                                        backgroundImage: `url(${props.user.background})`,
                                        backgroundRepeat: props.user.repeat_background ? "repeat" : "no-repeat",
                                    }}
                                    height={50}
                                >
                                    <img height={60} src={`${props.user.logo}`} alt="ロゴ" />
                                </Box>
                            </Grid>
                            <Grid item xs={12} sx={{ mb: 2 }}>
                                項目
                                <Autocomplete
                                    multiple
                                    size="small"
                                    options={itemBaseList}
                                    value={itemList}
                                    onChange={handleItemList}
                                    getOptionLabel={(option) => option || ""}
                                    filterOptions={(options, params) => {
                                        const filtered = filter(options, params);

                                        const { inputValue } = params;
                                        // Suggest the creation of a new value
                                        const isExisting = options.some((option) => inputValue === option);
                                        if (inputValue !== "" && !isExisting) {
                                            filtered.push(inputValue);
                                        }

                                        return filtered;
                                    }}
                                    filterSelectedOptions
                                    fullWidth
                                    renderInput={(params) => <TextField {...params} />}
                                    noOptionsText="オプションなし"
                                />
                            </Grid>
                            <Grid item xs={12} sx={{ mb: 2 }}>
                                色展開
                                <Autocomplete
                                    multiple
                                    size="small"
                                    options={colorBaseList}
                                    value={colorList}
                                    onChange={handleColorList}
                                    getOptionLabel={(option) => option || ""}
                                    filterOptions={(options, params) => {
                                        const filtered = filter(options, params);

                                        const { inputValue } = params;
                                        // Suggest the creation of a new value
                                        const isExisting = options.some((option) => inputValue === option);
                                        if (inputValue !== "" && !isExisting) {
                                            filtered.push(inputValue);
                                        }

                                        return filtered;
                                    }}
                                    filterSelectedOptions
                                    fullWidth
                                    renderInput={(params) => <TextField {...params} />}
                                    noOptionsText="オプションなし"
                                />
                            </Grid>
                            <Button variant="contained" disabled={isSaving} onClick={handleSubmit}>
                                保存
                            </Button>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField value={header} label="ヘッダー" fullWidth multiline rows={12} onChange={handleHeader} />
                            <Typography style={{ textAlign: "center" }}>{"<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"}</Typography>
                            <TextField value={footer} label="フッター" fullWidth multiline rows={12} onChange={handleFooter} />
                        </Grid>
                    </Grid>
                </>
            )}
        </>
    );
};

export default SettingPanel;
