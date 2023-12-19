import { OptimizedImage } from "@ui-kit/components/index";
import { Culture } from "@ui-kit/core/Culture";
import { Translate } from "@ui-kit/service";
import { IEvent } from "@ui-kit/widgets/models";
import { getFilePath } from "@ui-kit/widgets/utilize";
import { FC } from "react";

interface IUpcomingMonthEvent {
    month?: string;
    eventItems?: IEvent[];
}

interface IUpcomingMonthProps {
    dataSource: IEvent[];
    maxMonthNumber?: number;
    contentMediaPath: string;
}

export const UpcomingMonth: FC<IUpcomingMonthProps> = (props) => {
    const { dataSource, contentMediaPath, maxMonthNumber = 5 } = props;
    const { tr } = Translate;
    const { code, dir } = Culture.getLocale();
    const nowDate = new Date();
    const selectDate = new Date();
    const events: IUpcomingMonthEvent[] = [];
    const colorList = ['rgba(128, 48, 121, 0.77)', 'rgba(105, 136, 72, 0.77)', 'rgba(75, 162, 172, 0.77)', 'rgba(206, 79, 85, 0.77)'];

    for (let i = 0; i < maxMonthNumber; i++) {
        const selectedEvents: IEvent[] = [];
        const selectMonth = nowDate.getMonth() + i;
        selectDate.setMonth(selectMonth);
        dataSource.forEach(d => {
            const eventDate = new Date(d.startTime ?? 0);
            if (eventDate.getFullYear() === nowDate.getFullYear() && eventDate.getMonth() === selectDate.getMonth())
                selectedEvents.push(d);
        });
        events.push({
            month: selectDate.toLocaleString(code, { month: 'long' }),
            eventItems: selectedEvents
        })
    }

    return (
        <div className="upcoming-month row flex flex-wrap mb-6 spa-sm-2">
            {
                events.map((event, index) =>
                    <div key={`upcoming_month_event_${index}`} className={`col-1-auto ${index ? 'col-sm-1-2' : 'col-sm-1-1'} mb-4`}>
                        <div className="upcoming-month-event">
                            <div
                                className="upcoming-month-event-bg-image"
                                style={{ backgroundImage: `url(${event.eventItems?.length && index ? getFilePath(contentMediaPath, event.eventItems[0].cover?.paths[0] || "") : ''})` }}
                            >
                                <div className="upcoming-month-event-bg-color" style={{ backgroundColor: index ? colorList[index - 1] : '' }}></div>
                            </div>
                            <div className="upcoming-month-event-container">
                                <div className="upcoming-month-event-header">{event.month}</div>
                                <div className="upcoming-month-event-content">
                                    {
                                        index === 0 ?
                                            <div className="upcoming-month-event-content-item">
                                                {
                                                    event.eventItems?.map((e, i) =>
                                                        <OptimizedImage
                                                            className="event-image"
                                                            contentMediaPath={contentMediaPath as string}
                                                            style={dir === 'ltr' ? { left: `${i * 30}px`, zIndex: i + 1 } : { right: `${i * 30}px`, zIndex: i + 1 }}
                                                            key={`event_image_${i}`} source={e.cover || { paths: [], texts: [] }}
                                                        />
                                                    )
                                                }
                                            </div> : ''
                                    }
                                    <div>
                                        <div className="event-number">{event.eventItems?.length}</div>
                                        <div>{tr('event')}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    )
}