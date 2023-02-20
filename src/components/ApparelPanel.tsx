import React, { useEffect, useState } from "react";
import axios from "axios";
import { ReactGrid, Column, Row, CellChange, SelectionMode, Id, MenuOption } from "@silevis/reactgrid";
import { Button, CircularProgress, IconButton } from "@mui/material";
import { Backup, RefreshRounded, ReplayRounded } from "@mui/icons-material";
import "@silevis/reactgrid/styles.css";

import CopyToClipboardButton from "./common/dynamic-table/components/CopyToClipboardButton";
import { Apparel } from "../react-app-env.d";
import { LoadingStatus } from "./common/LoadingStatus";

const getApparel = (apparel: any[]): Apparel[] => {
    let result: Apparel[] = [];
    for (let i = 0; i < apparel.length; i++) {
        result.push({
            freeEntry: { checked: false, text: apparel[i].freeEntry },
            big: { checked: false, text: apparel[i].big },
            medium: { checked: false, text: apparel[i].medium },
            small: { checked: false, text: apparel[i].small },
            height: { checked: false, text: apparel[i].height },
            sleeve: { checked: false, text: apparel[i].sleeve },
            neck: { checked: false, text: apparel[i].neck },
            shape: { checked: false, text: apparel[i].shape },
            design: { checked: false, text: apparel[i].design },
            material: { checked: false, text: apparel[i].material },
            set: { checked: false, text: apparel[i].set },
            image: { checked: false, text: apparel[i].image },
            pattern: { checked: false, text: apparel[i].pattern },
            seasonOrEvent: { checked: false, text: apparel[i].seasonOrEvent },
            ageOrSex: { checked: false, text: apparel[i].ageOrSex },
            place: { checked: false, text: apparel[i].place },
            others: { checked: false, text: apparel[i].others },
            size: { checked: false, text: apparel[i].size },
            color: { checked: false, text: apparel[i].color },
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
    { columnId: "small_checked", width: 40 },
    { columnId: "small_text", width: 70, resizable: true },
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
    { columnId: "material_checked", width: 40 },
    { columnId: "material_text", width: 70, resizable: true },
    { columnId: "set_checked", width: 40 },
    { columnId: "set_text", width: 70, resizable: true },
    { columnId: "image_checked", width: 40 },
    { columnId: "image_text", width: 70, resizable: true },
    { columnId: "pattern_checked", width: 40 },
    { columnId: "pattern_text", width: 70, resizable: true },
    { columnId: "seasonOrEvent_checked", width: 40 },
    { columnId: "seasonOrEvent_text", width: 70, resizable: true },
    { columnId: "ageOrSex_checked", width: 40 },
    { columnId: "ageOrSex_text", width: 70, resizable: true },
    { columnId: "place_checked", width: 40 },
    { columnId: "place_text", width: 70, resizable: true },
    { columnId: "others_checked", width: 40 },
    { columnId: "others_text", width: 70, resizable: true },
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
        { type: "header", text: "小" },
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
        { type: "header", text: "セット" },
        { type: "header", text: "☑" },
        { type: "header", text: "イメージ" },
        { type: "header", text: "☑" },
        { type: "header", text: "柄" },
        { type: "header", text: "☑" },
        { type: "header", text: "季節・行事" },
        { type: "header", text: "☑" },
        { type: "header", text: "年代・性別" },
        { type: "header", text: "☑" },
        { type: "header", text: "場所" },
        { type: "header", text: "☑" },
        { type: "header", text: "その他" },
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
        { type: "text", text: "" },
    ],
};

const getRows = (data: Apparel[]): Row[] => [
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
            { type: "checkbox", checked: t.small.checked },
            { type: "text", text: t.small.text },
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
            { type: "checkbox", checked: t.material.checked },
            { type: "text", text: t.material.text },
            { type: "checkbox", checked: t.set.checked },
            { type: "text", text: t.set.text },
            { type: "checkbox", checked: t.image.checked },
            { type: "text", text: t.image.text },
            { type: "checkbox", checked: t.pattern.checked },
            { type: "text", text: t.pattern.text },
            { type: "checkbox", checked: t.seasonOrEvent.checked },
            { type: "text", text: t.seasonOrEvent.text },
            { type: "checkbox", checked: t.ageOrSex.checked },
            { type: "text", text: t.ageOrSex.text },
            { type: "checkbox", checked: t.place.checked },
            { type: "text", text: t.place.text },
            { type: "checkbox", checked: t.others.checked },
            { type: "text", text: t.others.text },
            { type: "checkbox", checked: t.size.checked },
            { type: "text", text: t.size.text },
            { type: "checkbox", checked: t.color.checked },
            { type: "text", text: t.color.text },
        ],
    })),
    footerRow,
];

const ApparelPanel = () => {
    const [loadingStatus, setLoadingStatus] = useState<LoadingStatus>(LoadingStatus.LOADING);
    const [isSaving, setIsSaving] = useState(false);
    const [columns, setColumns] = useState<Column[]>(getColumns());
    const [textToCopy, setTextToCopy] = useState("");
    const [apparel, setApparel] = useState<Apparel[]>([]);
    const [cellChangesIndex, setCellChangesIndex] = useState(() => -1);
    const [cellChanges, setCellChanges] = useState<CellChange[][]>(() => []);

    const applyNewValue = (changes: CellChange[], prevData: Apparel[], usePrevValue: boolean = false): Apparel[] => {
        changes.forEach((change) => {
            const fieldName = change.columnId as string;
            const cell = usePrevValue ? change.previousCell : change.newCell;

            if (change.rowId === "footer" && cell.type === "text") {
                let newRow: Apparel = {
                    freeEntry: { checked: false, text: "" },
                    big: { checked: false, text: "" },
                    medium: { checked: false, text: "" },
                    small: { checked: false, text: "" },
                    height: { checked: false, text: "" },
                    sleeve: { checked: false, text: "" },
                    neck: { checked: false, text: "" },
                    shape: { checked: false, text: "" },
                    design: { checked: false, text: "" },
                    material: { checked: false, text: "" },
                    set: { checked: false, text: "" },
                    image: { checked: false, text: "" },
                    pattern: { checked: false, text: "" },
                    seasonOrEvent: { checked: false, text: "" },
                    ageOrSex: { checked: false, text: "" },
                    place: { checked: false, text: "" },
                    others: { checked: false, text: "" },
                    size: { checked: false, text: "" },
                    color: { checked: false, text: "" },
                };
                if (fieldName.startsWith("freeEntry") && cell.text.trim() !== "") newRow.freeEntry.text = cell.text;
                else if (fieldName.startsWith("big") && cell.text.trim() !== "") newRow.big.text = cell.text;
                else if (fieldName.startsWith("medium") && cell.text.trim() !== "") newRow.medium.text = cell.text;
                else if (fieldName.startsWith("small") && cell.text.trim() !== "") newRow.small.text = cell.text;
                else if (fieldName.startsWith("height") && cell.text.trim() !== "") newRow.height.text = cell.text;
                else if (fieldName.startsWith("sleeve") && cell.text.trim() !== "") newRow.sleeve.text = cell.text;
                else if (fieldName.startsWith("neck") && cell.text.trim() !== "") newRow.neck.text = cell.text;
                else if (fieldName.startsWith("shape") && cell.text.trim() !== "") newRow.shape.text = cell.text;
                else if (fieldName.startsWith("design") && cell.text.trim() !== "") newRow.design.text = cell.text;
                else if (fieldName.startsWith("material") && cell.text.trim() !== "") newRow.material.text = cell.text;
                else if (fieldName.startsWith("set") && cell.text.trim() !== "") newRow.set.text = cell.text;
                else if (fieldName.startsWith("image") && cell.text.trim() !== "") newRow.image.text = cell.text;
                else if (fieldName.startsWith("pattern") && cell.text.trim() !== "") newRow.pattern.text = cell.text;
                else if (fieldName.startsWith("seasonOrEvent") && cell.text.trim() !== "") newRow.seasonOrEvent.text = cell.text;
                else if (fieldName.startsWith("ageOrSex") && cell.text.trim() !== "") newRow.ageOrSex.text = cell.text;
                else if (fieldName.startsWith("place") && cell.text.trim() !== "") newRow.place.text = cell.text;
                else if (fieldName.startsWith("others") && cell.text.trim() !== "") newRow.others.text = cell.text;
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
                    else if (fieldName.startsWith("small")) prevData[tIndex].small.checked = cell.checked;
                    else if (fieldName.startsWith("height")) prevData[tIndex].height.checked = cell.checked;
                    else if (fieldName.startsWith("sleeve")) prevData[tIndex].sleeve.checked = cell.checked;
                    else if (fieldName.startsWith("neck")) prevData[tIndex].neck.checked = cell.checked;
                    else if (fieldName.startsWith("shape")) prevData[tIndex].shape.checked = cell.checked;
                    else if (fieldName.startsWith("design")) prevData[tIndex].design.checked = cell.checked;
                    else if (fieldName.startsWith("material")) prevData[tIndex].material.checked = cell.checked;
                    else if (fieldName.startsWith("set")) prevData[tIndex].set.checked = cell.checked;
                    else if (fieldName.startsWith("image")) prevData[tIndex].image.checked = cell.checked;
                    else if (fieldName.startsWith("pattern")) prevData[tIndex].pattern.checked = cell.checked;
                    else if (fieldName.startsWith("seasonOrEvent")) prevData[tIndex].seasonOrEvent.checked = cell.checked;
                    else if (fieldName.startsWith("ageOrSex")) prevData[tIndex].ageOrSex.checked = cell.checked;
                    else if (fieldName.startsWith("place")) prevData[tIndex].place.checked = cell.checked;
                    else if (fieldName.startsWith("others")) prevData[tIndex].others.checked = cell.checked;
                    else if (fieldName.startsWith("size")) prevData[tIndex].size.checked = cell.checked;
                    else if (fieldName.startsWith("color")) prevData[tIndex].color.checked = cell.checked;
                } else if (cell.type === "text") {
                    if (fieldName.startsWith("freeEntry")) prevData[tIndex].freeEntry.text = cell.text;
                    else if (fieldName.startsWith("big")) prevData[tIndex].big.text = cell.text;
                    else if (fieldName.startsWith("medium")) prevData[tIndex].medium.text = cell.text;
                    else if (fieldName.startsWith("small")) prevData[tIndex].small.text = cell.text;
                    else if (fieldName.startsWith("height")) prevData[tIndex].height.text = cell.text;
                    else if (fieldName.startsWith("sleeve")) prevData[tIndex].sleeve.text = cell.text;
                    else if (fieldName.startsWith("neck")) prevData[tIndex].neck.text = cell.text;
                    else if (fieldName.startsWith("shape")) prevData[tIndex].shape.text = cell.text;
                    else if (fieldName.startsWith("design")) prevData[tIndex].design.text = cell.text;
                    else if (fieldName.startsWith("material")) prevData[tIndex].material.text = cell.text;
                    else if (fieldName.startsWith("set")) prevData[tIndex].set.text = cell.text;
                    else if (fieldName.startsWith("image")) prevData[tIndex].image.text = cell.text;
                    else if (fieldName.startsWith("pattern")) prevData[tIndex].pattern.text = cell.text;
                    else if (fieldName.startsWith("seasonOrEvent")) prevData[tIndex].seasonOrEvent.text = cell.text;
                    else if (fieldName.startsWith("ageOrSex")) prevData[tIndex].ageOrSex.text = cell.text;
                    else if (fieldName.startsWith("place")) prevData[tIndex].place.text = cell.text;
                    else if (fieldName.startsWith("others")) prevData[tIndex].others.text = cell.text;
                    else if (fieldName.startsWith("size")) prevData[tIndex].size.text = cell.text;
                    else if (fieldName.startsWith("color")) prevData[tIndex].color.text = cell.text;
                }
            }
        });
        return [...prevData];
    };

    const applyChangesToData = (changes: CellChange[], prevData: Apparel[]): Apparel[] => {
        const updated = applyNewValue(changes, prevData);
        if (changes.filter((changes) => changes.type === "text").length !== 0) {
            setCellChanges([...cellChanges.slice(0, cellChangesIndex + 1), changes]);
            setCellChangesIndex(cellChangesIndex + 1);
        }
        return updated;
    };

    const undoChanges = (changes: CellChange[], prevData: Apparel[]): Apparel[] => {
        const updated = applyNewValue(changes, prevData, true);
        setCellChangesIndex(cellChangesIndex - 1);
        return updated;
    };

    const redoChanges = (changes: CellChange[], prevData: Apparel[]): Apparel[] => {
        const updated = applyNewValue(changes, prevData);
        setCellChangesIndex(cellChangesIndex + 1);
        return updated;
    };

    const handleChanges = (changes: CellChange[]) => {
        setApparel((prevData) => applyChangesToData(changes, prevData));
    };

    const handleUndoChanges = () => {
        if (cellChangesIndex >= 0) setApparel((prevData) => undoChanges(cellChanges[cellChangesIndex], prevData));
    };

    const handleRedoChanges = () => {
        if (cellChangesIndex + 1 <= cellChanges.length - 1) setApparel((prevData) => redoChanges(cellChanges[cellChangesIndex + 1], prevData));
    };

    const handleContextMenu = (selectedRowIds: Id[], selectedColIds: Id[], selectionMode: SelectionMode, menuOptions: MenuOption[]): MenuOption[] => {
        if (selectionMode === "row") {
            menuOptions = [
                // ...menuOptions,
                {
                    id: "removeRow",
                    label: "行削材",
                    handler: () => {
                        setApparel((prevData) => {
                            return [...prevData.filter((data, idx) => !selectedRowIds.includes(idx))];
                        });
                    },
                },
            ];
        } else menuOptions = [];
        return menuOptions;
    };

    const handleReset = () => {
        setApparel(
            apparel.map((t) => {
                t.freeEntry.checked = false;
                t.big.checked = false;
                t.medium.checked = false;
                t.small.checked = false;
                t.height.checked = false;
                t.sleeve.checked = false;
                t.neck.checked = false;
                t.shape.checked = false;
                t.design.checked = false;
                t.material.checked = false;
                t.set.checked = false;
                t.image.checked = false;
                t.pattern.checked = false;
                t.seasonOrEvent.checked = false;
                t.ageOrSex.checked = false;
                t.place.checked = false;
                t.others.checked = false;
                t.size.checked = false;
                t.color.checked = false;
                return t;
            })
        );
    };

    const handleUpload = () => {
        setIsSaving(true);
        axios
            .post("/apparel", {
                data: [
                    ...apparel.map((t) => [
                        t.freeEntry.text,
                        t.big.text,
                        t.medium.text,
                        t.small.text,
                        t.height.text,
                        t.sleeve.text,
                        t.neck.text,
                        t.shape.text,
                        t.design.text,
                        t.material.text,
                        t.set.text,
                        t.image.text,
                        t.pattern.text,
                        t.seasonOrEvent.text,
                        t.ageOrSex.text,
                        t.place.text,
                        t.others.text,
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

    const fetchApparel = () => {
        axios
            .get("/apparel")
            .then((response) => {
                setApparel(getApparel(response.data.apparel));
                setLoadingStatus(LoadingStatus.LOADED);
            })
            .catch(() => {
                setLoadingStatus(LoadingStatus.DATA_NOT_RETRIEVED);
            });
    };

    const isMacOs = () => window.navigator.userAgent.indexOf("Mac") !== -1;

    useEffect(() => {
        fetchApparel();
    }, []);

    useEffect(() => {
        let freeEntry_textToCopy = "";
        let big_textToCopy = "";
        let medium_textToCopy = "";
        let small_textToCopy = "";
        let height_textToCopy = "";
        let sleeve_textToCopy = "";
        let neck_textToCopy = "";
        let shape_textToCopy = "";
        let design_textToCopy = "";
        let material_textToCopy = "";
        let set_textToCopy = "";
        let image_textToCopy = "";
        let pattern_textToCopy = "";
        let seasonOrEvent_textToCopy = "";
        let ageOrSex_textToCopy = "";
        let place_textToCopy = "";
        let others_textToCopy = "";
        let size_textToCopy = "";
        let color_textToCopy = "";
        apparel.forEach((t) => {
            if (t.freeEntry.checked) freeEntry_textToCopy += t.freeEntry.text + " ";
            if (t.big.checked) big_textToCopy += t.big.text + " ";
            if (t.medium.checked) medium_textToCopy += t.medium.text + " ";
            if (t.small.checked) small_textToCopy += t.small.text + " ";
            if (t.height.checked) height_textToCopy += t.height.text + " ";
            if (t.sleeve.checked) sleeve_textToCopy += t.sleeve.text + " ";
            if (t.neck.checked) neck_textToCopy += t.neck.text + " ";
            if (t.shape.checked) shape_textToCopy += t.shape.text + " ";
            if (t.design.checked) design_textToCopy += t.design.text + " ";
            if (t.material.checked) material_textToCopy += t.material.text + " ";
            if (t.set.checked) set_textToCopy += t.set.text + " ";
            if (t.image.checked) image_textToCopy += t.image.text + " ";
            if (t.pattern.checked) pattern_textToCopy += t.pattern.text + " ";
            if (t.seasonOrEvent.checked) seasonOrEvent_textToCopy += t.seasonOrEvent.text + " ";
            if (t.ageOrSex.checked) ageOrSex_textToCopy += t.ageOrSex.text + " ";
            if (t.place.checked) place_textToCopy += t.place.text + " ";
            if (t.others.checked) others_textToCopy += t.others.text + " ";
            if (t.size.checked) size_textToCopy += t.size.text + " ";
            if (t.color.checked) color_textToCopy += t.color.text;
        });
        let textToCopy = "";
        if (freeEntry_textToCopy.trimEnd() !== "") textToCopy += freeEntry_textToCopy + " ";
        if (big_textToCopy.trimEnd() !== "") textToCopy += big_textToCopy + " ";
        if (medium_textToCopy.trimEnd() !== "") textToCopy += medium_textToCopy + " ";
        if (small_textToCopy.trimEnd() !== "") textToCopy += small_textToCopy + " ";
        if (height_textToCopy.trimEnd() !== "") textToCopy += height_textToCopy + " ";
        if (sleeve_textToCopy.trimEnd() !== "") textToCopy += sleeve_textToCopy + " ";
        if (neck_textToCopy.trimEnd() !== "") textToCopy += neck_textToCopy + " ";
        if (shape_textToCopy.trimEnd() !== "") textToCopy += shape_textToCopy + " ";
        if (design_textToCopy.trimEnd() !== "") textToCopy += design_textToCopy + " ";
        if (material_textToCopy.trimEnd() !== "") textToCopy += material_textToCopy + " ";
        if (set_textToCopy.trimEnd() !== "") textToCopy += set_textToCopy + " ";
        if (image_textToCopy.trimEnd() !== "") textToCopy += image_textToCopy + " ";
        if (pattern_textToCopy.trimEnd() !== "") textToCopy += pattern_textToCopy + " ";
        if (seasonOrEvent_textToCopy.trimEnd() !== "") textToCopy += seasonOrEvent_textToCopy + " ";
        if (ageOrSex_textToCopy.trimEnd() !== "") textToCopy += ageOrSex_textToCopy + " ";
        if (place_textToCopy.trimEnd() !== "") textToCopy += place_textToCopy + " ";
        if (others_textToCopy.trimEnd() !== "") textToCopy += others_textToCopy + " ";
        if (size_textToCopy.trimEnd() !== "") textToCopy += size_textToCopy + " ";
        if (color_textToCopy.trimEnd() !== "") textToCopy += color_textToCopy;
        setTextToCopy(textToCopy.trimEnd());
    }, [apparel]);

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
                        <IconButton sx={{ mb: 1 }} onClick={fetchApparel}>
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
                            rows={getRows(apparel)}
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

export default ApparelPanel;
