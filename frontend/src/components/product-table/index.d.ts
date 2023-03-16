export { default } from "./ProductTable";
export type { ProductKeyword } from "./ProductKeyword";

export interface CheckboxData {
    checked: boolean;
    text: string;
}

export interface ExcelData {
    [key: string]: string;
}

export { default as CopyToClipboardButton } from "./components/CopyToClipboardButton";
export { default as AddProductDialog } from "./components/AddProductDialog";
