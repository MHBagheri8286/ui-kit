import { IContentPicker, ICustomization } from "./index";

export interface ILayoutStyle extends ICustomization {
    wrap?: boolean;
    columnCount?: number;
    itemLayouts?: IContentPicker<IItemLayout>;
    rowHeight?: string;
    gap?: number;
}

export interface IItemLayout {
    colSpan?: number;
    rowSpan?: number;
}