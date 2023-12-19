import { ITypography } from "@ui-kit/common/models";
import { Culture } from "@ui-kit/core/index";
import { hexToRgb } from "@ui-kit/utilize";
import { IBackgroundColorStyle, IBackgroundImageStyle, IHeaderSetting, IPaddingStyle, ISizingStyle, IWidget, WidgetHeader, getCustomization, getFilePath } from "@ui-kit/widgets/index";
import { CSSProperties, FC, useEffect, useRef, useState } from "react";

interface ITitleProps {
    typography: ITypography;
    contentMediaPath: string;
    dataSource?: IWidget;
    style?: CSSProperties;
    className?: string;
}

export const WidgetArea: FC<ITitleProps> = (props) => {
    const { contentMediaPath, dataSource, style, typography, className, children } = props;
    const headerRef = useRef<HTMLDivElement>(null);
    const { dir } = Culture.getLocale();
    const [headerHeight, setHeaderHeight] = useState<number>(0);
    const backgroundColorStyle = getCustomization<IBackgroundColorStyle>(dataSource?.customizations, "BackgroundColorStyle");
    const backgroundImageStyle = getCustomization<IBackgroundImageStyle>(dataSource?.customizations, "BackgroundImageStyle");
    const sizingStyle = getCustomization<ISizingStyle>(dataSource?.customizations, "SizingStyle");
    const paddingStyle = getCustomization<IPaddingStyle>(dataSource?.customizations, "PaddingStyle");
    const marginStyle = getCustomization<IPaddingStyle>(dataSource?.customizations, "MarginStyle");
    const headerSetting = getCustomization<IHeaderSetting>(dataSource?.customizations, "HeaderSettings");

    useEffect(() => {
        setHeaderHeight(headerRef.current?.getBoundingClientRect().height || 0);
    }, [headerRef])

    const setCustomization = (): CSSProperties => {
        let result: CSSProperties = {
            backgroundImage: backgroundImageStyle?.image?.paths.length ? `url(${getFilePath(contentMediaPath, backgroundImageStyle?.image?.paths[0])})` : '',
            backgroundPositionX: `calc( ${backgroundImageStyle?.positionX === "end" ? "100%" : "0%"} + ${backgroundImageStyle?.offsetX}px )`,
            backgroundPositionY: `calc( ${backgroundImageStyle?.positionY === "bottom" ? "100%" : "0%"} + ${backgroundImageStyle?.offsetY}px )`,
            backgroundRepeat: backgroundImageStyle?.repeat,
            backgroundSize: backgroundImageStyle?.size
        }
        if (backgroundImageStyle?.positionX === "center") result.backgroundPositionX = "center";
        if (backgroundImageStyle?.positionY === "center") result.backgroundPositionY = "center";
        return result
    }
    const hexToRgba = backgroundColorStyle?.color ? hexToRgb(backgroundColorStyle.color) : null;

    return (
        <div
            className={`widget-area ${className ?? ""} ${backgroundImageStyle?.flip === "Horizontal" ? "flip-x" : backgroundImageStyle?.flip === "Vertical" ? "flip-y" : ""}`.trim()}
            style={{
                ...style,
                backgroundColor: backgroundColorStyle?.color ?
                    `rgba(${hexToRgba?.r},${hexToRgba?.g},${hexToRgba?.b},${(backgroundColorStyle?.opacity || 100) / 100})` : "transparent",
                height: sizingStyle?.heightMode === "Full" ? '100vh'
                    : sizingStyle?.heightMode === "Auto" ? 'auto'
                        : `${sizingStyle?.customHight}${sizingStyle?.heightMode === "Pixel" ? 'px' : 'vh'}`,
                paddingTop: paddingStyle?.top ?? typography?.defaultPadding?.top,
                paddingBottom: paddingStyle?.bottom ?? typography?.defaultPadding?.bottom,
                marginTop: marginStyle?.top,
                marginBottom: marginStyle?.bottom,
                marginLeft: dir === "ltr" ? marginStyle?.start : marginStyle?.end,
                marginRight: dir === "ltr" ? marginStyle?.end : marginStyle?.start,
                ...setCustomization()
            }}
        >
            {
                !headerSetting?.hidden &&
                <div ref={headerRef} className="container">
                    <WidgetHeader dataSource={dataSource} />
                </div>
            }
            <div
                style={{
                    paddingLeft: dir === "ltr" ? paddingStyle?.start : paddingStyle?.end,
                    paddingRight: dir === "ltr" ? paddingStyle?.end : paddingStyle?.start,
                    height: headerHeight ? `calc(100% - ${headerHeight}px)` : ""
                }}
                className={`widget-area-container${sizingStyle?.widthMode === "Full" ? "" : " container"}`}
            >
                {children}
            </div>
        </div>
    )
}