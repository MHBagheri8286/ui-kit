/* eslint-disable react-hooks/exhaustive-deps */
import mahan from "@ui-kit/assets/images/mahan-logo.svg";
import { IMedia } from "@ui-kit/widgets/models";
import { getWidth, renderSourceBaseOfDevice } from "@ui-kit/utilize";
import { CSSProperties, FC, ImgHTMLAttributes, useEffect, useRef, useState } from "react";
import ContentLoader from "react-content-loader";
import { Translate } from "@ui-kit/service";

interface ILoadingStatusConfig {
    element?: JSX.Element;
    text?: string;
}

export interface IImageProps {
    source?: IMedia;
    index?: number;
    className?: string;
    contentMediaPath: string;
    loading?: boolean;
    sizeBasis?: "height" | "width" | "auto";
    flip?: boolean;
    imageOption?: ImgHTMLAttributes<HTMLImageElement>;
    positionX?: "start" | "center" | "end";
    style?: CSSProperties;
    objectFit?: "contain" | "cover",
    loadingConfig?: {
        loading?: ILoadingStatusConfig,
        error?: ILoadingStatusConfig,
        notFound?: ILoadingStatusConfig
    }
}

enum LoadImageStatus { Loading, Error, Succeed, SrcNotFound };

export const OptimizedImage: FC<IImageProps> = (props) => {
    const { source, index = 0, className, imageOption, flip, loading, style, objectFit } = props;
    const { tr } = Translate;
    const imageRef = useRef<HTMLDivElement>(null);
    const [src, setSrc] = useState<string>();
    const [imageStatus, setImageStatus] = useState<LoadImageStatus>(LoadImageStatus.Loading);
    const widthTimer = useRef<NodeJS.Timeout>();
    const [width, SetWidth] = useState<number>(getWidth());

    useEffect(() => {
        window.addEventListener("resize", onResize);

        return (() => window.removeEventListener("resize", onResize))
    }, [])

    useEffect(() => {
        if (source && source?.paths?.length && imageRef.current)
            setSrc(getFilePath(source.paths));
    }, [source, imageRef, width, imageStatus]);


    const onResize = () => {
        clearTimeout(widthTimer.current as NodeJS.Timeout);
        widthTimer.current = setTimeout(() => {
            SetWidth(getWidth());
        }, 200);
    }

    const getFilePath = (paths: string[]) => {
        const path = encodeURI(index !== undefined ? paths[index] : renderSourceBaseOfDevice(paths));
        const orchardSupportedSizes = [16, 32, 50, 100, 160, 240, 480, 600, 1024, 1170, 1200, 2048];
        let sizeBasis = props.sizeBasis;
        if (sizeBasis === "auto")
            sizeBasis = (imageRef.current?.clientHeight || 0) < (imageRef.current?.clientWidth || 0) ? "width" : "height";
        const requestSize = orchardSupportedSizes.find(x => (sizeBasis === "height" ? (imageRef.current?.clientHeight || 0) : (imageRef.current?.clientWidth || 0)) <= x);
        const src = `${props.contentMediaPath}/${path}?${sizeBasis}=${requestSize}`;
        return src;
    }
    const renderOptimizedImageLoading = (title?: string) => {
        return {
            loadingElement:
                <ContentLoader
                    width="100%"
                    height="100%"
                    className="image-loading"
                    title={title ?? tr("msg_info_loading")}
                    speed={1.2}
                    rtl
                    backgroundColor="#efefef"
                    foregroundColor="#fbfbfb"
                >
                    {/* Only SVG shapes */}
                    <rect x="0" y="0" rx="0" ry="0" width="100%" height="100%" />
                </ContentLoader>,
            errorElement:
                <article className="error-content">
                    <p className="text">{tr("src_invalid")}</p>
                </article>

        }
    }


    const renderImage = (src: string) => {
        switch (imageStatus) {
            case LoadImageStatus.Loading:
                return <>
                    {renderOptimizedImageLoading(src).loadingElement}
                </>
            case LoadImageStatus.SrcNotFound:
                return <img
                    {...imageOption}
                    src={mahan}
                    alt={(source?.texts && source?.texts[index])}
                    className={`default`}
                />
            case LoadImageStatus.Error:
                return <>
                    {renderOptimizedImageLoading(src).errorElement}
                </>
        }
    }

    return (
        <div
            ref={imageRef}
            className={`image ${className ?? ""}`}
            style={style}
        >
            {renderImage(src ?? "")}
            <img
                {...imageOption}
                src={src ?? "error"}
                alt={(source?.texts && source.texts[index])}
                onError={() => setImageStatus(src ? (loading ? LoadImageStatus.Loading : LoadImageStatus.Error) : LoadImageStatus.SrcNotFound)}
                onLoad={() => setImageStatus(LoadImageStatus.Succeed)}
                style={{
                    transform: flip ? `scaleX(-1)` : "",
                    position: imageStatus === LoadImageStatus.Succeed ? "relative" : "absolute",
                    visibility: imageStatus === LoadImageStatus.Succeed ? "visible" : "hidden",
                    objectFit: objectFit
                }}
            />
        </div>
    )
}

OptimizedImage.defaultProps = {
    sizeBasis: "auto"
}