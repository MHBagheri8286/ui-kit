import { Button, OptimizedImage } from "@ui-kit/components/index";
import { ICardItem, IForecaWeatherInfo } from "@ui-kit/widgets/models";
import { getRecentWeatherCondition } from "@ui-kit/utilize/index";
import { FC, useEffect, useState } from "react";
import { CardWidgetController } from "./index";
import { Translate } from "@ui-kit/service";

interface ICardItemProps {
    card: ICardItem;
    contentMediaPath: string;
    cardWidgetController: CardWidgetController;
}

export const CardItem: FC<ICardItemProps> = (props) => {
    const { contentMediaPath, card, cardWidgetController } = props;
    const { tr } = Translate;
    const [weatherRecent, setWeatherRecent] = useState<IForecaWeatherInfo>();

    useEffect(() => {
        if (card.forecaWeatherId) {
            getRecentWeatherCondition(card.forecaWeatherId)
                .then((response) => setWeatherRecent(response[card.forecaWeatherId || 0]));
        }
    }, [card.forecaWeatherId]);

    return (
        <div className={`flex flex-center card-item card-item-${cardWidgetController.getClassName()}`}>
            {card?.image &&
                <OptimizedImage
                    contentMediaPath={contentMediaPath}
                    objectFit={cardWidgetController.handleCondition("iconMode") ? "contain" : "cover"}
                    className="card-image"
                    source={card.image}
                />
            }
            <div className="card-tag">
                {
                    weatherRecent ?
                        <div className="card-tag-item">
                            <img
                                className="weather-icon mr-1"
                                alt="weather-icon"
                                src={`https://www.foreca.com/public/images/symbols/${weatherRecent.symb}.svg`}
                                loading="lazy"
                            />
                            <span className="en">{weatherRecent.temp}&deg;c</span>
                        </div>
                        : ''
                }
                {
                    card.tags?.map((cardTagItem, index) => <div key={index} className="card-tag-item">{cardTagItem}</div>)
                }
            </div>
            <div className="card-caption">
                <div>
                    {
                        cardWidgetController.handleCondition("titleItem") &&
                        <h4 className="text title">
                            {card.displayText}
                        </h4>
                    }
                    {
                        cardWidgetController.handleCondition("descItem") &&
                        <div className={`text desc${card.link ? " four-line" : ""}`}>
                            {card.description}
                        </div>
                    }
                </div>
                {
                    cardWidgetController.handleCondition("btnLink") && card.link &&
                    <Button
                        variant="outlined"
                        className="link-btn"
                        url={card.link}
                        text={`${tr("more_info")}`}
                        icon="icon-arrow-right"
                        iconPositin="end"
                        type="more-info"
                        color="primary"
                        size="large"
                        width="fit-content"
                    />
                }
            </div>
        </div>
    )
}