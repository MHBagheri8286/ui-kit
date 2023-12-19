import { Button, IFormControlProps } from "@ui-kit/components/index";
import { FC, MouseEvent } from "react";

interface IRangeInputProps extends IFormControlProps {
    max?: number;
    min?: number;
}

export const RangeInput: FC<IRangeInputProps> = (props) => {
    const { value, name, readonly, error, min, max } = props;

    const onChange = (event: MouseEvent<HTMLButtonElement>) => {
        if (name && props.onChange && !readonly) {
            if (event.currentTarget.name === "increase") {
                max && value + 1 > max ? props.onChange(name, value) : props.onChange(name!, value + 1);
            } else {
                min && value - 1 < min ? props.onChange(name, value) : props.onChange(name!, value - 1);
            }
        }
    }

    return (
        <div className={`form-group range-input ${error ? "has-error" : ""}`}>
            <div className="form-range">
                <Button
                    variant="contained"
                    color="primary"
                    name="decrease"
                    icon="icon-minus"
                    className="range-btn"
                    disabled={min === value}
                    onClick={onChange}
                />
                <div className="range-value">{value}</div>
                <Button
                    variant="contained"
                    color="primary"
                    name="increase"
                    icon="icon-plus"
                    className="range-btn"
                    disabled={max === value}
                    onClick={onChange}
                />
            </div>
            <p className="form-error">{error || ""}</p>
        </div>
    );

}

