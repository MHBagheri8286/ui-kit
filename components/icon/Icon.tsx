import { CSSProperties, FC } from "react";
import { IFormControlProps } from "@ui-kit/components/index";

export enum IconMode { File, Font, Position }
export interface IIconSetting {
    mode: IconMode;
    iconField?: string; // property data source
    path?: string;
    className?: string;
    width?: string;
    height?: string;
    link?: string;
    cssProperties?: CSSProperties;
}
export interface IIconProps extends IFormControlProps {
    className?: string;
    name: string;
    color?: "primary" | "secondary" | "danger" | "info" | "white" | "blue" | "black" | "grey";
    flipRtl?: boolean;
    multi?: boolean;
    flip?: boolean;
    size?: string;
    circle?: boolean;
    onClick?: (e: any) => void;
    onMouseEnter?: (e: any) => void;
    onMouseLeave?: (e: any) => void;
    onMouseOver?: (e: any) => void;
}

export const Icon: FC<IIconProps> = ({ name, id, multi, onClick, onMouseEnter, onMouseLeave, onMouseOver, className = "", flipRtl, flip, circle, size, color }) => {

    const addClass = (): string => {
        if (color && circle) {
            return ` circle-${color}`
        } else {
            if (circle)
                return " circle"
            if (color)
                return ` ${color}`
        }
        return ""
    }

    const generateName = (): string => {
        switch (name) {
            case "icon-events":
                return "icon-calendar-outline";
            case "icon-attractions":
                return "icon-max-range";
            case "icon-danger":
                return "icon-alert";
            case "icon-error":
                return "icon-close-circle";
            case "icon-warning":
                return "icon-alert-circle";
            default:
                return name;
        }
    }

    return (
        <span
            id={id}
            className={`icon ${generateName()} ${className}${flipRtl ? " flip-rtl" : ""}${flip ? " flip" : ""}${addClass()}`.trim()}
            style={{ fontSize: size, width: size, height: size, cursor: onClick ? "pointer" : "" }}
            onClick={onClick}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onMouseOver={onMouseOver}
        >
        </span>
    );
}

export const generateIcon = (iconSetting?: IIconSetting, record?: any) => {
    if (iconSetting) {
        switch (iconSetting.mode) {
            case IconMode.Position:
                return (
                    iconSetting.iconField && record && record[iconSetting.iconField] ? <div
                        className={`icon-position ${iconSetting.className || ""}`}
                        style={{
                            ...iconSetting.cssProperties,
                            backgroundImage: `url(${iconSetting.path})`,
                            backgroundRepeat: "no-repeat",
                            backgroundSize: `${iconSetting.width} ${iconSetting.height}`,
                            backgroundPositionX: "0px",
                            backgroundPositionY: `${record[iconSetting.iconField]}px`
                        }}
                    />
                        : ""
                );
            case IconMode.Font:
                return (
                    <Icon
                        name={`${iconSetting.iconField ? record && record[iconSetting.iconField] ? record[iconSetting.iconField] : iconSetting.iconField : ""}`}
                        className={`icon-font ${iconSetting.className || ""}`}
                    />
                )
            case IconMode.File:
                return (
                    <img
                        src={`${iconSetting?.path}${iconSetting.iconField ? `/${record[iconSetting.iconField]}` : ""}`}
                        alt="icon-file"
                        className={`icon-file ${iconSetting.className || ""}`}
                        style={{
                            ...iconSetting.cssProperties,
                            width: iconSetting.width,
                            height: iconSetting.height
                        }}
                    />
                )
        }
    }
}