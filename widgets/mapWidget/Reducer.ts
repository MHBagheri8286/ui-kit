import { IMapWidgetAction } from "./MapWidgetAction";
import { IMapWidgetState } from "./MapWidgetContext";

export const reducer = (state: IMapWidgetState, action: IMapWidgetAction): IMapWidgetState => {

    return { ...state, ...action.payload };
}