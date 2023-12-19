import { FC } from "react";

interface IDialogHeaderProps {
    className?: string;
}

export const DialogHeader: FC<IDialogHeaderProps> = (props) => {
    const { className } = props;
    return (
        <div className={`dialog-header ${className || ""}`}>
            {props.children}
        </div>
    )
}
DialogHeader.displayName = "DialogHeader";