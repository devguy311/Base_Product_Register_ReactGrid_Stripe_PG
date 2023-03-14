export { default } from "./ProductTable";
export { ProductKeyword } from "./ProductKeyword";

export interface CheckboxData {
    checked: boolean;
    text: string;
}

export interface ExcelData {
    [key: string]: string;
}

export { CopyToClipboardButton } from "./components/CopyToClipboardButton";
export { AddProductDialog } from "./components/AddProductDialog";
