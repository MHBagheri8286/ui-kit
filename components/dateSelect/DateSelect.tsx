/* eslint-disable react-hooks/exhaustive-deps */
import { ViewPort, usePrevious } from "@ui-kit/common";
import { DropDown, IFormControlProps, Icon } from "@ui-kit/components/index";
import { Culture, ILocale } from "@ui-kit/core/index";
import { Translate } from "@ui-kit/service";
import { getWidth } from "@ui-kit/utilize";
import { FC, useEffect, useMemo, useRef, useState } from "react";
interface IDate {
    id: number;
    title: string;
}
interface IDateSelectProps extends IFormControlProps {
    min: number;
    max: number;
    index: number;
}

export const DateSelect: FC<IDateSelectProps> = (props) => {
    const { tr } = Translate;
    const { small } = ViewPort;
    const dateSelectRef = useRef<HTMLDivElement>(null);
    const prevValue = usePrevious(props.value);
    const [focused, setFocused] = useState<boolean>(false);
    const [dayOptions] = useState<IDate[]>(setDays());
    const [date, setDate] = useState<number>();
    const [month, setMonth] = useState<number>();
    const [year, setYear] = useState<number>();
    const [validationError, setValidationError] = useState<string>();
    const yearOptions = useMemo(() => ModifyYearOptions(props.min, props.max, props.locale as ILocale), [props.locale, props.min, props.max]);
    const monthOptions = useMemo(() => ModifyMonthOptions(props.locale as ILocale), [props.locale]);
    const widthTimer = useRef<NodeJS.Timeout>();
    const [width, SetWidth] = useState<number>(getWidth());

    useEffect(() => {
        window.addEventListener("resize", onResize);

        return (() => window.removeEventListener("resize", onResize))
    }, [])

    useEffect(() => {
        document.addEventListener("click", handleOuterClick);
        return () => {
            document.removeEventListener("click", handleOuterClick);
        };
    }, [dateSelectRef]);

    useEffect(() => {
        if (prevValue !== props.value) {
            if (props.value) {
                const selectDate = Culture.getDateTimeInstance(props.locale?.code).setTime(props.value);
                setDate(selectDate.getDate());
                setMonth(selectDate.getMonth() + 1);
                setYear(selectDate.getFullYear());
            } else {
                setDate(undefined);
                setMonth(undefined);
                setYear(undefined);
            }
        }
    }, [props.value])

    useEffect(() => {
        if (props.value && prevValue === props.value) {
            const selectDate = Culture.getDateTimeInstance(props.locale?.code).setTime(props.value);
            setDate(selectDate.getDate());
            setMonth(selectDate.getMonth() + 1);
            setYear(selectDate.getFullYear());
        }
    }, [props.locale]);

    const onResize = () => {
        clearTimeout(widthTimer.current as NodeJS.Timeout);
        widthTimer.current = setTimeout(() => {
            SetWidth(getWidth());
        }, 200);
    }

    const handleOuterClick = (e: any) => {
        if (!dateSelectRef.current?.contains(e.target)) {
            setFocused(false);
        } else {
            setFocused(true);
        }
    }

    const ModifyMonthOptions = (loc: ILocale) => {
        const months: IDate[] = [];
        loc?.months?.map(x => x.displayText)?.forEach((item, index) => {
            months.push({ id: index + 1, title: item });
        })
        return months;
    }

    const ModifyYearOptions = (min: number, max: number, locale: ILocale) => {
        const yearStartLimit = Culture.getDateTimeInstance(locale.code).setTime(min).getFullYear();
        const yearEndLimit = Culture.getDateTimeInstance(locale.code).setTime(max).getFullYear();
        const years: IDate[] = [];
        for (let i = yearEndLimit, li = yearStartLimit - 1; i > li; i--) {
            years.push({ id: i, title: i.toString() });
        }
        return years;
    }

    const onDropDownChange = (name: string, value: number) => {
        let d = date, m = month, y = year;
        if (name === "day") {
            d = value;
            setDate(value);
        }
        else if (name === "month") {
            m = value;
            setMonth(value);
        }
        else if (name === "year") {
            y = value;
            setYear(value);
        }

        if (d && m && y) {
            const dateTime = Culture.getDateTimeInstance(props.locale?.code);
            const selectDate = Culture.getDateTimeInstance(props.locale?.code);
            selectDate.setFullYear(y, m - 1, d);
            // validate value
            if (selectDate.getTime() < props.min) {
                dateTime.setTime(props.min);
                setValidationError(tr("err_date_select_validate_min", dateTime.format("Y/m/d")));
            }
            else if (selectDate.getTime() > props.max) {
                dateTime.setTime(props.max);
                setValidationError(tr("err_date_select_validate_max", dateTime.format("Y/m/d")));
            }
            else {
                setValidationError('');
            }

            if (props.onChange && props.name) {
                const stringFormat = selectDate.format("Y/m/d", false);
                const timestamp = selectDate.validate(stringFormat, false, false) ? selectDate.getTime() : 0;
                props.onChange(props.name, timestamp);
            }
        }
    }

    return (
        <div
            ref={dateSelectRef}
            onFocus={() => setFocused(true)}
            className={`form-group date-select has-value form-focused${props.className ? ` ${props.className}` : ""}${props.error || validationError ? " has-error" : ""}`}
        >
            {props.label ? <label htmlFor={window.name}>{props.label}{props.required ? <Icon name="icon-required" className="filed-required" size="8px" /> : null}</label> : null}
            <div className="form-container">
                <div className="date-select-items">
                    <DropDown
                        name="day"
                        id={`${props.name}day${props.index}`}
                        value={dayOptions.find(d => d.id === date)}
                        itemDisplayFormat="title"
                        dataSource={dayOptions}
                        placeholder={tr("day")}
                        mobileTitle={`${props.label} - ${tr("day")}`}
                        selectOptionsMode={width <= small}
                        onChange={onDropDownChange}
                        nextElement={`${props.name}month${props.index}`}
                    />
                    <DropDown
                        name="month"
                        id={`${props.name}month${props.index}`}
                        value={monthOptions.find(d => d.id === month)}
                        itemDisplayFormat="title"
                        selectOptionsMode={width <= small}
                        dataSource={monthOptions}
                        mobileTitle={`${props.label} - ${tr("month")}`}
                        placeholder={tr("month")}
                        onChange={onDropDownChange}
                        nextElement={`${props.name}year${props.index}`}
                    />
                    <DropDown
                        name="year"
                        id={`${props.name}year${props.index}`}
                        value={yearOptions.find(d => d.id === year)}
                        itemDisplayFormat="title"
                        selectOptionsMode={width <= small}
                        dataSource={yearOptions}
                        mobileTitle={`${props.label} - ${tr("year")}`}
                        placeholder={tr("year")}
                        onChange={onDropDownChange}
                        nextElement={props.name === "birthDate" ? `idcd${props.index}` : `gender${props.index + 1}`}
                    />
                </div>
                <fieldset aria-hidden="true" className={`form-fieldset${focused ? " form-focused" : ""}`}>
                    <legend className="form-fieldset-legend">
                        {props.label ? <label htmlFor={window.name}>{props.label}{props.required ? <Icon name="icon-required" className="filed-required" size="8px" /> : null}</label> : null}
                    </legend>
                </fieldset>
            </div>
            <p className="form-error">{props.error}</p>
            <p className="form-error">{validationError}</p>
        </div>
    )
}

function setDays() {
    const days: IDate[] = [];
    for (let i = 1; i < 32; i++) {
        days.push({ id: i, title: i.toString() });
    }
    return days;
}
