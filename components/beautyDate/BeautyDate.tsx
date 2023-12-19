import { ViewPort } from "@ui-kit/common/index";
import { Culture } from "@ui-kit/core/index";
import { getBeautyTime, getWidth } from "@ui-kit/utilize";
import { FC, useEffect, useRef, useState } from "react";
interface IBeautyDateProps {
    date: number;
    format: string;
}

export const BeautyDate: FC<IBeautyDateProps> = (props) => {
    const { date, format } = props;
    const dateTime = Culture.getDateTimeInstance();
    const nowDateTime = Culture.getDateTimeInstance();
    const [beautyDate, setBeautyDate] = useState<boolean>(true);
    dateTime.setTime(date);
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

    return (
        width <= ViewPort.large ?
            <div className="beauty-date" onClick={() => setBeautyDate(!beautyDate)}>
                {
                    beautyDate ?
                        getBeautyTime(nowDateTime.getTime(), date, format) : dateTime.format(format)
                }
            </div>
            :
            <div className="beauty-date" title={dateTime.format(format)}>{getBeautyTime(nowDateTime.getTime(), date, format)}</div>

    );
}