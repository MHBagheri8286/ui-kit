/* eslint-disable react-hooks/exhaustive-deps */
import { IItemLayout, ILayoutStyle } from "@ui-kit/widgets/models/LayoutStyle";
import { Children, FC, useEffect, useMemo, useRef, useState } from "react";
import { LayoutServices } from "./LayoutServices";
import { getWidth } from "@ui-kit/utilize";

interface ILayout {
    colCount?: number;
    columnWidth?: string;
    rowCount?: number;
    rowHeight?: string;
    gap?: number;
    colAuto?: boolean;
    rowAuto?: boolean;
}

export interface ILayoutProps {
    layoutData?: ILayout;
    contentData?: ILayoutStyle
    itemData?: IItemLayout[];
}

export const Layout: FC<ILayoutProps> = ({ children, itemData, layoutData, contentData }) => {
    const childrenInArray = Children.toArray(children);
    const widthTimer = useRef<NodeJS.Timeout>();
    const [width, SetWidth] = useState<number>(getWidth());

    useEffect(() => {
        window.addEventListener("resize", onResize);

        return (() => window.removeEventListener("resize", onResize))
    }, [])

    const onResize = () => {
        clearTimeout(widthTimer.current as NodeJS.Timeout);
        widthTimer.current = setTimeout(() => {
            SetWidth(getWidth());
        }, 200);
    }

    const layoutController = useMemo(() => {
        return contentData ?
            new LayoutServices(
                {
                    itemData: contentData.itemLayouts?.contentItems, layoutData:
                    {
                        colCount: contentData.columnCount,
                        gap: contentData.gap,
                        rowHeight: contentData.rowHeight
                    }
                }
                ,
                childrenInArray.length
            )
            :
            new LayoutServices({ itemData: itemData, layoutData: layoutData }, childrenInArray.length);
    }, [itemData, layoutData, contentData, width]);


    return (
        <div
            className={`layout-container${contentData ? " default" : ""}`}
            style={layoutController.getLayout()}
        >
            {
                childrenInArray.map((child, index) =>
                    <div
                        key={`layout_item_${index}`}
                        className="item"
                        style={layoutController.getItemStyle(index)}
                    >
                        {child}
                    </div>
                )
            }
        </div>
    )
};

