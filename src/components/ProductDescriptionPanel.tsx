import { Autocomplete, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useEffect, useState } from "react";
import { Size } from "./common/Size";

const ProductDescriptionPanel = (props: any) => {
    const [size, setSize] = useState("0");
    const [sizeList, setSizeList] = useState<Size[]>([Size.XS, Size.S, Size.M, Size.L, Size.XL, Size.XL2, Size.XL3, Size.XL4, Size.XL5, Size.XL6]);

    const handleSize = (event: SelectChangeEvent) => {
        setSize(event.target.value);
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
                        getOptionLabel={(option) => option || ""}
                        filterSelectedOptions
                        renderInput={(params) => <TextField {...params} />}
                    />
                </Grid>
                <Grid item xs={12}>
                    商品説明
                </Grid>
                <Grid item xs={12}>
                    {sizeList}
                </Grid>
            </Grid>
        </>
    );
};

export default ProductDescriptionPanel;
