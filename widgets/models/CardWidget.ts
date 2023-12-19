import { ICardItem, IContentPicker, ILayoutStyle, IWidget } from "./index";

export enum CardWidgetStyle {
    style1,
    style2,
    style3,
    style4,
    style5,
    style6,
    style7
}

export interface ICardWidget extends IWidget {
    style?: string;
    items?: IContentPicker<ICardItem>;
    layouts?: IContentPicker<ILayoutStyle>;
}