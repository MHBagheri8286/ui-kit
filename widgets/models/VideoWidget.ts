import { IHtmlBody, IMedia, IWidget } from "./index";

export interface IVideoWidget extends IWidget {
    cover?: IMedia;
    sources?: IMedia;
    description?: IHtmlBody;
}