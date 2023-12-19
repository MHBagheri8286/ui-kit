import { IContentPicker, IContentType, ICustomization } from "./index";

export interface IWidget extends IContentType {
    customizations?: IContentPicker<ICustomization>;
}