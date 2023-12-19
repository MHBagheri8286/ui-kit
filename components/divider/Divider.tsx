import { CSSProperties, FC } from "react";
interface IDivider {
    id?: string;
    className?: string;
    style?: CSSProperties;
    orientation: "vertical" | "horizontal";
    mode: "perforation" | "scissor" | "default";
    varient?: "box-shadow" | "border";
}

export const Divider: FC<IDivider> = (props) => {
    const { id, orientation, style, mode, varient, className } = props;

    return (
        <div
            id={id}
            className={`divider ${orientation} ${mode ? mode === "scissor" ? "icon icon-scissor" : mode : ""} ${varient ? varient : ""} ${className ? className : ""}`}
            style={style} />
    )
}