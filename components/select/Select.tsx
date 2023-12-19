import { IFormControlProps, Icon } from "@ui-kit/components/index";
import { ChangeEvent, FC, FocusEvent, useState } from "react";

interface IFormSelectProps extends IFormControlProps {
    options: any[];
    titleKey?: string;
    valueKey?: string;
    required?: boolean;
    dir?: "ltr" | "rtl";
}

export const Select: FC<IFormSelectProps> = (props) => {

    const { label, dir, titleKey = "title", valueKey = "id", value, name, options, error, placeholder, readonly, required, className = "", id } = props;
    const [focused, setFocused] = useState(false);

    const extClassName = dir ? `dir-${dir}` : "";

    const optionsList = options.map((o, i) =>
        (<option key={i} value={i}>{o[titleKey]}</option>));
    optionsList.splice(0, 0, <option key={-1} value={-1}>{placeholder ? placeholder : ""}</option>);

    // finding index of selected value
    const getSelectedIndex = () => {
        // value might be a number or an object
        const realValue = (value && value[valueKey]) || value;
        // finding index of selected value
        for (let i = options.length; i--;) {
            if (realValue === options[i][valueKey]) {
                return i;
            }
        }
        // in case no value is passed through props
        return undefined;
    }

    const onChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const index = Number(e.target.value);
        const item = options[index];
        if (props.onChange && !readonly) {
            props.onChange(name!, item ? item[valueKey] : -1);
        }
    }

    const onFocus = (e: FocusEvent<HTMLSelectElement>) => {
        const index = Number(e.target.value);
        const item = options[index];
        if (props.onFocus && !readonly) {
            props.onFocus(name!, item ? item.value : null);
        }
        setFocused(true);
    }

    const onBlur = (e: FocusEvent<HTMLSelectElement>) => {
        const index = Number(e.target.value);
        const item = options[index];
        if (props.onBlur && !readonly) {
            props.onBlur(name!, item ? item.value : null);
        }
        setFocused(false);
    }

    const selectedIndex = getSelectedIndex();

    return (
        <div className={`form-group select-input${className ? ` ${className}` : ""}${extClassName ? ` ${extClassName}` : ""}${error ? " has-error" : ""}${selectedIndex !== undefined ? " has-value" : ""}${focused ? " form-focused" : ""}`}>
            {label ? <label htmlFor={name}>{label}{required ? <Icon name="icon-required" className="filed-required" size="8px" /> : null}</label> : null}
            <div className="form-container">
                <select
                    id={id}
                    className="form-control"
                    name={name}
                    value={selectedIndex}
                    disabled={readonly}
                    onChange={onChange}
                    onFocus={onFocus}
                    onBlur={onBlur}
                >
                    {optionsList}
                </select>
                <svg className="form-icon" focusable="false" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M7 10l5 5 5-5z" />
                </svg>
                <fieldset aria-hidden="true" className="form-fieldset">
                    <legend className="form-fieldset-legend">
                        {label ? <label htmlFor={name}>{label}{required ? <Icon name="icon-required" className="filed-required" size="8px" /> : null}</label> : null}
                    </legend>
                </fieldset>
            </div>
            <p className="form-error">{error || ""}</p>
        </div>

    )

}

