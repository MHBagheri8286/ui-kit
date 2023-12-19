import { IMedia } from "./Media";

export interface ICardItem {
    displayText?: string;
    image?: IMedia;
    link?: string;
    description?: string;
    forecaWeatherId?: number;
    tags?: string[];
}