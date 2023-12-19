import { Dialog, DialogFooter, DialogHeader } from "@components/general/dialog";
import Button from "@components/general/form/Button";
import CheckboxInput from "@components/general/form/CheckboxInput";
import Icon from "@components/general/Icon";
import Translate from "@service/Translate";
import { Children, FC, ReactElement, ReactNode, useContext, useState } from "react";
import { IColumnProps } from "../Column";
import { DataGridAction } from "../DataGridAction";
import { DataGridContext, searchInAllColumns, setDataSourceBaseOnColumnType } from "../DataGridContext";
import { IFilterProps } from "./index";

interface IFilterMobileViewProps {
}

export const FilterMobileView: FC<IFilterMobileViewProps> = () => {
    const { tr } = Translate;
    const { state, dispatch } = useContext(DataGridContext);
    const [dataSource, setDataSource] = useState<string[]>([]);
    const [currentFilter, setCurrentFilter] = useState<string>("");
    const [filterDialogVisibility, setFilterDialogVisibility] = useState<boolean>(false);
    const filteredDataSource = (state?.props?.dataSource as Array<any>)
        ?.filter(row => {
            let isFiltered = true;
            state.filterItems?.forEach(filterItem => {
                if (!filterItem.values?.some(x => searchInAllColumns(row, { columns: state.columnsProps, term: x })))
                    isFiltered = false;
            })
            return isFiltered
        }
        );

    const activeFilter = (children: ReactNode): boolean => {
        return ((Children.toArray(children).find((child: any) => child.type?.displayName === "HeaderFilter") as ReactElement<IFilterProps>
        )?.props.visible !== false)
    };

    const onFilterIconClick = () => {
        setFilterDialogVisibility(true);
        setCurrentFilter("");
    }

    const onFilterItemClick = (column: IColumnProps) => {
        setCurrentFilter(column.dataField || "");
        setDataSource(setDataSourceBaseOnColumnType(state.props?.dataSource as any[], column));
    }

    const onChangeSelectedItems = (name: string) => {
        const filteredItem = state.filterItems?.find(x => x.keyExpr === currentFilter);
        if (filteredItem) {
            if (filteredItem.values?.some(x => x === name)) {
                filteredItem.values.splice(filteredItem.values.findIndex(x => x === name), 1);
                if (!filteredItem.values.length) {
                    state.filterItems?.splice(state.filterItems.findIndex(x => x.keyExpr === currentFilter), 1);
                }
            }
            else {
                filteredItem.values?.push(name);
            }
        }
        else {
            state.filterItems?.push({ keyExpr: currentFilter, values: [name] })
        }
        dispatch(({
            type: DataGridAction.SetFilterItems, payload: {
                filterItems: state.filterItems?.slice()
            }
        }))
    }

    const onRemoveFilterBtnClick = () => {
        dispatch(({
            type: DataGridAction.SetFilterItems, payload: {
                filterItems: []
            }
        }))
    }

    return (
        <div className="filter-mobile-view">
            <Button
                width="40px"
                height="40px"
                rounded
                icon={
                    state.filterItems?.filter(x => x.keyExpr !== "search").length ? "icon-filter"
                        : "icon-filter-outline"
                }
                variant="outlined"
                color="primary"
                onClick={onFilterIconClick}
            />
            <Dialog
                show={filterDialogVisibility}
                fullContent
                onHiding={() => setFilterDialogVisibility(false)}
                onBackwardBtnClick={currentFilter ? () => setCurrentFilter("") : undefined}
            >
                <DialogHeader className="flex-grow" >
                    <section className="flex flex-center justify-between">
                        <div className="title">{currentFilter ? state.columnsProps?.find(x => x.dataField === currentFilter)?.caption || currentFilter : tr("filters")}</div>
                        <Button
                            text={tr("remove_filters")}
                            color="blue"
                            width="auto"
                            size="small"
                            onClick={onRemoveFilterBtnClick}
                        />
                    </section>
                </DialogHeader>
                {
                    currentFilter ?
                        <main className="filter-item-contents">
                            {
                                dataSource?.map((data, index) =>
                                    <div
                                        key={index}
                                        className="filter-item-content"
                                    >
                                        <CheckboxInput
                                            name={data.toLocaleString()}
                                            id={data}
                                            label={data}
                                            value={state.filterItems?.find(x => x.keyExpr === currentFilter)?.values?.some(item => item === data) || false}
                                            onChange={onChangeSelectedItems}
                                        />
                                    </div>
                                )
                            }
                        </main>
                        : <ul className="filter-mobile-content">
                            {
                                state?.columnsProps?.filter(column => activeFilter(column?.children)).map((column, index) =>
                                    <li
                                        key={index}
                                        className={`filter-item flex flex-center justify-between ${state.filterItems?.find(x => x.keyExpr === column.dataField)?.values?.length ? " filtered" : ""}`}
                                        onClick={() => onFilterItemClick(column)}
                                    >
                                        <div className="caption">{column.caption || column.dataField}</div>
                                        <Icon
                                            size="30px"
                                            name="icon-chevron-left"
                                        />
                                    </li>
                                )
                            }
                        </ul>
                }
                <DialogFooter className="filter-mobile-view-footer">
                    <section
                        className="flex justify-between"
                        onClick={() => setFilterDialogVisibility(false)}
                    >
                        <div className="caption">{tr("view")} {filteredDataSource?.length} {state?.editingProps?.texts?.singular || tr("item")}</div>
                        <Icon
                            size="30px"
                            name="icon-chevron-up"
                        />
                    </section>
                </DialogFooter>
            </Dialog>
        </div >
    )

}