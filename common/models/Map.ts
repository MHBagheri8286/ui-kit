import { ILocation } from "@common/models";
import { IHtmlBody } from "@ui-kit/widgets/models";
import L, { DivIconOptions, IconOptions, LatLngExpression, PolylineOptions, PopupOptions } from "leaflet";
import { MarkOptions } from "perf_hooks";
import { CSSProperties, ReactNode } from "react";

export interface IPopupConfig extends PopupOptions {
    popupDelay?: number;
    openPopup?: boolean;
}
export interface IExtLocation extends ILocation {
    id?: string;
    icon?: ReactNode | string | IconOptions;
    divIcon?: DivIconOptions;
    content?: {
        contentTitle?: string;
        container?: string;
    };
    opacity?: number;
    popupConfig?: IPopupConfig;
    remainedState?: boolean;
    fitOnThis?: boolean;
    tooltip?: IHtmlBody;
    tooltipDisplayMode?: "OnHover" | "OnClick";
    option?: MarkOptions
    eventConfig?: {
        eventType: string,
        handler: (e: L.LeafletEvent) => void
    }
}

export interface DefaultGoogleValue {
    center: google.maps.LatLngAltitudeLiteral,
    zoom: number
}

export interface DefaultLeafletValue {
    center: L.LatLngExpression | google.maps.LatLngAltitudeLiteral,
    zoom: number
}

export interface IPolyline {
    clickable?: boolean;
    draggable?: boolean;
    editable?: boolean;
    geodesic?: boolean;
    paths?: ILocation[][] | ILocation[];
    strokeColor?: string;
    strokeOpacity?: number;
    strokeWeight?: number;
    fillColor?: string;
    fillOpacity?: number;
    invert?: boolean;
    visible?: boolean;
    zIndex?: number;
    polyLineOption?: PolylineOptions;
    animationForLine?: boolean;
    delayForDrowningInEachGroup?: number;
    lineCurve?: boolean;
    transitionTime?: number;
}

export interface ILeafletPolygons {
    paths: LatLngExpression[],
    options: PolylineOptions
}

export interface IGooglePolygons extends google.maps.PolygonOptions {
    id?: string;
    invert?: boolean;
}
export interface IPopupStyle {
    popupStyle?: CSSProperties;
    popupIndex?: number;
    popupAnimation?: {
        start: CSSProperties;
        end: CSSProperties;
        // delay is not for animateDuration, Use for differential in doing each loop of animate.  
        popupIndexForAnimate?: number;
    }
}

export enum LeafletLayerName { DefaultLayer, StandardLayer }