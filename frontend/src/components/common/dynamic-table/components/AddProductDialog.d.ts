import { Component } from "react";

export interface AddProductDialogProps {
    name: string | undefined;
    hidden: boolean | undefined;
}
export default class AddProductDialog extends Component<AddProductDialogProps> {}
