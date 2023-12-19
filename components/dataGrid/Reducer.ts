import { DataGridAction } from './DataGridAction';
import { IDataGridAction, IDataGridState } from "./index";


export const reducer = (state: IDataGridState, action: IDataGridAction): IDataGridState => {
    switch (action.type) {
        case (DataGridAction.SetSearchPanelProps):
            return { ...state, searchPanelProps: action.payload?.searchPanelProps }
        case (DataGridAction.SetHeaderFilterProps):
            return { ...state, headerFilterProps: action.payload?.headerFilterProps }
        case (DataGridAction.ActiveFilter):
            return { ...state, filterMode: action.payload?.filterMode }
        default:
            return { ...state, ...action.payload };
    }
}



