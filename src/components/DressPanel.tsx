import React, { useEffect, useState } from "react";
import axios from "axios";
import { ReactGrid, Column, Row, CellChange, SelectionMode, Id, MenuOption } from "@silevis/reactgrid";
import { Button, CircularProgress, IconButton } from "@mui/material";
import { Backup, RefreshRounded, ReplayRounded } from "@mui/icons-material";
import "@silevis/reactgrid/styles.css";

import CopyToClipboardButton from "./common/dynamic-table/components/CopyToClipboardButton";
import { Dress } from "../react-app-env.d";
import { LoadingStatus } from "./common/LoadingStatus";

const getDress = (dress: any[]): Dress[] => {
    let result: Dress[] = [];
    for (let i = 0; i < dress.length; i++) {
        result.push({
            freeEntry: { checked: false, text: dress[i].freeEntry },
            big: { checked: false, text: dress[i].big },
            medium: { checked: false, text: dress[i].medium },
            height: { checked: false, text: dress[i].height },
            sleeve: { checked: false, text: dress[i].sleeve },
            neck: { checked: false, text: dress[i].neck },
            shape: { checked: false, text: dress[i].shape },
            design: { checked: false, text: dress[i].design },
            material1: { checked: false, text: dress[i].material1 },
            material2: { checked: false, text: dress[i].material2 },
            image: { checked: false, text: dress[i].image },
            pattern1: { checked: false, text: dress[i].pattern1 },
            pattern2: { checked: false, text: dress[i].pattern2 },
            ageOrSex: { checked: false, text: dress[i].ageOrSex },
            place: { checked: false, text: dress[i].place },
            others: { checked: false, text: dress[i].others },
            seasonOrEvent: { checked: false, text: dress[i].seasonOrEvent },
            size: { checked: false, text: dress[i].size },
            color: { checked: false, text: dress[i].color },
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
    { columnId: "medium_checked", width: 40 },
    { columnId: "medium_text", width: 70, resizable: true },
    { columnId: "height_checked", width: 40 },
    { columnId: "height_text", width: 70, resizable: true },
    { columnId: "sleeve_checked", width: 40 },
    { columnId: "sleeve_text", width: 70, resizable: true },
    { columnId: "neck_checked", width: 40 },
    { columnId: "neck_text", width: 70, resizable: true },
    { columnId: "shape_checked", width: 40 },
    { columnId: "shape_text", width: 70, resizable: true },
    { columnId: "design_checked", width: 40 },
    { columnId: "design_text", width: 70, resizable: true },
    { columnId: "material1_checked", width: 40 },
    { columnId: "material1_text", width: 70, resizable: true },
    { columnId: "material2_checked", width: 40 },
    { columnId: "material2_text", width: 70, resizable: true },
    { columnId: "image_checked", width: 40 },
    { columnId: "image_text", width: 70, resizable: true },
    { columnId: "pattern1_checked", width: 40 },
    { columnId: "pattern1_text", width: 70, resizable: true },
    { columnId: "pattern2_checked", width: 40 },
    { columnId: "pattern2_text", width: 70, resizable: true },
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
        { type: "header", text: "中" },
        { type: "header", text: "☑" },
        { type: "header", text: "丈" },
        { type: "header", text: "☑" },
        { type: "header", text: "袖" },
        { type: "header", text: "☑" },
        { type: "header", text: "首回り" },
        { type: "header", text: "☑" },
        { type: "header", text: "形" },
        { type: "header", text: "☑" },
        { type: "header", text: "デザイン" },
        { type: "header", text: "☑" },
        { type: "header", text: "素材" },
        { type: "header", text: "☑" },
        { type: "header", text: "素材" },
        { type: "header", text: "☑" },
        { type: "header", text: "イメージ" },
        { type: "header", text: "☑" },
        { type: "header", text: "柄" },
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
        { type: "text", text: "", nonEditable: true },
        { type: "text", text: "" },
        { type: "text", text: "", nonEditable: true },
        { type: "text", text: " " },
        { type: "text", text: "", nonEditable: true },
        { type: "text", text: " " },
    ],
};

const getRows = (data: Dress[]): Row[] => [
    headerRow,
    ...data.map<Row>((t, idx) => ({
        rowId: idx,
        cells: [
            { type: "text", text: "", nonEditable: true },
            { type: "checkbox", checked: t.freeEntry.checked },
            { type: "text", text: t.freeEntry.text },
            { type: "checkbox", checked: t.big.checked },
            { type: "text", text: t.big.text },
            { type: "checkbox", checked: t.medium.checked },
            { type: "text", text: t.medium.text },
            { type: "checkbox", checked: t.height.checked },
            { type: "text", text: t.height.text },
            { type: "checkbox", checked: t.sleeve.checked },
            { type: "text", text: t.sleeve.text },
            { type: "checkbox", checked: t.neck.checked },
            { type: "text", text: t.neck.text },
            { type: "checkbox", checked: t.shape.checked },
            { type: "text", text: t.shape.text },
            { type: "checkbox", checked: t.design.checked },
            { type: "text", text: t.design.text },
            { type: "checkbox", checked: t.material1.checked },
            { type: "text", text: t.material1.text },
            { type: "checkbox", checked: t.material2.checked },
            { type: "text", text: t.material2.text },
            { type: "checkbox", checked: t.image.checked },
            { type: "text", text: t.image.text },
            { type: "checkbox", checked: t.pattern1.checked },
            { type: "text", text: t.pattern1.text },
            { type: "checkbox", checked: t.pattern2.checked },
            { type: "text", text: t.pattern2.text },
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

const DressPanel = () => {
    const [loadingStatus, setLoadingStatus] = useState<LoadingStatus>(LoadingStatus.LOADING);
    const [isSaving, setIsSaving] = useState(false);
    const [columns, setColumns] = useState<Column[]>(getColumns());
    const [textToCopy, setTextToCopy] = useState("");
    const [dress, setDress] = useState<Dress[]>([]);
    const [cellChangesIndex, setCellChangesIndex] = useState(() => -1);
    const [cellChanges, setCellChanges] = useState<CellChange[][]>(() => []);

    const applyNewValue = (changes: CellChange[], prevData: Dress[], usePrevValue: boolean = false): Dress[] => {
        changes.forEach((change) => {
            const fieldName = change.columnId as string;
            const cell = usePrevValue ? change.previousCell : change.newCell;

            if (change.rowId === "footer" && cell.type === "text") {
                let newRow: Dress = {
                    freeEntry: { checked: false, text: "" },
                    big: { checked: false, text: "" },
                    medium: { checked: false, text: "" },
                    height: { checked: false, text: "" },
                    sleeve: { checked: false, text: "" },
                    neck: { checked: false, text: "" },
                    shape: { checked: false, text: "" },
                    design: { checked: false, text: "" },
                    material1: { checked: false, text: "" },
                    material2: { checked: false, text: "" },
                    image: { checked: false, text: "" },
                    pattern1: { checked: false, text: "" },
                    pattern2: { checked: false, text: "" },
                    ageOrSex: { checked: false, text: "" },
                    place: { checked: false, text: "" },
                    others: { checked: false, text: "" },
                    seasonOrEvent: { checked: false, text: "" },
                    size: { checked: false, text: "" },
                    color: { checked: false, text: "" },
                };
                if (fieldName.startsWith("freeEntry") && cell.text.trim() !== "") newRow.freeEntry.text = cell.text;
                else if (fieldName.startsWith("big") && cell.text.trim() !== "") newRow.big.text = cell.text;
                else if (fieldName.startsWith("medium") && cell.text.trim() !== "") newRow.medium.text = cell.text;
                else if (fieldName.startsWith("height") && cell.text.trim() !== "") newRow.height.text = cell.text;
                else if (fieldName.startsWith("sleeve") && cell.text.trim() !== "") newRow.sleeve.text = cell.text;
                else if (fieldName.startsWith("neck") && cell.text.trim() !== "") newRow.neck.text = cell.text;
                else if (fieldName.startsWith("shape") && cell.text.trim() !== "") newRow.shape.text = cell.text;
                else if (fieldName.startsWith("design") && cell.text.trim() !== "") newRow.design.text = cell.text;
                else if (fieldName.startsWith("material1") && cell.text.trim() !== "") newRow.material1.text = cell.text;
                else if (fieldName.startsWith("material2") && cell.text.trim() !== "") newRow.material2.text = cell.text;
                else if (fieldName.startsWith("image") && cell.text.trim() !== "") newRow.image.text = cell.text;
                else if (fieldName.startsWith("pattern1") && cell.text.trim() !== "") newRow.pattern1.text = cell.text;
                else if (fieldName.startsWith("pattern2") && cell.text.trim() !== "") newRow.pattern2.text = cell.text;
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
                    else if (fieldName.startsWith("medium")) prevData[tIndex].medium.checked = cell.checked;
                    else if (fieldName.startsWith("height")) prevData[tIndex].height.checked = cell.checked;
                    else if (fieldName.startsWith("sleeve")) prevData[tIndex].sleeve.checked = cell.checked;
                    else if (fieldName.startsWith("neck")) prevData[tIndex].neck.checked = cell.checked;
                    else if (fieldName.startsWith("shape")) prevData[tIndex].shape.checked = cell.checked;
                    else if (fieldName.startsWith("design")) prevData[tIndex].design.checked = cell.checked;
                    else if (fieldName.startsWith("material1")) prevData[tIndex].material1.checked = cell.checked;
                    else if (fieldName.startsWith("material2")) prevData[tIndex].material2.checked = cell.checked;
                    else if (fieldName.startsWith("image")) prevData[tIndex].image.checked = cell.checked;
                    else if (fieldName.startsWith("pattern1")) prevData[tIndex].pattern1.checked = cell.checked;
                    else if (fieldName.startsWith("pattern2")) prevData[tIndex].pattern2.checked = cell.checked;
                    else if (fieldName.startsWith("ageOrSex")) prevData[tIndex].ageOrSex.checked = cell.checked;
                    else if (fieldName.startsWith("place")) prevData[tIndex].place.checked = cell.checked;
                    else if (fieldName.startsWith("others")) prevData[tIndex].others.checked = cell.checked;
                    else if (fieldName.startsWith("seasonOrEvent")) prevData[tIndex].seasonOrEvent.checked = cell.checked;
                    else if (fieldName.startsWith("size")) prevData[tIndex].size.checked = cell.checked;
                    else if (fieldName.startsWith("color")) prevData[tIndex].color.checked = cell.checked;
                } else if (cell.type === "text") {
                    if (fieldName.startsWith("freeEntry")) prevData[tIndex].freeEntry.text = cell.text;
                    else if (fieldName.startsWith("big")) prevData[tIndex].big.text = cell.text;
                    else if (fieldName.startsWith("medium")) prevData[tIndex].medium.text = cell.text;
                    else if (fieldName.startsWith("height")) prevData[tIndex].height.text = cell.text;
                    else if (fieldName.startsWith("sleeve")) prevData[tIndex].sleeve.text = cell.text;
                    else if (fieldName.startsWith("neck")) prevData[tIndex].neck.text = cell.text;
                    else if (fieldName.startsWith("shape")) prevData[tIndex].shape.text = cell.text;
                    else if (fieldName.startsWith("design")) prevData[tIndex].design.text = cell.text;
                    else if (fieldName.startsWith("material1")) prevData[tIndex].material1.text = cell.text;
                    else if (fieldName.startsWith("material2")) prevData[tIndex].material2.text = cell.text;
                    else if (fieldName.startsWith("image")) prevData[tIndex].image.text = cell.text;
                    else if (fieldName.startsWith("pattern1")) prevData[tIndex].pattern1.text = cell.text;
                    else if (fieldName.startsWith("pattern2")) prevData[tIndex].pattern2.text = cell.text;
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

    const applyChangesToData = (changes: CellChange[], prevData: Dress[]): Dress[] => {
        const updated = applyNewValue(changes, prevData);
        if (changes.filter((changes) => changes.type === "text").length !== 0) {
            setCellChanges([...cellChanges.slice(0, cellChangesIndex + 1), changes]);
            setCellChangesIndex(cellChangesIndex + 1);
        }
        return updated;
    };

    const undoChanges = (changes: CellChange[], prevData: Dress[]): Dress[] => {
        const updated = applyNewValue(changes, prevData, true);
        setCellChangesIndex(cellChangesIndex - 1);
        return updated;
    };

    const redoChanges = (changes: CellChange[], prevData: Dress[]): Dress[] => {
        const updated = applyNewValue(changes, prevData);
        setCellChangesIndex(cellChangesIndex + 1);
        return updated;
    };

    const handleChanges = (changes: CellChange[]) => {
        setDress((prevData) => applyChangesToData(changes, prevData));
    };

    const handleUndoChanges = () => {
        if (cellChangesIndex >= 0) setDress((prevData) => undoChanges(cellChanges[cellChangesIndex], prevData));
    };

    const handleRedoChanges = () => {
        if (cellChangesIndex + 1 <= cellChanges.length - 1) setDress((prevData) => redoChanges(cellChanges[cellChangesIndex + 1], prevData));
    };

    const handleContextMenu = (selectedRowIds: Id[], selectedColIds: Id[], selectionMode: SelectionMode, menuOptions: MenuOption[]): MenuOption[] => {
        if (selectionMode === "row") {
            menuOptions = [
                // ...menuOptions,
                {
                    id: "removeRow",
                    label: "行削材",
                    handler: () => {
                        setDress((prevData) => {
                            return [...prevData.filter((data, idx) => !selectedRowIds.includes(idx))];
                        });
                    },
                },
            ];
        } else menuOptions = [];
        return menuOptions;
    };

    const handleReset = () => {
        setDress(
            dress.map((t) => {
                t.freeEntry.checked = false;
                t.big.checked = false;
                t.medium.checked = false;
                t.height.checked = false;
                t.sleeve.checked = false;
                t.neck.checked = false;
                t.shape.checked = false;
                t.design.checked = false;
                t.material1.checked = false;
                t.material2.checked = false;
                t.image.checked = false;
                t.pattern1.checked = false;
                t.pattern2.checked = false;
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
            .post("/dress", {
                data: [
                    ...dress.map((t) => [
                        t.freeEntry.text,
                        t.big.text,
                        t.medium.text,
                        t.height.text,
                        t.sleeve.text,
                        t.neck.text,
                        t.shape.text,
                        t.design.text,
                        t.material1.text,
                        t.material2.text,
                        t.image.text,
                        t.pattern1.text,
                        t.pattern2.text,
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

    const fetchDress = () => {
        axios
            .get("/dress")
            .then((response) => {
                setDress(getDress(response.data.dress));
                setLoadingStatus(LoadingStatus.LOADED);
            })
            .catch(() => {
                setLoadingStatus(LoadingStatus.DATA_NOT_RETRIEVED);
            });
    };

    const isMacOs = () => window.navigator.userAgent.indexOf("Mac") !== -1;

    useEffect(() => {
        fetchDress();
    }, []);

    useEffect(() => {
        let freeEntry_textToCopy = "";
        let big_textToCopy = "";
        let medium_textToCopy = "";
        let height_textToCopy = "";
        let sleeve_textToCopy = "";
        let neck_textToCopy = "";
        let shape_textToCopy = "";
        let design_textToCopy = "";
        let material1_textToCopy = "";
        let material2_textToCopy = "";
        let image_textToCopy = "";
        let pattern1_textToCopy = "";
        let pattern2_textToCopy = "";
        let ageOrSex_textToCopy = "";
        let place_textToCopy = "";
        let others_textToCopy = "";
        let seasonOrEvent_textToCopy = "";
        let size_textToCopy = "";
        let color_textToCopy = "";
        dress.forEach((t) => {
            if (t.freeEntry.checked) freeEntry_textToCopy += t.freeEntry.text + " ";
            if (t.big.checked) big_textToCopy += t.big.text + " ";
            if (t.medium.checked) medium_textToCopy += t.medium.text + " ";
            if (t.height.checked) height_textToCopy += t.height.text + " ";
            if (t.sleeve.checked) sleeve_textToCopy += t.sleeve.text + " ";
            if (t.neck.checked) neck_textToCopy += t.neck.text + " ";
            if (t.shape.checked) shape_textToCopy += t.shape.text + " ";
            if (t.design.checked) design_textToCopy += t.design.text + " ";
            if (t.material1.checked) material1_textToCopy += t.material1.text + " ";
            if (t.material2.checked) material2_textToCopy += t.material2.text + " ";
            if (t.image.checked) image_textToCopy += t.image.text + " ";
            if (t.pattern1.checked) pattern1_textToCopy += t.pattern1.text + " ";
            if (t.pattern2.checked) pattern2_textToCopy += t.pattern2.text + " ";
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
        if (medium_textToCopy.trimEnd() !== "") textToCopy += medium_textToCopy + " ";
        if (height_textToCopy.trimEnd() !== "") textToCopy += height_textToCopy + " ";
        if (sleeve_textToCopy.trimEnd() !== "") textToCopy += sleeve_textToCopy + " ";
        if (neck_textToCopy.trimEnd() !== "") textToCopy += neck_textToCopy + " ";
        if (shape_textToCopy.trimEnd() !== "") textToCopy += shape_textToCopy + " ";
        if (design_textToCopy.trimEnd() !== "") textToCopy += design_textToCopy + " ";
        if (material1_textToCopy.trimEnd() !== "") textToCopy += material1_textToCopy + " ";
        if (material2_textToCopy.trimEnd() !== "") textToCopy += material2_textToCopy + " ";
        if (image_textToCopy.trimEnd() !== "") textToCopy += image_textToCopy + " ";
        if (pattern1_textToCopy.trimEnd() !== "") textToCopy += pattern1_textToCopy + " ";
        if (pattern2_textToCopy.trimEnd() !== "") textToCopy += pattern2_textToCopy + " ";
        if (ageOrSex_textToCopy.trimEnd() !== "") textToCopy += ageOrSex_textToCopy + " ";
        if (place_textToCopy.trimEnd() !== "") textToCopy += place_textToCopy + " ";
        if (others_textToCopy.trimEnd() !== "") textToCopy += others_textToCopy + " ";
        if (seasonOrEvent_textToCopy.trimEnd() !== "") textToCopy += seasonOrEvent_textToCopy + " ";
        if (size_textToCopy.trimEnd() !== "") textToCopy += size_textToCopy + " ";
        if (color_textToCopy.trimEnd() !== "") textToCopy += color_textToCopy;
        setTextToCopy(textToCopy.trimEnd());
    }, [dress]);

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
                        <IconButton sx={{ mb: 1 }} onClick={fetchDress}>
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
                            rows={getRows(dress)}
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

export default DressPanel;
