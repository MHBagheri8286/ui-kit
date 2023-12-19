import { Icon, Layout, OptimizedImage } from "@ui-kit/components/index";
import { setKeyPascalCaseToDiffCase, setModeOfEnum } from "@ui-kit/utilize";
import { IImageGalleryWidget, ISizingStyle, ImageStyle, ImageTextMode, getCompatibleLayout, getCurrentScreenSize, getCustomization } from "@ui-kit/widgets/index";
import { FC, useState } from "react";
interface IImageGalleryWidgetProps {
    dataSource: IImageGalleryWidget;
    contentMediaPath: string;
}

export const ImageGalleryWidget: FC<IImageGalleryWidgetProps> = (props) => {
    const { contentMediaPath, dataSource } = props;
    const [hover, setHover] = useState<{ status: boolean, index: number }>();
    const setRowHeightCondition = () => (getCustomization<ISizingStyle>(dataSource?.customizations, "SizingStyle")?.heightMode !== "Auto") && getCustomization<ISizingStyle>(dataSource?.customizations, "SizingStyle")?.heightMode;
    const getRowCount = () => Math.floor(dataSource.images?.paths.length! / getCompatibleLayout(dataSource.layouts).columnCount!) ?? 0;

    const setGap = getCurrentScreenSize() === "small" ? 10 : 15;

    const setTextModeConfig = () => {
        const textMode = setModeOfEnum(dataSource.textMode!, ImageTextMode) ?? ImageTextMode.None;
        const className = dataSource.textMode ? setKeyPascalCaseToDiffCase("kebabCase", dataSource.textMode!) : "";
        return { textMode, className }
    };

    const setStyleConfig = () => {
        const styleMode = setModeOfEnum(dataSource.style!, ImageStyle) ?? ImageStyle.Curved;
        const className = dataSource.style ? setKeyPascalCaseToDiffCase("kebabCase", dataSource.style!) : "";
        return { styleMode, className }
    };

    // const setTargetConfig = () => dataSource.customizations?.contentItems.find(config => setScreenCondition(width, config?.screenSize));
    const layout = getCompatibleLayout(dataSource.layouts);

    return (
        layout ? <div className="image-container">
            <div className={`image-gallery-widget ${setStyleConfig().className} ${setTextModeConfig().className}`}>
                <Layout contentData={{
                    ...layout,
                    rowHeight: setRowHeightCondition() ? `calc((100% - (${setGap}px * ${getRowCount() - 1})) / ${getRowCount()})` : undefined
                }}>
                    {dataSource.images?.paths.map((x, index) =>
                        <div key={index} className="item-container">
                            {
                                dataSource.images?.texts[index] && <section className="text-cover">
                                    {
                                        <p className={`text${(hover?.index === index && hover.status) ? " hover" : ""}`}>{dataSource.images?.texts[index]}</p>
                                    }
                                    {
                                        setTextModeConfig().textMode === ImageTextMode.IconHover && <Icon
                                            name="icon-information-outline"
                                            onMouseOver={() => setHover({ index: index, status: true })}
                                            onMouseLeave={() => setHover({ index: index, status: false })}
                                        />
                                    }
                                </section>
                            }
                            <OptimizedImage
                                key={index}
                                source={dataSource.images!}
                                contentMediaPath={contentMediaPath}
                                index={index}
                                imageOption={{
                                    loading: "lazy"
                                }}
                            />
                        </div>
                    )}
                </Layout>
            </div>
        </div> : null
    )
}