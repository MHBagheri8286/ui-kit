import { Locale } from "@ui-kit/common";
import { miliSecondToDays, miliSecondToMinHour } from "@ui-kit/utilize";
import { FC } from "react";

export interface ITimeSpanProps {
    startTime: number;
    endTime: number;
}

export const TimeSpan: FC<ITimeSpanProps> = ({ startTime, endTime }) => {

    const moreOneDay = () => {
        const start = new Date(startTime!).toLocaleDateString(Locale.fa, { month: "numeric", day: "numeric" });
        const end = new Date(endTime!).toLocaleDateString(Locale.fa, { month: "numeric", day: "numeric" });
        const result = start !== end;
        return result
    }

    const setDeltaTime = () => {
        const result = moreOneDay() ? miliSecondToDays(endTime - startTime, true) : miliSecondToMinHour(endTime - startTime)
        return result
    }

    return (
        <span className="time-span">{setDeltaTime()}</span>
    );
}
