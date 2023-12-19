/* eslint-disable react-hooks/exhaustive-deps */
import { Locale } from "@ui-kit/common";
import { Button, Calender, IFormControlProps } from "@ui-kit/components/index";
import { Culture, DateTime, ILocale } from "@ui-kit/core/index";
import { Translate } from "@ui-kit/service";
import { scrollParentToChild } from "@ui-kit/utilize";
import { ChangeEvent, FC, MouseEvent, useCallback, useEffect, useRef, useState } from "react";

enum RenderState { Day, Month, Year }

export interface IDatePickerProps extends IFormControlProps {
    value: string;
    hasTime?: boolean;
    onAbort: () => void;
    onChange: (value: string) => void;
    onDatePickerModeChange: () => void;
}

export const DatePicker: FC<IDatePickerProps> = ({ hasTime, value, locale, onAbort, onChange, onDatePickerModeChange }) => {
    const { tr } = Translate;
    const IrLocale = Culture.getLocale(Locale.fa);
    const datePickerYearRef = useRef<HTMLUListElement>(null);
    const [renderState, setRenderState] = useState<RenderState>(RenderState.Day);
    let [dateTime, setDateTime] = useState<DateTime>(Culture.getDateTimeInstance(locale?.code));
    let [selectedDateTime, setSelectedDateTime] = useState<DateTime>(Culture.getDateTimeInstance(locale?.code));
    const [, setUpdate] = useState<any>();
    const forceUpdate = useCallback(() => setUpdate({}), []);
    const privateLocale: ILocale = dateTime.locale;
    const dateTimeFormat: string = hasTime ? privateLocale.defaultDateTimeFormat : privateLocale.defaultDateFormat;;
    const monthNames: string[] = privateLocale.months.map(x => x.displayText);

    useEffect(() => {
        const activeItem = document.getElementById("activeItem");
        if (datePickerYearRef.current && activeItem)
            scrollParentToChild(datePickerYearRef.current, activeItem);
    }, [renderState]);

    useEffect(() => {
        dateTime = Culture.getDateTimeInstance(locale?.code);
        selectedDateTime = Culture.getDateTimeInstance(locale?.code);
        if (selectedDateTime.validate(value, hasTime, false))
            dateTime.setTime(selectedDateTime.getTime());
        else
            selectedDateTime.setTime(dateTime.getTime() - 10000000000);
        setDateTime(dateTime);
        setSelectedDateTime(selectedDateTime);
        forceUpdate();
    }, [locale?.code]);

    const nextMonth = () => {
        dateTime.setMonth(dateTime.getMonth() + 1);
        setDateTime(dateTime);
        forceUpdate();
    }

    const prevMonth = () => {
        dateTime.setMonth(dateTime.getMonth() - 1);
        setDateTime(dateTime);
        forceUpdate();
    }

    const onYearClick = (e: MouseEvent<HTMLLIElement>) => {
        const value = +(e.currentTarget.textContent || 0);
        dateTime.setFullYear(value);
        setDateTime(dateTime);
        setRenderState(RenderState.Month);
    }

    const onMonthClick = (e: MouseEvent<HTMLDivElement>) => {
        const value = +e.currentTarget.id;
        dateTime.setMonth(value);
        setDateTime(dateTime);
        setRenderState(RenderState.Day);
    }

    const onYearSelect = () => {
        setRenderState(RenderState.Year);
    }

    const onMonthSelect = () => {
        setRenderState(RenderState.Month);
    }

    const onDaySelect = (e: MouseEvent<HTMLTableCellElement>) => {
        // this.dateTime holds the current month & year
        dateTime.setDate(+(e.currentTarget.textContent!));
        selectedDateTime.setTime(dateTime.getTime());
        if (window.innerWidth > 768) {
            onChange(selectedDateTime.format(dateTimeFormat, false));
        } else {
            setDateTime(dateTime);
            setSelectedDateTime(selectedDateTime);
        }
        forceUpdate();
    }

    const onHourSelect = (e: ChangeEvent<HTMLSelectElement>) => {
        const hour = +e.target.value;
        selectedDateTime.setHours(hour);
        setSelectedDateTime(selectedDateTime);
    }

    const onMinSelect = (e: ChangeEvent<HTMLSelectElement>) => {
        const minute = +e.target.value;
        selectedDateTime.setMinutes(minute);
        setSelectedDateTime(selectedDateTime);
    }

    const renderHeader = () => {
        return (
            <header>
                <button type="button" className="select-arrow" onClick={prevMonth}>&#8249;</button>
                <div className="select-container">
                    <span className="select-item" onClick={onMonthSelect}>{monthNames[dateTime.getMonth()]}</span>
                    <span className="select-item" onClick={onYearSelect}>{dateTime.getFullYear()}</span>
                </div>
                <button type="button" className="select-arrow" onClick={nextMonth}>&#8250;</button>
                <Button
                    className="change-picker-type"
                    variant="outlined"
                    color="white"
                    width="115px"
                    height="auto"
                    text={tr(locale?.code === IrLocale.code ? "calendar_gregorian" : "calendar_persian")}
                    onClick={onDatePickerModeChange}
                />
            </header>
        );
    }

    const renderContent = () => {
        const time = hasTime ? renderTime() : null;
        const year = Culture.getDateTimeInstance(locale?.code).getFullYear();
        const monthItems = [];
        const yearItems = [];

        for (let i = year - 150, le = year + 50; i < le; i++) {
            const selectedYear = dateTime.getFullYear();
            yearItems.push(<li key={i} id={selectedYear === i ? "activeItem" : ""} className={`year-item${selectedYear === i ? " year-item-active" : ""}`} onClick={onYearClick}>{i}</li>);
        }

        for (let i = 0; i < 12; i++) {
            monthItems.push(<div key={i} id={i.toString()} className={`month-item${dateTime.getMonth() === i ? " month-item-active" : ""}`} onClick={onMonthClick}>{monthNames[i]}</div>);
        }

        return (
            <div className="date-picker-content">
                <div className={`date-picker-content-item${renderState === RenderState.Day ? " active" : ""}`}>
                    <Calender
                        locale={locale}
                        selectedDateTime={selectedDateTime}
                        dateInstance={dateTime.getTime()}
                        hasTime={hasTime}
                        onDaySelect={onDaySelect}
                    />
                    {time}
                </div>
                <div className={`date-picker-content-item${renderState === RenderState.Month ? " active" : ""}`}>
                    <div className="month-content">{monthItems}</div>
                </div>
                <div className={`date-picker-content-item${renderState === RenderState.Year ? " active" : ""}`}>
                    <ul ref={datePickerYearRef} className="year-content">{yearItems}</ul>
                </div>
            </div>
        )
    }

    const renderTime = () => {
        const hour = selectedDateTime.getHours();
        const minute = selectedDateTime.getMinutes();
        const hourSelect = [];
        for (let i = 0; i <= 23; ++i) {
            hourSelect.push(<option value={i} key={i}>{i}</option>);
        }
        const minSelect = [];
        for (let i = 0; i <= 59; ++i) {
            minSelect.push(<option value={i} key={i}>{i}</option>);
        }
        return (
            <div className="time-select">
                <div className="hour-select">
                    <label>{tr("hour")}</label>
                    <select className="form-control" value={hour} onChange={onHourSelect}>{hourSelect}</select>
                </div>
                <div className="min-select">
                    <select className="form-control" value={minute} onChange={onMinSelect}>{minSelect}</select>
                    <label>{tr("minute")}</label>
                </div>
            </div>
        );
    }

    return (
        <div className="date-picker">
            <div className={`picker-wrapper ${locale?.code === IrLocale.code ? "persian-date-picker" : "gregorian-date-picker"}`}>
                {renderHeader()}
                {renderContent()}
                <div className="date-picker-btn">
                    <button
                        type="button"
                        className="btn btn-primary btn-link"
                        onClick={() => onChange(selectedDateTime.format(dateTimeFormat, false))}
                    >
                        {tr("btn_select")}
                    </button>
                    <button
                        type="button"
                        className="btn btn-primary btn-link"
                        onClick={onAbort}
                    >
                        {tr("btn_cancel")}
                    </button>
                </div>
            </div>
        </div>
    );
}