/* eslint-disable react-hooks/exhaustive-deps */
import { CheckboxInput } from "@ui-kit/components/index";
import { IMarkerGroup } from "@ui-kit/widgets/models";
import { FC, useContext } from "react";
import { MapWidgetAction, MapWidgetContext } from "./index";

interface IMarkerGroupsProps {
    dataSource: IMarkerGroup[];
    title?: string;
    onChangeMapMarkerGroups: (markerGroups: IMarkerGroup[]) => void;
}

export const MarkerGroups: FC<IMarkerGroupsProps> = ({ title, dataSource, onChangeMapMarkerGroups }) => {
    const { state: { selectedMarkerGroups }, dispatch } = useContext(MapWidgetContext);


    const onMarkerGroupsValueChange = (value: boolean, markerGroup: IMarkerGroup) => {
        if (value)
            selectedMarkerGroups?.push(markerGroup);
        else
            selectedMarkerGroups?.splice(selectedMarkerGroups.findIndex(x => x.contentItemId === markerGroup.contentItemId), 1);
        dispatch({ type: MapWidgetAction.SelectedMarkerGroups, payload: { selectedMarkerGroups: selectedMarkerGroups?.slice() } });
        onChangeMapMarkerGroups(selectedMarkerGroups || []);
    }

    return (
        <div className="marker-groups">
            {
                dataSource.length &&
                <h2 className="marker-groups-title">{title}</h2>
            }
            <ul className="marker-groups-content">
                {
                    dataSource?.map((markerGroup, index) =>
                        <li key={index} className="marker-groups-content-item flex flex-center justify-between">
                            <CheckboxInput
                                id={markerGroup.contentItemId}
                                value={selectedMarkerGroups?.find(x => x.contentItemId === markerGroup.contentItemId)}
                                label={markerGroup.displayText}
                                onChange={(name: string, value: boolean) => onMarkerGroupsValueChange(value, markerGroup)}
                            />
                            <div className="count flex flex-center justify-center">{markerGroup.markers?.contentItems.length}</div>
                        </li>)
                }
            </ul>

        </div>
    )
}