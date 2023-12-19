/* eslint-disable react-hooks/exhaustive-deps */
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import { DefaultGoogleValue, IExtLocation, IGooglePolygons, IMapOption, IPolyline } from "@ui-kit/common";
import { Icon } from "@ui-kit/components/index";
import { Translate } from "@ui-kit/service";
import { CSSProperties, FC, useEffect, useMemo, useRef, useState } from "react";

interface IGoogleMapProps {
    markers?: IExtLocation[];
    polyline?: IPolyline;
    polygons?: IGooglePolygons[];
    searchbox?: boolean;
    style?: CSSProperties;
    mapOptions?: IMapOption<google.maps.MapOptions>
    onMarkerClick?: (marker: IExtLocation) => void;
    clickableHandler?: (e: any) => void;
    changedBoundHandler?: (e: IExtLocation) => void;
}

let mapMarkers: google.maps.Marker[] = [];
let mapPolygens: google.maps.Polygon[] = [];
let markerClusterer: MarkerClusterer;
let map: google.maps.Map;

export const GoogleMap: FC<IGoogleMapProps> = ({ markers, polygons, style, mapOptions, searchbox, onMarkerClick, clickableHandler, changedBoundHandler }) => {
    const { tr } = Translate;
    const mapContainer = useRef<HTMLElement>(null);
    const searchInput = useRef<HTMLInputElement>(null);
    const [draggable, setDraggable] = useState<boolean>();
    const defaultValue = useMemo<DefaultGoogleValue>(() => ({
        center: { lat: 35.6892, lng: 51.3890, altitude: 0 },
        zoom: 10
    }), []);

    useEffect(() => {
        if (mapContainer.current) {
            map = new window.google.maps.Map(mapContainer.current, {
                ...mapOptions?.initial,
                zoom: mapOptions?.initial?.zoom || defaultValue.zoom,
                center: mapOptions?.initial?.center || defaultValue.center,
            });
        }
    }, [mapContainer.current]);

    useEffect(() => {
        if (map) {
            mapMarkers = [];
            var markers: google.maps.Marker[] = [];
            // add remaining marker property
            clickableHandler && map?.addListener('click', (e: any) => {
                mapMarkers.forEach(mr => mr.setMap(null))
                markers.forEach(mr => mr.setMap(null))
                const marker = new google.maps.Marker({
                    title: '',
                    position: { lat: e.latLng.lat(), lng: e.latLng.lng() },
                    map
                });
                markers.push(marker);
                clickableHandler(e);
            });

            changedBoundHandler && map?.addListener('bounds_changed', () => {
                mapMarkers.forEach(mr => mr.setMap(null));
                const locate: IExtLocation = {
                    lat: map.getCenter()?.lat() as number,
                    lng: map.getCenter()?.lng() as number
                };
                changedBoundHandler(locate);
            });
            //setMarkerClusterer(new MarkerClusterer({ map }))
            map?.addListener('dragstart', () => setDraggable(true));
            map?.addListener('dragend', () => setDraggable(false));
        }
    }, [map])

    useEffect(() => {
        // Construct the polygon
        mapPolygens.forEach(polygon => polygon.setMap(null));
        mapPolygens = [];
        polygons?.forEach(x => {
            const polygon = new google.maps.Polygon({
                paths: x?.paths,
                strokeColor: x?.strokeColor,
                strokeOpacity: x?.strokeOpacity,
                strokeWeight: x?.strokeWeight,
                fillColor: x?.fillColor,
                fillOpacity: x?.fillOpacity
            });
            polygon.set("id", x.id);
            polygon.set("invert", x.invert);
            polygon.setMap(map as google.maps.Map);
            mapPolygens.push(polygon);
        });
    }, [map, polygons])


    useEffect(() => {
        if (map && markers?.length) {
            mapMarkers.forEach(marker => {
                google.maps.event.clearListeners(marker, 'click');
                google.maps.event.clearListeners(marker, 'mouseover');
            });
            const deletedMarkers = mapMarkers.filter(marker => !markers.some(x => x.lat === marker.getPosition()?.lat() && x.lng === marker.getPosition()?.lng()));
            deletedMarkers.forEach(marker => marker.setMap(null))
            mapMarkers = mapMarkers.filter(marker => markers.some(x => x.lat === marker.getPosition()?.lat() && x.lng === marker.getPosition()?.lng()));
            let newMarkers = markers?.filter(marker => !mapMarkers.some(x => marker.lat === x.getPosition()?.lat() && marker.lng === x.getPosition()?.lng()));
            newMarkers?.forEach(mr => {
                const sizeOfMarker: number = 40;
                const marker = new google.maps.Marker({
                    icon: {
                        url: mr.icon as string,
                        size: new google.maps.Size(sizeOfMarker, sizeOfMarker),
                        anchor: new google.maps.Point(20, sizeOfMarker),
                        scaledSize: new google.maps.Size(sizeOfMarker, sizeOfMarker)
                    },
                    position: { lat: mr.lat, lng: mr.lng },
                    map: map,
                    animation: google.maps.Animation.DROP,
                });
                marker.set("id", mr.id);
                mapMarkers.push(marker);
            });
            markers.forEach(mr => {
                const marker = mapMarkers.find(m => m.get("id") === mr.id);
                marker?.setOpacity(mr.opacity || 1);
                if (mr.tooltip) {
                    const infoWindow = new google.maps.InfoWindow({
                        content: `<div class="marker">${mr.tooltip.html}</div>`
                    });
                    marker?.addListener(mr.tooltipDisplayMode === "OnClick" ? "click" : "mouseover", () => {
                        infoWindow.open({
                            anchor: marker,
                            map,
                            shouldFocus: false,
                        })
                    });
                    onMarkerClick && marker?.addListener("click", () => {
                        onMarkerClick(mr);
                    })
                    mr.tooltipDisplayMode === "OnHover" && marker?.addListener("mouseout", () => {
                        infoWindow.close();
                    })
                }
            })
            markers.find(mr => mr.fitOnThis) && fitBoundOnPropsMarkers(markers);
            // Add a marker clusterer to manage the markers
            markerClusterer?.clearMarkers();
            markerClusterer = new MarkerClusterer({ map });
            markerClusterer.addMarkers(mapMarkers);
        }
    }, [map, markers]);

    useEffect(() => {
        const searchBox = new google.maps.places.SearchBox(searchInput.current as HTMLInputElement);
        searchBox.addListener('places_changed', () => {
            const places = searchBox.getPlaces();
            places && fitBoundOnPlaces(places);
        })
    }, [map, searchbox, searchInput.current]);

    useEffect(() => {
        mapOptions?.current && map && map.setOptions(mapOptions?.current)
    }, [mapOptions?.current]);

    const fitBoundOnPropsMarkers = (markers: IExtLocation[]): void => {
        const bounds = new google.maps.LatLngBounds();
        markers.forEach(mr => mr.fitOnThis && bounds.extend(mr));
        map?.fitBounds(bounds);
    }

    const fitBoundOnPlaces = (places: google.maps.places.PlaceResult[]): void => {
        const bounds = new google.maps.LatLngBounds();
        places?.forEach(place => mapMarkers.push(new google.maps.Marker({
            map,
            icon: {
                url: place.icon as string,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25)
            },
            title: place.name, position: place.geometry?.location
        })));
        places.filter(place => place.geometry?.viewport).forEach(place => place.geometry?.viewport && bounds.union(place.geometry?.viewport));
        places.filter(place => !place.geometry?.viewport).forEach(place => place.geometry?.location && bounds.extend(place.geometry?.location));
        map?.fitBounds(bounds);
    }

    return (
        <main className="google-map" style={style}>
            <article className="article-map" ref={mapContainer} style={{ height: '100%' }}></article>
            {
                searchbox &&
                <aside className="aside-map">
                    <input type="text" ref={searchInput} placeholder={tr('map_search_box')} />
                    < Icon name="icon-search" />
                </aside>
            }
            {changedBoundHandler && <Icon name="icon-map-marker" className={draggable ? 'dragging' : ''} />}
        </main>
    )
}

export const showGoogleMarkerInfoWindow = (id: string) => {
    google.maps.event.trigger(mapMarkers.find(x => x.get("id") === id), "mouseover");
}

export const hideGoogleMarkerInfoWindow = (id: string) => {
    google.maps.event.trigger(mapMarkers.find(x => x.get("id") === id), "mouseout");
}

export const fitToPolygon = (id: string) => {
    const poly = mapPolygens.filter(x => x.get("id") === id)[mapPolygens.filter(x => x.get("id") === id).length - 1] || {} as google.maps.Polygon;
    if (Object.keys(poly).length) {
        let paths = poly.getPath() as any;
        if (poly.get("invert")) {
            paths?.cd?.splice(0, 8);
            paths?.cd?.splice(paths?.cd?.length - 1, 1);
        }
        var bounds = new google.maps.LatLngBounds();
        paths.forEach(function (element: any) { bounds.extend(element) });
        map.fitBounds(bounds);
    }
}