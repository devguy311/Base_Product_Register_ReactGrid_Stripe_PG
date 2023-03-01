import { Component } from "react";

export interface CheckboxData {
    checked: boolean;
    text: string;
}

export interface DynamicTableProps {
    source?: ProductKeyword[] | undefined;
}
export default class DynamicTable extends Component<DynamicTableProps> {}
