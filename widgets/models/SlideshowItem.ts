import { IHtmlBody, ILink, IMedia } from "./index";

export enum MenuStyle { Transparent, Solid, Blur }

export interface ISlideshowItem {
    displayText?: string;
    contentType?: string;
    media?: IMedia;
    textOverly?: IHtmlBody;
    navigation?: ILink;
    flip?: boolean;
    positionX?: "start" | "center" | "end";
}