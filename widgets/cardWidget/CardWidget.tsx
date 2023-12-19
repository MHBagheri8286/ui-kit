import { Icon, Layout } from "@ui-kit/components/index";
import { CardWidgetStyle, ICardWidget, ISizingStyle, getCompatibleLayout, getCurrentScreenSize, getCustomization } from "@ui-kit/widgets/index";
import { FC, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { CardItem, CardWidgetController } from "./index";

interface ICardWidgetProps {
    dataSource: ICardWidget;
    contentMediaPath: string;
}

export const CardWidget: FC<ICardWidgetProps> = (props) => {
    const { contentMediaPath, dataSource } = props;
    const layout = getCompatibleLayout(dataSource.layouts);
    const cardWidgetController = useMemo(() => new CardWidgetController(dataSource), [dataSource]);
    const itemsContainer = useRef<HTMLDivElement>(null);
    const cardItem = useRef<HTMLDivElement>(null);
    const [slideIndex, setSlideIndex] = useState<number>(0);
    const activeSlide = !layout?.wrap && layout?.columnCount! < dataSource.items?.contentItems.length!

    useEffect(() => {
        if (cardItem.current && activeSlide) {
            const widthItem = cardItem.current.offsetWidth;
            const translateValue = slideIndex * widthItem;
            itemsContainer.current?.style.setProperty("left", `-${translateValue}px`);
        }
    }, [slideIndex, activeSlide]);

    const onNext = () => slideIndex < (dataSource.items?.contentItems.length || 0) - (layout?.columnCount || 0) && setSlideIndex(slideIndex + 1);
    const onPrevious = () => slideIndex > 0 && setSlideIndex(slideIndex - 1);
    const setGap = getCurrentScreenSize() === "small" ? 10 : 15;
    const setRowHeightCondition = () => (getCustomization<ISizingStyle>(dataSource?.customizations, "SizingStyle")?.heightMode !== "Auto") && getCustomization<ISizingStyle>(dataSource?.customizations, "SizingStyle")?.heightMode;

    return (
        layout ?
            <div className="card-widget-container">
                <div className={`card-widget${cardWidgetController.handleCondition("iconMode") ? " icon-mode" : ""} ${cardWidgetController.getClassName() ?? ""} ${activeSlide ? "slide" : ""}`}>
                    <div className="cards-container">
                        {
                            <div className="slide-container">
                                {
                                    activeSlide ?
                                        <div
                                            ref={itemsContainer}
                                            className={`row flex items-container${cardWidgetController.getModel() === CardWidgetStyle.style2 ? ' spa-4' : ' spa-2'}`}
                                        >
                                            {
                                                dataSource.items?.contentItems?.map((item, index) =>
                                                    <div
                                                        key={`card_item_${index}`}
                                                        ref={slideIndex === index ? cardItem : undefined}
                                                        style={{
                                                            direction: cardWidgetController.handleCondition("alternate") ? (index % 2 === 0) ? "rtl" : "ltr" : "unset",
                                                        }}
                                                        className={`col-1-${layout?.columnCount ?? ""} col-sm-1-1 item-container${(index + 1 > dataSource.items?.contentItems.length! - layout?.columnCount!) && !activeSlide ? "" : " margin-bottom"}`}
                                                    >
                                                        {
                                                            item.link && cardWidgetController.handleCondition("cardLink") ?
                                                                <Link to={item.link} className="card-link">
                                                                    <CardItem
                                                                        card={item}
                                                                        contentMediaPath={contentMediaPath}
                                                                        cardWidgetController={cardWidgetController}
                                                                    />
                                                                </Link>
                                                                :
                                                                <CardItem
                                                                    card={item}
                                                                    contentMediaPath={contentMediaPath}
                                                                    cardWidgetController={cardWidgetController}
                                                                />
                                                        }
                                                    </div>
                                                )
                                            }
                                        </div>
                                        :
                                        <Layout
                                            contentData={{
                                                rowHeight: setRowHeightCondition() ? `calc((100% - (${setGap}px * ${cardWidgetController.getRowCount() - 1})) / ${cardWidgetController.getRowCount()})` : undefined,
                                                ...layout
                                            }}
                                        >
                                            {
                                                dataSource.items?.contentItems?.map((item, index) => item.link && cardWidgetController.handleCondition("cardLink") ?
                                                    <Link
                                                        to={item.link}
                                                        key={`card_link_${index}`}
                                                        className="card-link"
                                                    >
                                                        <div style={{
                                                            width: "100%",
                                                            height: "100%",
                                                            direction: cardWidgetController.handleCondition("alternate") ? (index % 2 === 0) ? "rtl" : "ltr" : "unset"
                                                        }}>
                                                            <CardItem
                                                                card={item}
                                                                contentMediaPath={contentMediaPath}
                                                                cardWidgetController={cardWidgetController}
                                                            />
                                                        </div>
                                                    </Link>
                                                    :
                                                    <div
                                                        key={`card_link_${index}`}
                                                        style={{
                                                            height: "100%",
                                                            direction: cardWidgetController.handleCondition("alternate") ? (index % 2 === 0) ? "rtl" : "ltr" : "unset"
                                                        }}
                                                    >
                                                        <CardItem
                                                            card={item}
                                                            contentMediaPath={contentMediaPath}
                                                            cardWidgetController={cardWidgetController}
                                                        />
                                                    </div>
                                                )}
                                        </Layout>
                                }
                            </div>
                        }
                        {
                            activeSlide &&
                            <div className="controls-container flex justify-between">
                                <Icon
                                    className={slideIndex === 0 ? "disable" : ""}
                                    name='icon-chevron-left'
                                    size="50px"
                                    onClick={() => onPrevious()}
                                />
                                <Icon
                                    className={slideIndex === dataSource.items?.contentItems.length! - layout?.columnCount! ? "disable" : ""}
                                    name='icon-chevron-right'
                                    size="50px"
                                    onClick={() => onNext()}
                                />
                            </div>
                        }
                    </div>
                </div>
            </div> : null
    )
}