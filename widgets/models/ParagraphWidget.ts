import { IHtmlBody, IWidget } from "./index";

export interface IParagraphWidget extends IWidget {
    text?: IHtmlBody;
}