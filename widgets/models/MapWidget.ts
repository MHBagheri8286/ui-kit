import { IContentPicker, ICmsLocation, IMapLayer, IMarkerGroup, IWidget } from "./index";

export interface IMapWidget extends IWidget {
    provider?: string;
    style?: string;
    center?: ICmsLocation;
    zoom?: number;
    zoomEnable?: boolean;
    markerGroups?: IContentPicker<IMarkerGroup>;
    layers?: IContentPicker<IMapLayer>;
    dataSource?: ("Attractions" | "Events" | "Custom" | "Cities")[];
}