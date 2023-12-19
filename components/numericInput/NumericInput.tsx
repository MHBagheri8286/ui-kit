import { IFormControlProps, Icon } from "@ui-kit/components/index";
import { FC, InputHTMLAttributes, useEffect, useRef, useState } from "react";

interface INumericInputProps extends IFormControlProps {
    format?: boolean;
    size?: number;
    step?: number;
}

export const NumericInput: FC<INumericInputProps> = (props) => {
    const ref = useRef<HTMLTextAreaElement>(null);
    const [focused, setFocused] = useState(false);
    const { id, className, label, name, value, step, error, placeholder, size, required, readonly, disabled, format } = props;
    const placeholderValue = label ? focused && placeholder ? placeholder : "" : placeholder;
    const attrs: InputHTMLAttributes<HTMLInputElement> = { className: "form-control", type: "number" };

    if (placeholder) {
        attrs.placeholder = placeholderValue;
    }

    if (step) {
        attrs.step = step;
    }

    if (size) {
        attrs.size = size;
    }

    useEffect(() => {
        if (value) {
            const displayValue = format ? (+value).toLocaleString() : value.toString();
            ref.current?.setAttribute(displayValue, "0");
        } else {
            ref.current?.setAttribute("value", "0");
        }
    }, [value, format]);

    const onChange = () => {
        if (props.onChange && name && !readonly)
            props.onChange(name!, ref.current?.value);
    }

    const onFocus = () => {
        if (props.onFocus && name && !readonly)
            props.onFocus(name, ref.current?.value);
        setFocused(true);
    }

    const onBlur = () => {
        onChange();
        if (props.onBlur && name && !readonly)
            props.onBlur(name, ref.current?.value);
        setFocused(false);
    }

    return (
        <div className={`form-group numeric-input${className ? ` ${className}` : ""}${error ? " has-error" : ""}${value ? " has-value" : ""}${focused ? " form-focused" : ""}`}>
            {label ? <label htmlFor={name}>{label}{required ? <Icon name="icon-required" className="filed-required" size="8px" /> : null}</label> : null}
            <div className="form-container">
                <input
                    id={id}
                    name={name}
                    readOnly={readonly}
                    disabled={disabled}
                    {...attrs}
                    onChange={onChange}
                    onFocus={onFocus}
                    onBlur={onBlur}
                />
                <fieldset aria-hidden="true" className="form-fieldset">
                    <legend className="form-fieldset-legend">
                        {label ? <label htmlFor={name}>{label}{required ? <Icon name="icon-required" className="filed-required" size="8px" /> : null}</label> : null}
                    </legend>
                </fieldset>
            </div>
            <p className="form-error">{error || ""}</p>
        </div>
    );
}