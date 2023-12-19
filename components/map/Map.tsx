import { Wrapper } from "@googlemaps/react-wrapper";
import { IExtLocation, IGooglePolygons, ILeafletPolygons, ILocation, IMapOption, IPolyline, IPopupStyle, LeafletLayerName } from "@ui-kit/common";
import { GoogleMap, LeafletMap } from "@ui-kit/components/index";
import { Culture } from "@ui-kit/core/index";
import { FitBoundsOptions } from "leaflet";
import { CSSProperties, FC } from "react";

export interface IMarkerAnimationProperty {
    animationPropertyAtStart: CSSProperties;
    animationPropertyAtEnd: CSSProperties;
    keyAttribute: string;
    valueAttribute: string;
}

export enum MapType { Google = 1, Leaflet }

interface IMapProps {
    displayOnlySvg?: true;
    areaPoints?: IExtLocation[];
    center?: ILocation;
    leafletFitBoundOption?: FitBoundsOptions;
    centerIcon?: string;
    fitBound?: boolean;
    onesFitBound?: boolean;
    height?: string;
    toolTipMarkerId?: string;
    leafletMapOption?: IMapOption<L.MapOptions>;
    leafletLayerName?: LeafletLayerName;
    mapType: MapType;
    gMapCode: string;
    markerAnimationProperty?: IMarkerAnimationProperty;
    markerIcon?: string;
    markers?: IExtLocation[];
    mode?: MapType;
    polyline?: IPolyline;
    googlePolygons?: IGooglePolygons[];
    leafletPolygons?: ILeafletPolygons[];
    popupStyle?: IPopupStyle;
    popupIndex?: number;
    searchbox?: boolean;
    svgElement?: string;
    transitionActivate?: boolean;
    style?: CSSProperties;
    googleMapOption?: IMapOption<google.maps.MapOptions>;
    draggableHandler?: (locate: IExtLocation) => void;
    onMarkerClick?: (marker: IExtLocation) => void;
    clickableHandler?: (e: any) => void;
}

export const Map: FC<IMapProps> = ({
    leafletLayerName,
    googleMapOption,
    areaPoints,
    leafletMapOption,
    style,
    popupStyle,
    transitionActivate,
    markerAnimationProperty,
    mapType,
    gMapCode,
    polyline,
    googlePolygons,
    leafletPolygons,
    fitBound,
    onesFitBound,
    markers,
    searchbox,
    height,
    mode,
    leafletFitBoundOption,
    displayOnlySvg,
    draggableHandler,
    clickableHandler,
    onMarkerClick
}) => {
    const type = mode || mapType;
    const { lang } = Culture.getLocale();
    const map = type === MapType.Google ?
        <Wrapper apiKey={gMapCode} libraries={['drawing', 'places']} language={lang || "en"} >
            <GoogleMap
                markers={markers}
                searchbox={searchbox}
                mapOptions={googleMapOption}
                style={style}
                polygons={googlePolygons}
                changedBoundHandler={draggableHandler}
                clickableHandler={clickableHandler}
                onMarkerClick={onMarkerClick}
            />
        </Wrapper>
        :
        <LeafletMap
            displayOnlySvg={displayOnlySvg}
            areaPoints={areaPoints}
            fitBound={fitBound}
            onesFitBound={onesFitBound}
            leafletLayerName={leafletLayerName}
            mapOption={leafletMapOption}
            markerAnimationProperty={markerAnimationProperty}
            markers={markers}
            polyline={polyline}
            popupStyle={popupStyle}
            searchbox={searchbox}
            transitionActivate={transitionActivate}
            onLocationUpdate={clickableHandler}
            polygons={leafletPolygons}
            fitBoundOption={leafletFitBoundOption}
        />;

    return (
        <div className="map" style={{ height: height }}>
            {map}
        </div>
    );
}