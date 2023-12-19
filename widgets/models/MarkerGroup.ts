
import { IContentPicker, IContentType, IMarker, IMedia } from "./index";

export interface IMarkerGroup extends IContentType{
    defaultMarkerIcon?: IMedia;
    markers?: IContentPicker<IMarker>;

}