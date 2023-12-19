import { ChangeEvent, FC } from "react";
import { FieldError, useController, useForm } from "react-hook-form";
import { IFormControlProps } from "@ui-kit/components/index";

interface IRadioInputProps extends IFormControlProps {
    checked: boolean;
}

export const RadioInput: FC<IRadioInputProps> = (props) => {
    const { control } = useForm();
    const { field: { onChange, ref } } = useController({
        name: props.validate?.name ?? (props.name || ""),
        control: props.validate?.control ?? control
    });

    const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (props.onChange && !props.readonly) {
            props.validate && onChange(props.value);
            props.onChange(props.name!, props.value);
        }
    }

    return (
        <div className={`form-group radio-input${props.error ? " has-error" : ""}`}>
            <input
                type="radio"
                id={props.id}
                ref={ref}
                className="radio"
                name={props.name}
                value={props.value}
                checked={props.checked}
                readOnly={props.readonly}
                disabled={props.disabled}
                onChange={onInputChange}
            />
            <div className={`form-radio${props.label ? " margin" : ""}`}>
                <svg
                    className="radiovgIcon-root"
                    focusable="false"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    role="presentation"
                >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
                </svg>
                <svg
                    className={`radiovgIcon-root radiovgIcon-dot ${props.checked ? "active" : ""}`}
                    focusable="false"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    role="presentation"
                >
                    <path d="M8.465 8.465C9.37 7.56 10.62 7 12 7C14.76 7 17 9.24 17 12C17 13.38 16.44 14.63 15.535 15.535C14.63 16.44 13.38 17 12 17C9.24 17 7 14.76 7 12C7 10.62 7.56 9.37 8.465 8.465Z" />
                </svg>
            </div>
            {props.label ? <label className="title" htmlFor={props.id} >{props.label}</label> : ""}
            <p className="form-error">{(props.error as FieldError)?.message}</p>
        </div>
    );
}

RadioInput.defaultProps = {
    value: ""
}