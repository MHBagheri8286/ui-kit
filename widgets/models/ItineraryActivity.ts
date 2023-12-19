import { IHtmlBody } from "./HtmlBody";
import { ICmsLocation } from "./CmsLocation";
import { IMedia } from "./Media";

export interface IItineraryActivity {
    activity?: string;
    brief?: IHtmlBody;
    day?: number;
    displayText?: string;
    endTime?: string;
    startTime?: string;
    gallery?: IMedia;
    location?: ICmsLocation;
    icon?: string;
}