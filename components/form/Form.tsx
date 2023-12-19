import { KeyCode } from "@ui-kit/common";
import { ILocale } from "@ui-kit/core";
import { CSSProperties, ChangeEvent, FC, KeyboardEvent } from "react";
import { Control, FieldError } from "react-hook-form";

export type ChangeEventHandler = (name: string, value: any) => void;

export interface IValidate {
    control?: Control;
    name?: string;
}
export interface IFormControlProps {
    autoComplete?: "on" | "off" | "new-password";
    className?: string;
    locale?: ILocale;
    dir?: "ltr" | "rtl";
    disabled?: boolean;
    error?: string | FieldError;
    icon?: any;
    id?: string;
    label?: any;
    name?: string;
    onBlur?: ChangeEventHandler;
    onChange?: ChangeEventHandler;
    onFocus?: ChangeEventHandler;
    onKeyDown?: (e: KeyboardEvent<HTMLInputElement>, value: any) => void;
    placeholder?: any;
    required?: boolean;
    readonly?: boolean;
    style?: CSSProperties;
    value?: any;
    validate?: IValidate;
}

interface IFormProps extends IFormControlProps {
    name?: string;
    className?: string;
    preventDefault?: boolean;
    onSubmit?: (e: ChangeEvent<HTMLFormElement>) => void;
}

export const Form: FC<IFormProps> = (props) => {
    const onKeyDown = (e: any) => {
        if (props.preventDefault && (e.code === KeyCode.Enter || e.code === KeyCode.NumpadEnter)) {
            e.preventDefault();
        }
    }

    const onFormSubmit = (e: ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (props.onSubmit)
            props.onSubmit(e);
    }

    return (
        <form
            id={props.id}
            className={props.className}
            name={props.name}
            noValidate={true}
            onKeyDown={onKeyDown}
            onSubmit={onFormSubmit}
        >
            {props.children}
        </form>
    );
}

Form.defaultProps = {
    preventDefault: false
}
