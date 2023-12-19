/* eslint-disable react-hooks/exhaustive-deps */
import loadingIcon from '@ui-kit/assets/images/loading.svg';
import { IFormControlProps } from '@ui-kit/components/form/Form';
import { Icon } from '@ui-kit/components/index';
import { Culture } from '@ui-kit/core/index';
import { formatToDateTime } from '@ui-kit/utilize';
import { FC, useEffect, useRef, useState } from 'react';
import { CSSTransition } from 'react-transition-group';

interface ITimePickerProps extends IFormControlProps {
    hint?: string;
    loading?: boolean;
    format: string;
    initDate?: number;
}

export const TimePicker: FC<ITimePickerProps> = ({ className, format, name, label, required, value, error, placeholder, disabled, id, loading, initDate, onChange }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [hour, setHour] = useState<number>(0);
    const [minute, setMinute] = useState<number>(0);
    const [focused, setFocused] = useState(false);
    const [showPicker, setShowPicker] = useState(false);

    useEffect(() => {
        if (value && !isNaN(value)) {
            setHour(Number(formatToDateTime(value, { format: "H" })));
            setMinute(Number(formatToDateTime(value, { format: "i" })));
        }
    }, [value]);

    useEffect(() => {
        document.addEventListener("click", handleOuterClick);

        return () => {
            document.removeEventListener("click", handleOuterClick);
        };
    }, []);

    const handleOuterClick = (e: any) => {
        if (!containerRef.current?.contains(e.target))
            if (!(e.target.parentElement?.id === "timePickerContent"))
                setShowPicker(false);
    }

    const onValueChange = (n: string, v: number) => {
        const dateTime = Culture.getDateTimeInstance();
        if (!isNaN(value))
            dateTime.setTime(value);
        else if (initDate)
            dateTime.setTime(initDate);
        n === "h" ? dateTime.setUTCHours(v) : dateTime.setUTCMinutes(v);
        if (name && onChange)
            onChange(name, dateTime.getTime());
    }

    const onTimePickerFocus = () => {
        setFocused(true);
        setShowPicker(true);
    }

    const onTimePickerBlur = () => {
        setFocused(false);
    }

    return (
        <div ref={containerRef} className={`form-group time-picker${className ? ` ${className}` : ""}${error ? " has-error" : ""}${value ? " has-value" : ""}${focused ? " form-focused" : ""}`}>
            {label ? <label htmlFor={name}>{label}{required ? <Icon name="icon-required" className="filed-required" size="8px" /> : null}</label> : null}
            <div className="form-container">
                {
                    loading ? <img className="time-picker-loading" src={loadingIcon} alt="loading" /> :
                        <input
                            id={id}
                            className="form-control ltr"
                            name={name}
                            type="text"
                            value={formatToDateTime(value, { format })}
                            placeholder={placeholder}
                            disabled={disabled}
                            readOnly
                            onBlur={onTimePickerBlur}
                            onFocus={onTimePickerFocus}
                        />
                }
                <fieldset aria-hidden="true" className={`form-fieldset${focused ? " form-focused" : ""}`}>
                    <legend className="form-fieldset-legend">
                        {label ? <label htmlFor={name}>{label}{required ? <Icon name="icon-required" className="filed-required" size="8px" /> : null}</label> : null}
                    </legend>
                </fieldset>
            </div>
            <p className="form-error">{error || ""}</p>
            <CSSTransition
                classNames="fade"
                in={showPicker}
                timeout={{ enter: 500, exit: 100 }}
                unmountOnExit
            >
                <div
                    id='timePickerContent'
                    className="time-picker-content"
                    style={{ minWidth: containerRef.current?.getBoundingClientRect().width }}
                >
                    <div className="time-picker-item">
                        <Icon name='icon-chevron-up' onClick={() => onValueChange('h', hour + 1)} />
                        <input
                            className='time-picker-item-text'
                            type="number"
                            value={hour}
                            min={0}
                            max={23}
                            onChange={(e) => onValueChange('h', +e.currentTarget.value)}
                        />
                        <Icon name='icon-chevron-down' onClick={() => onValueChange('h', hour - 1)} />
                    </div>
                    <span className="time-picker-seperator">:</span>
                    <div className="time-picker-item">
                        <Icon name='icon-chevron-up' onClick={() => onValueChange('m', minute + 1)} />
                        <input
                            className="time-picker-item-text"
                            type="number"
                            value={minute}
                            min={0}
                            max={59}
                            onChange={(e) => onValueChange('m', +e.currentTarget.value)}
                        />
                        <Icon name='icon-chevron-down' onClick={() => onValueChange('m', minute - 1)} />
                    </div>
                </div>
            </CSSTransition>
        </div>
    )
}