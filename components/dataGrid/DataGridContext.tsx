import { ColumnType } from "@common/enum/ColumnType";
import { createCtx } from "@misc/Context";
import { formatToDate } from "@utilize/Format";
import Icon from "../Icon";
import { IFilterProps } from './Filter/Filter';
import { IColumnProps, IDataGridAction, IDataGridProps, IEditingProps } from "./index";
import { ISearchPanelProps } from "./SearchPanel";

export interface IFilterItem {
    keyExpr?: string;
    values?: string[];
}
export interface IDataGridState {
    props?: IDataGridProps<any>;
    searchPanelProps?: ISearchPanelProps;
    headerFilterProps?: IFilterProps;
    columnsProps?: IColumnProps[];
    editingProps?: IEditingProps;
    colSpan?: number;
    filterItems?: IFilterItem[];
    filterMode?: boolean;
    popoverDisable?: boolean;
}

export const DataGridContext = createCtx<IDataGridState, IDataGridAction>({});

export function setDataSourceBaseOnColumnType(dataSource: any[], column: IColumnProps): string[] {
    switch (column?.dataType) {
        case ColumnType.enum:
            return column?.colorIconPallete ? column?.colorIconPallete
                .filter(x => (dataSource as any[])
                    ?.some(row => setValueBaseOfDataField(row, column as IColumnProps) === x.key)).map(x => x.vocab) : [];
        default:
            const dataSourceInstance: string[] = [];
            (dataSource as any[])?.forEach(row => {
                let value = setValueBaseOfDataField(row, column as IColumnProps);
                if (column.cellRender)
                    value = column.cellRender(value);
                !dataSourceInstance.some(x => x === value) && dataSourceInstance.push(value)
            })
            return dataSourceInstance.slice()
    }
}

export function searchInAllColumns(row: any, options: { columns?: IColumnProps[], term: string }) {
    let isFound = false;
    options.columns?.forEach(column => {
        let value;
        switch (column.dataType) {
            case ColumnType.enum:
                value = column.colorIconPallete?.find(x => x.key === row[column.dataField as keyof any])?.vocab;
                break;
            default:
                value = setValueBaseOfDataField(row, column as IColumnProps);
                if (column.cellRender)
                    value = column.cellRender(value);
        }
        if (value.toLowerCase().indexOf(options?.term?.toLowerCase()) !== -1)
            isFound = true;
    })
    return isFound;
}

export function renderColumnValue(row: any, column: IColumnProps) {
    const dataValue = setValueBaseOfDataField(row, column);

    return column?.cellRender ? column.cellRender(dataValue)
        : renderValue(dataValue, column);

    function renderValue(dataValue: any, column: IColumnProps) {
        const colorIconPallete = column?.colorIconPallete?.find(x => x.key === dataValue);
        switch (column.dataType) {
            case ColumnType.date:
                return formatToDate(dataValue);
            case ColumnType.number:
                return (dataValue as number).toLocaleString();
            case ColumnType.enum:
                return <div className={`flex align-center status-cell ${colorIconPallete?.color}`}>
                    <span className="flex flex-center">
                        {
                            colorIconPallete?.icon &&
                            <Icon
                                name={colorIconPallete?.icon} />
                        }
                    </span>
                    <span className="status-title">{colorIconPallete?.vocab}</span>
                </div>
            default:
                return dataValue;
        }
    }
}

export function setValueBaseOfDataField(row: any, column: IColumnProps) {
    const dataField = column?.dataField as string;
    const splitDataField = dataField?.split('.') ?? [];
    let dataValue = row;
    for (let i = 0, le = splitDataField?.length; i < le; i++) {
        dataValue = dataValue ? dataValue[splitDataField[i]] : "";
    }
    return dataValue;
}