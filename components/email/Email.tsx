/* eslint-disable react-hooks/exhaustive-deps */
import { CSSProperties, FC, KeyboardEvent, useEffect, useRef, useState } from "react";
import { FieldError, useController, useForm } from "react-hook-form";
import { IFormControlProps, IIconSetting, Icon, generateIcon } from "@ui-kit/components/index";
import { Culture } from "@ui-kit/core";
import { Locale } from "@ui-kit/common";


interface IEmailProps extends IFormControlProps {
    dataSource?: any;
    dataMember?: any;
    inputLanguage?: "fa" | "en";
    loading?: boolean;
    iconSetting?: IIconSetting;
    autoFocus?: boolean;
}


export const Email: FC<IEmailProps> = (props) => {
    const { lang } = Culture.getLocale();
    const IrLocale = Culture.getLocale(Locale.fa);
    const inputRef = useRef<HTMLInputElement>(null);
    const iconRef = useRef<HTMLSpanElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [focused, setFocused] = useState<boolean>(false);
    const placeholderValue = props.label ? focused && props.placeholder ? props.placeholder : "" : props.placeholder;
    const value = props.value || (props.dataSource ? props.dataSource[props.dataMember].emailAddress : '') || ''
    const { control } = useForm();
    const { field: { onChange, onBlur, ref } } = useController({
        name: props.validate?.name ?? (props.name || ""),
        control: props.validate?.control ?? control
    });

    useEffect(() => {
        ref(inputRef.current);
    }, [inputRef]);

    useEffect(() => {
        if (inputRef && inputRef.current)
            inputRef.current.value = value;
    }, [value]);

    useEffect(() => {
        if (props.autoFocus && inputRef.current)
            inputRef.current.focus();
    }, [props.autoFocus]);

    useEffect(() => {
        document.addEventListener("click", handleOuterClick);
        return () => {
            setTimeout(() => {
                document.removeEventListener("click", handleOuterClick);
            }, 100);
        };
    });

    const handleOuterClick = (e: any) => {
        if (!containerRef.current?.contains(e.target))
            setFocused(false)
    }


    const onInputChange = () => {
        props.validate && onChange(props.dataSource[props.dataMember] ? props.dataSource[props.dataMember] : undefined);
        if (props.onChange && props.name && !props.readonly)
            props.onChange(props.name, props.dataSource[props.dataMember]);
    }

    const onInputFocus = () => {
        setFocused(true);
        if (props.onFocus && props.name && !props.readonly)
            props.onFocus(props.name, props.dataSource[props.dataMember]);
    }

    const onInputBlur = () => {
        props.validate && onBlur();
        setFocused(false);
        if (props.dataSource && props.dataMember)
            props.dataSource[props.dataMember].emailAddress = inputRef.current?.value;
        if (props.onBlur && props.name && !props.readonly)
            props.onBlur(props.name, props.dataSource[props.dataMember]);
    }

    const onInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (props.onKeyDown)
            props.onKeyDown(e, inputRef.current?.value)
    }

    const labelStyle: CSSProperties = iconRef && iconRef.current ? lang === IrLocale.lang ? { transform: `translate(-${iconRef.current.clientWidth + 3}px,9px)` } : { transform: `translate(${iconRef.current.clientWidth + 3}px,9px)` } : {};

    return (
        <div ref={containerRef} className={`text-input form-group${props.className ? ` ${props.className}` : ""}${props.icon ? " has-icon" : ""}${props.error ? " has-error" : ""}${inputRef.current?.value || (props.dataSource && props.dataSource.emailAddress) ? " has-value" : ""}${focused ? " form-focused" : ""}`}>
            {props.label ? <label style={labelStyle} htmlFor={props.name}>{props.label}{props.required ? <Icon name="icon-required" className="filed-required" size="8px" /> : null}</label> : null}
            <div className="form-container">
                <div className={`flex-grow form-input-section${props.inputLanguage ? ` ${props.inputLanguage}` : ""}${props.dir ? ` dir-${props.dir}` : ""}`}>
                    {
                        props.iconSetting && generateIcon(props.iconSetting) ? <div className="flex flex-center icon-position">{generateIcon(props.iconSetting)}</div> : ""
                    }
                    <input
                        id={props.id}
                        className={`form-control`}
                        name={props.name}
                        ref={inputRef}
                        type="email"
                        placeholder={placeholderValue}
                        autoComplete={props.autoComplete}
                        readOnly={props.readonly}
                        disabled={props.disabled}
                        onChange={onInputChange}
                        onFocus={onInputFocus}
                        onBlur={onInputBlur}
                        onKeyDown={onInputKeyDown}
                    />
                </div>
                <fieldset aria-hidden="true" className={`form-fieldset${focused ? " form-focused" : ""}`}>
                    <legend className="form-fieldset-legend">
                        {props.label ? <label style={labelStyle} htmlFor={props.name}>{props.label}{props.required ? <Icon name="icon-required" className="filed-required" size="8px" /> : null}</label> : null}
                    </legend>
                </fieldset>
            </div>
            <p className="form-error">{(props.error as FieldError)?.message}</p>
        </div>
    );

}