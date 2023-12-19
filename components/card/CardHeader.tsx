import { FC } from "react";

interface ICardHeaderProps {
    id?: string;
    title?: string;
    subTitle?: string;
    onClick?: (id?: string) => void;
}

export const CardHeader: FC<ICardHeaderProps> = ({ id, title, subTitle, children, onClick }) => {

    return (
        <div className="card-header">
            {title ? <h2 className={`title${onClick ? ' header-link' : ''}`} onClick={() => { if (onClick) onClick(id) }}>{title}</h2> : ""}
            {subTitle ? <h4 className="sub-title">{subTitle}</h4> : ""}
            {children}
        </div>
    )
}
CardHeader.displayName = "CardHeader";
