import { Button, Title } from "@ui-kit/components/index";
import { IBannerWidget, getFilePath, renderSourceBaseOfDevice } from "@ui-kit/widgets/index";
import { FC } from "react";
import { useHistory } from "react-router";

interface IBannerWidgetProps {
    dataSource: IBannerWidget;
    contentMediaPath: string;
}

export const BannerWidget: FC<IBannerWidgetProps> = (props) => {
    const { contentMediaPath, dataSource } = props;
    const { push } = useHistory();

    const onBannerClick = () => {
        if (dataSource.navigation?.url)
            if (dataSource.navigation?.url.startsWith('/')) {
                push(dataSource.navigation.url);
            }
            else {
                window.location.href = dataSource.navigation.url;
            }
    }

    return (
        <div
            className={`banner-widget ${dataSource.navigation?.url && !dataSource.navigation?.text ? " pointer" : ""}`}
            style={{
                backgroundColor: dataSource.color,
                backgroundSize: dataSource.size || "cover",
                backgroundImage: dataSource?.image?.paths?.length ? `url(${getFilePath(contentMediaPath, renderSourceBaseOfDevice(dataSource?.image?.paths))})` : "",
            }}
            onClick={() => dataSource.navigation?.url && !dataSource.navigation?.text ? onBannerClick() : undefined}
        >
            {(dataSource?.subtitle || dataSource.displayText || dataSource?.description || dataSource.navigation?.text) &&
                <div className={`content-section ${dataSource.wrap ? "wrap" : ""}`} style={{ height: "100%" }}>
                    <div className="container flex flex-center">
                        <div className="caption flex justify-center flex-center">
                            {dataSource?.subtitle && <h4 className="sub-title">{dataSource.subtitle}</h4>}
                            {dataSource.displayText && <Title text={dataSource?.displayText} border={`${dataSource.wrap ? "center" : "none"}`} />}
                            {dataSource?.description && <p className="description">{dataSource.description}</p>}
                        </div>
                        {
                            dataSource.navigation?.text &&
                            <div className="more-btn">
                                <Button
                                    width="140px"
                                    color="white"
                                    variant="outlined"
                                    text={dataSource.navigation.text}
                                    url={dataSource?.navigation?.url}
                                    target={dataSource.navigation?.url.startsWith('/') ? undefined : "_blank"}
                                />
                            </div>
                        }
                    </div>
                </div>
            }
        </div>
    )
}