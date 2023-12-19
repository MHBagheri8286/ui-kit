/* eslint-disable react-hooks/exhaustive-deps */
import Button from "@components/general/form/Button";
import Icon from "@components/general/Icon";
import { Content } from "@components/general/popover/Content";
import Popover from "@components/general/popover/Popover";
import Translate from "@service/Translate";
import { FC, useContext, useEffect, useState } from 'react';
import CheckboxInput from '../../form/CheckboxInput';
import { IColumnProps } from "../Column";
import { DataGridAction } from "../DataGridAction";
import { DataGridContext, setDataSourceBaseOnColumnType } from "../DataGridContext";

interface IFilterDesktopViewContent {
    column?: IColumnProps;
}

export const FilterDesktopView: FC<IFilterDesktopViewContent> = ({ column }) => {
    const { tr } = Translate;
    const [dataSource, setDataSource] = useState<string[]>([]);
    const { state, dispatch } = useContext(DataGridContext);
    const [popoverVisibility, setPopoverVisibility] = useState<boolean>(false);

    useEffect(() => {
        setDataSource(setDataSourceBaseOnColumnType(state.props?.dataSource as any[], column as IColumnProps));
    }, [state.props?.dataSource])

    const onChangeSelectedItems = (name: string) => {
        const filteredItem = state.filterItems?.find(x => x.keyExpr === column?.dataField);
        if (filteredItem) {
            if (filteredItem.values?.some(x => x === name)) {
                filteredItem.values.splice(filteredItem.values.findIndex(x => x === name), 1);
                if (!filteredItem.values.length) {
                    state.filterItems?.splice(state.filterItems.findIndex(x => x.keyExpr === column?.dataField), 1);
                }
            }
            else {
                filteredItem.values?.push(name);
            }
        }
        else {
            state.filterItems?.push({ keyExpr: column?.dataField, values: [name] })
        }
        dispatch(({
            type: DataGridAction.SetFilterItems, payload: {
                filterItems: state.filterItems?.slice()
            }
        }))
    }

    const onRemoveFilterBtnClick = () => {
        setPopoverVisibility(false);
        state.filterItems?.splice(state.filterItems.findIndex(x => x.keyExpr === column?.dataField), 1);
        dispatch(({
            type: DataGridAction.SetFilterItems, payload: {
                filterItems: state.filterItems?.slice()
            }
        }))
    }

    return (
        <Popover
            visible={popoverVisibility}
            className="header-filter"
            placement="bottom-end"
        >
            <Content>
                <article className="filter-desktop-view" id="filterContent">
                    {
                        dataSource?.map((data, index) => data &&
                            <div
                                key={index}
                                className={`filter-item`}
                            >
                                <div className="type-data">
                                    <CheckboxInput
                                        name={data.toLocaleString()}
                                        id={data}
                                        label={data}
                                        value={state.filterItems?.find(x => x.keyExpr === column?.dataField)?.values?.some(item => item === data) || false}
                                        onChange={onChangeSelectedItems}
                                    />
                                </div>
                            </div>
                        )
                    }
                    <div className="btn-container">
                        <Button
                            text={tr("remove_filter")}
                            size="medium"
                            color="primary"
                            variant="outlined"
                            onClick={onRemoveFilterBtnClick}
                        />
                        <Button
                            text={tr("ok")}
                            size="medium"
                            color="primary"
                            variant="outlined"
                            onClick={() => setPopoverVisibility(false)}
                        />
                    </div>
                </article>
            </Content>
            <Icon
                onClick={() => setPopoverVisibility(true)}
                name={
                    state.filterItems?.find(x => x.keyExpr === column?.dataField)?.values?.some(str => dataSource?.some(x => x === str)) ? "icon-filter"
                        : "icon-filter-outline"
                }
            />
        </Popover>
    )
};
