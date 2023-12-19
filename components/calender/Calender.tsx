import { IFormControlProps } from '@ui-kit/components/form/Form';
import { Culture } from '@ui-kit/core/Culture';
import { DateTime } from '@ui-kit/core/DateTime';
import { CSSProperties, FC, MouseEvent, useEffect, useState } from 'react';

export interface ICalenderProps extends IFormControlProps {
    renderHeader?: boolean;
    hasTime?: boolean;
    dateInstance?: number;
    specialDayConfig?: {
        dates: number[];
        style: CSSProperties;
        className?: string;
        onHoverShowDescription?: boolean;
    }
    selectedDateTime?: DateTime;
    onDaySelect?: (e: MouseEvent<HTMLTableCellElement>) => void;
}

export const Calender: FC<ICalenderProps> = ({ onDaySelect, selectedDateTime, dateInstance, specialDayConfig, locale, renderHeader = false }) => {
    const date = Culture.getDateTimeInstance(locale?.code);
    let [dateTime, setDateTime] = useState<DateTime>(date);

    useEffect(() => {
        const tmpDate = Culture.getDateTimeInstance(locale?.code);
        dateInstance && tmpDate.setTime(dateInstance)
        setDateTime(tmpDate);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dateInstance]);

    const renderWeekDaysHeader = () => {
        const row = [];
        const weekDays = dateTime.locale.weekDays.map(x => x.abbreviation);
        for (let i = 0; i < 7; ++i) {
            row.push(<th key={i}>{weekDays[i]}</th>);
        }
        return row;
    }

    const renderWeekDays = () => {
        const tmpDate = Culture.getDateTimeInstance(locale?.code);
        const isThisMonth = tmpDate.getFullYear() === dateTime.getFullYear() &&
            tmpDate.getMonth() === dateTime.getMonth();
        const today = tmpDate.getDate();
        //
        tmpDate.setFullYear(dateTime.getFullYear(), dateTime.getMonth(), 1);
        const isSelectedMonth = selectedDateTime?.getFullYear() === dateTime.getFullYear() &&
            selectedDateTime.getMonth() === dateTime.getMonth();
        const selectedDay = selectedDateTime?.getDate();
        const rows = [];
        let rowCounter = 1;
        let colCounter = 0;
        const daysInMonth = dateTime.getDaysInMonth(dateTime.getMonth());
        let row = [];
        // get weekDay first day of month
        const firstWeekDayOfMonth = tmpDate.getDay();
        // first row
        for (let i = 0; i < firstWeekDayOfMonth; ++i) {
            row.push(<td key={colCounter}>&nbsp;</td>);
            ++colCounter;
        }
        for (let i = 1; i <= daysInMonth; i++) {
            let className = isThisMonth && i === today ? "today" : "";
            const isSpecialDate = specialDayConfig?.dates.some(date => {
                const tmpDate = Culture.getDateTimeInstance(Culture.getLocale().code);
                tmpDate.setTime(date);
                return tmpDate.getDate() === i
            })
            className = `${className}${isSelectedMonth && i === selectedDay ? " selected" : ""}${isSpecialDate ? `special-date ${specialDayConfig?.className}` : ""}`;
            row.push(<td
                key={colCounter}
                className={className}
                onClick={onDaySelect}
                style={isSpecialDate ? specialDayConfig?.style : {}}
            >
                <i>{i}</i>
            </td>);
            ++colCounter;
            if (colCounter % 7 === 0) {
                rows.push(<tr key={rowCounter++}>{row}</tr>);
                row = [];
            }
        }
        // next month remaining cell
        if (colCounter % 7) {
            for (let i = colCounter % 7; i < 7; ++i) {
                row.push(<td key={colCounter++}>&nbsp;</td>);
            }
        }
        if (row.length) {
            rows.push(<tr key={rowCounter}>{row}</tr>);
        }
        if (rows.length < 6) {
            rows.push(<tr key={++rowCounter}><td colSpan={7} /></tr>);
        }
        return rows;
    }

    return (
        <div className="calender">
            {renderHeader && <header className="calender-header">
                <h4 className="value">{dateTime.format("M Y")}</h4>
            </header>}
            <table className="calender-content">
                <thead className="header-calender">
                    <tr className="week-days-name">
                        {renderWeekDaysHeader()}
                    </tr>
                </thead>
                <tbody className="content">
                    {renderWeekDays()}
                </tbody>
            </table>
        </div>
    )
}