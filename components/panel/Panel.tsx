import { Icon } from "@ui-kit/components/index";
import { Culture } from "@ui-kit/core/index";
import { FC } from "react";

interface IPanelProps {
    id?: string;
    title?: string;
    action?: any;
    color?: "primary" | "secondary" | "danger" | "info" | "outline" | "white" | "blue" | "green" | "gold" | "teal";
    mode?: "full" | "mini";
    className?: string;
    onBackBtnClick?: () => void;
    hasHeader?: boolean
}

export const Panel: FC<IPanelProps> = (props) => {
    const { dir } = Culture.getLocale();
    const { id, title, action, color, mode, className, onBackBtnClick, hasHeader } = props;
    const backBtn = onBackBtnClick ? <Icon name={`icon-chevron-${dir === "rtl" ? "right" : "left"} back-btn`} onClick={onBackBtnClick} /> : "";
    const panelTitle = title || action ?
        <div className={`panel-head${hasHeader ? " seperate" : ""}`} >
            <div className="panel-head-item trim">
                {backBtn}
                {title}
            </div>
            <div className="panel-head-item">
                {action}
            </div>
        </div> : "";

    return (
        <div id={id} className={`panel${color ? ` color-${color}` : ""}${mode ? ` ${mode}` : ""}${className ? ` ${className}` : ""}`}>
            {panelTitle}
            <div className="panel-body">
                {props.children}
            </div>
        </div>
    );
}

