/* eslint-disable react-hooks/exhaustive-deps */
import flags from "@ui-kit/assets/images/flags.png";
import { IContactNumber, ICountry, ViewPort } from "@ui-kit/common";
import { DisplayMode, DropDown, IFormControlProps, Icon, IconMode, TextInput } from "@ui-kit/components/index";
import { Translate } from "@ui-kit/service";
import { DigitsToEN, getWidth, nameof } from "@ui-kit/utilize";
import { FC, useEffect, useRef, useState } from "react";
import { useController, useForm } from "react-hook-form";

interface IPhoneSectionProps extends IFormControlProps {
    type?: "phone" | "tel";
    index?: number;
    countriesData: ICountry[];
    readonlyInternationalCode?: boolean;
    readonlyAreaCode?: boolean;
    readonlyLineNumber?: boolean;
    dataSource?: any;
    dataMember?: any;
    freezeCallingCode?: string;
    size?: "default" | "small";
    error?: any;
}

export const PhoneSection: FC<IPhoneSectionProps> = (props) => {
    const { tr } = Translate;
    const inputRef = useRef<HTMLInputElement>(null);
    const widthTimer = useRef<NodeJS.Timeout>();
    const [width, SetWidth] = useState<number>(getWidth());
    const { control } = useForm();
    const { field: { ref, onBlur, onChange } } = useController({
        name: props.validate?.name ?? (props.name || ""),
        control: props.validate?.control ?? control
    });

    if (props.freezeCallingCode && !props.dataSource[props.dataMember]?.internationalCode)
        props.dataSource[props.dataMember] = { internationalCode: props.countriesData?.find(c => c.callingCode === props.freezeCallingCode?.toString())?.callingCode };

    useEffect(() => {
        ref(inputRef.current)
    }, [inputRef]);

    useEffect(() => {
        window.addEventListener("resize", onResize);

        return (() => window.removeEventListener("resize", onResize))
    }, [])

    const onResize = () => {
        clearTimeout(widthTimer.current as NodeJS.Timeout);
        widthTimer.current = setTimeout(() => {
            SetWidth(getWidth());
        }, 200);
    }

    const onTextInputBlur = (name: string, value: string) => {
        value = DigitsToEN(value);
        value = value.replace(/^0+/, '').replace(/^۰+/, '');
        props.validate && onBlur();
        props.onBlur && props.onBlur(name, value);
    }

    const onChangeInternationalCode = (name: string, value: string) => {
        if (props.dataSource && props.dataMember)
            props.dataSource[props.dataMember].internationalCode = value || undefined;
        props.validate && onChange(props.dataSource ? props.dataSource[props.dataMember] : value || undefined);
        props.onChange && props.onChange(name, value);
    }

    const onChangeAreaCode = (name: string, value: string) => {
        value = DigitsToEN(value);
        props.validate && onChange(props.dataSource ? props.dataSource[props.dataMember] : value || undefined);
        props.onChange && props.onChange(name, value);
    }

    const onChangePhoneNumber = (name: string, value: string) => {
        value = DigitsToEN(value);
        value = value.replace(/^0+/, '').replace(/^۰+/, '');
        props.validate && onChange(props.dataSource ? props.dataSource[props.dataMember] : value || undefined);
        props.onChange && props.onChange(name, value);
    }

    return (
        <div className={`form-group phone-section has-value form-focused${props.className ? ` ${props.className}` : ""}${props.error?.areaCode || props.error?.internationalCode || props.error?.phoneNumber ? " has-error" : ""}`}>
            {props.label ? <label htmlFor={window.name}>{props.label}{props.required ? <Icon name="icon-required" className="filed-required" size="8px" /> : null}</label> : null}
            <div className="form-container">
                <div className={`${props.type}-section-items`}>
                    <DropDown
                        name={nameof<IContactNumber>("internationalCode")}
                        id={`${nameof<IContactNumber>("internationalCode")}${props.index ?? ''}`}
                        className="international-code"
                        autoComplete="off"
                        value={props.countriesData?.find(c => c.callingCode === (props.dataSource[props.dataMember]?.internationalCode))}
                        placeholder={tr("id")}
                        valueKey="callingCode"
                        onChange={onChangeInternationalCode}
                        itemDisplayFormat={`{name} - {callingCode}`}
                        dataSource={props.countriesData || []}
                        disabled={props.disabled}
                        size={props.size}
                        readonly={props.readonlyInternationalCode || props.readonly}
                        dir={width > ViewPort.small ? "ltr" : "rtl"}
                        nextElement={`${nameof<IContactNumber>(props.type === "tel" ? "areaCode" : "phoneNumber")}${props.index ?? ''}`}
                        displayMode={DisplayMode.TextAndIcon}
                        displayFormat="callingCode"
                        iconSetting={{ mode: IconMode.Position, iconField: "flagPosition", path: flags, width: "24px", height: "3876px" }}
                    />
                    {
                        props.type === "tel" ?
                            <TextInput
                                name={nameof<IContactNumber>("areaCode")}
                                type="tel"
                                id={`${nameof<IContactNumber>("areaCode")}${props.index ?? ''}`}
                                size={props.size}
                                autoComplete={props.autoComplete}
                                dataSource={props.dataSource[props.dataMember]}
                                dataMember={nameof<IContactNumber>("areaCode")}
                                onChange={onChangeAreaCode}
                                placeholder={tr("phone_area_code")}
                                disabled={props.disabled || !props.dataSource[props.dataMember]?.internationalCode}
                                onBlur={onTextInputBlur}
                                readonly={props.readonlyAreaCode || props.readonly}
                            />
                            : ""
                    }
                    <div className={`phone-splitter${props.disabled ? " splitter-disable" : ""}`} />
                    <TextInput
                        name={nameof<IContactNumber>("phoneNumber")}
                        id={`${nameof<IContactNumber>("phoneNumber")}${props.index ?? ''}`}
                        type="tel"
                        autoComplete={props.autoComplete}
                        dataSource={props.dataSource[props.dataMember]}
                        size={props.size}
                        dataMember={nameof<IContactNumber>("phoneNumber")}
                        onChange={onChangePhoneNumber}
                        placeholder={tr("number_without_zero")}
                        disabled={props.disabled || !props.dataSource[props.dataMember]?.internationalCode}
                        readonly={props.readonlyLineNumber || props.readonly}
                        onBlur={onTextInputBlur}
                    />
                </div>
                <fieldset aria-hidden="true" className="form-fieldset">
                    <legend className="form-fieldset-legend">
                        {props.label ? <label htmlFor={window.name}>{props.label}{props.required ? <Icon name="icon-required" className="filed-required" size="8px" /> : null}</label> : null}
                    </legend>
                </fieldset>
            </div>
            <p className="form-error">{props.error?.areaCode || props.error?.internationalCode || props.error?.phoneNumber}</p>
        </div>
    )
}

PhoneSection.defaultProps = {
    dataSource: [],
    autoComplete: "new-password"
}
