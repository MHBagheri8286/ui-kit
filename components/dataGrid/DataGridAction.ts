import { IDataGridState } from "./DataGridContext";


export enum DataGridAction {
    Props,
    SetColumnsProps,
    SetEditingProps,
    ColSpan,
    CurrentCol,
    ActiveFilter,
    SetFilterItems,
    SetSearchPanelProps,
    SetHeaderFilterProps,
    ShowPopover,
    HiddenPopover
}

export interface IDataGridAction {
    type: DataGridAction;
    payload?: Partial<IDataGridState>;
}