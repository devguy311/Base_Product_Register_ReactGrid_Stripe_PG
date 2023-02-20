import React, { useEffect, useState } from "react";
import axios from "axios";
import { ReactGrid, Column, Row, CellChange, SelectionMode, Id, MenuOption } from "@silevis/reactgrid";
import { Button, CircularProgress, IconButton } from "@mui/material";
import { Backup, RefreshRounded, ReplayRounded } from "@mui/icons-material";
import "@silevis/reactgrid/styles.css";

import CopyToClipboardButton from "./common/dynamic-table/components/CopyToClipboardButton";
import { BagWallet } from "../react-app-env.d";
import { LoadingStatus } from "./common/LoadingStatus";

const getBagWallet = (bagWallet: any[]): BagWallet[] => {
    let result: BagWallet[] = [];
    for (let i = 0; i < bagWallet.length; i++) {
        result.push({
            freeEntry: { checked: false, text: bagWallet[i].freeEntry },
            big: { checked: false, text: bagWallet[i].big },
            mediumBag: { checked: false, text: bagWallet[i].mediumBag },
            mediumWallet: { checked: false, text: bagWallet[i].mediumWallet },
            functionBag: { checked: false, text: bagWallet[i].functionBag },
            functionWallet: { checked: false, text: bagWallet[i].functionWallet },
            designOrShape: { checked: false, text: bagWallet[i].designOrShape },
            material: { checked: false, text: bagWallet[i].material },
            image: { checked: false, text: bagWallet[i].image },
            pattern: { checked: false, text: bagWallet[i].pattern },
            ageOrSex: { checked: false, text: bagWallet[i].ageOrSex },
            place: { checked: false, text: bagWallet[i].place },
            others: { checked: false, text: bagWallet[i].others },
            seasonOrEvent: { checked: false, text: bagWallet[i].seasonOrEvent },
            size: { checked: false, text: bagWallet[i].size },
            color: { checked: false, text: bagWallet[i].color },
        });
    }
    return result;
};

const getColumns = (): Column[] => [
    { columnId: "row_select", width: 40 },
    { columnId: "freeEntry_checked", width: 40 },
    { columnId: "freeEntry_text", width: 70, resizable: true },
    { columnId: "big_checked", width: 40 },
    { columnId: "big_text", width: 70, resizable: true },
    { columnId: "mediumBag_checked", width: 40 },
    { columnId: "mediumBag_text", width: 70, resizable: true },
    { columnId: "mediumWallet_checked", width: 40 },
    { columnId: "mediumWallet_text", width: 70, resizable: true },
    { columnId: "functionBag_checked", width: 40 },
    { columnId: "functionBag_text", width: 70, resizable: true },
    { columnId: "functionWallet_checked", width: 40 },
    { columnId: "functionWallet_text", width: 70, resizable: true },
    { columnId: "designOrShape_checked", width: 40 },
    { columnId: "designOrShape_text", width: 70, resizable: true },
    { columnId: "material_checked", width: 40 },
    { columnId: "material_text", width: 70, resizable: true },
    { columnId: "image_checked", width: 40 },
    { columnId: "image_text", width: 70, resizable: true },
    { columnId: "pattern_checked", width: 40 },
    { columnId: "pattern_text", width: 70, resizable: true },
    { columnId: "ageOrSex_checked", width: 40 },
    { columnId: "ageOrSex_text", width: 70, resizable: true },
    { columnId: "place_checked", width: 40 },
    { columnId: "place_text", width: 70, resizable: true },
    { columnId: "others_checked", width: 40 },
    { columnId: "others_text", width: 70, resizable: true },
    { columnId: "seasonOrEvent_checked", width: 40 },
    { columnId: "seasonOrEvent_text", width: 70, resizable: true },
    { columnId: "size_checked", width: 40 },
    { columnId: "size_text", width: 70, resizable: true },
    { columnId: "color_checked", width: 40 },
    { columnId: "color_text", width: 70, resizable: true },
];

const headerRow: Row = {
    rowId: "header",
    cells: [
        { type: "header", text: "" },
        { type: "header", text: "☑" },
        { type: "header", text: "自由記入" },
        { type: "header", text: "☑" },
        { type: "header", text: "大" },
        { type: "header", text: "☑" },
        { type: "header", text: "中（バッグ" },
        { type: "header", text: "☑" },
        { type: "header", text: "中（財布）" },
        { type: "header", text: "☑" },
        { type: "header", text: "機能（バッグ）" },
        { type: "header", text: "☑" },
        { type: "header", text: "機能（財布）" },
        { type: "header", text: "☑" },
        { type: "header", text: "デザイン・形" },
        { type: "header", text: "☑" },
        { type: "header", text: "素材" },
        { type: "header", text: "☑" },
        { type: "header", text: "イメージ" },
        { type: "header", text: "☑" },
        { type: "header", text: "柄" },
        { type: "header", text: "☑" },
        { type: "header", text: "年代・性別" },
        { type: "header", text: "☑" },
        { type: "header", text: "場所" },
        { type: "header", text: "☑" },
        { type: "header", text: "その他" },
        { type: "header", text: "☑" },
        { type: "header", text: "季節・行事" },
        { type: "header", text: "☑" },
        { type: "header", text: "サイズ " },
        { type: "header", text: "☑" },
        { type: "header", text: "カラー" },
    ],
};

const footerRow: Row = {
    rowId: "footer",
    cells: [
        { type: "text", text: "", nonEditable: true },
        { type: "text", text: "", nonEditable: true },
        { type: "text", text: "" },
        { type: "text", text: "", nonEditable: true },
        { type: "text", text: "" },
        { type: "text", text: "", nonEditable: true },
        { type: "text", text: "" },
        { type: "text", text: "", nonEditable: true },
        { type: "text", text: "" },
        { type: "text", text: "", nonEditable: true },
        { type: "text", text: "" },
        { type: "text", text: "", nonEditable: true },
        { type: "text", text: "" },
        { type: "text", text: "", nonEditable: true },
        { type: "text", text: "" },
        { type: "text", text: "", nonEditable: true },
        { type: "text", text: "" },
        { type: "text", text: "", nonEditable: true },
        { type: "text", text: "" },
        { type: "text", text: "", nonEditable: true },
        { type: "text", text: "" },
        { type: "text", text: "", nonEditable: true },
        { type: "text", text: "" },
        { type: "text", text: "", nonEditable: true },
        { type: "text", text: "" },
        { type: "text", text: "", nonEditable: true },
        { type: "text", text: "" },
        { type: "text", text: "", nonEditable: true },
        { type: "text", text: "" },
        { type: "text", text: "", nonEditable: true },
        { type: "text", text: "" },
        { type: "text", text: "", nonEditable: true },
        { type: "text", text: "" },
    ],
};

const getRows = (data: BagWallet[]): Row[] => [
    headerRow,
    ...data.map<Row>((t, idx) => ({
        rowId: idx,
        cells: [
            { type: "text", text: "", nonEditable: true },
            { type: "checkbox", checked: t.freeEntry.checked },
            { type: "text", text: t.freeEntry.text },
            { type: "checkbox", checked: t.big.checked },
            { type: "text", text: t.big.text },
            { type: "checkbox", checked: t.mediumBag.checked },
            { type: "text", text: t.mediumBag.text },
            { type: "checkbox", checked: t.mediumWallet.checked },
            { type: "text", text: t.mediumWallet.text },
            { type: "checkbox", checked: t.functionBag.checked },
            { type: "text", text: t.functionBag.text },
            { type: "checkbox", checked: t.functionWallet.checked },
            { type: "text", text: t.functionWallet.text },
            { type: "checkbox", checked: t.designOrShape.checked },
            { type: "text", text: t.designOrShape.text },
            { type: "checkbox", checked: t.material.checked },
            { type: "text", text: t.material.text },
            { type: "checkbox", checked: t.image.checked },
            { type: "text", text: t.image.text },
            { type: "checkbox", checked: t.pattern.checked },
            { type: "text", text: t.pattern.text },
            { type: "checkbox", checked: t.ageOrSex.checked },
            { type: "text", text: t.ageOrSex.text },
            { type: "checkbox", checked: t.place.checked },
            { type: "text", text: t.place.text },
            { type: "checkbox", checked: t.others.checked },
            { type: "text", text: t.others.text },
            { type: "checkbox", checked: t.seasonOrEvent.checked },
            { type: "text", text: t.seasonOrEvent.text },
            { type: "checkbox", checked: t.size.checked },
            { type: "text", text: t.size.text },
            { type: "checkbox", checked: t.color.checked },
            { type: "text", text: t.color.text },
        ],
    })),
    footerRow,
];

const BagWalletPanel = () => {
    const [loadingStatus, setLoadingStatus] = useState<LoadingStatus>(LoadingStatus.LOADING);
    const [isSaving, setIsSaving] = useState(false);
    const [columns, setColumns] = useState<Column[]>(getColumns());
    const [textToCopy, setTextToCopy] = useState("");
    const [bagWallet, setBagWallet] = useState<BagWallet[]>([]);
    const [cellChangesIndex, setCellChangesIndex] = useState(() => -1);
    const [cellChanges, setCellChanges] = useState<CellChange[][]>(() => []);

    const applyNewValue = (changes: CellChange[], prevData: BagWallet[], usePrevValue: boolean = false): BagWallet[] => {
        changes.forEach((change) => {
            const fieldName = change.columnId as string;
            const cell = usePrevValue ? change.previousCell : change.newCell;

            if (change.rowId === "footer" && cell.type === "text") {
                let newRow: BagWallet = {
                    freeEntry: { checked: false, text: "" },
                    big: { checked: false, text: "" },
                    mediumBag: { checked: false, text: "" },
                    mediumWallet: { checked: false, text: "" },
                    functionBag: { checked: false, text: "" },
                    functionWallet: { checked: false, text: "" },
                    designOrShape: { checked: false, text: "" },
                    material: { checked: false, text: "" },
                    image: { checked: false, text: "" },
                    pattern: { checked: false, text: "" },
                    ageOrSex: { checked: false, text: "" },
                    place: { checked: false, text: "" },
                    others: { checked: false, text: "" },
                    seasonOrEvent: { checked: false, text: "" },
                    size: { checked: false, text: "" },
                    color: { checked: false, text: "" },
                };
                if (fieldName.startsWith("freeEntry") && cell.text.trim() !== "") newRow.freeEntry.text = cell.text;
                else if (fieldName.startsWith("big") && cell.text.trim() !== "") newRow.big.text = cell.text;
                else if (fieldName.startsWith("mediumBag") && cell.text.trim() !== "") newRow.mediumBag.text = cell.text;
                else if (fieldName.startsWith("mediumWallet") && cell.text.trim() !== "") newRow.mediumWallet.text = cell.text;
                else if (fieldName.startsWith("functionBag") && cell.text.trim() !== "") newRow.functionBag.text = cell.text;
                else if (fieldName.startsWith("functionWallet") && cell.text.trim() !== "") newRow.functionWallet.text = cell.text;
                else if (fieldName.startsWith("designOrShape") && cell.text.trim() !== "") newRow.designOrShape.text = cell.text;
                else if (fieldName.startsWith("material") && cell.text.trim() !== "") newRow.material.text = cell.text;
                else if (fieldName.startsWith("image") && cell.text.trim() !== "") newRow.image.text = cell.text;
                else if (fieldName.startsWith("pattern") && cell.text.trim() !== "") newRow.pattern.text = cell.text;
                else if (fieldName.startsWith("ageOrSex") && cell.text.trim() !== "") newRow.ageOrSex.text = cell.text;
                else if (fieldName.startsWith("place") && cell.text.trim() !== "") newRow.place.text = cell.text;
                else if (fieldName.startsWith("others") && cell.text.trim() !== "") newRow.others.text = cell.text;
                else if (fieldName.startsWith("seasonOrEvent") && cell.text.trim() !== "") newRow.seasonOrEvent.text = cell.text;
                else if (fieldName.startsWith("size") && cell.text.trim() !== "") newRow.size.text = cell.text;
                else if (fieldName.startsWith("color") && cell.text.trim() !== "") newRow.color.text = cell.text;
                else if (change.previousCell.type === "text" && change.newCell.type === "text") {
                    console.log(change.previousCell);
                    console.log(change.newCell);
                    if (change.previousCell.text !== "" || change.newCell.text.trim() !== "") prevData.pop();
                    return [...prevData];
                }
                prevData.push(newRow);
            } else {
                const tIndex = change.rowId as number;

                if (cell.type === "checkbox") {
                    if (fieldName.startsWith("freeEntry")) prevData[tIndex].freeEntry.checked = cell.checked;
                    else if (fieldName.startsWith("big")) prevData[tIndex].big.checked = cell.checked;
                    else if (fieldName.startsWith("mediumBag")) prevData[tIndex].mediumBag.checked = cell.checked;
                    else if (fieldName.startsWith("mediumWallet")) prevData[tIndex].mediumWallet.checked = cell.checked;
                    else if (fieldName.startsWith("functionBag")) prevData[tIndex].functionBag.checked = cell.checked;
                    else if (fieldName.startsWith("functionWallet")) prevData[tIndex].functionWallet.checked = cell.checked;
                    else if (fieldName.startsWith("designOrShape")) prevData[tIndex].designOrShape.checked = cell.checked;
                    else if (fieldName.startsWith("material")) prevData[tIndex].material.checked = cell.checked;
                    else if (fieldName.startsWith("image")) prevData[tIndex].image.checked = cell.checked;
                    else if (fieldName.startsWith("pattern")) prevData[tIndex].pattern.checked = cell.checked;
                    else if (fieldName.startsWith("ageOrSex")) prevData[tIndex].ageOrSex.checked = cell.checked;
                    else if (fieldName.startsWith("place")) prevData[tIndex].place.checked = cell.checked;
                    else if (fieldName.startsWith("others")) prevData[tIndex].others.checked = cell.checked;
                    else if (fieldName.startsWith("seasonOrEvent")) prevData[tIndex].seasonOrEvent.checked = cell.checked;
                    else if (fieldName.startsWith("size")) prevData[tIndex].size.checked = cell.checked;
                    else if (fieldName.startsWith("color")) prevData[tIndex].color.checked = cell.checked;
                } else if (cell.type === "text") {
                    if (fieldName.startsWith("freeEntry")) prevData[tIndex].freeEntry.text = cell.text;
                    else if (fieldName.startsWith("big")) prevData[tIndex].big.text = cell.text;
                    else if (fieldName.startsWith("mediumBag")) prevData[tIndex].mediumBag.text = cell.text;
                    else if (fieldName.startsWith("mediumWallet")) prevData[tIndex].mediumWallet.text = cell.text;
                    else if (fieldName.startsWith("functionBag")) prevData[tIndex].functionBag.text = cell.text;
                    else if (fieldName.startsWith("functionWallet")) prevData[tIndex].functionWallet.text = cell.text;
                    else if (fieldName.startsWith("designOrShape")) prevData[tIndex].designOrShape.text = cell.text;
                    else if (fieldName.startsWith("material")) prevData[tIndex].material.text = cell.text;
                    else if (fieldName.startsWith("image")) prevData[tIndex].image.text = cell.text;
                    else if (fieldName.startsWith("pattern")) prevData[tIndex].pattern.text = cell.text;
                    else if (fieldName.startsWith("ageOrSex")) prevData[tIndex].ageOrSex.text = cell.text;
                    else if (fieldName.startsWith("place")) prevData[tIndex].place.text = cell.text;
                    else if (fieldName.startsWith("others")) prevData[tIndex].others.text = cell.text;
                    else if (fieldName.startsWith("seasonOrEvent")) prevData[tIndex].seasonOrEvent.text = cell.text;
                    else if (fieldName.startsWith("size")) prevData[tIndex].size.text = cell.text;
                    else if (fieldName.startsWith("color")) prevData[tIndex].color.text = cell.text;
                }
            }
        });
        return [...prevData];
    };

    const applyChangesToData = (changes: CellChange[], prevData: BagWallet[]): BagWallet[] => {
        const updated = applyNewValue(changes, prevData);
        if (changes.filter((changes) => changes.type === "text").length !== 0) {
            setCellChanges([...cellChanges.slice(0, cellChangesIndex + 1), changes]);
            setCellChangesIndex(cellChangesIndex + 1);
        }
        return updated;
    };

    const undoChanges = (changes: CellChange[], prevData: BagWallet[]): BagWallet[] => {
        const updated = applyNewValue(changes, prevData, true);
        setCellChangesIndex(cellChangesIndex - 1);
        return updated;
    };

    const redoChanges = (changes: CellChange[], prevData: BagWallet[]): BagWallet[] => {
        const updated = applyNewValue(changes, prevData);
        setCellChangesIndex(cellChangesIndex + 1);
        return updated;
    };

    const handleChanges = (changes: CellChange[]) => {
        setBagWallet((prevData) => applyChangesToData(changes, prevData));
    };

    const handleUndoChanges = () => {
        if (cellChangesIndex >= 0) setBagWallet((prevData) => undoChanges(cellChanges[cellChangesIndex], prevData));
    };

    const handleRedoChanges = () => {
        if (cellChangesIndex + 1 <= cellChanges.length - 1) setBagWallet((prevData) => redoChanges(cellChanges[cellChangesIndex + 1], prevData));
    };

    const handleContextMenu = (selectedRowIds: Id[], selectedColIds: Id[], selectionMode: SelectionMode, menuOptions: MenuOption[]): MenuOption[] => {
        if (selectionMode === "row") {
            menuOptions = [
                // ...menuOptions,
                {
                    id: "removeRow",
                    label: "行削材",
                    handler: () => {
                        setBagWallet((prevData) => {
                            return [...prevData.filter((data, idx) => !selectedRowIds.includes(idx))];
                        });
                    },
                },
            ];
        } else menuOptions = [];
        return menuOptions;
    };

    const handleReset = () => {
        setBagWallet(
            bagWallet.map((t) => {
                t.freeEntry.checked = false;
                t.big.checked = false;
                t.mediumBag.checked = false;
                t.mediumWallet.checked = false;
                t.functionBag.checked = false;
                t.functionWallet.checked = false;
                t.designOrShape.checked = false;
                t.material.checked = false;
                t.image.checked = false;
                t.pattern.checked = false;
                t.ageOrSex.checked = false;
                t.place.checked = false;
                t.others.checked = false;
                t.seasonOrEvent.checked = false;
                t.size.checked = false;
                t.color.checked = false;
                return t;
            })
        );
    };

    const handleUpload = () => {
        setIsSaving(true);
        axios
            .post("/bag-wallet", {
                data: [
                    ...bagWallet.map((t) => [
                        t.freeEntry.text,
                        t.big.text,
                        t.mediumBag.text,
                        t.mediumWallet.text,
                        t.functionBag.text,
                        t.functionWallet.text,
                        t.designOrShape.text,
                        t.material.text,
                        t.image.text,
                        t.pattern.text,
                        t.ageOrSex.text,
                        t.place.text,
                        t.others.text,
                        t.seasonOrEvent.text,
                        t.size.text,
                        t.color.text,
                    ]),
                ],
            })
            .then((response) => {
                if (response.data.saved) console.log("保存した");
                else console.warn("保存 失敗しま");
                setIsSaving(false);
            })
            .catch(() => {
                console.error("おっと");
                setIsSaving(false);
            });
    };

    const handleColumnResize = (ci: Id, width: number) => {
        setColumns((prevColumns) => {
            const columnIndex = prevColumns.findIndex((el) => el.columnId === ci);
            const resizedColumn = prevColumns[columnIndex];
            const updatedColumn = { ...resizedColumn, width };
            prevColumns[columnIndex] = updatedColumn;
            return [...prevColumns];
        });
    };

    const fetchBagWallet = () => {
        axios
            .get("/bag-wallet")
            .then((response) => {
                setBagWallet(getBagWallet(response.data.bagWallet));
                setLoadingStatus(LoadingStatus.LOADED);
            })
            .catch(() => {
                setLoadingStatus(LoadingStatus.DATA_NOT_RETRIEVED);
            });
    };

    const isMacOs = () => window.navigator.userAgent.indexOf("Mac") !== -1;

    useEffect(() => {
        fetchBagWallet();
    }, []);

    useEffect(() => {
        let freeEntry_textToCopy = "";
        let big_textToCopy = "";
        let mediumBag_textToCopy = "";
        let mediumWallet_textToCopy = "";
        let functionBag_textToCopy = "";
        let functionWallet_textToCopy = "";
        let designOrShape_textToCopy = "";
        let material_textToCopy = "";
        let image_textToCopy = "";
        let pattern_textToCopy = "";
        let ageOrSex_textToCopy = "";
        let place_textToCopy = "";
        let others_textToCopy = "";
        let seasonOrEvent_textToCopy = "";
        let size_textToCopy = "";
        let color_textToCopy = "";
        bagWallet.forEach((t) => {
            if (t.freeEntry.checked) freeEntry_textToCopy += t.freeEntry.text + " ";
            if (t.big.checked) big_textToCopy += t.big.text + " ";
            if (t.mediumBag.checked) mediumBag_textToCopy += t.mediumBag.text + " ";
            if (t.mediumWallet.checked) mediumWallet_textToCopy += t.mediumWallet.text + " ";
            if (t.functionBag.checked) functionBag_textToCopy += t.functionBag.text + " ";
            if (t.functionWallet.checked) functionWallet_textToCopy += t.functionWallet.text + " ";
            if (t.designOrShape.checked) designOrShape_textToCopy += t.designOrShape.text + " ";
            if (t.material.checked) material_textToCopy += t.material.text + " ";
            if (t.image.checked) image_textToCopy += t.image.text + " ";
            if (t.pattern.checked) pattern_textToCopy += t.pattern.text + " ";
            if (t.ageOrSex.checked) ageOrSex_textToCopy += t.ageOrSex.text + " ";
            if (t.place.checked) place_textToCopy += t.place.text + " ";
            if (t.others.checked) others_textToCopy += t.others.text + " ";
            if (t.seasonOrEvent.checked) seasonOrEvent_textToCopy += t.seasonOrEvent.text + " ";
            if (t.size.checked) size_textToCopy += t.size.text + " ";
            if (t.color.checked) color_textToCopy += t.color.text;
        });
        let textToCopy = "";
        if (freeEntry_textToCopy.trimEnd() !== "") textToCopy += freeEntry_textToCopy + " ";
        if (big_textToCopy.trimEnd() !== "") textToCopy += big_textToCopy + " ";
        if (mediumBag_textToCopy.trimEnd() !== "") textToCopy += mediumBag_textToCopy + " ";
        if (mediumWallet_textToCopy.trimEnd() !== "") textToCopy += mediumWallet_textToCopy + " ";
        if (functionBag_textToCopy.trimEnd() !== "") textToCopy += functionBag_textToCopy + " ";
        if (functionWallet_textToCopy.trimEnd() !== "") textToCopy += functionWallet_textToCopy + " ";
        if (designOrShape_textToCopy.trimEnd() !== "") textToCopy += designOrShape_textToCopy + " ";
        if (material_textToCopy.trimEnd() !== "") textToCopy += material_textToCopy + " ";
        if (image_textToCopy.trimEnd() !== "") textToCopy += image_textToCopy + " ";
        if (pattern_textToCopy.trimEnd() !== "") textToCopy += pattern_textToCopy + " ";
        if (ageOrSex_textToCopy.trimEnd() !== "") textToCopy += ageOrSex_textToCopy + " ";
        if (place_textToCopy.trimEnd() !== "") textToCopy += place_textToCopy + " ";
        if (others_textToCopy.trimEnd() !== "") textToCopy += others_textToCopy + " ";
        if (seasonOrEvent_textToCopy.trimEnd() !== "") textToCopy += seasonOrEvent_textToCopy + " ";
        if (size_textToCopy.trimEnd() !== "") textToCopy += size_textToCopy + " ";
        if (color_textToCopy.trimEnd() !== "") textToCopy += color_textToCopy;
        setTextToCopy(textToCopy.trimEnd());
    }, [bagWallet]);

    return (
        <>
            {loadingStatus === LoadingStatus.LOADING && <CircularProgress />}
            {loadingStatus === LoadingStatus.DATA_NOT_RETRIEVED && <div>おっと...</div>}
            {loadingStatus === LoadingStatus.LOADED && (
                <>
                    <div>
                        コピーしてBASEに貼り付け→ {textToCopy} <CopyToClipboardButton textToCopy={textToCopy} disabled={textToCopy === ""} />
                    </div>
                    <div>
                        <Button variant="outlined" size="small" sx={{ mb: 1 }} startIcon={<RefreshRounded />} onClick={handleReset}>
                            リセット
                        </Button>
                        <IconButton sx={{ mb: 1 }} onClick={handleUpload} disabled={isSaving}>
                            <Backup color={!isSaving ? "primary" : "inherit"} />
                        </IconButton>
                        <IconButton sx={{ mb: 1 }} onClick={fetchBagWallet}>
                            <ReplayRounded color="primary" />
                        </IconButton>
                    </div>

                    <div
                        onKeyDown={(e) => {
                            if ((!isMacOs() && e.ctrlKey) || e.metaKey) {
                                switch (e.key) {
                                    case "z":
                                        handleUndoChanges();
                                        return;
                                    case "y":
                                        handleRedoChanges();
                                        return;
                                }
                            }
                        }}
                    >
                        <ReactGrid
                            rows={getRows(bagWallet)}
                            columns={columns}
                            stickyTopRows={1}
                            onCellsChanged={handleChanges}
                            onContextMenu={handleContextMenu}
                            onColumnResized={handleColumnResize}
                            enableRowSelection
                            enableRangeSelection
                        />
                    </div>
                </>
            )}
        </>
    );
};

export default BagWalletPanel;
