import { IGeneralContainer, ILocalization, IMedia } from "@ui-kit/widgets/models";

export interface INews extends IGeneralContainer {
    summary?: string;
    figure?: IMedia;
    createdUtc?: string;
    publishedUtc?: string;
    localization?: ILocalization;
}