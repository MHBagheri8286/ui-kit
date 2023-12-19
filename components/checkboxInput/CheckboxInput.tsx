import { ChangeEvent, FC } from "react";
import { FieldError, useController, useForm } from "react-hook-form";
import { IFormControlProps } from "@ui-kit/components/index";

interface ICheckboxInputProps extends IFormControlProps {
    size?: string;
}

export const CheckboxInput: FC<ICheckboxInputProps> = (props) => {
    const { control } = useForm();
    const { field: { onChange, ref } } = useController({
        name: props.validate?.name ?? (props.name || ""),
        control: props.validate?.control ?? control
    });

    const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (props.onChange && !props.readonly) {
            props.validate && onChange(e.target.checked);
            props.onChange(props.name || "", e.target.checked);
        }
    }

    return (
        <div
            className={`checkbox-input ${props.error ? "has-error" : ""} ${props.className ?? ""}`}
            style={{ height: props.size }}
        >
            <input
                id={props.id}
                name={props.name}
                ref={ref}
                className="checkbox"
                style={{ width: props.size, height: props.size }}
                type="checkbox"
                value={props.value || ""}
                checked={props.value}
                onChange={onInputChange}
                disabled={props.readonly}
            />
            <div className={`form-checkbox${props.value ? " checkbox-checked" : ""}`}>
                <svg className="checkboxSvgIcon-root"
                    xmlns="http://www.w3.org/2000/svg"
                    width={props.size || "24"}
                    height={props.size || "24"}
                    viewBox="0 0 24 24"
                >
                    <path d="M5 2c-1.654 0-3 1.346-3 3v14c0 1.654 1.346 3 3 3h14c1.654 0 3-1.346 3-3v-14c0-1.654-1.346-3-3-3h-14zm19 3v14c0 2.761-2.238 5-5 5h-14c-2.762 0-5-2.239-5-5v-14c0-2.761 2.238-5 5-5h14c2.762 0 5 2.239 5 5z" />
                </svg>
                <svg className="checkboxSvgIcon-root checkboxSvgIcon-check"
                    xmlns="http://www.w3.org/2000/svg"
                    width={props.size || "24"}
                    height={props.size || "24"}
                    viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.762 0-5 2.239-5 5v14c0 2.761 2.238 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-8.959 17l-4.5-4.319 1.395-1.435 3.08 2.937 7.021-7.183 1.422 1.409-8.418 8.591z" />
                </svg>
            </div>
            {props.label && <label htmlFor={props.id}>{props.label}</label>}
            <p className="form-error">{(props.error as FieldError)?.message}</p>
        </div>
    );

}