import { Icon } from "@ui-kit/components/index";
import { FC, ReactNode } from "react";
interface IAlertProps {
    type?: "warning" | "information" | "danger" | "success" | "error" | "defult";
    variant?: "contain" | "outline" | "none";
    title?: string | ReactNode;
    seperate?: boolean;
    className?: string;
    icon?: string;
    displayIcon?: boolean;
}

export const Alert: FC<IAlertProps> = (props) => {
    const { type, children, variant = "contain", title, displayIcon = true, seperate, className, icon } = props;

    return (
        <div className={`alert alert-${variant} alert-${type}${className ? ` ${className}` : ""}`}>
            {type && displayIcon ? <Icon className="alert-icon" name={icon ?? `icon-${type}`} multi={type === "success"} /> : ""}
            <div className="alert-container">
                {title ? <div className="alert-title">{title}</div> : ""}
                <div className={`alert-content${seperate ? " alert-black" : ""}`}>
                    {children}
                </div>
            </div>
        </div>
    );
}