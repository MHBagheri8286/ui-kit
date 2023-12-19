import { ILocation, Locale } from "@ui-kit/common/index";
import { Button, IButton } from "@ui-kit/components/index";
import { Culture } from "@ui-kit/core/index";
import { Translate } from "@ui-kit/service/index";
import { FC } from "react";
export interface IAddToCalendarProps {
    location?: ILocation;
    address?: string;
    title?: string;
    description?: string;
    startTime?: number;
    endTime?: number;
    sf?: boolean;
    pli?: number;
    btnConfig?: IButton;
    mode?: keyof IAddToCalendarUrl;
}
export interface IAddToCalendarUrl {
    googleCalendar?: string;
    outlookCalendar?: string;
    yahooCalendar?: string;
    office365Calendar?: string;
}

export const AddToCalendar: FC<IAddToCalendarProps> = ({ mode = "googleCalendar", ...props }) => {
    const { tr } = Translate;

    const createUrl = (): IAddToCalendarUrl => {
        const startDate = new Date(props.startTime ?? "");
        const startDateTime = Culture.getDateTimeInstance(Locale.en);
        const endDateTime = Culture.getDateTimeInstance(Locale.en);
        props.startTime && startDateTime.setTime(props.startTime);
        props.endTime && endDateTime.setTime(props.endTime);
        const endDate = new Date(props.endTime ?? "");
        const startGoogleTime = `${startDate.toJSON()?.replaceAll("-", "").replaceAll(":", "")}`;
        const endGoogleTime = `${endDate.toJSON()?.replaceAll("-", "").replaceAll(":", "")}`;
        const startOutLookTime = `${startDateTime.format("Y-m-dTh%3Ai%3As")}%2B00%3A00`;
        const endOutLookTime = `${endDateTime.format("Y-m-dTh%3Ai%3As")}%2B00%3A00`;
        const googleCalendar = `https://calendar.google.com/calendar/u/0/r/eventedit?text=${props.title}&dates=${startGoogleTime}/${endGoogleTime}&details=${props.description}&location=${props.address}&pli=${props.pli}&sf=${props.sf}`;
        const outlookCalendar = `https://outlook.live.com/calendar/0/deeplink/compose?body=${props.description}&enddt=${endOutLookTime}&location=${props.address}&startdt=${startOutLookTime}&subject=${props.title}`;
        const yahooCalendar = `https://calendar.yahoo.com/?desc=${props.description}&et=${endDate}&in_loc=${props.address}&st=${startGoogleTime}&title=${props.title}&v=60`;
        const office365Calendar = `https://outlook.office.com/calendar/0/deeplink/compose?body=${props.description}&enddt=${endOutLookTime}&location=${props.address}&path=%2Fcalendar%2Faction%2Fcompose&rru=addevent&startdt=${startOutLookTime}subject=${props.title}`;
        return {
            googleCalendar,
            outlookCalendar,
            yahooCalendar,
            office365Calendar
        }
    };

    return (
        <Button
            className="add-to-calendar"
            text={props.btnConfig?.text ?? tr("add_to_calendar")}
            target="_blank"
            variant={props.btnConfig?.variant ?? "outlined"}
            color={props.btnConfig?.color ?? "primary"}
            url={createUrl()[mode]}
            {...props.btnConfig}
        />
    );
}