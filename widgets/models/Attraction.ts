import { IAttractionCategory } from "./AttractionCategory";
import { ICity } from "./City";
import { IContentPicker } from "./ContentPicker";
import { IGeneralContainer } from "./GeneralContainer";
import { IHtmlBody } from "./HtmlBody";
import { ILocalization } from "./Localization";
import { ICmsLocation } from "./CmsLocation";
import { IMedia } from "./Media";

export interface IAttraction extends IGeneralContainer {
    forecaWeatherId?: number;
    startTime?: string;
    endTime?: string;
    address?: string;
    localization?: ILocalization;
    location?: ICmsLocation;
    phone?: string;
    cover?: IMedia;
    icon?: IMedia;
    estimatedVisitDuration?: string;
    bestVisitingSeason?: string;
    mostVisitingHours?: string;
    groundArea?: number;
    city?: IContentPicker<ICity>;
    introduction?: IHtmlBody;
    category?: IContentPicker<IAttractionCategory>;
}