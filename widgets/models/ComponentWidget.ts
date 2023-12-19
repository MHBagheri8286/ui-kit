import { IContentPicker, IKeyValue, IWidget } from "./index";

export interface IComponentWidget extends IWidget {
    componet?: string;
    parameters?: IContentPicker<IKeyValue>;
}