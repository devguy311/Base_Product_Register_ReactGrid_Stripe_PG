import {
    Alert,
    AlertTitle,
    Autocomplete,
    Box,
    Button,
    CircularProgress,
    MenuItem,
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
import { ChangeEvent, SyntheticEvent, useEffect, useState } from "react";
import axios from "axios";

import { Size, SavingStatus, ProductVariation } from "../types";
import useToken from "../../../hooks/useToken";
import useAuthorizationCode from "../../../hooks/useAuthorizationCode";

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
    const [itemSizes, setItemSizes] = useState<number[][]>([]);
    const [itemStocks, setItemStocks] = useState<number[][]>([]);
    const [productDescriptionToCopy, setProductDescriptionToCopy] = useState("");
    const [productVariations, setProductVariations] = useState<ProductVariation[]>([]);
    const [savingStatus, setSavingStatus] = useState(SavingStatus.NOT_SAVING);

    const handleNext = () => {
        setActiveStep((prevActiveStep) => {
            if (prevActiveStep === 1) {
                setProductDescriptionToCopy((prevText) => {
                    prevText = `色展開\t${colorList.join("\t")}\n\nサイズ\t${sizeList.join("\t")}\n\nサイズ(cm)`;
                    let sizeLines = "";
                    sizeList.forEach((size, idx) => {
                        let newLine = "";
                        itemList.forEach((item, jdx) => {
                            if (itemSizes[idx][jdx] !== 0) newLine += `\t/${item}\t${itemSizes[idx][jdx]}`;
                        });
                        if (newLine !== "") sizeLines += `${sizeLines === "" ? "" : "\n"}\n${size + newLine}`;
                    });
                    return prevText + sizeLines;
                });
                setProductVariations((prevList) => {
                    prevList = [];
                    colorList.forEach((color, idx) => {
                        sizeList.forEach((size, jdx) => {
                            if (itemStocks[idx][jdx] !== 0) prevList.push({ name: `${color}　${size}`, stock: itemStocks[idx][jdx] });
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
    };

    const handleEndSize = (event: SelectChangeEvent) => {
        if (parseInt(startSize) > parseInt(event.target.value)) setStartSize(event.target.value);
        setEndSize(event.target.value);
    };

    const handleItemList = (_event: SyntheticEvent, newValue: string[]) => {
        setItemList(newValue);
        setItemSizes(init2DArray(sizeList.length, newValue.length));
    };

    const handleColorList = (_event: SyntheticEvent, newValue: string[]) => {
        setColorList(newValue);
        setItemStocks(init2DArray(newValue.length, sizeList.length));
    };

    const handleItemSize = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const split = e.target.id.split("_");
        const sizeIndex = parseInt(split[1]);
        const itemIndex = parseInt(split[2]);
        const newValue = parseInt(e.target.value);

        const newItemSizes = itemSizes.slice();
        newItemSizes[sizeIndex][itemIndex] = isNaN(newValue) ? 0 : newValue;
        setItemSizes(newItemSizes);
    };

    const handleItemStocks = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const split = e.target.id.split("_");
        const sizeIndex = parseInt(split[1]);
        const colorIndex = parseInt(split[2]);
        const newValue = parseInt(e.target.value);

        const newItemStocks = itemStocks.slice();
        newItemStocks[sizeIndex][colorIndex] = isNaN(newValue) ? 0 : newValue;
        setItemStocks(newItemStocks);
    };

    const handleSubmit = () => {
        setActiveStep(activeStep + 1);
        setSavingStatus(SavingStatus.SAVING);

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
                    .post(`${process.env.REACT_APP_BACKEND_URL}/product`, {
                        accessToken,
                        title: props.productName,
                        detail: productDescriptionToCopy,
                        variations: productVariations,
                    })
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
        setSizeList(defaultSizeList.slice(parseInt(startSize), parseInt(endSize) + 1));
    }, [startSize, endSize]);

    return (
        <>
            <Stepper activeStep={activeStep} orientation="vertical">
                <Step key={0}>
                    <StepLabel>どうぞ</StepLabel>
                    <StepContent>
                        <Grid container spacing={2}>
                            <Grid item xs={2}>
                                商品名
                            </Grid>
                            <Grid item xs={10}>
                                {props.productName}
                            </Grid>
                            <Grid item xs={2}>
                                サイズ
                            </Grid>
                            <Grid item xs={10}>
                                <Select size="small" sx={{ mr: 2 }} value={startSize} onChange={handleStartSize}>
                                    {itemList.map((item, jdx) => (
                                        <MenuItem value="0">サイズ XS</MenuItem>
                                    ))}
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
                                    options={[
                                        "バスト",
                                        "ウェスト",
                                        "ヒップ",
                                        "肩幅",
                                        "袖丈",
                                        "袖口",
                                        "スカート丈",
                                        "縦",
                                        "横",
                                        "厚さ",
                                        "ストラップ長さ",
                                        "裾丈",
                                        "ズボン丈",
                                    ]}
                                    value={itemList}
                                    onChange={handleItemList}
                                    getOptionLabel={(option) => option || ""}
                                    filterSelectedOptions
                                    renderInput={(params) => <TextField {...params} />}
                                />
                            </Grid>
                            <Grid item xs={2}>
                                色展開
                            </Grid>
                            <Grid item xs={10}>
                                <Autocomplete
                                    multiple
                                    size="small"
                                    options={[
                                        "白",
                                        "ホワイト",
                                        "黒",
                                        "ブラック",
                                        "赤",
                                        "レッド",
                                        "青",
                                        "ブルー",
                                        "緑",
                                        "グリーン",
                                        "紫",
                                        "パープル",
                                        "茶色",
                                        "ブラウン",
                                        "灰色",
                                        "グレー",
                                        "黄色",
                                        "オフホワイト",
                                        "ベージュ",
                                        "カーキ",
                                        "イエロー",
                                        "ピンク",
                                        "藍色",
                                        "オレンジ",
                                        "水色",
                                        "ワインレッド",
                                        "ネイビー",
                                        "金色",
                                        "銀色",
                                        "ゴールド",
                                        "シルバー",
                                        "パステルカラー",
                                        "くすみカラー",
                                        "大人カラー",
                                        "ベイクドカラー",
                                        "バイカラー",
                                        "モノトーン",
                                        "春カラー",
                                        "秋カラー",
                                        "ニュアンスカラー",
                                        "カラバリ",
                                        "ミリタリー",
                                        "光沢",
                                        "メタリック",
                                        "アプリコット",
                                    ]}
                                    value={colorList}
                                    onChange={handleColorList}
                                    getOptionLabel={(option) => option || ""}
                                    filterSelectedOptions
                                    renderInput={(params) => <TextField {...params} />}
                                />
                            </Grid>
                        </Grid>
                        <Box sx={{ mb: 2 }}>
                            <div>
                                <Button variant="contained" onClick={handleNext} sx={{ mt: 1, mr: 1 }}>
                                    続く
                                </Button>
                            </div>
                        </Box>
                    </StepContent>
                </Step>
                <Step key={1}>
                    <StepLabel>どうぞ</StepLabel>
                    <StepContent>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                サイズ(cm)
                            </Grid>
                            {sizeList.map((size, idx) => (
                                <Grid key={idx} item display={"flex"} xs={12}>
                                    <Grid item xs={2}>
                                        {size}
                                    </Grid>

                                    <Grid item xs={10}>
                                        {itemList.map((item, jdx) => (
                                            <TextField
                                                key={jdx}
                                                id={"item_" + idx + "_" + jdx}
                                                size="small"
                                                sx={{ mb: 1, mr: 1 }}
                                                value={itemSizes[idx][jdx]}
                                                label={item}
                                                type="number"
                                                onChange={handleItemSize}
                                            />
                                        ))}
                                    </Grid>
                                </Grid>
                            ))}
                            <Grid item xs={12}>
                                バリエーション
                            </Grid>
                            {sizeList.map((size, idx) => (
                                <Grid key={idx} item display={"flex"} xs={12}>
                                    {colorList.map((color, jdx) => (
                                        <TextField
                                            key={jdx}
                                            id={"color_" + jdx + "_" + idx}
                                            size="small"
                                            sx={{ mb: 1, mr: 1 }}
                                            value={itemStocks[jdx][idx]}
                                            label={color + "　" + size}
                                            type="number"
                                            onChange={handleItemStocks}
                                        />
                                    ))}
                                </Grid>
                            ))}
                        </Grid>
                        <Box sx={{ mb: 2 }}>
                            <div>
                                <Button variant="contained" onClick={handleNext} sx={{ mt: 1, mr: 1 }}>
                                    続く
                                </Button>
                                <Button onClick={handleBack} sx={{ mt: 1, mr: 1 }}>
                                    戻る
                                </Button>
                            </div>
                        </Box>
                    </StepContent>
                </Step>
                <Step key={2}>
                    <StepLabel optional={<Typography variant="caption">最後</Typography>}>どうぞ</StepLabel>
                    <StepContent>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                商品説明
                            </Grid>
                            <Grid item xs={12}>
                                <p>{productDescriptionToCopy}</p>
                                <p>{productVariations.map((t) => `${t.name}\t${t.stock}`).join("\t")}</p>
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
                    <AlertTitle>成功</AlertTitle>商品が追加ました
                </Alert>
            )}
            {savingStatus === SavingStatus.NOT_SAVED && (
                <Alert severity="error">
                    <AlertTitle>失敗</AlertTitle>製品の追加に失敗しました
                </Alert>
            )}
        </>
    );
};

export default ProductDescriptionPanel;
