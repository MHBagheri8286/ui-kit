
import { IContentPicker, IContentType, IHtmlBody, ICmsLocation, IMedia } from "./index";

export interface IMarker extends IContentType {
    contentItemId?: string;
    tag?: string;
    content?: IContentPicker<IContentType> | any;
    location?: ICmsLocation;
    tooltip?: IHtmlBody;
    tooltipDisplayMode?: "OnHover" | "OnClick";
    icon?: IMedia;
}