/* eslint-disable react-hooks/exhaustive-deps */
import { KeyCode, Locale } from "@ui-kit/common";
import { IFormControlProps, IIconSetting, Icon, generateIcon } from "@ui-kit/components/index";
import { Culture } from "@ui-kit/core/index";
import { DigitsToEN, isSafariBrowser } from "@ui-kit/utilize";
import { CSSProperties, FC, HTMLInputTypeAttribute, KeyboardEvent, useEffect, useRef, useState } from "react";

interface ITextInputProps extends IFormControlProps {
    dataSource?: any;
    dataMember?: any;
    inputLanguage?: "fa" | "en";
    loading?: boolean;
    prefix?: any;
    postfix?: any;
    pad?: IPad;
    size?: "default" | "small";
    iconSetting?: IIconSetting;
    type?: HTMLInputTypeAttribute;
    autoFocus?: boolean;
}

export interface IPad {
    type: "start" | "end";
    count: number;
    character: string;
}

export const TextInput: FC<ITextInputProps> = (props) => {
    const {
        autoFocus,
        id,
        className,
        type = "text",
        label,
        name,
        dir,
        error,
        placeholder,
        readonly,
        inputLanguage,
        required,
        autoComplete,
        disabled,
        icon,
        dataSource,
        dataMember,
        prefix,
        postfix,
        pad,
        size,
        iconSetting,
        onChange,
        onBlur,
        onFocus,
        onKeyDown
    } = props;
    const { lang } = Culture.getLocale();
    const IrLocale = Culture.getLocale(Locale.fa);
    const inputRef = useRef<HTMLInputElement>(null);
    const value = props.value || (dataSource ? dataSource[dataMember] : '') || '';
    const iconRef = useRef<HTMLSpanElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [focused, setFocused] = useState<boolean>(false);
    const placeholderValue = label ? focused && placeholder ? placeholder : "" : placeholder;

    useEffect(() => {
        if (inputRef && inputRef.current) {
            inputRef.current.value = value.replace(postfix, "").replace(prefix, "");
        }
    }, [value]);

    useEffect(() => {
        if (autoFocus && inputRef.current)
            inputRef.current.focus();
    }, [autoFocus]);

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

    const renderValue = (value: string = "") => {
        value = DigitsToEN(value).trim();
        if (value) {
            if (pad) {
                if (pad.type === "start")
                    value = value.padStart(pad.count, pad.character)
                else
                    value = value.padEnd(pad.count, pad.character)
            }
            if (prefix && typeof prefix !== "object")
                value = prefix + value;
            if (postfix && typeof postfix !== "object")
                value = value + postfix;
        }
        return value;
    }

    const onInputChange = () => {
        if (dataSource && dataMember)
            dataSource[dataMember] = inputRef.current?.value;
        if (onChange && name && !readonly)
            onChange(name, renderValue(inputRef.current?.value));
    }

    const onInputFocus = () => {
        if (onFocus && name && !readonly)
            onFocus(name, renderValue(inputRef.current?.value));
        setFocused(true);
    }

    const onInputBlur = () => {
        setFocused(false);
        if (dataSource && dataMember)
            dataSource[dataMember] = renderValue(inputRef.current?.value);
        if (inputRef && inputRef.current)
            inputRef.current.value = renderValue(inputRef.current?.value).replace(postfix, "").replace(prefix, "");
        if (onBlur && name && !readonly)
            onBlur(name, renderValue(inputRef.current?.value));
    }

    const onInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === KeyCode.Enter)
            onInputBlur();
        if (onKeyDown)
            onKeyDown(e, renderValue(inputRef.current?.value))
    }

    const labelStyle: CSSProperties = iconRef && iconRef.current ? lang === IrLocale.lang ? { transform: `translate(-${iconRef.current.clientWidth + 3}px,9px)` } : { transform: `translate(${iconRef.current.clientWidth + 3}px,9px)` } : {};

    return (
        <div ref={containerRef} className={`text-input form-group ${size ?? "default"} ${className ? ` ${className}` : ""}${icon ? " has-icon" : ""}${error ? " has-error" : ""}${value || (dataSource && dataSource[dataMember]) ? " has-value" : ""}${focused ? " form-focused" : ""}`}>
            {label ? <label style={labelStyle} htmlFor={name}>{label}{required ? <Icon name="icon-required" className="filed-required" size="8px" /> : null}</label> : null}
            <div className="form-container">
                <div className={`flex-grow form-input-section${inputLanguage ? ` ${inputLanguage}` : ""}${type === "email" ? " en" : ""}${dir ? ` dir-${dir}` : ""}`}>
                    {
                        iconSetting && generateIcon(iconSetting) ? <div className="flex flex-center icon-position">{generateIcon(iconSetting)}</div> : ""
                    }
                    {
                        (focused || value || (dataSource && dataSource[dataMember])) && prefix ? <span className="prefix">{prefix}</span> : ""
                    }
                    <input
                        id={id}
                        className={`form-control${iconSetting && generateIcon(iconSetting) ? dir === "ltr" ? " no-padding-left" : " no-padding-x" : ""}`}
                        name={name}
                        ref={inputRef}
                        type={isSafariBrowser() && type === "number" ? "text" : type}
                        min={0}
                        placeholder={placeholderValue}
                        autoComplete={autoComplete}
                        readOnly={readonly}
                        disabled={disabled}
                        onChange={onInputChange}
                        onFocus={onInputFocus}
                        onBlur={onInputBlur}
                        onKeyDown={onInputKeyDown}
                    />
                    {
                        (focused || value || (dataSource && dataSource[dataMember])) && postfix ? <span className="postfix">{postfix}</span> : ""
                    }
                </div>
                <fieldset aria-hidden="true" className={`form-fieldset${focused ? " form-focused" : ""}`}>
                    <legend className="form-fieldset-legend">
                        {label ? <label style={labelStyle} htmlFor={name}>{label}{required ? <Icon name="icon-required" className="filed-required" size="8px" /> : null}</label> : null}
                    </legend>
                </fieldset>
            </div>
            <p className="form-error">{error || ""}</p>
        </div>
    );

}