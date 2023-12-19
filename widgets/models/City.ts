import { ICmsCountry, ICode, IContentPicker, IGeneralContainer, IMedia } from "./index";

export interface ICity extends IGeneralContainer {
    code?: ICode;
    name?: string;
    cover?: IMedia;
    nickname?: string;
    area?: number;
    borderCoordinates?: string;
    climate?: number;
    createdUtc?: string;
    forecaWeatherId?: number;
    tourismOrder?: number;
    population?: number;
    publishedUtc?: string
    render?: string;
    sortIndex?: number;
    content?: IContentPicker<any>;
    level?: string;
    country?: IContentPicker<ICmsCountry>;
}