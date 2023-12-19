
import { IAnnouncement, INews } from "@common/models/CMS";
import { ICode, IContentPicker, IMedia } from "./index";

export interface ICmsCountry {
    sortIndex?: number;
    guid?: string;
    code?: ICode;
    cover?: IMedia;
    name?: string;
    demonym?: string;
    demonymCode?: number;
    callingCode?: string;
    flagPosition?: number;
    announcements?: IContentPicker<IAnnouncement>;
    travelConditions?: IContentPicker<INews>;
    borderCoordinates?: string;
}