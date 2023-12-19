import { createContext } from "react";
import { IMapWidgetAction } from "./index";
import { IAttraction, ICity, IEvent, IMapPolygen, IMarker, IMarkerGroup } from "@ui-kit/widgets/index";
import { IExtLocation } from "@ui-kit/common";

export interface IMapWidgetState {
    dataSource: Array<IAttraction | IEvent>;
    markerGroups: IMarkerGroup[];
    polys: IMapPolygen[];
    selectedMarkerGroups: IMarkerGroup[];
    currentCity?: ICity;
    mapMarkers: IExtLocation[];
    currentMarker?: IMarker;
}

export const MapWidgetContext = createCtx<IMapWidgetState, IMapWidgetAction>({
    dataSource: [],
    markerGroups: [],
    polys: [],
    mapMarkers: [],
    selectedMarkerGroups: []
});

export function createCtx<S, A>(defaultValue: S) {
    const defaultDispatch: React.Dispatch<A> = () => defaultValue;
    const ctx = createContext({
        state: defaultValue,
        dispatch: defaultDispatch
    });
    return ctx;
}

