import {
    Alert,
    AlertTitle,
    Autocomplete,
    Box,
    Button,
    ButtonGroup,
    CircularProgress,
    FormHelperText,
    Input,
    InputAdornment,
    MenuItem,
    IconButton,
    Select,
    SelectChangeEvent,
    Step,
    StepContent,
    StepLabel,
    Stepper,
    TextField,
    Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { ChangeEvent, SyntheticEvent, useEffect, useState, useRef } from "react";
import axios from "axios";

import { Size, SavingStatus, ProductVariation } from "../types/index.d";
import useToken from "../../../hooks/useToken";
import useAuthorizationCode from "../../../hooks/useAuthorizationCode";
import { AddCircle } from "@mui/icons-material";

const defaultSizeList = [Size.XS, Size.S, Size.M, Size.L, Size.XL, Size.XL2, Size.XL3, Size.XL4, Size.XL5, Size.XL6];

const init2DArray = (rowLength: number, columnLength: number): number[][] => {
    let newArray: number[][] = [];
    let dummyToClone: number[] = [];

    while (columnLength--) dummyToClone.push(0);
    while (rowLength--) newArray.push(dummyToClone.slice(0));

    return newArray;
};

const ProductDescriptionPanel = (props: any) => {
    const { token, setToken } = useToken();
    const { authorizationCode, setAuthorizationCode } = useAuthorizationCode();
    const [startSize, setStartSize] = useState("0");
    const [endSize, setEndSize] = useState("0");
    const [activeStep, setActiveStep] = useState(0);
    const [sizeList, setSizeList] = useState<Size[]>([Size.XS]);
    const [itemList, setItemList] = useState<string[]>([]);
    const [colorList, setColorList] = useState<string[]>([]);
    const [itemBaseList, setItemBaseList] = useState<string[]>([]);
    const [colorBaseList, setColorBaseList] = useState<string[]>([]);
    const [itemSizes, setItemSizes] = useState<number[][]>([]);
    const [itemStocks, setItemStocks] = useState<number[][]>([]);
    const [stockAutoFillValue, setStockAutoFillValue] = useState(0);
    const [productDescriptionToCopy, setProductDescriptionToCopy] = useState("");
    const [productVariations, setProductVariations] = useState<ProductVariation[]>([]);
    const [header, setHeader] = useState("");
    const [footer, setFooter] = useState("");
    const [price, setPrice] = useState(0);
    const [itemStock, setItemStock] = useState(0);
    const [identifier, setIdentifier] = useState("");
    const [savingStatus, setSavingStatus] = useState(SavingStatus.NOT_SAVING);
    const [botAuthToken, setBothAuthToken] = useState(localStorage.getItem("bot_auth_token"));
    const [increRateArray, setIncreRateArray] = useState<number[]>([]);

    const handleNext = () => {
        setActiveStep((prevActiveStep) => {
            if (prevActiveStep === 0) {
                itemList.forEach((item, idx) => {
                    if (isNaN(increRateArray[idx])) increRateArray[idx] = 0;
                })
            }
            if (prevActiveStep === 1) {
                setProductDescriptionToCopy((prevText) => {
                    prevText = `色展開\t${colorList.join("\t")}\n\nサイズ\t${sizeList.join("\t")}\n\nサイズ(cm)`;
                    let sizeLines = "";
                    sizeList.forEach((size, idx) => {
                        let newLine = "";
                        itemList.forEach((item, jdx) => {
                            if (itemSizes[idx][jdx] > 0) newLine += `\t/${item}\t${itemSizes[idx][jdx]}`;
                        });
                        if (newLine !== "") sizeLines += `${sizeLines === "" ? "" : "\n"}\n${size + newLine}`;
                    });
                    return prevText + sizeLines;
                });
                setProductVariations((prevList) => {
                    prevList = [];
                    colorList.forEach((color, idx) => {
                        sizeList.forEach((size, jdx) => {
                            if (itemStocks[idx][jdx] > 0) prevList.push({ name: `${color}　${size}`, stock: itemStocks[idx][jdx] });
                        });
                    });
                    return prevList;
                });
            }

            return prevActiveStep + 1;
        });
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    const handleStartSize = (event: SelectChangeEvent) => {
        if (parseInt(endSize) < parseInt(event.target.value)) setEndSize(event.target.value);
        setStartSize(event.target.value);
        const newSizeList = defaultSizeList.slice(parseInt(event.target.value), parseInt(endSize) + 1);
        setSizeList(newSizeList);
        setItemSizes(init2DArray(newSizeList.length, itemList.length));
        setItemStocks(init2DArray(colorList.length, newSizeList.length));
    };

    const handleEndSize = (event: SelectChangeEvent) => {
        if (parseInt(startSize) > parseInt(event.target.value)) setStartSize(event.target.value);
        setEndSize(event.target.value);
        const newSizeList = defaultSizeList.slice(parseInt(startSize), parseInt(event.target.value) + 1);
        setSizeList(newSizeList);
        setItemSizes(init2DArray(newSizeList.length, itemList.length));
        setItemStocks(init2DArray(colorList.length, newSizeList.length));
    };

    const handleItemList = (_event: SyntheticEvent, newValue: string[]) => {
        if (newValue.length < 21) {
            setItemList(newValue);
            setItemSizes(init2DArray(sizeList.length, newValue.length));
        }
    };

    const handleColorList = (_event: SyntheticEvent, newValue: string[]) => {
        if (newValue.length < 21) {
            setColorList(newValue);
            setItemStocks(init2DArray(newValue.length, sizeList.length));
        }
    };

    const increRateChanged = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, index: number) => {
        const value = Number(e.target.value);
        const newArray = [...increRateArray];
        newArray[index] = isNaN(value) ? 0 : value;
        setIncreRateArray(newArray);
    }

    const handleSizeAutoIncrement = (index: number, incrementRate: number) => {
        let newArray = [...itemSizes];
        sizeList.map((val, idx) => {
            if (idx > 0) newArray[idx][index] = Number((newArray[0][index] + incrementRate * idx).toFixed(1));
        })
        setItemSizes(newArray);
    };

    const handleStockAutoFillValue = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setStockAutoFillValue(isNaN(Number(e.target.value)) ? 0 : Number(e.target.value));
    };

    const handleStockAutoFill = () => {
        setItemStocks(
            itemStocks.map((t) => {
                return t.map(() => {
                    return stockAutoFillValue;
                });
            })
        );
    };
    const handleItemSize = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, idx: number, jdx: number) => {
        const value = Number(e.target.value);
        let newItemSizes = [...itemSizes];
        newItemSizes[idx][jdx] = isNaN(value) ? 0 : value;
        setItemSizes(newItemSizes);
    };

    const handleItemStocks = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, idx: number, jdx: number) => {
        const newValue = Number(e.target.value);
        const newItemStocks = [...itemStocks];
        newItemStocks[jdx][idx] = isNaN(newValue) ? 0 : newValue;
        setItemStocks(newItemStocks);
    };

    const handleHeader = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setHeader(e.target.value);
    };

    const handleFooter = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setFooter(e.target.value);
    };

    const handlePrice = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setPrice(isNaN(Number(e.target.value)) ? 0 : Number(e.target.value));
    };

    const handleItemStock = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setItemStock(isNaN(Number(e.target.value)) ? 0 : Number(e.target.value));
    };

    const handleIdentifier = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setIdentifier(e.target.value);
    };

    const handleSubmit = () => {
        setActiveStep(activeStep + 1);
        setSavingStatus(SavingStatus.SAVING);

        axios.post(`${process.env.REACT_APP_BACKEND_URL}/product/header-footer`, {
            email: props.email,
            header,
            footer,
        },
            { headers: { 'Authorization': `Bearer ${botAuthToken}` } });

        let accessToken = token[0];
        axios
            .post(`${process.env.REACT_APP_BACKEND_URL}/credentials`, {
                accessToken,
                refreshToken: token[1],
                authorizationCode,
            },
                { headers: { 'Authorization': `Bearer ${botAuthToken}` } })
            .then((response) => {
                if (response.status === 201) {
                    setToken([response.data.accessToken, response.data.refreshToken]);
                    accessToken = response.data.accessToken;
                }
                axios
                    .post(`${process.env.REACT_APP_BACKEND_URL}/product`, {
                        accessToken,
                        title: props.productName,
                        detail: `${header}\n\n${productDescriptionToCopy}\n\n${footer}\n\n${identifier}`,
                        price,
                        identifier,
                        ...(productVariations.length === 0 ? { stock: itemStock } : { variations: productVariations }),
                    },
                        { headers: { 'Authorization': `Bearer ${botAuthToken}` } })
                    .then(() => setSavingStatus(SavingStatus.SAVED))
                    .catch(() => setSavingStatus(SavingStatus.NOT_SAVED));
            })
            .catch(() => {
                setAuthorizationCode(undefined);
                setToken([undefined, undefined]);
                window.location.reload();
            });
    };

    useEffect(() => {
        setBothAuthToken(localStorage.getItem("bot_auth_token"));
        axios
            .get(`${process.env.REACT_APP_BACKEND_URL}/product`, {
                headers: {
                    'Authorization': `Bearer ${botAuthToken}`
                },
                params: {
                    email: props.email,
                },
            })
            .then((response) => {
                const productInfo = response.data.productInfo;
                if (productInfo !== undefined) {
                    setItemBaseList(productInfo.items.split(",\t"));
                    setColorBaseList(productInfo.colors.split(",\t"));
                    setHeader(productInfo.header);
                    setFooter(productInfo.footer);
                }
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <Stepper activeStep={activeStep} orientation="vertical">
                <Step key={0}>
                    <StepLabel>ステップ　1</StepLabel>
                    <StepContent>
                        <Grid container spacing={2}>
                            <Grid item xs={2}>
                                サイズ
                            </Grid>
                            <Grid item xs={10}>
                                <Select size="small" sx={{ mr: 2 }} value={startSize} onChange={handleStartSize}>
                                    <MenuItem value="0">サイズ XS</MenuItem>
                                    <MenuItem value="1">サイズ S</MenuItem>
                                    <MenuItem value="2">サイズ M</MenuItem>
                                    <MenuItem value="3">サイズ L</MenuItem>
                                    <MenuItem value="4">サイズ XL</MenuItem>
                                    <MenuItem value="5">サイズ XL2</MenuItem>
                                    <MenuItem value="6">サイズ XL3</MenuItem>
                                    <MenuItem value="7">サイズ XL4</MenuItem>
                                    <MenuItem value="8">サイズ XL5</MenuItem>
                                    <MenuItem value="9">サイズ XL6</MenuItem>
                                </Select>

                                <span>~</span>

                                <Select size="small" sx={{ mr: 2 }} value={endSize} onChange={handleEndSize} style={{ marginLeft: 16 }}>
                                    <MenuItem value="0">サイズ XS</MenuItem>
                                    <MenuItem value="1">サイズ S</MenuItem>
                                    <MenuItem value="2">サイズ M</MenuItem>
                                    <MenuItem value="3">サイズ L</MenuItem>
                                    <MenuItem value="4">サイズ XL</MenuItem>
                                    <MenuItem value="5">サイズ XL2</MenuItem>
                                    <MenuItem value="6">サイズ XL3</MenuItem>
                                    <MenuItem value="7">サイズ XL4</MenuItem>
                                    <MenuItem value="8">サイズ XL5</MenuItem>
                                    <MenuItem value="9">サイズ XL6</MenuItem>
                                </Select>
                            </Grid>
                            <Grid item xs={2}>
                                項目
                            </Grid>
                            <Grid item xs={10}>
                                <Autocomplete
                                    multiple
                                    size="small"
                                    options={itemBaseList}
                                    value={itemList}
                                    onChange={handleItemList}
                                    getOptionLabel={(option) => option || ""}
                                    filterSelectedOptions
                                    renderInput={(params) => <TextField {...params} />}
                                    noOptionsText="オプションなし"
                                />
                                <FormHelperText>{(itemList || []).length}/20</FormHelperText>
                            </Grid>
                            <Grid item xs={2}>
                                色展開
                            </Grid>
                            <Grid item xs={10}>
                                <Autocomplete
                                    multiple
                                    size="small"
                                    options={colorBaseList}
                                    value={colorList}
                                    onChange={handleColorList}
                                    getOptionLabel={(option) => option || ""}
                                    filterSelectedOptions
                                    renderInput={(params) => <TextField {...params} />}
                                    noOptionsText="オプションなし"
                                />
                                <FormHelperText>{(colorList || []).length}/20</FormHelperText>
                            </Grid>
                        </Grid>
                        <Box sx={{ mb: 2 }}>
                            <div>
                                <Button variant="contained" onClick={handleNext} sx={{ mt: 1, mr: 1 }}>
                                    次へ
                                </Button>
                            </div>
                        </Box>
                    </StepContent>
                </Step>
                <Step key={1}>
                    <StepLabel>
                        ステップ　2
                        {activeStep === 1 && (
                            <Button size="small" variant="outlined" onClick={handleBack}>
                                戻る
                            </Button>
                        )}
                    </StepLabel>
                    <StepContent>
                        <Grid container spacing={2}>
                            {itemList.length !== 0 && (
                                <>
                                    <Grid item xs={12}>
                                        <strong>サイズ(cm)</strong>
                                    </Grid>
                                    <Grid item display={"flex"} xs={12}>
                                        <Grid item xs={1} sx={{ pt: 1, pl: 2 }}>+</Grid>
                                        <Grid item display={"flex"} xs={11}>
                                            {
                                                itemList.map((item, idx) => (
                                                    <>
                                                        <TextField
                                                            key={idx}
                                                            size="small"
                                                            sx={{ mb: 1, width: itemList.length < 6 ? "223px" : "100vh", pr: 1 }}
                                                            value={increRateArray[idx].toString()}
                                                            onChange={(event) => increRateChanged(event, idx)}
                                                            inputProps={{ step: "any", type: "number", min: "0" }}
                                                            InputProps={{
                                                                endAdornment:
                                                                    <InputAdornment position="end">
                                                                        <IconButton aria-label="add" onClick={() => handleSizeAutoIncrement(idx, increRateArray[idx])} sx={{ mr: -2 }}>
                                                                            <AddCircle color="primary" />
                                                                        </IconButton>
                                                                    </InputAdornment>
                                                            }}
                                                        />
                                                    </>
                                                ))
                                            }
                                        </Grid>
                                    </Grid>
                                    {sizeList.map((size, idx) => (
                                        <Grid key={idx} item display={"flex"} xs={12}>
                                            <Grid item xs={1} sx={{ pt: 1, pl: 2 }}>
                                                {size}
                                            </Grid>

                                            <Grid item display={"flex"} xs={11}>
                                                {itemList.map((item, jdx) => (
                                                    <TextField
                                                        key={jdx}
                                                        size="small"
                                                        sx={{ mb: 1, mr: 1 }}
                                                        value={itemSizes[idx][jdx].toString()}
                                                        label={item}
                                                        inputProps={{ step: "any", type: "number", min: "0" }}
                                                        onChange={(e) => handleItemSize(e, idx, jdx)}
                                                    />
                                                ))}
                                            </Grid>
                                        </Grid>
                                    ))}
                                </>
                            )}

                            {colorList.length !== 0 && (
                                <>
                                    <Grid item xs={12}>
                                        <strong>バリエーション</strong>
                                        <TextField
                                            size="small"
                                            value={stockAutoFillValue.toString()}
                                            sx={{ pl: 1, pr: 1 }}
                                            inputProps={{ step: "any", type: "number", min: "0" }}
                                            onChange={handleStockAutoFillValue}
                                        />
                                        <Button onClick={handleStockAutoFill}>一括入力</Button>
                                    </Grid>
                                    {sizeList.map((size, idx) => (
                                        <Grid key={idx} item display="flex" xs={12}>
                                            <Grid item display={"flex"} xs={12}>
                                                {colorList.map((color, jdx) => (
                                                    <TextField
                                                        key={jdx}
                                                        size="small"
                                                        sx={{ mb: 1, mr: 1 }}
                                                        value={itemStocks[jdx][idx].toString()}
                                                        label={color + "　" + size}
                                                        inputProps={{ step: "any", type: "number", min: "0" }}
                                                        onChange={(e) => handleItemStocks(e, idx, jdx)}
                                                    />
                                                ))}
                                            </Grid>
                                        </Grid>
                                    ))}
                                </>
                            )}
                        </Grid>
                        <Box sx={{ mb: 2 }}>
                            <div>
                                <Button variant="contained" onClick={handleNext} sx={{ mt: 1, mr: 1 }}>
                                    次へ
                                </Button>
                                <Button onClick={handleBack} sx={{ mt: 1, mr: 1 }}>
                                    戻る
                                </Button>
                            </div>
                        </Box>
                    </StepContent>
                </Step>
                <Step key={2}>
                    <StepLabel optional={<Typography variant="caption">最後</Typography>}>
                        ステップ　3
                        {activeStep === 2 && (
                            <Button size="small" variant="outlined" onClick={handleBack}>
                                戻る
                            </Button>
                        )}
                    </StepLabel>
                    <StepContent>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <strong>商品名</strong>
                                {" " + props.productName}
                            </Grid>
                            <Grid item xs={12}>
                                <strong>商品説明</strong>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField value={header} label="ヘッダー" fullWidth multiline rows={7} onChange={handleHeader} />
                                <p>{productDescriptionToCopy}</p>
                                <TextField value={footer} label="フッター" fullWidth multiline rows={7} onChange={handleFooter} />
                            </Grid>
                            <Grid item xs={12}>
                                <strong>必須設定</strong>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField size="small" sx={{ mr: 1 }} value={price.toString()} label="価格(税込)"
                                    inputProps={{ step: "any", type: "number", min: "0" }} onChange={handlePrice} />
                                {productVariations.length === 0 && (
                                    <TextField size="small" sx={{ mr: 1 }} value={itemStock.toString()} label="在庫数"
                                        inputProps={{ step: "any", type: "number", min: "0" }} type="number" onChange={handleItemStock} />
                                )}
                                <TextField size="small" value={identifier} label="商品コード" onChange={handleIdentifier} />
                            </Grid>
                        </Grid>
                        <Box sx={{ mb: 2 }}>
                            <div>
                                <Button variant="contained" onClick={handleSubmit} sx={{ mt: 1, mr: 1 }}>
                                    確認
                                </Button>
                                <Button onClick={handleBack} sx={{ mt: 1, mr: 1 }}>
                                    戻る
                                </Button>
                                <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
                                    リセット
                                </Button>
                            </div>
                        </Box>
                    </StepContent>
                </Step>
            </Stepper>
            {savingStatus === SavingStatus.SAVING && (
                <Alert severity="info" icon={<CircularProgress size="1rem" />}>
                    商品追加中。。。
                </Alert>
            )}
            {savingStatus === SavingStatus.SAVED && (
                <Alert severity="success">
                    <AlertTitle>成功</AlertTitle>商品が追加しました
                </Alert>
            )}
            {savingStatus === SavingStatus.NOT_SAVED && (
                <Alert severity="error">
                    <AlertTitle>失敗</AlertTitle>製品の追加に失敗しました
                    <Button
                        onClick={() => {
                            setSavingStatus(SavingStatus.NOT_SAVING);
                            handleBack();
                        }}
                        sx={{ mt: 1, mr: 1 }}
                    >
                        戻る
                    </Button>
                    <Button
                        onClick={() => {
                            setSavingStatus(SavingStatus.NOT_SAVING);
                            handleReset();
                        }}
                        sx={{ mt: 1, mr: 1 }}
                    >
                        リセット
                    </Button>
                </Alert>
            )}
        </>
    );
};

export default ProductDescriptionPanel;
