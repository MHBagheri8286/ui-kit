import { IMedia } from "@ui-kit/widgets/models";
import { getWidth } from "@ui-kit/utilize";
import { Children, CSSProperties, FC, useEffect, useRef, useState } from "react";
import { ViewPort } from "@ui-kit/common";


interface ICardProps {
    id?: string;
    className?: string;
    variant: 'horizontal' | 'vertical' | 'imageInText';
    cover?: IMedia;
    style?: CSSProperties;
    actionHover?: boolean;
    onClick?: (id?: string) => void;
    shadow?: boolean;
}

export const Card: FC<ICardProps> = ({ id, className = "", variant, children, style, actionHover, shadow, onClick }) => {
    const widthTimer = useRef<NodeJS.Timeout>();
    const [width, SetWidth] = useState<number>(getWidth());

    useEffect(() => {
        window.addEventListener("resize", onResize);

        return (() => window.removeEventListener("resize", onResize))
    }, [])

    const onResize = () => {
        clearTimeout(widthTimer.current as NodeJS.Timeout);
        widthTimer.current = setTimeout(() => {
            SetWidth(getWidth());
        }, 200);
    }

    return (
        <section
            id={id}
            className={`card card-${variant.toLowerCase()}${actionHover && width > ViewPort.large ? " action-hover" : ""}${shadow ? " shadow" : ""} ${className}`}
            onClick={() => { if (onClick) onClick(id) }} style={style}
        >
            {Children.toArray(children).find((child: any) => child.type?.displayName === "CardMedia")}
            <div className="card-wrapper">
                {Children.toArray(children).filter((child: any) => child.type?.displayName !== "CardMedia")}
            </div>
        </section>
    )
}
