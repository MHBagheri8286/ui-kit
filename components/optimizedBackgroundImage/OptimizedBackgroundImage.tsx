/* eslint-disable react-hooks/exhaustive-deps */
import { IImageProps } from "@ui-kit/components/index";
import { Culture } from "@ui-kit/core/index";
import { getWidth, renderSourceBaseOfDevice } from "@ui-kit/utilize";
import { FC, useEffect, useRef, useState } from "react";

export const OptimizedBackgroundImage: FC<IImageProps> = (props) => {
    const { source, index = 0, className, positionX = "center", style, flip, objectFit } = props;
    const { dir } = Culture.getLocale();
    const imageRef = useRef<HTMLDivElement>(null);
    const [src, setSrc] = useState<string>();
    const widthTimer = useRef<NodeJS.Timeout>();
    const [width, SetWidth] = useState<number>(getWidth());

    useEffect(() => {
        window.addEventListener("resize", onResize);

        return (() => window.removeEventListener("resize", onResize))
    }, [])

    useEffect(() => {
        if (source && source?.paths?.length && imageRef.current)
            setSrc(getFilePath(source.paths));
    }, [source, imageRef, width]);

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



    return (
        <div
            ref={imageRef}
            className={`image ${className ?? ""}`}
            style={{
                ...style,
                transform: flip ? `scaleX(-1)` : "",
                backgroundSize: objectFit || "cover",
                backgroundImage: `url(${src})`,
                backgroundPositionX: positionX === "start" ? (dir === "ltr" ? "left" : "right")
                    : positionX === "end" ? (dir === "ltr" ? "right" : "left")
                        : positionX,
                backgroundPositionY: "center"
            }}
        />
    )
}

OptimizedBackgroundImage.defaultProps = {
    sizeBasis: "auto"
}