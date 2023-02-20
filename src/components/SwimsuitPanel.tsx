import React, { useEffect, useState } from "react";
import axios from "axios";
import { ReactGrid, Column, Row, CellChange, SelectionMode, Id, MenuOption } from "@silevis/reactgrid";
import { Button, CircularProgress, IconButton } from "@mui/material";
import { Backup, RefreshRounded, ReplayRounded } from "@mui/icons-material";
import "@silevis/reactgrid/styles.css";

import CopyToClipboardButton from "./common/dynamic-table/components/CopyToClipboardButton";
import { Swimsuit } from "../react-app-env.d";
import { LoadingStatus } from "./common/LoadingStatus";

const getSwimsuit = (swimsuit: any[]): Swimsuit[] => {
    let result: Swimsuit[] = [];
    for (let i = 0; i < swimsuit.length; i++) {
        result.push({
            freeEntry: { checked: false, text: swimsuit[i].freeEntry },
            big: { checked: false, text: swimsuit[i].big },
            medium: { checked: false, text: swimsuit[i].medium },
            shape: { checked: false, text: swimsuit[i].shape },
            design: { checked: false, text: swimsuit[i].design },
            set: { checked: false, text: swimsuit[i].set },
            image: { checked: false, text: swimsuit[i].image },
            pattern: { checked: false, text: swimsuit[i].pattern },
            ageOrSex: { checked: false, text: swimsuit[i].ageOrSex },
            others: { checked: false, text: swimsuit[i].others },
            size: { checked: false, text: swimsuit[i].size },
            color: { checked: false, text: swimsuit[i].color },
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
    { columnId: "shape_checked", width: 40 },
    { columnId: "shape_text", width: 70, resizable: true },
    { columnId: "design_checked", width: 40 },
    { columnId: "design_text", width: 70, resizable: true },
    { columnId: "set_checked", width: 40 },
    { columnId: "set_text", width: 70, resizable: true },
    { columnId: "image_checked", width: 40 },
    { columnId: "image_text", width: 70, resizable: true },
    { columnId: "pattern_checked", width: 40 },
    { columnId: "pattern_text", width: 70, resizable: true },
    { columnId: "ageOrSex_checked", width: 40 },
    { columnId: "ageOrSex_text", width: 70, resizable: true },
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
        { type: "header", text: "形" },
        { type: "header", text: "☑" },
        { type: "header", text: "デザイン" },
        { type: "header", text: "☑" },
        { type: "header", text: "セット" },
        { type: "header", text: "☑" },
        { type: "header", text: "イメージ" },
        { type: "header", text: "☑" },
        { type: "header", text: "柄" },
        { type: "header", text: "☑" },
        { type: "header", text: "年代・性別" },
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
    ],
};

const getRows = (data: Swimsuit[]): Row[] => [
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
            { type: "checkbox", checked: t.shape.checked },
            { type: "text", text: t.shape.text },
            { type: "checkbox", checked: t.design.checked },
            { type: "text", text: t.design.text },
            { type: "checkbox", checked: t.set.checked },
            { type: "text", text: t.set.text },
            { type: "checkbox", checked: t.image.checked },
            { type: "text", text: t.image.text },
            { type: "checkbox", checked: t.pattern.checked },
            { type: "text", text: t.pattern.text },
            { type: "checkbox", checked: t.ageOrSex.checked },
            { type: "text", text: t.ageOrSex.text },
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

const SwimsuitPanel = () => {
    const [loadingStatus, setLoadingStatus] = useState<LoadingStatus>(LoadingStatus.LOADING);
    const [isSaving, setIsSaving] = useState(false);
    const [columns, setColumns] = useState<Column[]>(getColumns());
    const [textToCopy, setTextToCopy] = useState("");
    const [swimsuit, setSwimsuit] = useState<Swimsuit[]>([]);
    const [cellChangesIndex, setCellChangesIndex] = useState(() => -1);
    const [cellChanges, setCellChanges] = useState<CellChange[][]>(() => []);

    const applyNewValue = (changes: CellChange[], prevData: Swimsuit[], usePrevValue: boolean = false): Swimsuit[] => {
        changes.forEach((change) => {
            const fieldName = change.columnId as string;
            const cell = usePrevValue ? change.previousCell : change.newCell;

            if (change.rowId === "footer" && cell.type === "text") {
                let newRow: Swimsuit = {
                    freeEntry: { checked: false, text: "" },
                    big: { checked: false, text: "" },
                    medium: { checked: false, text: "" },
                    shape: { checked: false, text: "" },
                    design: { checked: false, text: "" },
                    set: { checked: false, text: "" },
                    image: { checked: false, text: "" },
                    pattern: { checked: false, text: "" },
                    ageOrSex: { checked: false, text: "" },
                    others: { checked: false, text: "" },
                    size: { checked: false, text: "" },
                    color: { checked: false, text: "" },
                };
                if (fieldName.startsWith("freeEntry") && cell.text.trim() !== "") newRow.freeEntry.text = cell.text;
                else if (fieldName.startsWith("big") && cell.text.trim() !== "") newRow.big.text = cell.text;
                else if (fieldName.startsWith("medium") && cell.text.trim() !== "") newRow.medium.text = cell.text;
                else if (fieldName.startsWith("shape") && cell.text.trim() !== "") newRow.shape.text = cell.text;
                else if (fieldName.startsWith("design") && cell.text.trim() !== "") newRow.design.text = cell.text;
                else if (fieldName.startsWith("set") && cell.text.trim() !== "") newRow.set.text = cell.text;
                else if (fieldName.startsWith("image") && cell.text.trim() !== "") newRow.image.text = cell.text;
                else if (fieldName.startsWith("pattern") && cell.text.trim() !== "") newRow.pattern.text = cell.text;
                else if (fieldName.startsWith("ageOrSex") && cell.text.trim() !== "") newRow.ageOrSex.text = cell.text;
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
                    else if (fieldName.startsWith("shape")) prevData[tIndex].shape.checked = cell.checked;
                    else if (fieldName.startsWith("design")) prevData[tIndex].design.checked = cell.checked;
                    else if (fieldName.startsWith("set")) prevData[tIndex].set.checked = cell.checked;
                    else if (fieldName.startsWith("image")) prevData[tIndex].image.checked = cell.checked;
                    else if (fieldName.startsWith("pattern")) prevData[tIndex].pattern.checked = cell.checked;
                    else if (fieldName.startsWith("ageOrSex")) prevData[tIndex].ageOrSex.checked = cell.checked;
                    else if (fieldName.startsWith("others")) prevData[tIndex].others.checked = cell.checked;
                    else if (fieldName.startsWith("size")) prevData[tIndex].size.checked = cell.checked;
                    else if (fieldName.startsWith("color")) prevData[tIndex].color.checked = cell.checked;
                } else if (cell.type === "text") {
                    if (fieldName.startsWith("freeEntry")) prevData[tIndex].freeEntry.text = cell.text;
                    else if (fieldName.startsWith("big")) prevData[tIndex].big.text = cell.text;
                    else if (fieldName.startsWith("medium")) prevData[tIndex].medium.text = cell.text;
                    else if (fieldName.startsWith("shape")) prevData[tIndex].shape.text = cell.text;
                    else if (fieldName.startsWith("design")) prevData[tIndex].design.text = cell.text;
                    else if (fieldName.startsWith("set")) prevData[tIndex].set.text = cell.text;
                    else if (fieldName.startsWith("image")) prevData[tIndex].image.text = cell.text;
                    else if (fieldName.startsWith("pattern")) prevData[tIndex].pattern.text = cell.text;
                    else if (fieldName.startsWith("ageOrSex")) prevData[tIndex].ageOrSex.text = cell.text;
                    else if (fieldName.startsWith("others")) prevData[tIndex].others.text = cell.text;
                    else if (fieldName.startsWith("size")) prevData[tIndex].size.text = cell.text;
                    else if (fieldName.startsWith("color")) prevData[tIndex].color.text = cell.text;
                }
            }
        });
        return [...prevData];
    };

    const applyChangesToData = (changes: CellChange[], prevData: Swimsuit[]): Swimsuit[] => {
        const updated = applyNewValue(changes, prevData);
        if (changes.filter((changes) => changes.type === "text").length !== 0) {
            setCellChanges([...cellChanges.slice(0, cellChangesIndex + 1), changes]);
            setCellChangesIndex(cellChangesIndex + 1);
        }
        return updated;
    };

    const undoChanges = (changes: CellChange[], prevData: Swimsuit[]): Swimsuit[] => {
        const updated = applyNewValue(changes, prevData, true);
        setCellChangesIndex(cellChangesIndex - 1);
        return updated;
    };

    const redoChanges = (changes: CellChange[], prevData: Swimsuit[]): Swimsuit[] => {
        const updated = applyNewValue(changes, prevData);
        setCellChangesIndex(cellChangesIndex + 1);
        return updated;
    };

    const handleChanges = (changes: CellChange[]) => {
        setSwimsuit((prevData) => applyChangesToData(changes, prevData));
    };

    const handleUndoChanges = () => {
        if (cellChangesIndex >= 0) setSwimsuit((prevData) => undoChanges(cellChanges[cellChangesIndex], prevData));
    };

    const handleRedoChanges = () => {
        if (cellChangesIndex + 1 <= cellChanges.length - 1) setSwimsuit((prevData) => redoChanges(cellChanges[cellChangesIndex + 1], prevData));
    };

    const handleContextMenu = (selectedRowIds: Id[], selectedColIds: Id[], selectionMode: SelectionMode, menuOptions: MenuOption[]): MenuOption[] => {
        if (selectionMode === "row") {
            menuOptions = [
                // ...menuOptions,
                {
                    id: "removeRow",
                    label: "行削材",
                    handler: () => {
                        setSwimsuit((prevData) => {
                            return [...prevData.filter((data, idx) => !selectedRowIds.includes(idx))];
                        });
                    },
                },
            ];
        } else menuOptions = [];
        return menuOptions;
    };

    const handleReset = () => {
        setSwimsuit(
            swimsuit.map((t) => {
                t.freeEntry.checked = false;
                t.big.checked = false;
                t.medium.checked = false;
                t.shape.checked = false;
                t.design.checked = false;
                t.set.checked = false;
                t.image.checked = false;
                t.pattern.checked = false;
                t.ageOrSex.checked = false;
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
            .post("/swimsuit", {
                data: [
                    ...swimsuit.map((t) => [
                        t.freeEntry.text,
                        t.big.text,
                        t.medium.text,
                        t.shape.text,
                        t.design.text,
                        t.set.text,
                        t.image.text,
                        t.pattern.text,
                        t.ageOrSex.text,
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

    const fetchSwimsuit = () => {
        axios
            .get("/swimsuit")
            .then((response) => {
                setSwimsuit(getSwimsuit(response.data.swimsuit));
                setLoadingStatus(LoadingStatus.LOADED);
            })
            .catch(() => {
                setLoadingStatus(LoadingStatus.DATA_NOT_RETRIEVED);
            });
    };

    const isMacOs = () => window.navigator.userAgent.indexOf("Mac") !== -1;

    useEffect(() => {
        fetchSwimsuit();
    }, []);

    useEffect(() => {
        let freeEntry_textToCopy = "";
        let big_textToCopy = "";
        let medium_textToCopy = "";
        let shape_textToCopy = "";
        let design_textToCopy = "";
        let set_textToCopy = "";
        let image_textToCopy = "";
        let pattern_textToCopy = "";
        let ageOrSex_textToCopy = "";
        let others_textToCopy = "";
        let size_textToCopy = "";
        let color_textToCopy = "";
        swimsuit.forEach((t) => {
            if (t.freeEntry.checked) freeEntry_textToCopy += t.freeEntry.text + " ";
            if (t.big.checked) big_textToCopy += t.big.text + " ";
            if (t.medium.checked) medium_textToCopy += t.medium.text + " ";
            if (t.shape.checked) shape_textToCopy += t.shape.text + " ";
            if (t.design.checked) design_textToCopy += t.design.text + " ";
            if (t.set.checked) set_textToCopy += t.set.text + " ";
            if (t.image.checked) image_textToCopy += t.image.text + " ";
            if (t.pattern.checked) pattern_textToCopy += t.pattern.text + " ";
            if (t.ageOrSex.checked) ageOrSex_textToCopy += t.ageOrSex.text + " ";
            if (t.others.checked) others_textToCopy += t.others.text + " ";
            if (t.size.checked) size_textToCopy += t.size.text + " ";
            if (t.color.checked) color_textToCopy += t.color.text;
        });
        let textToCopy = "";
        if (freeEntry_textToCopy.trimEnd() !== "") textToCopy += freeEntry_textToCopy + " ";
        if (big_textToCopy.trimEnd() !== "") textToCopy += big_textToCopy + " ";
        if (medium_textToCopy.trimEnd() !== "") textToCopy += medium_textToCopy + " ";
        if (shape_textToCopy.trimEnd() !== "") textToCopy += shape_textToCopy + " ";
        if (design_textToCopy.trimEnd() !== "") textToCopy += design_textToCopy + " ";
        if (set_textToCopy.trimEnd() !== "") textToCopy += set_textToCopy + " ";
        if (image_textToCopy.trimEnd() !== "") textToCopy += image_textToCopy + " ";
        if (pattern_textToCopy.trimEnd() !== "") textToCopy += pattern_textToCopy + " ";
        if (ageOrSex_textToCopy.trimEnd() !== "") textToCopy += ageOrSex_textToCopy + " ";
        if (others_textToCopy.trimEnd() !== "") textToCopy += others_textToCopy + " ";
        if (size_textToCopy.trimEnd() !== "") textToCopy += size_textToCopy + " ";
        if (color_textToCopy.trimEnd() !== "") textToCopy += color_textToCopy;
        setTextToCopy(textToCopy.trimEnd());
    }, [swimsuit]);

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
                        <IconButton sx={{ mb: 1 }} onClick={fetchSwimsuit}>
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
                            rows={getRows(swimsuit)}
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

export default SwimsuitPanel;
