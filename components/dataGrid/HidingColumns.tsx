/* eslint-disable react-hooks/exhaustive-deps */
import Translate from "@service/Translate";
import { FC, Fragment, useContext } from "react";
import Button from "../form/Button";
import { Column, IColumnProps } from "./Column";
import { DataGridContext, renderColumnValue } from "./index";
interface IDataGridContentProps {
    dataSource?: any;
    onRowUpdating?: (record: any) => void;
    onRowRemoving?: (record: any) => void;
}

export const HidingColumns: FC<IDataGridContentProps> = (props) => {
    const { state } = useContext(DataGridContext);
    const { tr } = Translate;

    const renderHidindColumns = (column: IColumnProps) => {
        return (
            <Fragment>
                <div className="title">
                    {column?.caption || tr(column?.dataField as string)}:
                </div>
                <div className="value flex-grow">
                    {renderColumnValue(props.dataSource, column)}
                </div>
            </Fragment>
        )
    }

    return (
        <tr className="data-grid-hiding-columns">
            <Column
                colSpan={state.colSpan}
            >
                <div className="hiding-columns-container">
                    {state?.columnsProps?.filter(column => column?.hidingPriority !== undefined).sort((a, b) => (a.hidingPriority || 0) - (b.hidingPriority || 0)).map((column, index) =>
                        <div key={index} className="flex hiding-columns-item">
                            {renderHidindColumns(column)}
                        </div>
                    )}
                    {
                        (state?.editingProps?.allowDeleting || state?.editingProps?.allowUpdating) ?
                            <div className="column button-edit-remove-group">
                                <div className="btn-container">
                                    {
                                        state?.editingProps?.allowUpdating &&
                                        <Button
                                            text={tr("btn_modify")}
                                            icon="icon-edit"
                                            loading={state.props?.initialLoading}
                                            onClick={() => props?.onRowUpdating && props.onRowUpdating(props.dataSource)}
                                        />
                                    }
                                    {
                                        state?.editingProps?.allowDeleting &&
                                        <Button
                                            text={tr("btn_delete")}
                                            icon="icon-delete"
                                            loading={state.props?.initialLoading}
                                            onClick={() => props?.onRowRemoving && props.onRowRemoving(props.dataSource)}
                                        />
                                    }
                                </div>
                            </div>
                            : null
                    }
                </div>
            </Column>

        </tr>
    )
}