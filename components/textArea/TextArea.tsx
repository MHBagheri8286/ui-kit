/* eslint-disable react-hooks/exhaustive-deps */
import { IFormControlProps, Icon } from "@ui-kit/components/index";
import { CSSProperties, FC, useEffect, useRef, useState } from "react";
import { FieldError, useController, useForm } from "react-hook-form";

interface ITextAreaProps extends IFormControlProps {
    style?: CSSProperties;
}

export const TextArea: FC<ITextAreaProps> = (props) => {
    const textAreaInputRef = useRef<HTMLTextAreaElement>(null);
    const [focused, setFocused] = useState(false);
    const placeholderValue = props.label ? focused && props.placeholder ? props.placeholder : "" : props.placeholder;
    const { control } = useForm();
    const { field: { onChange, onBlur, ref } } = useController({
        name: props.validate?.name ?? (props.name || ""),
        control: props.validate?.control ?? control
    });

    useEffect(() => {
        ref(textAreaInputRef.current);
    }, [textAreaInputRef]);

    useEffect(() => {
        if (textAreaInputRef && textAreaInputRef.current)
            textAreaInputRef.current.value = props.value || "";
    }, [props.value]);

    const onTextAreaChange = () => {
        props.validate && onChange(textAreaInputRef.current?.value);
        if (props.onChange && props.name && !props.readonly)
            props.onChange(props.name, textAreaInputRef.current?.value);
    }

    const onTextAreaFocus = () => {
        if (props.onFocus && props.name && !props.readonly)
            props.onFocus(props.name, textAreaInputRef.current?.value);
        setFocused(true);
    }

    const onTextAreaBlur = () => {
        onTextAreaChange();
        props.validate && onBlur();
        if (props.onBlur && props.name && !props.readonly)
            props.onBlur(props.name, textAreaInputRef.current?.value);
        setFocused(false);
    }

    return (
        <div style={props.style} className={`form-group text-area ${props.className ?? ""} ${props.error ? " has-error" : ""}${props.value ? " has-value" : ""}${focused ? " form-focused" : ""}`}>
            {props.label ? <label htmlFor={props.name}>{props.label}{props.required ? <Icon name="icon-required" className="filed-required" size="8px" /> : null}</label> : null}
            <div className="form-container">
                <textarea
                    id={props.id}
                    className={`form-control`}
                    name={props.name}
                    ref={textAreaInputRef}
                    placeholder={placeholderValue}
                    autoComplete={props.autoComplete}
                    disabled={props.disabled}
                    onChange={onTextAreaChange}
                    onBlur={onTextAreaBlur}
                    onFocus={onTextAreaFocus}
                />
                <fieldset aria-hidden="true" className={`form-fieldset${focused ? " form-focused" : ""}`}>
                    <legend className="form-fieldset-legend">
                        {props.label ? <label htmlFor={props.name}>{props.label}{props.required ? <Icon name="icon-required" className="filed-required" size="8px" /> : null}</label> : null}
                    </legend>
                </fieldset>
            </div>
            <p className="form-error">{(props.error as FieldError)?.message}</p>
        </div>
    );
}

