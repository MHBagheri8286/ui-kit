/* eslint-disable react-hooks/exhaustive-deps */
import PageController from "@pages/page/PageController";
import { FC } from "react";
import { IColumnProps } from "../Column";
import { FilterDesktopView, FilterMobileView } from "./index";

export interface IFilterProps {
    visible?: boolean
    column?: IColumnProps;
}

export const Filter: FC<IFilterProps> = ({ column }) => {

    return (
        <div className="filter">
            {
                PageController.handleView("mobileView") ?
                    <FilterMobileView
                    />
                    : <FilterDesktopView
                        column={column}
                    />
            }
        </div>
    )
};

Filter.defaultProps = {
    visible: true
}

Filter.displayName = "HeaderFilter"
