/* eslint-disable react-hooks/exhaustive-deps */
import { IExtLocation, ILocation, LeafletLayerName, ViewPort } from "@ui-kit/common";
import { Map, MapType } from "@ui-kit/components/index";
import { getWidth } from "@ui-kit/utilize";
import { IMapPolygen, IMapWidget, IMarker, IMarkerGroup, getFilePath } from "@ui-kit/widgets/index";
import { FC, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { MapWidgetAction, MapWidgetContext, MarkerGroups, reducer } from "./index";

interface IMapWidgetProps {
    contentMediaPath: string;
    dataSource: IMapWidget;
    mapType: MapType;
    gMapCode: string;
}

export const MapWidget: FC<IMapWidgetProps> = (props) => {
    const { contentMediaPath, mapType, gMapCode, dataSource: mapWidget } = props;
    const mapWidgetRef = useRef<HTMLDivElement>(null);
    const { medium } = ViewPort;
    const widthTimer = useRef<NodeJS.Timeout>();
    const [width, SetWidth] = useState<number>(getWidth());
    const initialGoogleMap: google.maps.MapOptions = width > medium ? { zoom: mapWidget?.zoom, center: { lat: mapWidget.center?.latitude || 0, lng: mapWidget.center?.longitude || 0 } }
        : { zoom: 5, center: { lat: 31.0817841, lng: 53.07171 } }
    const [currentGoogleMapOptions, setCurrentGoogleMapOptions] = useState<google.maps.MapOptions>(initialGoogleMap);
    const [state, dispatch] = useReducer(reducer, {
        dataSource: [],
        markerGroups: [],
        polys: mapWidget?.layers?.contentItems?.flatMap(layer => layer.overlies?.contentItems || {})
            .concat(mapWidget?.layers?.contentItems?.flatMap(layer => layer.overlies?.contentItems.filter(p => p.invert)
                .map(p => ({ ...p, invert: false, fillOpacity: 0, stroke: "#c9c9c9", strokeWidth: 3, strokeOpacity: 1 })) || {})) || [],
        selectedMarkerGroups: [],
        mapMarkers: [],
    });

    useEffect(() => {
        const markerGroups: IMarkerGroup[] = [];
        if (mapWidget?.dataSource?.some(x => x === "Custom")) {
            mapWidget.markerGroups?.contentItems?.forEach(markerGroup => markerGroups.push(markerGroup));
        }
        window.addEventListener("resize", onResize);

        return (() => window.removeEventListener("resize", onResize))
    }, [])

    useEffect(() => {
        onChangeMapMarkerGroups(state.markerGroups);
    }, [state.markerGroups])

    useEffect(() => {
        if (state.currentMarker?.contentItemId) {
            setCurrentGoogleMapOptions({
                zoom: 16,
                center: { lat: state.currentMarker?.location?.latitude || 0, lng: state.currentMarker?.location?.longitude || 0 }
            });
        }
        else {
            setCurrentGoogleMapOptions(initialGoogleMap);
        }
    }, [state.currentMarker])


    const onResize = () => {
        clearTimeout(widthTimer.current as NodeJS.Timeout);
        widthTimer.current = setTimeout(() => {
            SetWidth(getWidth());
        }, 200);
    }

    const onChangeMapMarkerGroups = (selectedMarkerGroups: IMarkerGroup[]) => {
        const mapMarkers: IExtLocation[] = [];
        state?.markerGroups?.filter(markerGroup => !selectedMarkerGroups.length || selectedMarkerGroups.some(x => x.contentItemId === markerGroup.contentItemId)).forEach(markerGroup => markerGroup.markers?.contentItems.forEach((marker: IMarker) =>
            mapMarkers.push({
                id: marker.contentItemId,
                icon: getFilePath(contentMediaPath, (marker.icon?.paths[0] ?? markerGroup.defaultMarkerIcon?.paths[0]) || ''),
                lat: marker.location?.latitude as number,
                lng: marker.location?.longitude as number,
                opacity: 1,
                tooltip: marker.tooltip,
                tooltipDisplayMode: marker.tooltipDisplayMode,
            })));
        dispatch({ type: MapWidgetAction.MapMakers, payload: { mapMarkers: mapMarkers } });
    }

    const onMarkerClick = (marker: IExtLocation) => {
        const markerGroup: IMarkerGroup = state.markerGroups?.find(markerGroup => markerGroup?.markers?.contentItems?.some(x => x.contentItemId === marker.id)) || {};
        dispatch({
            type: MapWidgetAction.CurrentMarker, payload: {
                currentMarker: markerGroup?.markers?.contentItems.find(x => marker.id === x.contentItemId)
            }
        });
    }

    return (
        <MapWidgetContext.Provider
            value={useMemo(() => { return { state, dispatch } }, [state, dispatch])}
        >
            <div ref={mapWidgetRef} className="map-widget" style={{ height: "100vh" }}>
                <Map
                    mode={mapWidget?.provider === MapType[MapType.Google] ? MapType.Google : MapType.Leaflet}
                    mapType={mapType}
                    gMapCode={gMapCode}
                    googleMapOption={{
                        initial: {
                            zoomControl: false,
                            scaleControl: false,
                            draggable: mapWidget.zoomEnable,
                            fullscreenControl: false,
                            mapTypeControl: false,
                            streetViewControl: false,
                            zoom: initialGoogleMap.zoom,
                            minZoom: initialGoogleMap.zoom,
                            mapTypeId: mapWidget.style?.toLowerCase(),
                            center: initialGoogleMap.center
                        },
                        current: currentGoogleMapOptions
                    }}
                    googlePolygons={state.polys.map(p => {
                        return {
                            id: p.contentItemId,
                            invert: p.invert,
                            paths: getPolygonPath(p),
                            strokeColor: p.stroke,
                            strokeWeight: p.strokeWidth,
                            strokeOpacity: p.strokeOpacity,
                            fillColor: p.fill,
                            fillOpacity: p.fillOpacity
                        }
                    })}
                    leafletLayerName={LeafletLayerName.StandardLayer}
                    leafletMapOption={{
                        initial: {
                            dragging: false,
                            zoomControl: false,
                            scrollWheelZoom: false,
                            zoom: mapWidget?.zoom,
                            center: {
                                lat: mapWidget.center?.latitude || 0,
                                lng: mapWidget.center?.longitude || 0
                            }
                        }
                    }}
                    markers={state.mapMarkers.filter(x => x.opacity === 1)}
                    onMarkerClick={onMarkerClick}
                />
                <div className="content-section flex flex-start column-direction">
                    {
                        (state.markerGroups.length || 0) > 1 &&
                        <MarkerGroups
                            title={mapWidget.displayText}
                            dataSource={state.markerGroups}
                            onChangeMapMarkerGroups={onChangeMapMarkerGroups}
                        />
                    }
                </div>
            </div >
        </MapWidgetContext.Provider>
    )
}

export function getPolygonPath(polygon: IMapPolygen) {
    if (polygon.points) {
        const points = JSON.parse(polygon.points || "") as number[][];
        if (polygon.invert) {
            points.unshift([0, 90], [180, 90], [180, -90], [0, -90], [-180, -90], [-180, 0], [-180, 90], [0, 90]);
            points.push([0, 90]);
        }
        const path: ILocation[] = [];
        for (let i = 0; i < points.length; i++) {
            path.push({ lat: points[i][1], lng: points[i][0] });
        }
        return path.slice();
    }
}