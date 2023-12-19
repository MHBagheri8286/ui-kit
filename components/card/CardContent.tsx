
import { Icon } from "@ui-kit/components/index";
import { FC } from "react";

interface ICardContentProps {
    mediaBackground?: {
        icon?: string;
        urlImage?: string
    },
}


export const CardContent: FC<ICardContentProps> = ({ children, mediaBackground }) => {
    return (
        <div className="card-content" style={{ backgroundImage: mediaBackground?.urlImage ? `url(${mediaBackground?.urlImage})` : '' }}>
            {mediaBackground?.icon && <Icon name={mediaBackground?.icon}></Icon>}
            {children}
        </div>
    )
}

CardContent.displayName = "CardContent";