/* eslint-disable react-hooks/exhaustive-deps */
import { ColumnType } from "@common/enum/ColumnType";
import PageController from "@pages/page/PageController";
import { getTextWidth } from "@utilize/Util";
import { FC, useContext, useEffect, useRef, useState } from "react";
import { IFormControlProps } from "../form/Form";
import Tooltip from "../Tooltip";
import { DataGridContext, renderColumnValue } from "./DataGridContext";

export interface IColorIconPallete<T> {
    key: T;
    vocab: string;
    color: string;
    icon: string;
}

export interface IColumnProps extends IFormControlProps {
    dataField?: string;
    dataValue?: string;
    dataType?: ColumnType;
    colorIconPallete?: IColorIconPallete<number>[],
    rowStatus?: boolean;
    hidingPriority?: number;
    colSpan?: number;
    caption?: string;
    width?: string;
    keyExpr?: string;
    onClick?: () => void;
    cellRender?: (record: any) => JSX.Element | string;
}

export const Column: FC<IColumnProps> = (props) => {
    const { state } = useContext(DataGridContext);
    const columnRef = useRef<HTMLTableCellElement>(null);
    const [isEllipsisActive, setIsEllipsisActive] = useState<boolean>(false);
    const [width, setWidth] = useState<string>(props.width || "");

    useEffect(() => {
        if (columnRef.current && state.props?.dataSource?.length) {
            if (state.props?.columnAutoWidth && props.hidingPriority === undefined && !props.width) {
                // calculate maximum width of column in datasource
                const width: number = (state.props?.dataSource as any[])?.map(row => {
                    return renderColumnValue(row, { dataField: columnRef?.current?.getAttribute('data-field') as string, cellRender: props.cellRender })
                })?.map(x => getTextWidth(x)).reduce((a, b) => Math.max(a, b));
                setWidth(`${width + 30}px`);
            }
            else if ((getTextWidth(columnRef.current.getAttribute('data-value') as string)) > (columnRef.current?.offsetWidth - 35)) {
                setIsEllipsisActive(true);
            }
        }
    }, [state.props?.dataSource])

    return (
        <td
            data-field={props.dataField}
            data-value={props.dataValue}
            dir={!props.dir && props?.dataType === ColumnType.number ? "ltr" : props.dir}
            ref={columnRef}
            colSpan={props?.colSpan}
            className={`column ${PageController.handleView("mobileView") && props?.hidingPriority !== undefined ? "hide" : ""} ${isEllipsisActive ? "trim" : ""} ${props?.className ?? ""}`}
            style={{
                ...props?.style,
                minWidth: width,
                width: width,
                maxWidth: width
            }}
            onClick={() => props.onClick && props.onClick()}
        >
            {
                isEllipsisActive ?
                    <Tooltip
                        title={columnRef.current?.getAttribute('data-value') || ""}
                        placement='top'
                    >
                        {props?.children}
                    </Tooltip>
                    : props?.children
            }
        </td>
    )
}
Column.displayName = "Column";