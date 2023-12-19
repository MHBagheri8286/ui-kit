import { ICustomization, IMedia } from "./index";


export interface IBackgroundImageStyle extends ICustomization {
    image?: IMedia;
    size?: string;
    repeat?: string;
    flip?: "Horizontal" | "Vertical" | "None";
    positionX?: "start" | "end" | "center";
    positionY?: "top" | "bottom" | "center";
    offsetX?: string;
    offsetY?: string;
}