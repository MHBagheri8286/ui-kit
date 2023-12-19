import { IItemLayout } from "@ui-kit/widgets/models/LayoutStyle";
import { CSSProperties } from "react";
import { ILayoutProps } from "./Layout";
import { getCurrentScreenSize } from "@ui-kit/widgets/utilize";

export class LayoutServices {

    private _defaultValue = {
        gap: getCurrentScreenSize() === "small" ? 10 : 15,
        columnWidth: "1fr",
        itemWidth: "50px",
        rowHeight: "1fr",
        itemHeight: "50px"
    }

    static tets = 0;

    constructor(private _dataSource: ILayoutProps, private _itemsCount: number) {
        this._dataSource = _dataSource
        this._itemsCount = _itemsCount
    }

    private setItemModeStyle = () => this._dataSource.itemData ? "custom" : "default";

    private setDataItems = (): IItemLayout[] => {
        const result: IItemLayout[] = [];
        for (let i = 0; i < this._itemsCount; i++) {
            if (this._dataSource.itemData?.length) {
                result.push(this._dataSource.itemData[i] ?? this._dataSource.itemData[this._dataSource.itemData.length - 1])
            }
        }
        return result
    }

    public getAutomaticRowCount = () => {
        let addCount = 0;
        this.setDataItems().forEach(x => {
            if (x.rowSpan && x.colSpan) {
                addCount += ((x.rowSpan * x.colSpan) - 1)
            }
            else if (x.rowSpan || x.colSpan) {
                if (x.rowSpan! > 1) addCount += x.rowSpan! - 1;
                if (x.colSpan! > 1) addCount += x.colSpan! - 1;
            }
        })
        const rowCount = Math.ceil((this._itemsCount! + addCount) / this._dataSource.layoutData?.colCount!);
        return rowCount
    }

    public getLayout = (): CSSProperties => {
        let result: CSSProperties = {};
        const gridTemplateColumns = `repeat(${this._dataSource.layoutData?.colCount}, ${this._dataSource.layoutData?.columnWidth ?? (this._dataSource.layoutData?.colAuto ? "auto" : this._defaultValue.columnWidth)})`;
        const gridTemplateRows = !this._dataSource.layoutData?.rowHeight ? `repeat(${this._dataSource.layoutData?.rowCount ?? this.getAutomaticRowCount()}, ${this._dataSource.layoutData?.rowAuto ? "auto" : this._defaultValue.rowHeight})` : '';
        const gridAutoRows = this._dataSource.layoutData?.rowHeight ? this._dataSource.layoutData?.rowHeight : '';
        const gap = this._dataSource.layoutData?.gap ?? this._defaultValue.gap;
        result = {
            display: "grid",
            gridTemplateColumns,
            gridTemplateRows,
            gridAutoRows,
            gap
        }
        return result
    }

    public getItemStyle = (index: number): CSSProperties => {
        let result: CSSProperties = {};
        if (this.setItemModeStyle() === "custom" && this.setDataItems().length) {
            const dataItem = this.setDataItems()[index];
            result = {
                gridColumn: `span ${dataItem.colSpan}`,
                gridRow: `span ${dataItem.rowSpan}`,
            }
        }
        return result;
    }

}