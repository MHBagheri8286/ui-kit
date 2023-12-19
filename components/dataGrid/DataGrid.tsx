/* eslint-disable react-hooks/exhaustive-deps */
import { IDictionary } from "@common/models";
import PageController from "@pages/page/PageController";
import Translate from "@service/Translate";
import { Children, ReactElement, useEffect, useMemo, useReducer, useState } from "react";
import { FieldValues, UseFormHandleSubmit } from "react-hook-form";
import { Dialog } from "../dialog";
import Button from "../form/Button";
import Form, { IFormControlProps } from "../form/Form";
import { ILabelProps } from "../Label";
import { MessageBox, MessageBoxBtn, MessageBoxBtnGroup } from "../MessageBox";
import { IColumnProps } from "./Column";
import { DataGridContent } from "./DataGridContent";
import { DataGridHeader } from "./DataGridHeader";
import { Filter } from "./Filter";
import { IFilterProps } from "./Filter/Filter";
import { DataGridAction, DataGridContext, IEditingProps, IToolbarProps, reducer, Toolbar } from "./index";
import SearchPanel, { ISearchPanelProps } from "./SearchPanel";


export interface IDataGridProps<TItem> extends IFormControlProps {
    label?: ILabelProps;
    dataSource?: string | Array<TItem>;
    initialLoading?: boolean;
    keyExpr?: string;
    columnAutoWidth?: boolean;
    columns?: IColumnProps[];
    rowStatusColorPallete?: IDictionary<string>;
    rowStatusColor?: string;
    onAddingStart?: () => void;
    onRowAdding?: () => Promise<boolean>;
    onEditingStart?: (record: any) => void;
    onRowUpdating?: () => Promise<boolean>;
    onRowRemoving?: (record: any) => Promise<boolean>;
    borderCollapse?: "collapse" | "separate";
    columnHidingEnabled?: boolean;
    showBorders?: boolean;
    alignItems?: "start" | "center" | "end";
    height?: string;
    handleSubmit?: UseFormHandleSubmit<FieldValues>;
}

export const DataGrid = <TItem extends object>(props: IDataGridProps<TItem>) => {
    const { tr } = Translate;
    const [state, dataGridDispatch] = useReducer(reducer, {
        filterItems: []
    });
    const [currentRow, setCurrentRow] = useState<any>();
    const [deleteDialogVisibility, setDeleteDialogVisibility] = useState<boolean>(false);
    const [recordDialogVisibility, setRecordDialogVisibility] = useState<boolean>(false);
    const columns = props?.columns?.length ? props.columns
        : (Children.toArray(props?.children)?.filter((child: any) => child.type?.displayName === "Column") as ReactElement<IColumnProps>[])
            .map(element => element.props);
    const editing = Children.toArray(props?.children).find((child: any) => child.type?.displayName === "Editing") as ReactElement<IEditingProps>;
    const toolbar = Children.toArray(editing?.props?.children).find((child: any) => child.type?.displayName === "ToolBar") as ReactElement<IToolbarProps>;
    const searchPanel = Children.toArray(props?.children).find((child: any) => child.type?.displayName === "SearchPanel") as ReactElement<ISearchPanelProps>;
    const headerFilter = Children.toArray(props?.children).find((child: any) => child.type?.displayName === "HeaderFilter") as ReactElement<IFilterProps>;

    useEffect(() => {
        dataGridDispatch({ type: DataGridAction.Props, payload: { props: { ...props } } })
    }, [props.dataSource, props.initialLoading])

    useEffect(() => {
        dataGridDispatch({ type: DataGridAction.SetColumnsProps, payload: { columnsProps: columns } });
        dataGridDispatch({ type: DataGridAction.SetEditingProps, payload: { editingProps: editing?.props } });
        dataGridDispatch({ type: DataGridAction.SetSearchPanelProps, payload: { searchPanelProps: searchPanel?.props } });
        dataGridDispatch({ type: DataGridAction.SetHeaderFilterProps, payload: { headerFilterProps: headerFilter?.props } });
    }, [])

    useEffect(() => {
        let colSpan = state?.columnsProps?.length || 0;
        colSpan += PageController.handleView("desktopView") && (editing?.props?.allowUpdating || editing?.props?.allowDeleting) ? 1 : 0;
        colSpan += PageController.handleView("mobileView") && (state?.columnsProps?.filter(column => column?.hidingPriority !== undefined).length) ? 1 : 0;
        dataGridDispatch({ type: DataGridAction.ColSpan, payload: { colSpan } })
    }, [state.columnsProps])

    const onAddingStart = () => {
        setCurrentRow(undefined);
        setRecordDialogVisibility(true);
        props.onAddingStart && props?.onAddingStart();
    }

    const onRowAdding = (): Promise<boolean> => {
        return new Promise((resolve) => {
            props?.onRowAdding && props?.onRowAdding()
                .then(() => {
                    setRecordDialogVisibility(false);
                    resolve(true);
                });
        })
    }

    const onEditingStart = (row: any) => {
        setCurrentRow({ ...row })
        setRecordDialogVisibility(true);
        props.onEditingStart && props?.onEditingStart(row);
    }

    const onRowUpdating = () => {
        return new Promise((resolve) => {
            // call api update
            props?.onRowUpdating && props?.onRowUpdating()
                .then(() => {
                    setRecordDialogVisibility(false);
                    resolve(true);
                });
        })

    }

    const onRowRemoving = (btn: MessageBoxBtn): Promise<boolean> | void => {
        if (btn === MessageBoxBtn.No)
            setDeleteDialogVisibility(false);
        else
            return new Promise((resolve) => {
                // call api remove
                props?.onRowRemoving && props?.onRowRemoving(currentRow)
                    .then(() => setDeleteDialogVisibility(false))
                    .finally(() => resolve(true))
            })
    }

    const onSearchValueChange = (str: string) => {
        const searchItem = state.filterItems?.find(x => x.keyExpr === "search");
        if (searchItem) {
            if (str) {
                searchItem.values = [str];
            }
            else {
                state.filterItems?.splice(state.filterItems.findIndex(x => x.keyExpr === "search"), 1)
            }
        }
        else {
            state.filterItems?.push({ keyExpr: "search", values: [str] })
        }
        dataGridDispatch(
            {
                type: DataGridAction.SetFilterItems,
                payload: {
                    filterItems: state.filterItems?.slice()
                }
            }
        )
    }

    return (
        <DataGridContext.Provider
            value={useMemo(() => ({ state, dispatch: dataGridDispatch }), [state, dataGridDispatch])}
        >
            <div
                id={props.id}
                style={props.style}
                className={`data-grid border-${props.borderCollapse} align-${props.alignItems} ${props.showBorders ? "show-borders" : "no-borders"}`}
            >
                <Toolbar
                    label={props?.label}
                >
                    <section className="data-grid-toolbar-add">
                        {
                            state.searchPanelProps?.visible &&
                            <SearchPanel
                                placeHolder={tr("search")}
                                height="40px"
                                onValueChange={onSearchValueChange}
                            />
                        }
                        {PageController.handleView("mobileView") && headerFilter?.props?.visible && <Filter />}
                        {
                            editing?.props?.allowAdding &&
                            <Button
                                className="plus-btn"
                                width={PageController.handleView("mobileView") && state.searchPanelProps?.visible ? "40px" : "150px"}
                                height="40px"
                                rounded={PageController.handleView("mobileView") && state.searchPanelProps?.visible}
                                icon="icon-plus"
                                variant="outlined"
                                text={PageController.handleView("mobileView") && state.searchPanelProps?.visible ? "" : tr("btn_add")}
                                color="primary"
                                onClick={onAddingStart}
                            />
                        }
                    </section>
                    {toolbar?.props?.children}
                </Toolbar>
                <div className="data-grid-table-section">
                    <DataGridHeader />
                    <DataGridContent
                        style={{ height: props.height }}
                        onRowUpdating={onEditingStart}
                        onRowRemoving={(row: any) => { setCurrentRow({ ...row }); setDeleteDialogVisibility(true); }}
                    />
                    <MessageBox
                        btnGroup={MessageBoxBtnGroup.YesNo}
                        show={deleteDialogVisibility}
                        title={editing?.props?.texts?.deleteRow || `${tr("btn_delete")} ${editing?.props?.texts?.singular || ""}`}
                        onAction={onRowRemoving}
                    >
                        <div>{editing?.props?.texts?.confirmDeleteMessage || tr("msg_record_delete_confirm")}</div>
                    </MessageBox>
                    {
                        editing?.props?.mode === "popup" && editing?.props?.children ?
                            <Dialog
                                title={currentRow ? editing?.props?.texts?.editRow || `${tr("btn_modify")} ${editing?.props?.texts?.singular || ""}`
                                    : editing?.props?.texts?.addRow || `${tr("btn_add")} ${editing?.props?.texts?.singular || ""}`}
                                animate="fade"
                                show={recordDialogVisibility}
                                onHiding={() => setRecordDialogVisibility(false)}
                            >
                                <Form
                                    onSubmit={props.handleSubmit && props.handleSubmit(currentRow ? onRowUpdating : onRowAdding)}
                                >
                                    {editing.props.children}
                                    <div className="item btn-container mt-5">
                                        <Button
                                            text={editing?.props?.texts?.cancelRowChanges || tr("btn_cancel")}
                                            height="40px"
                                            variant="contained"
                                            onClick={() => setRecordDialogVisibility(false)}
                                        />
                                        <Button
                                            text={editing?.props?.texts?.saveRowChanges || tr("btn_confirm")}
                                            height="40px"
                                            color="primary"
                                            variant="contained"
                                            type="submit"
                                        />
                                    </div>
                                </Form>
                            </Dialog>
                            : ""
                    }
                </div>
            </div>
        </DataGridContext.Provider>
    )
}

DataGrid.defaultProps = {
    tableLayout: "auto",
    borderCollapse: "collapse",
    alignItems: "start",
    keyExpr: "id",
    columnAutoWidth: false
}

