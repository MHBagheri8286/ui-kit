import Config from "@service/Config";
import { OptimizedImage } from "@ui-kit/components/index";
import { IMedia } from "@ui-kit/widgets/models";
import { FC } from "react";

interface ICardHeaderProps {
    id?: string;
    source: IMedia;
    onClick?: (id?: string) => void;
}

export const CardMedia: FC<ICardHeaderProps> = ({ id, source, children, onClick }) => {

    return (
        <div className={`card-media${onClick ? " cursor-pointer" : ""}`} onClick={() => onClick && onClick(id)}>
            <OptimizedImage
                contentMediaPath={Config.config.contentMedia as string}
                source={source || {} as IMedia}
                className="card-img"
            />
            {children}
        </div>
    )
}

CardMedia.displayName = "CardMedia";