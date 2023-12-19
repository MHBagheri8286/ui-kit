import { ILink, IMedia, IWidget } from "./index";


export interface IBannerWidget extends IWidget {
    subtitle?: string;
    description?: string;
    wrap?: boolean;
    image?: IMedia;
    size?: string;
    color?: string;
    navigation?: ILink;
}