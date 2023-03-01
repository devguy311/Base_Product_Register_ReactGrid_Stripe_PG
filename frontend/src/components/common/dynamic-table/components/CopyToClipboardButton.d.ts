import { Component } from "react";

export interface CopyToClipboardButtonProps {
    textToCopy: string | undefined;
    disabled: boolean | undefined;
}
export default class CopyToClipboardButton extends Component<CopyToClipboardButtonProps> {}
