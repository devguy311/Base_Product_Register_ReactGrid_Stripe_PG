import { Autocomplete, Button, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material";
import Grid from "@mui/material/Grid";
import { ChangeEvent, SyntheticEvent, useEffect, useState } from "react";
import { Size } from "./common/Size.d";

let itemSizes: number[][] = [];
let itemStocks: number[][] = [];

const init2DArray = (rowLength: number, columnLength: number): number[][] => {
    let newArray: number[][] = [];
    let dummyToClone: number[] = [];

    while (columnLength--) dummyToClone.push(0);
    while (rowLength--) newArray.push(dummyToClone.slice(0));

    return newArray;
};

const ProductDescriptionPanel = (props: any) => {
    const [size, setSize] = useState("0");
    const [sizeList, setSizeList] = useState<Size[]>([Size.XS, Size.S, Size.M, Size.L, Size.XL, Size.XL2, Size.XL3, Size.XL4, Size.XL5, Size.XL6]);
    const [itemList, setItemList] = useState<string[]>([]);
    const [colorList, setColorList] = useState<string[]>([]);
    const [productDescriptionToCopy, setProductDescriptionToCopy] = useState("");
    const [productVariationToCopy, setProductVariationToCopy] = useState("");

    const handleSize = (event: SelectChangeEvent) => {
        setSize(event.target.value);
    };

    const handleItemList = (_event: SyntheticEvent, newValue: string[]) => {
        setItemList(newValue);
        itemSizes = init2DArray(sizeList.length, newValue.length);
    };

    const handleColorList = (_event: SyntheticEvent, newValue: string[]) => {
        setColorList(newValue);
        itemStocks = init2DArray(newValue.length, sizeList.length);
    };

    const handleItemSize = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const split = e.target.id.split("_");
        const sizeIndex = parseInt(split[1]);
        const itemIndex = parseInt(split[2]);

        itemSizes[sizeIndex][itemIndex] = parseInt(e.target.value);
    };

    const handleItemStocks = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const split = e.target.id.split("_");
        const sizeIndex = parseInt(split[1]);
        const colorIndex = parseInt(split[2]);

        itemStocks[sizeIndex][colorIndex] = parseInt(e.target.value);
    };

    const handleSubmit = () => {
        // TODO: TheBase API
        setProductDescriptionToCopy((prevText) => {
            prevText = `色展開\t${colorList.join("\t")}\n\n
            サイズ\t${sizeList.join("\t")}\n\n
            サイズ(cm)`;
            sizeList.forEach((size, idx) => {
                let newLine = "";
                itemList.forEach((item, jdx) => {
                    if (itemSizes[idx][jdx] !== 0) newLine += `\t/${item}\t${itemSizes[idx][jdx]}`;
                });
                if (newLine !== "") prevText += `\n${size + newLine}`;
            });
            return prevText;
        });
        setProductVariationToCopy((prevText) => {
            prevText = `~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`;
            colorList.forEach((color, idx) => {
                let newLine = "";
                sizeList.forEach((size, jdx) => {
                    if (itemStocks[idx][jdx] !== 0) newLine += `\t${color}　サイズ ${size}\t${itemStocks[idx][jdx]}`;
                });
                if (newLine !== "") prevText += `\n${newLine}`;
            });
            return prevText;
        });
    };

    useEffect(() => {
        let sizeList: Size[] = [];
        switch (size) {
            case "0":
                sizeList = [Size.XS, Size.S, Size.M, Size.L, Size.XL, Size.XL2, Size.XL3, Size.XL4, Size.XL5, Size.XL6];
                break;
            case "1":
                sizeList = [Size.S, Size.M, Size.L, Size.XL, Size.XL2, Size.XL3, Size.XL4, Size.XL5, Size.XL6];
                break;
            case "2":
                sizeList = [Size.M, Size.L, Size.XL, Size.XL2, Size.XL3, Size.XL4, Size.XL5, Size.XL6];
                break;
            case "3":
                sizeList = [Size.L, Size.XL, Size.XL2, Size.XL3, Size.XL4, Size.XL5, Size.XL6];
                break;
            case "4":
                sizeList = [Size.XL, Size.XL2, Size.XL3, Size.XL4, Size.XL5, Size.XL6];
                break;
            default:
        }
        setSizeList(sizeList);
    }, [size]);

    return (
        <>
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
                    <Select size="small" sx={{ mr: 2 }} value={size} onChange={handleSize}>
                        <MenuItem value="0">サイズ XS~</MenuItem>
                        <MenuItem value="1">サイズ S~</MenuItem>
                        <MenuItem value="2">サイズ M~</MenuItem>
                        <MenuItem value="3">サイズ L~</MenuItem>
                        <MenuItem value="4">サイズ XL~</MenuItem>
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
                                label={color + "　サイズ " + size}
                                type="number"
                                onChange={handleItemStocks}
                            />
                        ))}
                    </Grid>
                ))}
                <Grid item xs={12}>
                    商品説明
                </Grid>
                <Grid item xs={12}>
                    <p>{productDescriptionToCopy}</p>
                    <p>{productVariationToCopy}</p>
                </Grid>
                <Grid item xs={12}>
                    <Button variant="contained" onClick={handleSubmit}>
                        Submit
                    </Button>
                </Grid>
            </Grid>
        </>
    );
};

export default ProductDescriptionPanel;
