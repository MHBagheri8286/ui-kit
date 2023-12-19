import { IContentPicker, IMedia } from ".";

export interface IAttractionCategory {
    contentItemId?: string;
    displayText?: string;
    mapMarkerIcon?: IMedia;
    icon?: string;
    parent?: IContentPicker<IAttractionCategory>;
}