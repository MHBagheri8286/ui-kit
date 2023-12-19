/* eslint-disable react-hooks/exhaustive-deps */
import { KeyCode, Locale, ViewPort } from "@ui-kit/common";
import { DatePicker, IFormControlProps, Icon, Modal } from "@ui-kit/components/index";
import { Culture, DateTime, ILocale } from "@ui-kit/core/index";
import { formatToDate, formatToDateTime, getWidth, setToLocaleDawn } from "@ui-kit/utilize";
import { ChangeEvent, FC, FocusEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { FieldError, useController, useForm } from "react-hook-form";

interface IDateTimeInputProps extends IFormControlProps {
    hasTime?: boolean;
    onDateRangeModeChange: (locale: ILocale) => void;
}

export const DateTimeInput: FC<IDateTimeInputProps> = (props) => {
    const { dir } = Culture.getLocale();
    const IrLocale = Culture.getLocale(Locale.fa);
    const UsLocale = Culture.getLocale(Locale.en);
    const { medium } = ViewPort;
    const dateRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const widthTimer = useRef<NodeJS.Timeout>();
    const [width, SetWidth] = useState<number>(getWidth());
    const [picker, setPicker] = useState<boolean>(false);
    const [focused, setFocused] = useState<boolean>(false);
    let [dateTime, setDateTime] = useState<DateTime>(Culture.getDateTimeInstance(props.locale?.code));
    let [calenderPosition, setCalenderPosition] = useState<string>("");
    let [calenderStyle, setCalenderStyle] = useState<any>(null);
    const { control } = useForm();
    const { field: { onChange, onBlur, ref } } = useController({
        name: props.validate?.name ?? (props.name || ""),
        control: props.validate?.control ?? control
    });

    if (inputRef && inputRef.current) {
        inputRef.current.value = (props.hasTime ? formatToDateTime(props.value, { locale: props.locale?.code, utc: false })
            : formatToDate(props.value, { locale: props.locale?.code, utc: false })) || "";
    }

    useEffect(() => {
        ref(inputRef.current);
    }, [inputRef]);

    useEffect(() => {
        document.addEventListener("click", handleOuterClick);
        window.addEventListener("resize", onResize);

        return () => {
            document.removeEventListener("click", handleOuterClick);
            window.removeEventListener("resize", onResize);
        }
    }, []);

    const onResize = () => {
        clearTimeout(widthTimer.current as NodeJS.Timeout);
        widthTimer.current = setTimeout(() => {
            SetWidth(getWidth());
        }, 200);
    }

    const handleOuterClick = (e: any) => {
        if (!(dateRef.current?.contains(e.target))) {
            setPicker(false);
        }
    }

    const onInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        switch (e.key) {
            case KeyCode.Tab:
                return setPicker(false);
        }
    }

    const showPicker = (e: any) => {
        let remainingWidth: number;
        calenderPosition = "";
        calenderStyle = null;
        const rect = e.target.getBoundingClientRect();
        const remainingHeightBottom: number = window.innerHeight - rect.bottom;
        const remainingHeightTop: number = rect.top;
        dir === "rtl" ? remainingWidth = rect.right : remainingWidth = window.innerWidth - rect.left;
        if (remainingHeightBottom < 366) {
            if (remainingHeightTop < 366) {
                calenderStyle = { bottom: `-${366 - remainingHeightTop + 49}px` };
            } else
                calenderPosition = "bottom";
        }
        if (remainingWidth < 300) {
            dir === "rtl" ? calenderPosition += " left" : calenderPosition += " right";
        }

        setCalenderPosition(calenderPosition);
        setCalenderStyle(calenderStyle);
        setPicker(true);
    }

    const onValueChange = (value: string) => {
        // dateTime validation, also sets the correct values
        const timestamp = dateTime.validate(value, props.hasTime, false) ? setToLocaleDawn(dateTime.getTime()) : undefined;
        if (props.name && props.onChange)
            props.onChange(props.name, timestamp);
        if (inputRef && inputRef.current)
            inputRef.current.value = value;
        setPicker(false);
        props.validate && onChange(timestamp);
    }

    const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.currentTarget.value;
        onValueChange(value);
    }

    const onInputFocus = (e: FocusEvent<HTMLInputElement>) => {
        showPicker(e);
        setFocused(true);
    }

    const onInputBlur = () => {
        setFocused(false);
        if (props.validate)
            onBlur();
    }

    const onDateRangeModeChange = () => {
        const timestamp = dateTime.validate(inputRef?.current?.value || "", props.hasTime, false) ? dateTime.getTime() : 0;
        const timeLocale = props.locale?.code === IrLocale.code ? UsLocale : IrLocale;
        dateTime = Culture.getDateTimeInstance(timeLocale.code);
        const dateTimeValue = (props.hasTime ? formatToDateTime(timestamp, { locale: timeLocale.code, utc: false }) : formatToDate(timestamp, { locale: timeLocale.code, utc: false })) || "";
        setDateTime(dateTime);
        if (inputRef && inputRef.current)
            inputRef.current.value = dateTimeValue;
        props.onDateRangeModeChange(timeLocale);
    }

    return (
        <div ref={dateRef} className={`form-group date-time-input has-icon${props.className ? ` ${props.className}` : ""}${inputRef?.current?.value ? " has-value" : ""}${focused ? " form-focused" : ""}${props.error ? " has-error" : ""}`}>
            {props.label ? <label htmlFor={props.name}>{props.label}{props.required ? <Icon name="icon-required" className="filed-required" size="8px" /> : null}</label> : null}
            <div className="form-container">
                <Icon name="icon-calendar-outline" className="icon-input" onClick={showPicker} />
                <input
                    id={props.id}
                    className="form-control"
                    ref={inputRef}
                    name={props.name}
                    placeholder={props.placeholder}
                    readOnly={true}
                    onClick={showPicker}
                    onChange={onInputChange}
                    onFocus={onInputFocus}
                    onBlur={onInputBlur}
                    onKeyDown={onInputKeyDown}
                    disabled={props.disabled}
                />
                {props.value ? <Icon name="icon-close-circle" onClick={() => onValueChange("")} /> : ""}
                <fieldset aria-hidden="true" className="form-fieldset">
                    <legend className="form-fieldset-legend">
                        {props.label ? <label htmlFor={props.name}>{props.label}{props.required ? <Icon name="icon-required" className="filed-required" size="8px" /> : null}</label> : null}
                    </legend>
                </fieldset>
            </div>
            <p className="form-error">{(props.error as FieldError).message}</p>
            <Modal
                className={calenderPosition}
                show={picker}
                name="fade"
                mode={width <= medium ? "full" : "inline"}
                style={calenderStyle}
                onClose={() => setPicker(false)}
            >
                <DatePicker
                    value={inputRef.current?.value || ""}
                    locale={props.locale}
                    hasTime={props.hasTime}
                    onDatePickerModeChange={onDateRangeModeChange}
                    onChange={onValueChange}
                    onAbort={() => setPicker(false)}
                />
            </Modal>
        </div>
    );
}