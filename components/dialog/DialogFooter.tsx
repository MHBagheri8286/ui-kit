import { FC } from "react";

interface IDialogFooterProps { }

export const DialogFooter: FC<IDialogFooterProps> = ({ children }) => {

    return (
        <div id="dialogFooter" className="dialog-footer">
            {children}
        </div>
    )
}
DialogFooter.displayName = "DialogFooter";