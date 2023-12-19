import { IContentType, IHtmlBody, ILink, IMedia } from "./index";


export interface IBanner extends IContentType{
    text?: IHtmlBody;
    icon?: string;
    type?: "topside" | "underbooking" | "overcover";
    backgroundImage?: IMedia;
    backgroundSmallHeight?: string;
    backgroundLargeHeight?: string;
    backgroundColor?: string;
    closable?: boolean;
    flip?: boolean;
    link?: ILink;
}