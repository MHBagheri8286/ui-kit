import { Culture } from "@core/index";
import PageController from "@pages/page/PageController";
import Translate from "@service/Translate";
import { Children, FC, ReactElement, ReactNode, useContext } from 'react';
import { Column } from "./Column";
import { Filter, IFilterProps } from "./Filter";
import { DataGridContext } from "./index";

export const DataGridHeader: FC = () => {
    const { state } = useContext(DataGridContext);
    const { tr } = Translate;
    const activeFilter = (children: ReactNode): boolean => {
        return ((Children.toArray(children).find((child: any) => child.type?.displayName === "HeaderFilter") as ReactElement<IFilterProps>
        )?.props.visible !== false)
    };

    return (
        <div className="data-grid-header">
            <div className="data-grid-header-container">
                <table className="data-grid-table" >
                    <tbody>
                        <tr className="data-grid-header-row">
                            {
                                state?.columnsProps?.map((column, index) => {
                                    const dataValue = PageController.handleView("mobileView") && column?.hidingPriority !== undefined ?
                                        "" : column?.caption || tr(column?.dataField as string);
                                    return (
                                        <Column
                                            key={index}
                                            {...column}
                                            dir={Culture.getLocale().dir}
                                            dataValue={dataValue}
                                            className="border"
                                        >
                                            <div className="header-item flex flex-center">
                                                <span className="title">
                                                    {dataValue}
                                                </span>
                                                {
                                                    !PageController.handleView("mobileView") && state.headerFilterProps?.visible && activeFilter(column?.children) &&
                                                    <Filter
                                                        column={column}
                                                        {...(column.children as ReactElement<IFilterProps>)?.props} />
                                                }
                                            </div>
                                        </Column>
                                    )
                                }
                                )
                            }
                            {
                                PageController.handleView("mobileView") && state?.columnsProps?.filter(column => column?.hidingPriority !== undefined).length ? ""
                                    : (state?.editingProps?.allowUpdating || state?.editingProps?.allowDeleting) ?
                                        < Column
                                            width={state?.editingProps?.allowUpdating && state?.editingProps?.allowDeleting ? "90px" : "45px"}
                                        />
                                        : ""
                            }
                            {
                                PageController.handleView("mobileView") && state?.columnsProps?.filter(column => column?.hidingPriority !== undefined).length ?
                                    <Column
                                        width="45px"
                                    />
                                    : ""
                            }
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}

