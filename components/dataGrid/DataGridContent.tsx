/* eslint-disable react-hooks/exhaustive-deps */
import { Culture } from "@core/index";
import PageController from "@pages/page/PageController";
import Translate from "@service/Translate";
import { CSSProperties, FC, Fragment, useContext, useState } from 'react';
import ContentLoader from "react-content-loader";
import Icon from "../Icon";
import { Column, IColumnProps } from "./Column";
import { HidingColumns } from "./HidingColumns";
import { DataGridContext, Editing, renderColumnValue, searchInAllColumns, setValueBaseOfDataField } from "./index";
interface IDataGridContentProps {
    onRowUpdating?: (record: any) => void;
    onRowRemoving?: (record: any) => void;
    style?: CSSProperties;
}

export const DataGridContent: FC<IDataGridContentProps> = (props) => {
    const { state } = useContext(DataGridContext);
    const { tr } = Translate;
    const { dir } = Culture.getLocale();
    const [currentHidingRow, setCurrentHidingRow] = useState<number>(-1);

    const filteredDataSource = (state?.props?.initialLoading ? Array(2)?.fill("") : state?.props?.dataSource as Array<any>)
        ?.filter(row => {
            let isFiltered = true;
            state.filterItems?.forEach(filterItem => {
                if (!filterItem.values?.some(x => searchInAllColumns(row, { columns: state.columnsProps, term: x })))
                    isFiltered = false;
            })
            return state?.props?.initialLoading || isFiltered
        })

    const renderColumn = (row: any, column: IColumnProps, index: number) => {
        const dataValue = renderColumnValue(row, column);

        return (
            <Column
                {...column}
                key={index}
                dataValue={setValueBaseOfDataField(row, column)}
            >
                {
                    PageController.handleView("mobileView") && column?.hidingPriority !== undefined ? ""
                        : state?.props?.borderCollapse === "separate" ?
                            <Fragment>
                                <div className="title">
                                    {column?.caption || tr(column?.dataField as string)}
                                </div>
                                <div className={`value ${state?.props?.initialLoading ? "flex" : ""}`}>
                                    {
                                        state?.props?.initialLoading ?
                                            <ContentLoader width="100%" height="23" rtl={dir === "rtl"}>
                                                <rect x="0" y="0" rx="8" ry="8" width="100%" height="23" />
                                            </ContentLoader>
                                            : dataValue
                                    }
                                </div>
                            </Fragment>
                            : state?.props?.initialLoading ?
                                <ContentLoader width="100%" height="23" rtl={dir === "rtl"}>
                                    <rect x="0" y="0" rx="8" ry="8" width="100%" height="23" />
                                </ContentLoader>
                                : dataValue
                }
            </Column>
        )
    }

    const onHidingColumnClick = (index: number) => {
        if (currentHidingRow === index) {
            setCurrentHidingRow(-1);
        }
        else {
            setCurrentHidingRow(index);
        }
    }

    return (
        <div
            className="data-grid-content"
            style={props.style}
        >
            <div className="data-grid-content-container">
                <table className="data-grid-table" >
                    <tbody>
                        {
                            filteredDataSource?.length ?
                                filteredDataSource.map((row, index) => {
                                    // Set status row
                                    const column = state?.columnsProps?.find(x => x.rowStatus);
                                    const dataValue = column ? setValueBaseOfDataField(row, column) : undefined;
                                    const colorIconPallete = column?.colorIconPallete?.find(x => x.key === dataValue);

                                    return (
                                        <Fragment key={index}>
                                            <tr className={`data-grid-content-row ${colorIconPallete?.color}`}>
                                                {
                                                    state?.columnsProps?.map((column, index) =>
                                                        renderColumn(row, column, index))
                                                }
                                                {
                                                    PageController.handleView("mobileView") && state?.columnsProps?.filter(column => column?.hidingPriority !== undefined).length ? ""
                                                        :
                                                        <Editing
                                                            row={row}
                                                            allowDeleting={state?.editingProps?.allowDeleting}
                                                            allowUpdating={state?.editingProps?.allowUpdating}
                                                            onRowRemoving={(row: any) => props?.onRowRemoving && props.onRowRemoving(row)}
                                                            onRowUpdating={(row: any) => props?.onRowUpdating && props.onRowUpdating(row)}
                                                        />
                                                }
                                                {
                                                    PageController.handleView("mobileView") && state?.columnsProps?.filter(column => column?.hidingPriority !== undefined).length ?
                                                        <Column
                                                            width="45px"
                                                            className="hiding-columns-btn"
                                                            onClick={() => onHidingColumnClick(index)}
                                                        >
                                                            <div className="hiding-columns-btn-container flex flex-center">
                                                                <Icon
                                                                    color="grey"
                                                                    name={`${state.props?.borderCollapse === "collapse" ? "icon-dots-horizontal" :
                                                                        currentHidingRow === index ? "icon-chevron-up"
                                                                            : "icon-chevron-down"
                                                                        }`}
                                                                />
                                                            </div>
                                                        </Column>
                                                        : ""
                                                }
                                            </tr>
                                            {
                                                currentHidingRow === index &&
                                                <HidingColumns
                                                    dataSource={row}
                                                    onRowRemoving={(row: any) => props?.onRowRemoving && props.onRowRemoving(row)}
                                                    onRowUpdating={(row: any) => props?.onRowUpdating && props.onRowUpdating(row)}
                                                />
                                            }
                                        </Fragment>
                                    )
                                }
                                )
                                : <tr className="data-grid-content-row">
                                    <Column
                                        className="column record-not-found"
                                        colSpan={state?.colSpan}
                                    >
                                        {tr("msg_record_not_found")}
                                    </Column>
                                </tr>
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}

