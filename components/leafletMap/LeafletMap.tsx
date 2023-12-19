/* eslint-disable react-hooks/exhaustive-deps */
import lShadow from '@ui-kit/assets/images/office-marker-shadow.png';
import lIcon from '@ui-kit/assets/images/office-marker.svg';
import { DefaultLeafletValue, IExtLocation, ILeafletPolygons, ILocation, IMapOption, IPolyline, IPopupStyle, LeafletLayerName } from '@ui-kit/common';
import { IMarkerAnimationProperty } from '@ui-kit/components/index';
import { convertingNodesToArray } from '@ui-kit/utilize';
import L, { FitBoundsOptions, IconOptions } from "leaflet";
import { CSSProperties, FC, useEffect, useMemo, useRef, useState } from "react";

interface ILeafletMapProps {
    displayOnlySvg?: boolean;
    areaPoints?: IExtLocation[];
    polygons?: ILeafletPolygons[];
    fitBound?: boolean;
    fitBoundOption?: FitBoundsOptions;
    onesFitBound?: boolean;
    leafletLayerName?: LeafletLayerName;
    mapOption?: IMapOption<L.MapOptions>;
    markers?: IExtLocation[];
    markerAnimationProperty?: IMarkerAnimationProperty;
    markerIcon?: string;
    polyline?: IPolyline;
    popupStyle?: IPopupStyle;
    searchbox?: boolean;
    transitionActivate?: boolean;
    onMarkerClick?: (id: number) => void;
    onLocationUpdate?: (location: ILocation) => void;
}

export const LeafletMap: FC<ILeafletMapProps> = ({
    mapOption,
    fitBoundOption,
    leafletLayerName,
    popupStyle,
    transitionActivate,
    areaPoints,
    markerAnimationProperty,
    markers,
    onLocationUpdate,
    polyline,
    fitBound,
    onesFitBound,
    polygons,
    displayOnlySvg,
}) => {
    const mapWrapper = useRef<HTMLDivElement>(null);
    const [map, setMap] = useState<L.Map>();
    const [mapMarkers, setMapMarkers] = useState<{ marker: IExtLocation, mapMarker: L.Marker }[]>([]);
    const [polyLines, setPolyLines] = useState<L.Polyline[] | undefined>([]);
    const [fitBounding, setFitBound] = useState<boolean>(fitBound!);
    const defaultValue = useMemo<DefaultLeafletValue>(() => ({
        center: { lat: 35.6892, lng: 51.3890, altitude: 0 },
        zoom: 10
    }), []);
    const greenIcon = L.icon({
        iconUrl: lIcon,
        shadowUrl: lShadow,
        iconSize: [40, 40], // size of the icon
        shadowSize: [40, 40], // size of the shadow
        iconAnchor: [20, 40], // point of the icon which will correspond to marker's location
        shadowAnchor: [14, 40],  // the same for the shadow
        popupAnchor: [0, -45] // point from which the popup should open relative to the iconAnchor
    });

    useEffect(() => {
        if (!map) {
            const tailLayerData = [
                { name: 'DefaultLayer', url: 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png' },
                { name: 'StandardLayer', url: 'https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png' }
            ]
            const tailLayerUrl = leafletLayerName ? tailLayerData.find(item => item.name === LeafletLayerName[leafletLayerName])?.url || tailLayerData[0].url : tailLayerData[0].url;
            if (mapWrapper && mapWrapper.current) {
                const initMap = L.map(mapWrapper.current, {
                    ...mapOption?.initial,
                    zoom: mapOption?.initial?.zoom ?? defaultValue.zoom,
                    center: mapOption?.initial?.center ?? defaultValue.center,
                    zoomAnimation: mapOption?.initial.zoomAnimation ?? true,
                    doubleClickZoom: mapOption?.initial.doubleClickZoom ?? false,
                    trackResize: mapOption?.initial.trackResize ?? false,
                });
                L.tileLayer(tailLayerUrl).addTo(initMap);
                setMap(initMap);
            }
        }
    }, [mapWrapper]);

    useEffect(() => {
        (mapOption?.current && map) && handleMapOptionOfCurrentOption(mapOption?.current);
    }, [JSON.stringify(mapOption?.current), map])

    useEffect(() => {
        if (map) {
            // <refactor: use setTimeOut in this line>
            removeMarkers();
            markers?.filter(loc => loc.lat || loc.lng)?.forEach((loc, index) => setTimeout(() => addMarker(loc, index), 60));
            ((!areaPoints?.length) && fitBounding) && setBoundingArea(markers);
            onesFitBound && setFitBound(false);
            map.on('zoomstart', () => removeTransition(getPolyLineOfDom()));
            map.on('zoomend', () => addTransition(getPolyLineOfDom()));
        }
    }, [JSON.stringify(markers), map]);

    useEffect(() => {
        (map && areaPoints) && setBoundingArea(areaPoints);
        // ** Effect on RouteDemonstration responsive mode **
    }, [map, mapOption?.current?.dragging]);

    useEffect(() => {
        if (markerAnimationProperty)
            setAnimateAndEventForMarker(markerAnimationProperty, polyline?.delayForDrowningInEachGroup);
    }, [mapMarkers]);

    useEffect(() => {
        if (map && polyline) {
            if (polyLines) {
                polyLines.forEach((item) => {
                    map.removeLayer(item);
                });
            }
            const newPolyLines = drawingPolyLine(polyline);
            setPolyLines(newPolyLines);
            drawingPolygons();
        }
    }, [polyline?.paths, map]);

    useEffect(() => {
        if (map && polygons) {
            drawingPolygons();
        }
    }, [map, JSON.stringify(polygons)])

    const removeTransition = (polyLines: SVGPathElement[]) => {
        polyLines.forEach(polyLine => polyLine.style.transition = 'unset')
    }

    const addTransition = (polyLines: SVGPathElement[]) => {
        setTimeout(() => {
            polyLines.forEach(polyLine => polyLine.style.transition = 'd 0.7s ease')
        }, 500)
    }

    const handleMapOptionOfCurrentOption = (currentOption: L.MapOptions): void => {
        for (let option in currentOption) {
            if ((currentOption[option as keyof L.MapOptions] !== undefined)) {
                let key = option as keyof L.Map;
                (map && (currentOption[option as keyof L.MapOptions]) ?
                    (map[key] as L.Handler)?.enable() : (map && map[key] as L.Handler)?.disable());
            }
            if (currentOption.center && currentOption.zoom)
                map?.setView(currentOption.center!, currentOption.zoom);
        }
    }

    const removeMarkers = () => {
        if (mapMarkers)
            mapMarkers.filter((marker) => !marker.marker.remainedState).forEach(marker => map?.removeLayer(marker.mapMarker));
    }

    const addMarker = (loc: IExtLocation, index: number) => {
        let marker: L.Marker = {} as L.Marker;
        if (loc.divIcon)
            marker = L.marker(loc, { icon: L.divIcon(loc.divIcon), title: loc.content?.contentTitle, ...loc.option });
        else
            marker = L.marker(loc, { icon: loc.icon ? L.icon(loc.icon as IconOptions) : greenIcon, title: loc.content?.contentTitle, });
        if (loc.popupConfig || loc.content)
            marker.bindPopup(loc.content?.container || "", loc.popupConfig);
        if (map) {
            marker.addTo(map);
            loc.eventConfig && marker.on(loc.eventConfig?.eventType, (e) => loc.eventConfig?.handler(e))
            if (loc.popupConfig?.openPopup) {
                if (loc.popupConfig.popupDelay && index !== 0) {
                    setTimeout(() => {
                        marker.openPopup()
                        if (popupStyle) {
                            if (popupStyle.popupIndex === index)
                                setStyleAndAnimationForPopup(popupStyle)
                        }
                    }, 1000 + index * loc.popupConfig.popupDelay)
                } else {
                    marker.openPopup()
                    if (popupStyle) {
                        if (popupStyle.popupIndex === index)
                            setStyleAndAnimationForPopup(popupStyle)
                    }
                }
            }
        }
        setMapMarkers(previewState => [...previewState, ({ mapMarker: marker, marker: loc })]);
    }

    const setBoundingArea = (boundingPoints: IExtLocation[] | undefined) => {
        const latLangs: L.LatLng[] = [];
        boundingPoints?.forEach(marker => {
            latLangs.push(L.latLng(marker.lat, marker.lng));
        })
        const bounds = L.latLngBounds(latLangs);
        latLangs[0] && map?.fitBounds(bounds, fitBoundOption);
        map?.setZoom(mapOption?.initial.zoom!);
    }

    const drawingPolyLine = (polyLineData: IPolyline): L.Polyline[] | undefined => {
        const polyLines: L.Polyline[] | undefined = polyLineData.paths?.map(item => {
            const polyLinePoints = (item as ILocation[]).map(point => new L.LatLng(point.lat, point.lng));
            return L.polyline(polyLinePoints, polyline?.polyLineOption).addTo(map as L.Map) as L.Polyline;
        });
        const paths = polyLines?.map(p => p.getElement()).filter(polyline => polyline) as SVGElement[];
        polyLineData.animationForLine && setAnimateAndCurveForLine(polyLineData.delayForDrowningInEachGroup, polyLineData.lineCurve, paths, polyLineData?.transitionTime);
        return polyLines;
    }

    const drawingPolygons = () => {
        const instancePolygons = polygons?.filter(x => x.paths?.length)?.map(polygon => L.polygon(polygon.paths!, polygon.options));
        instancePolygons?.forEach(x => x.addTo(map as L.Map));
    }

    return (
        <div className={`leaflet-map${transitionActivate ? " active" : ""}${!mapOption?.current?.zoomControl ? " leaflet-control-hide" : ""}${displayOnlySvg ? " frame" : ""}`}>
            <div ref={mapWrapper} className="map-wrapper" />
            {onLocationUpdate ? <img className="marker" src="img/icons/marker.png" alt="marker" /> : null}
        </div>
    )
}

const getPolyLineOfDom = (): SVGPathElement[] => {
    const paths = document.querySelectorAll('path');
    const pathsArray = convertingNodesToArray<SVGPathElement>(paths) as SVGPathElement[];
    return pathsArray
}

const setAnimateAndCurveForLine = (delay: number | undefined, relatedCurve: boolean | undefined, paths: Element[], transitionTime?: number) => {
    paths?.forEach((path, index) => {
        const pathProperty = path.getAttribute('d');
        (path as HTMLElement)?.style.setProperty('transition', `d ${transitionTime ?? 0.7}s ease`);
        const indexOfLPath = pathProperty?.indexOf('L');
        const mPath = pathProperty?.slice(1, indexOfLPath);
        let endPoint1 = `M${mPath}l0 0`;
        let endPoint2 = '0'
        if (relatedCurve) {
            const [point1, point2] = getPointOfSvgForLine(pathProperty as string);
            const bezierPoint = [(point2[0] - point1[0]) / 2, (point2[1] - point1[1]) / 3]
            endPoint1 = `M${mPath}q0 0 0 0`;
            endPoint2 = `M${mPath} q${bezierPoint[0]} ${bezierPoint[1]} ${point2[0] - point1[0]} ${point2[1] - point1[1]}`
        } else endPoint2 = pathProperty as string
        const setAttribValue = [endPoint1, endPoint2];
        if (setAttribValue[0]) {
            path?.setAttribute('d', setAttribValue[0]);
            delay = delay ? delay : 0;
            setTimeout(() => {
                if (setAttribValue[1]) path?.setAttribute('d', setAttribValue[1]);
            }, 100 + (delay * index))
        }
    })
}

const setAnimateAndEventForMarker = (markerAnimationProperty: {
    animationPropertyAtStart: CSSProperties,
    animationPropertyAtEnd: CSSProperties,
    keyAttribute: string,
    valueAttribute: string
},
    delay: number | undefined) => {
    const markers = document.querySelectorAll('img');
    const markersArray = convertingNodesToArray<HTMLImageElement>(markers) as HTMLImageElement[];
    const targetMarket = markersArray.filter(item =>
        item.getAttribute(markerAnimationProperty.keyAttribute) === markerAnimationProperty.valueAttribute
    )
    targetMarket.forEach((marker, index) => {
        const style = marker.style as any;
        for (const property in markerAnimationProperty.animationPropertyAtStart) {
            const targetCss = property as keyof CSSProperties;
            if (markerAnimationProperty.animationPropertyAtStart.hasOwnProperty(property)) {
                const value = markerAnimationProperty.animationPropertyAtStart[targetCss];
                style[property] = value;
            }
        }
        delay = delay ? delay : 0;
        setTimeout(() => {
            for (const property in markerAnimationProperty.animationPropertyAtStart) {
                const targetCss = property as keyof CSSProperties;
                const style = marker.style as any;
                style[property] = markerAnimationProperty.animationPropertyAtEnd[targetCss]
            }
        }, 1200 + (delay * index))
    }
    )

}

const setStyleAndAnimationForPopup = (targetStyle: IPopupStyle) => {
    const popup = document.querySelectorAll('.leaflet-popup');
    const popupArray = convertingNodesToArray(popup) as HTMLElement[];
    const popupContent = document.querySelectorAll('.leaflet-popup-content');
    const popupContentArray = convertingNodesToArray(popupContent) as HTMLElement[];
    const targetElement = popupContentArray.pop() as HTMLElement;
    if (targetStyle.popupStyle) setStyleOfProps(targetStyle.popupStyle, targetElement)
    if (targetStyle.popupAnimation && popupArray.pop()) {
        const popupTarget = popupArray.pop() as HTMLElement;
        setStyleOfProps(targetStyle.popupAnimation?.start as CSSProperties, popupTarget);
        setTimeout(() => setStyleOfProps(targetStyle.popupAnimation?.end as CSSProperties, popupTarget), 60)
    }
}

const getPointOfSvgForLine = (path: string): [number[], number[]] => {
    const mIndex = path.indexOf('M');
    const lIndex = path.indexOf('L');
    const pointString1 = path.slice(mIndex + 1, lIndex);
    const pointString2 = path.slice(lIndex + 1, path.length + 1);
    const point1 = [Number(pointString1.slice(0, pointString1.indexOf(' '))), Number(pointString1.slice(pointString1.indexOf(' '), pointString1.length + 1))];
    const point2 = [Number(pointString2.slice(0, pointString2.indexOf(' '))), Number(pointString2.slice(pointString2.indexOf(' '), pointString2.length + 1))];
    return [point1, point2]
}

const setStyleOfProps = <T extends CSSProperties>(styleContainer: T, element: HTMLElement): void => {
    const style = element?.style as any;
    for (const property in styleContainer) {
        const targetCss = property as keyof CSSProperties;
        if (styleContainer.hasOwnProperty(property)) {
            const value = styleContainer[targetCss];
            if (style) style[property] = value;
        }
    }
}