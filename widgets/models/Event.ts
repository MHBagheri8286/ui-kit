import { IContentType } from "./ContentType";
import { ICity } from "./City";
import { IContentPicker } from "./ContentPicker";
import { IMedia } from "./Media";
import { ILocalization } from "./Localization";

export interface IEvent extends IContentType {
    localization?: ILocalization;
    description?: string;
    startTime?: string;
    endTime?: string;
    cover?: IMedia;
    city?: IContentPicker<ICity>;
}