import linearLoadingGrey from '@ui-kit/assets/images/linear-loading-grey.svg';
import linearLoading from '@ui-kit/assets/images/linear-loading.svg';
import circleLoading from '@ui-kit/assets/images/loading.svg';
import { Icon } from "@ui-kit/components/index";
import { CSSProperties, FC, MouseEvent, useEffect, useState } from "react";
import { Link } from "react-router-dom";
export interface IButton {
    className?: string;
    color?: "primary" | "secondary" | "danger" | "info" | "white" | "blue" | "black";
    disabled?: boolean;
    loading?: boolean;
    height?: string;
    icon?: string;
    iconPositin?: "start" | "end";
    name?: string;
    rounded?: boolean;
    variant?: "contained" | "outlined";
    url?: string;
    text?: any;
    id?: string;
    width?: string;
    type?: "button" | "submit" | "reset" | "more-info";
    size?: "large" | "medium" | "small";
    cssProperties?: CSSProperties;
    target?: '_blank' | '_self' | '_parent' | '_top';
    onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
    onClickAsync?: (e: MouseEvent<HTMLButtonElement>) => Promise<boolean>;
}

export const Button: FC<IButton> = (props) => {
    const { name,
        id,
        variant,
        disabled,
        text,
        width,
        height,
        color,
        icon,
        iconPositin = "start",
        className = "",
        url,
        rounded,
        type = "button",
        size,
        target
    } = props;
    const typeButton = icon && !url ? "icon" : url ? "link" : "";
    const [loading, setLoading] = useState<boolean>(props.loading || false);

    useEffect(() => {
        setLoading(props.loading || false)
    }, [props.loading])

    const addClass = (): string => {
        if (color && variant) {
            return `${variant}-${color}`
        } else {
            if (variant)
                return `${variant}`
            if (color)
                return `${color}`
        }
        return "default"
    }

    const loadingType = variant === "contained" ? linearLoading : linearLoadingGrey;

    const onClick = (event: MouseEvent<HTMLButtonElement>) => {
        if (props.onClickAsync) {
            setLoading(true);
            props.onClickAsync(event).finally(() => setLoading(false))
        } else {
            props.onClick && props.onClick(event)
        }
    }

    const renderButton = () => {
        switch (typeButton) {
            case "icon":
                return (
                    <button
                        style={{ width: width, minWidth: width, height: height }}
                        type={type !== "more-info" ? type : "button"}
                        id={id}
                        name={name}
                        className={`flex flex-center justify-center btn${rounded ? " rounded" : ""}${loading ? " loading" : ""}  type-${type} ${addClass()} ${className ? className : ""} ${size ? size : ""}`.trim()}
                        disabled={disabled}
                        onClick={loading ? undefined : onClick}
                    >
                        {
                            loading ?
                                <div className="loading icon">
                                    <img src={text ? loadingType : circleLoading} alt="loading" />
                                </div>
                                :
                                <>
                                    {icon && iconPositin === "start" ? <Icon name={icon} className={text ? "start-icon" : ""} /> : ""}
                                    <div className="trim">{text}</div>
                                    {icon && iconPositin === "end" ? <Icon name={icon} className={text ? "end-icon" : ""} /> : ""}
                                </>
                        }
                    </button>
                );

            case "link":
                const btn = (
                    <button
                        type={type !== "more-info" ? type : "button"}
                        id={id}
                        name={name}
                        className={`flex flex-center justify-center btn${rounded ? " rounded" : ""}${loading ? " loading" : ""} type-${type} ${addClass()} ${className ? className : ""} ${size ? size : ""}`.trim()}
                        disabled={disabled}
                        onClick={loading ? undefined : onClick}
                    >
                        {
                            loading ?
                                <div className="loading">
                                    <img src={loadingType} alt="loading" />
                                </div>
                                :
                                <>
                                    {icon && iconPositin === "start" ? <Icon name={icon} className={text ? "start-icon" : ""} /> : ""}
                                    <div className="trim">{text}</div>
                                    {icon && iconPositin === "end" ? <Icon name={icon} className={text ? "end-icon" : ""} /> : ""}
                                </>
                        }
                    </button>
                );
                return (
                    target ?
                        <a
                            href={url}
                            target={target}
                            rel="noopener noreferrer"
                            style={{
                                width: width ? width : "auto",
                                minWidth: width,
                                height: height
                            }}
                        >
                            {btn}
                        </a>
                        :
                        <Link to={url !== undefined ? url : ""} style={{ width: width ? width : "100%", height: height ? height : "" }} >
                            {btn}
                        </Link>
                );

            default:
                return (
                    <button
                        tabIndex={1}
                        style={{ width: width, minWidth: width, height: height }}
                        type={type !== "more-info" ? type : "button"}
                        id={id}
                        name={name}
                        className={`btn${rounded ? " rounded" : ""}${loading ? " loading" : ""} type-${type} ${addClass()} ${className} ${size ? size : ""}`.trim()}
                        disabled={disabled}
                        onClick={loading ? undefined : onClick}
                    >
                        {
                            loading ? <div className="loading"><img src={loadingType} alt="loading" /></div>
                                : <div className="trim">{text}</div>
                        }
                    </button>
                );
        }
    }

    return (
        renderButton()
    )
}