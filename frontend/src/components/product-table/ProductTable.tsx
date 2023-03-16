import React, { ChangeEvent, useEffect, useState } from "react";
import axios from "axios";
import { read, utils, writeFile } from "xlsx";
import { ReactGrid, Column, Row, CellChange, SelectionMode, Id, MenuOption, TextCell } from "@silevis/reactgrid";
import { Button, IconButton } from "@mui/material";
import { Backup, Download, RefreshRounded, ReplayRounded, Upload } from "@mui/icons-material";
import "@silevis/reactgrid/styles.css";

import { ProductKeyword, CheckboxData, ExcelData, CopyToClipboardButton, AddProductDialog } from "./index.d";

const getData = (source: ProductKeyword[]): CheckboxData[][] => {
    let data: CheckboxData[][] = [];

    source.forEach((t) => {
        t.keywords.forEach((t, idx) => {
            if (idx >= data.length)
                data.push([
                    {
                        checked: false,
                        text: t,
                    },
                ]);
            else data[idx].push({ checked: false, text: t });
        });
    });
    return data;
};

const getColumns = (data: ProductKeyword[]): Column[] => {
    let dataColumns: Column[] = [];

    data.forEach((_t, idx) => {
        dataColumns.push({ columnId: "checked_" + idx, width: 40 }, { columnId: "text_" + idx, width: 70, resizable: true });
    });

    return [{ columnId: "row_select", width: 40 }, ...dataColumns, { columnId: "new_column", width: 70 }];
};

const getHeader = (source: ProductKeyword[]): Row => {
    let headerRow: Row = {
        rowId: "header",
        cells: [{ type: "header", text: "" }],
    };

    source.forEach((t) => {
        headerRow.cells.push({ type: "header", text: "☑" }, { type: "text", text: t.header });
    });

    headerRow.cells.push({ type: "text", text: "", nonEditable: false });

    return headerRow;
};

const getFooter = (source: ProductKeyword[]): Row => {
    let footerRow: Row = {
        rowId: "footer",
        cells: [{ type: "text", text: "", nonEditable: true }],
    };

    source.forEach((t) => {
        footerRow.cells.push({ type: "text", text: "", nonEditable: true }, { type: "text", text: "" });
    });

    footerRow.cells.push({ type: "text", text: "" });

    return footerRow;
};

const getRows = (data: CheckboxData[][]): Row[] => [
    ...data.map<Row>((t, idx) => {
        let newRow: Row = {
            rowId: idx,
            cells: [{ type: "text", text: "", nonEditable: true }],
        };

        t.forEach((t) => {
            newRow.cells.push({ type: "checkbox", checked: t.checked }, { type: "text", text: t.text });
        });
        newRow.cells.push({ type: "text", text: "" });
        return newRow;
    }),
];

const ProductTable = (props: any) => {
    const [file, setFile] = useState<File>();
    const [isSaving, setIsSaving] = useState(false);
    const [header, setHeader] = useState<Row>(getHeader((props.source as ProductKeyword[]) || []));
    const [footer, setFooter] = useState<Row>(getFooter((props.source as ProductKeyword[]) || []));
    const [data, setData] = useState<CheckboxData[][]>(getData((props.source as ProductKeyword[]) || []));
    const [columns, setColumns] = useState<Column[]>(getColumns((props.source as ProductKeyword[]) || []));
    const [textToCopy, setTextToCopy] = useState("");
    const [cellChangesIndex, setCellChangesIndex] = useState(() => -1);
    const [cellChanges, setCellChanges] = useState<CellChange[][]>(() => []);

    const getFromData = (): ProductKeyword[] => {
        let source: ProductKeyword[] = [];
        data.forEach((t, idx) =>
            t.forEach((t, jdx) => {
                if (idx === 0) source.push({ header: (header.cells[jdx * 2 + 2] as TextCell).text, keywords: [t.text] });
                else source[jdx].keywords.push(t.text);
            })
        );
        return source;
    };

    const getExcelHeadingFromData = (): string[] => {
        if (data.length === 0) return [];
        return data[0].map((_t, idx) => (header.cells[idx * 2 + 2] as TextCell).text);
    };

    const getExcelDataFromData = (): ExcelData[] => {
        let source: ExcelData[] = [];
        data.forEach((t, idx) =>
            t.forEach((t, jdx) => {
                if (jdx === 0) {
                    let newObject: ExcelData = {};
                    newObject["header0"] = t.text;
                    source.push(newObject);
                } else source[idx][`header${jdx}`] = t.text;
            })
        );
        return source;
    };

    const loadFromSource = (source: ProductKeyword[]) => {
        setHeader(getHeader(source));
        setFooter(getFooter(source));
        setData(getData(source));
        setColumns(getColumns(source));
    };

    const loadFromFile = (file: File) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const wb = read(event.target?.result);
            const sheets = wb.SheetNames;

            if (sheets.length) {
                const result = utils.sheet_to_json(wb.Sheets[sheets[0]]);

                let loadedData: ProductKeyword[] = [];
                (result as any[]).forEach((t) => {
                    const keys = Object.keys(t);
                    const values = Object.values<string>(t);
                    if (t.__rowNum__ === 1)
                        keys.forEach((t, idx) => {
                            if (t !== "__rowNum__") loadedData.push({ header: t, keywords: [values[idx]] });
                        });
                    else
                        keys.forEach((t, idx) => {
                            if (t !== "__rowNum__") loadedData[idx].keywords.push(values[idx]);
                        });
                });
                loadFromSource(loadedData);
            }
        };
        reader.readAsArrayBuffer(file);
    };

    const applyNewValue = (changes: CellChange[], prevData: CheckboxData[][], usePrevValue: boolean = false): CheckboxData[][] => {
        changes.forEach((change) => {
            const columnIndex = parseInt((change.columnId as string).split("_")[1]);
            const cell = usePrevValue ? change.previousCell : change.newCell;

            if (change.rowId === "header") {
                if (change.columnId === "new_column") {
                    setHeader((prevHeader) => {
                        prevHeader.cells.splice(prevHeader.cells.length - 1, 0, { type: "header", text: "☑" }, { type: "text", text: (cell as TextCell).text });
                        return prevHeader;
                    });
                    setColumns((prevColumns) => {
                        prevColumns.splice(
                            prevColumns.length - 1,
                            0,
                            { columnId: "checked_" + (prevColumns.length / 2 - 1), width: 40 },
                            { columnId: "text_" + (prevColumns.length / 2 - 1), width: 70, resizable: true }
                        );
                        return prevColumns;
                    });
                    setFooter((prevFooter) => {
                        prevFooter.cells.splice(prevFooter.cells.length - 1, 0, { type: "text", text: "", nonEditable: true }, { type: "text", text: "" });
                        return prevFooter;
                    });
                    prevData.forEach((t) => {
                        t.push({ checked: false, text: "" });
                    });
                } else {
                    setHeader((prevHeader) => {
                        (prevHeader.cells[columnIndex * 2 + 2] as TextCell).text = (cell as TextCell).text;
                        return prevHeader;
                    });
                }
            } else if (change.rowId === "footer" && change.columnId !== "new_column") {
                let newRow: CheckboxData[] = [];

                for (let i = 2; i < header.cells.length; i += 2) {
                    if (i / 2 === columnIndex + 1) newRow.push({ checked: false, text: (cell as TextCell).text });
                    else newRow.push({ checked: false, text: "" });
                }

                if (usePrevValue && change.previousCell.type === "text" && change.newCell.type === "text") {
                    if (change.previousCell.text === "" && change.newCell.text.trim() !== "") prevData.pop();
                    return [...prevData];
                }

                prevData.push(newRow);
            } else if (change.columnId !== "new_column") {
                const tIndex = change.rowId as number;
                if (cell.type === "checkbox") prevData[tIndex][columnIndex].checked = cell.checked;
                else if (cell.type === "text") prevData[tIndex][columnIndex].text = cell.text;
            }
        });
        return [...prevData];
    };

    const applyChangesToData = (changes: CellChange[], prevData: CheckboxData[][]): CheckboxData[][] => {
        const updated = applyNewValue(changes, prevData);
        if (changes.filter((changes) => changes.rowId !== "header" && changes.type === "text").length !== 0) {
            setCellChanges([...cellChanges.slice(0, cellChangesIndex + 1), changes]);
            setCellChangesIndex(cellChangesIndex + 1);
        }
        return updated;
    };

    const undoChanges = (changes: CellChange[], prevData: CheckboxData[][]): CheckboxData[][] => {
        const updated = applyNewValue(changes, prevData, true);
        setCellChangesIndex(cellChangesIndex - 1);
        return updated;
    };

    const redoChanges = (changes: CellChange[], prevData: CheckboxData[][]): CheckboxData[][] => {
        const updated = applyNewValue(changes, prevData);
        setCellChangesIndex(cellChangesIndex + 1);
        return updated;
    };

    const isMacOs = () => window.navigator.userAgent.indexOf("Mac") !== -1;

    const handleUndoChanges = () => {
        if (cellChangesIndex >= 0) setData((prevData) => undoChanges(cellChanges[cellChangesIndex], prevData));
    };

    const handleRedoChanges = () => {
        if (cellChangesIndex + 1 <= cellChanges.length - 1) setData((prevData) => redoChanges(cellChanges[cellChangesIndex + 1], prevData));
    };

    const handleChanges = (changes: CellChange[]) => {
        setData((prevData) => applyChangesToData(changes, prevData));
    };

    const handleReset = () => {
        setData((prevData) =>
            prevData.map((t) => {
                t.forEach((t) => {
                    t.checked = false;
                });
                return t;
            })
        );
    };

    const handleImport = (e: ChangeEvent<HTMLInputElement>) => {
        const files = (e.target as HTMLInputElement).files;
        if (files !== undefined && files !== null && files.length > 0) {
            loadFromFile(files[0]);
            setFile(files[0]);
        }
        e.target.value = "";
    };

    const handleExport = () => {
        const headings = [getExcelHeadingFromData()];
        const wb = utils.book_new();
        const ws = utils.json_to_sheet([]);
        utils.sheet_add_aoa(ws, headings);
        utils.sheet_add_json(ws, getExcelDataFromData(), { origin: "A2", skipHeader: true });
        utils.book_append_sheet(wb, ws, "シート 1");
        writeFile(wb, `${props.tabName}.xlsx`);
    };

    const handleSave = () => {
        setIsSaving(true);
        axios
            .post(`${process.env.REACT_APP_BACKEND_URL}/descriptions`, {
                email: props.email,
                no: props.no,
                data: getFromData(),
            })
            .then((response) => {
                if (response.data.saved) console.log("保存した");
                else console.warn("保存 失敗しま");
            })
            .catch(() => {
                console.error("おっと");
            })
            .finally(() => {
                setIsSaving(false);
            });
    };

    const handleDiscard = () => {
        if (file === undefined) loadFromSource(props.source);
        else loadFromFile(file);
    };

    const handleContextMenu = (selectedRowIds: Id[], selectedColIds: Id[], selectionMode: SelectionMode, menuOptions: MenuOption[]): MenuOption[] => {
        if (selectionMode === "row") {
            menuOptions = [
                // ...menuOptions,
                {
                    id: "insertRow",
                    label: "行挿入",
                    handler: () => {
                        setData((prevData) => {
                            let newRow: CheckboxData[] = [];
                            for (let i = 2; i < header.cells.length; i += 2) newRow.push({ checked: false, text: "" });

                            if (selectedRowIds[0].valueOf() === "footer") prevData.push(newRow);
                            else prevData.splice(selectedRowIds[0].valueOf() as number, 0, newRow);
                            return prevData;
                        });
                        setCellChanges([]);
                        setCellChangesIndex(-1);
                    },
                },
                {
                    id: "removeRow",
                    label: "行削材",
                    handler: () => {
                        setData((prevData) => {
                            return [...prevData.filter((_data, idx) => !selectedRowIds.includes(idx))];
                        });
                        setCellChanges([]);
                        setCellChangesIndex(-1);
                    },
                },
            ];
        } else if (selectionMode === "column") {
            menuOptions = [
                // ...menuOptions,
                {
                    id: "removeColumn",
                    label: "列を削除",
                    handler: () => {
                        setHeader((prevHeader) => {
                            return {
                                rowId: prevHeader.rowId,
                                cells: prevHeader.cells.filter(
                                    (_t, idx) =>
                                        selectedColIds.filter((id) => {
                                            const columnIndex = parseInt(id.toString().split("_")[1]);
                                            return isNaN(columnIndex) || columnIndex !== Math.floor((idx + 1) / 2) - 1;
                                        }).length !== 0
                                ),
                            };
                        });
                        setColumns((prevColumns) =>
                            prevColumns
                                .filter(
                                    (_t, idx) =>
                                        selectedColIds.filter((id) => {
                                            const columnIndex = parseInt(id.toString().split("_")[1]);
                                            return isNaN(columnIndex) || columnIndex !== Math.floor((idx + 1) / 2) - 1;
                                        }).length !== 0
                                )
                                .map((t, idx) => {
                                    let newColumnId = t.columnId;
                                    const split = newColumnId.toString().split("_");
                                    if (!isNaN(parseInt(split[1]))) newColumnId = split[0] + "_" + Math.floor((idx + 1) / 2 - 1);
                                    return {
                                        columnId: newColumnId,
                                        width: t.width,
                                        resizable: t.resizable,
                                    };
                                })
                        );
                        setFooter((prevFooter) => {
                            return {
                                rowId: prevFooter.rowId,
                                cells: prevFooter.cells.filter(
                                    (_t, idx) =>
                                        selectedColIds.filter((id) => {
                                            const columnIndex = parseInt(id.toString().split("_")[1]);
                                            return isNaN(columnIndex) || columnIndex !== Math.floor((idx + 1) / 2) - 1;
                                        }).length !== 0
                                ),
                            };
                        });
                        setData((prevData) =>
                            prevData.map((t) =>
                                t.filter(
                                    (_t, idx) =>
                                        selectedColIds.filter((id) => {
                                            const columnIndex = parseInt(id.toString().split("_")[1]);
                                            return isNaN(columnIndex) || columnIndex !== idx;
                                        }).length !== 0
                                )
                            )
                        );
                        setCellChanges([]);
                        setCellChangesIndex(-1);
                    },
                },
            ];
        } else menuOptions = [];
        return menuOptions;
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

    useEffect(() => {
        let texts: string[] = [];
        data.forEach((t, idx) =>
            t.forEach((t, jdx) => {
                if (idx === 0) texts.push("");

                if (t.checked) texts[jdx] += t.text + " ";
            })
        );
        setTextToCopy((prevTextToCopy) => {
            prevTextToCopy = "";
            texts.forEach((t) => {
                t = t.trimEnd();
                if (t !== "") prevTextToCopy += t + " ";
            });
            return prevTextToCopy.trim();
        });
    }, [data]);

    return (
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
            <div>
                新商品説明→ {textToCopy} <CopyToClipboardButton textToCopy={textToCopy} disabled={textToCopy === ""} />
                <AddProductDialog email={props.email} name={textToCopy} hidden={textToCopy === ""} />
            </div>
            <div>
                <Button variant="outlined" size="small" sx={{ mb: 1, mr: 1 }} startIcon={<RefreshRounded />} onClick={handleReset}>
                    リセット
                </Button>

                <Button size="small" sx={{ mb: 1, mr: 1 }} variant="outlined" onClick={handleExport}>
                    <Download /> Excelダウンロード
                </Button>

                <Button size="small" sx={{ mb: 1 }} variant="outlined" component="label">
                    <Upload /> Excelロード
                    <input
                        hidden
                        type="file"
                        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                        onChange={handleImport}
                    />
                </Button>

                <IconButton sx={{ mb: 1 }} onClick={handleSave} disabled={isSaving}>
                    <Backup color={!isSaving ? "primary" : "inherit"} />
                </IconButton>
                <IconButton sx={{ mb: 1 }} onClick={handleDiscard}>
                    <ReplayRounded color="primary" />
                </IconButton>
            </div>
            <ReactGrid
                rows={[header, ...getRows(data), footer]}
                columns={columns}
                stickyTopRows={1}
                onCellsChanged={handleChanges}
                onContextMenu={handleContextMenu}
                onColumnResized={handleColumnResize}
                enableRowSelection
                enableColumnSelection
                enableRangeSelection
            />
        </div>
    );
};

export default ProductTable;
