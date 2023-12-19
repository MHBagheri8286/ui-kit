import { Icon } from "@ui-kit/components/index";
import { Translate } from "@ui-kit/service";
import { IVideoWidget, getFilePath, renderSourceBaseOfDevice } from "@ui-kit/widgets/index";
import { FC, useRef, useState } from "react";

interface IVideoWidgetProps {
    contentMediaPath: string;
    dataSource: IVideoWidget;
    autoPlay?: boolean;
}

export const VideoWidget: FC<IVideoWidgetProps> = (props) => {
    const { contentMediaPath, dataSource, autoPlay } = props;
    const { tr } = Translate;
    const videoRef = useRef<HTMLVideoElement>(null);
    const [playControlsVisible, setPlayControlsVisible] = useState<boolean>(true);

    const onPlayControlsClick = () => {
        videoRef.current?.play();
        setTimeout(() => {
            videoRef.current?.setAttribute("controls", "true");
        }, 300)
        setPlayControlsVisible(false);
    }

    return (
        <div className="video-widget">
            {
                dataSource.sources?.paths.length ?
                    <div className="video-widget-container">
                        <video
                            ref={videoRef}
                            autoPlay={autoPlay}
                            muted={autoPlay}
                            className="video-widget-source"
                            width="100%"
                            height="100%"
                            poster={dataSource.cover?.paths.length ? getFilePath(contentMediaPath, renderSourceBaseOfDevice(dataSource.cover.paths)) : ""}
                            controls={!playControlsVisible}
                        >
                            <source src={getFilePath(contentMediaPath, renderSourceBaseOfDevice(dataSource.sources.paths))} type="video/mp4" />
                            {tr("msg_not_support_video")}
                        </video>
                        <div className={`video-widget-play-controls flex flex-center justify-center${!playControlsVisible ? " hide" : ""}`} >
                            <div className="video-widget-play-controls-container flex">
                                <Icon name="icon-paly-video" onClick={() => onPlayControlsClick()} />
                            </div>
                        </div>
                    </div>
                    : ""
            }
            {
                dataSource.description?.html ? <div className="video-widget-decsription" dangerouslySetInnerHTML={{ __html: dataSource.description.html }} /> : ""
            }
        </div>
    )
}