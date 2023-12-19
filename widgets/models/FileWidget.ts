import { IMedia, IWidget } from "./index";

export interface IFileWidget extends IWidget {
    files?: IMedia;
}