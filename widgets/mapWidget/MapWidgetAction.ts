import { IMapWidgetState } from "./MapWidgetContext";

export enum MapWidgetAction {
    DataSource,
    CurrentCity,
    MarkerGroups,
    Polys,
    SelectedMarkerGroups,
    MapMakers,
    CurrentMarker
}

export interface IMapWidgetAction {
    type: MapWidgetAction;
    payload: Partial<IMapWidgetState>;
}