import { Button, Title } from "@ui-kit/components/index";
import { FC } from "react";
import { IHeaderSetting, IWidget, getCustomization } from "@ui-kit/widgets/index";
interface ITitleProps {
    dataSource?: IWidget;
    className?: string;
}

export const WidgetHeader: FC<ITitleProps> = ({ dataSource, className }) => {
    const headerSetting: IHeaderSetting = getCustomization<IHeaderSetting>(dataSource?.customizations, "HeaderSettings");

    return (
        headerSetting?.subtitle || dataSource?.displayText || headerSetting?.description ?
            <header className={`widget-header ${headerSetting?.darkMode ? 'dark-mode' : ""} ${className ?? ""}`.trim()}>
                <div className={`row spa-0 flex flex-center ${headerSetting?.navigation?.text?.length && headerSetting?.navigation?.url?.length ? "justify-between"
                    : headerSetting?.alignment === "Center" ? "justify-center" : "justify-start"}`}
                >
                    <div className={`col-1-auto col-sm-1-1 flex column-direction ${headerSetting?.alignment === "Center" ? "text-center" : ""}`}>
                        {headerSetting?.subtitle && <h4 className="sub-title">{headerSetting.subtitle}</h4>}
                        {dataSource?.displayText && <Title size="h2" text={dataSource?.displayText} className={`flex ${headerSetting?.alignment === "Center" ? "justify-center" : ""}`} />}
                        {headerSetting?.description && <p className="description">{headerSetting.description}</p>}
                    </div>
                    {
                        headerSetting?.navigation?.text && headerSetting.navigation.url &&
                        <div className="col-1-auto col-sm-1-1 mt-sm-6 more-btn">
                            <Button
                                width="auto"
                                height="40px"
                                className="more-info-btn"
                                icon="icon-arrow-right"
                                iconPositin="end"
                                type="more-info"
                                variant="outlined"
                                color="primary"
                                text={headerSetting.navigation.text}
                                url={headerSetting.navigation.url}
                                target={!headerSetting.navigation.url.startsWith('/') ? "_blank" : undefined}
                            />
                        </div>
                    }
                </div>
            </header> : null
    )
}