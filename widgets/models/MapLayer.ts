import { IContentPicker, IMapPolygen } from "./index";

export interface IMapLayer {
    overlies?: IContentPicker<IMapPolygen>;
}