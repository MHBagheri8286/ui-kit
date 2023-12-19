/* eslint-disable react-hooks/exhaustive-deps */
import loading from "@ui-kit/assets/images/loading.svg";
import { KeyCode, ViewPort } from "@ui-kit/common";
import { Button, Dialog, DialogFooter, IFormControlProps, IIconSetting, Icon, generateIcon } from "@ui-kit/components/index";
import { Culture } from "@ui-kit/core/index";
import { Translate } from "@ui-kit/service";
import { distinctValue, generateText, getWidth, searchInAllProperties } from "@ui-kit/utilize";
import { ChangeEvent, FC, KeyboardEvent, ReactElement, ReactNode, useEffect, useRef, useState } from "react";
import { FieldError, useController, useForm } from "react-hook-form";
import { CSSTransition } from "react-transition-group";

export enum DisplayMode {
    Text,
    Icon,
    TextAndIcon
}

export interface IPosition {
    top?: number;
    right?: number;
    left?: number;
    bottom?: number;
}
export interface IInitialLoadingOptions {
    loading: boolean;
    content?: ReactElement;
}
interface IDropDownProps extends IFormControlProps {
    dir?: "ltr" | "rtl";
    multi?: boolean;
    initialLoadingOptions?: IInitialLoadingOptions;
    searchable?: boolean;
    removable?: boolean;
    type?: string;
    mobileTitle?: string;
    itemDisplayFormat?: string;
    valueKey?: string;
    selectableKey?: string;
    columnMember?: string;
    displayMode?: DisplayMode;
    displayFormat?: string;
    scrollTo?: number;
    selectOptionsMode?: boolean;
    size?: "default" | "small";
    iconSetting?: IIconSetting;
    icon?: string;
    render?: any;
    dataSource: any[];
    listHeader?: any;
    freezeValues?: any[];
    nextElement?: string;
    onSubmit?: () => void;
    onListHeaderClick?: () => void;
    renderItem?: (record: any, index?: number) => JSX.Element;
}

export const DropDown: FC<IDropDownProps> = (props) => {
    const { tr } = Translate;
    const { small } = ViewPort;
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const inputResponsiveRef = useRef<HTMLInputElement>(null);
    const listWrapperRef = useRef<HTMLDivElement>(null);
    const [focused, setFocused] = useState<boolean>(false);
    const [dropDownItems, setDropDownItems] = useState<any[]>([]);
    const [selectedItems, setSelectedItems] = useState<any[]>([]);
    const [menuIndex, setMenuIndex] = useState<number>(props.value ? props.dataSource?.findIndex((x: any) => x[props.valueKey as string] === props.value[props.valueKey as string]) : -1);
    const [showDropdown, setShowDropdown] = useState<boolean>(false);
    const [term, setTerm] = useState<string>('');
    const [position, setPosition] = useState<IPosition>();
    const widthTimer = useRef<NodeJS.Timeout>();
    const [width, SetWidth] = useState<number>(getWidth());
    const placeholderValue = props.label ? focused && props.placeholder ? props.placeholder : "" : props.placeholder;
    const { control } = useForm();
    const { field: { onChange, onBlur, ref } } = useController({
        name: props.validate?.name ?? (props.name || ""),
        control: props.validate?.control ?? control
    });

    if (inputRef.current)
        inputRef.current.value = term || (!props.multi && props.value && generateText(props.value, (props.displayFormat ? props.displayFormat : props.itemDisplayFormat) || "")) || "";

    const loadingContent = props.initialLoadingOptions?.content ? <div className="loading-content">{props.initialLoadingOptions.content}</div> :
        <div className="loading-default flex flex-center">
            <img src={loading} alt="loading" />
            <span>{tr("msg_info_loading")}</span>
        </div>

    useEffect(() => {
        ref(inputRef.current);
    }, [inputRef]);

    useEffect(() => {
        window.addEventListener("resize", onResize);

        return () => {
            window.removeEventListener("resize", onResize)
        };
    }, []);

    useEffect(() => {
        extractInitialValues();
        changeMenuIndex();
        const selectedItems = props.freezeValues ? [...props.freezeValues] : [];
        if (props.value) {
            if (props.multi)
                props.value.forEach((value: any) => {
                    selectedItems.push(value)
                });
            else if (props.value[props.valueKey as string]) {
                selectedItems.push(props.value);
            }
        }
        setSelectedItems([...selectedItems]);
    }, [props.value]);

    useEffect(() => {
        setDropDownItems([...(props.dataSource?.length ? props.dataSource : [])]);
        changeMenuIndex();
    }, [props.dataSource])

    useEffect(() => {
        setPositionListWrapper();
    }, [dropDownItems])

    const onResize = () => {
        clearTimeout(widthTimer.current as NodeJS.Timeout);
        widthTimer.current = setTimeout(() => {
            SetWidth(getWidth());
        }, 200);
    }

    const handleOuterClick = (e: any) => {
        if (!containerRef.current?.contains(e.target))
            if (!(e.target.parentElement?.id === "listWrapper"))
                onInputBlur();
    }

    const scrollWindow = () => {
        setPositionListWrapper()
    }

    const setPositionListWrapper = () => {
        if (containerRef && listWrapperRef.current) {
            const position: IPosition = {};
            const containerRect = containerRef.current?.getBoundingClientRect();
            const listWrapperRect = listWrapperRef.current.getBoundingClientRect();
            const containerPosition = containerRect || { bottom: 0, top: 0 };
            const remainingBottom = window.innerHeight - containerPosition.bottom;
            const listWrapperHeight = listWrapperRect.height || 0;
            const listWrapperWidth = listWrapperRect.width || 0;
            listWrapperRef.current.style.visibility = "visible";
            //set max height for list wrapper
            const maxHeight = remainingBottom > containerPosition.top ? remainingBottom : containerPosition.top;
            listWrapperRef.current.style.maxHeight = `${maxHeight < 320 ? maxHeight - 20 : 320}px`;
            const remainingWidth = props.dir === "ltr" ? window.innerWidth - (containerRect?.left || 0) : (containerRect?.right || 0);
            // Set positon (top, bottom, ...)
            if (remainingWidth < listWrapperWidth) {
                position[props.dir === "ltr" ? "right" : "left"] = 15;
            }
            if (remainingBottom < listWrapperHeight) {
                position.top = remainingBottom > containerPosition.top ? containerPosition.bottom : 0;
                position.bottom = remainingBottom < containerPosition.top ? remainingBottom + 55 : 0;
            }
            else {
                position.top = containerPosition.bottom;
            }

            setPosition({ ...position });
        }
    }

    const extractInitialValues = () => {
        if (!props.multi) {
            if (props.value) {
                const term = generateText(props.value, (props.displayFormat ? props.displayFormat : props.itemDisplayFormat) || "");
                setTerm(term);
            } else
                setTerm("");
        }
    }

    const changeMenuIndex = () => {
        setMenuIndex(props.value ? props.dataSource?.findIndex((x: any) => x[props.valueKey as string] === props.value[props.valueKey as string]) : -1);
    }

    const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (!props.selectOptionsMode) {
            const term = e.target.value;
            setTerm(term);
            const searchResult: any[] = [];
            props.dataSource?.forEach((record: any) => {
                if (record && (!term || searchInAllProperties(record, term)))
                    searchResult.push(record);
            });
            setDropDownItems(searchResult);
            if (!props.multi && term && searchResult.length)
                setMenuIndex(0);
            if (!term && props.onChange) {
                props.validate && onChange(term);
                props.onChange(props.name!, term);
            }
        }
    }

    const onInputFocus = (event: any) => {
        document.addEventListener("click", handleOuterClick);
        document.addEventListener("scroll", scrollWindow);
        const target = event.target as HTMLElement;
        if (!(props.multi && target.classList.contains('icon-close-circle'))) {
            setFocused(true);
            if (width > small && !props.selectOptionsMode)
                inputRef.current?.select();
            setTimeout(() => {
                setPositionListWrapper();
            }, 150)
            setDropDownItems([...(props.dataSource?.length ? props.dataSource : [])]);
            setShowDropdown(true);
            if (props.onFocus)
                props.onFocus(props.name!, selectedItems.map((item) => item));
        }
    }

    const onInputBlur = () => {
        setTerm("");
        setFocused(false);
        setShowDropdown(false);
        props.validate && onBlur()
        inputRef.current?.blur();
        document.removeEventListener("click", handleOuterClick);
        document.removeEventListener("scroll", scrollWindow);
    }

    const onCloseButtonClick = () => {
        onInputBlur();
        if (props.onBlur)
            props.onBlur(props.name as string, term)
    }

    const onItemSelect = (item: any) => {
        const index = dropDownItems.findIndex(x => x[props.valueKey as string] === item[props.valueKey as string]);
        const selectedIndex = selectedItems.findIndex(selectedItem => selectedItem[props.valueKey as string] === item[props.valueKey as string]);
        if (props.multi && selectedIndex !== -1) {
            selectedItems.splice(selectedIndex, 1);
            setSelectedItems(selectedItems.slice());
            props.validate && onChange(selectedItems.map((item) => item));
            props.onChange && props.onChange(props.name as string, selectedItems.map((item) => item));
        }
        else {
            selectItemByIndex(index);
        }
    }

    const selectItemByIndex = (index: number) => {
        const selectedItem = dropDownItems[index];
        if (!selectedItem) { return; }
        const selectedValue = selectedItem[props.valueKey as string];
        if (props.multi && !selectedItems.find(x => x[props.valueKey as string] === selectedItem[props.valueKey as string]))
            selectedItems.push(selectedItem);
        props.validate && onChange(props.multi ? selectedItems : selectedValue);
        props.onChange && props.onChange(props.name as string, props.multi ? selectedItems.map((item) => item) : selectedValue);
        setSelectedItems(selectedItems.slice());
        setTerm(props.multi ? "" : generateText(selectedItem, props.itemDisplayFormat || ""));
        if (props.multi && !dropDownItems.every(item => selectedItems.some(x => x[props.valueKey as string] === item[props.valueKey as string])))
            setShowDropdown(true);
        else {
            onInputBlur();
            const nextInput = document.getElementById(props.nextElement!) as HTMLInputElement;
            setTimeout(() => {
                if (nextInput && !nextInput.value && !props.renderItem)
                    nextInput.focus();
            }, width > small || props.selectOptionsMode ? 200 : 500)
        }
    }

    const renderSelectedItems = () => {
        const renderedSelectedItems = [];
        for (let i = 0, il = selectedItems.length; i < il; ++i) {
            if (selectedItems[i]) {
                if (props.freezeValues?.some(freezeItem => freezeItem[props.valueKey as string] === selectedItems[i][props.valueKey as string]))
                    renderedSelectedItems.push((
                        <div key={i} className="freezed-values" >
                            <span>{generateText(selectedItems[i], props.itemDisplayFormat || "")}</span>
                        </div>
                    ));
                else
                    renderedSelectedItems.push((
                        <div key={i} className="selected-items" >
                            {props.removable ? <i data-index={i} className={`icon icon-close-circle`} onClick={onItemDelete} /> : ""}
                            <span>{generateText(selectedItems[i], props.itemDisplayFormat || "")}</span>
                        </div>
                    ));
            }

        }

        return renderedSelectedItems;
    }

    const renderList = () => {
        let content: ReactNode;
        const columns = props.columnMember ? dropDownItems.map(x => x[props.columnMember as string]).filter((value, index, self) => distinctValue<any>(value, index, self)) : [0];
        content = <div
            id="listWrapper"
            ref={listWrapperRef}
            style={{
                top: position?.top ? position.top : "",
                bottom: position?.bottom ? position.bottom : "",
                left: position?.left ? position.left : "",
                right: position?.right ? position.right : "",
                minWidth: containerRef.current?.getBoundingClientRect().width,
                position: "fixed"
            }}
            className={`list-wrapper${props.dir ? ` dir-${props.dir}` : ""}`}
        >
            <div className="row flex spa-0">
                {
                    props.listHeader ? <div className="col-1-1 list-header flex-grow" onClick={props.onListHeaderClick}>{props.listHeader}</div> : ""
                }
                {
                    dropDownItems.length ? <>
                        {
                            columns.sort((a, b) => a - b).map((col, index) => {
                                const items = props.columnMember ? dropDownItems.filter(item => item[props.columnMember as string] === col) : dropDownItems;
                                return (
                                    <div
                                        key={`${col}${index}`}
                                        className={`list-column-wrapper col-1-${columns.length}${!items.length ? " hide" : ""}`}
                                    >
                                        {columns.length !== 1 && <div className="list-column-header">{tr(`${props.columnMember}_${col}`)}</div>}
                                        {
                                            items.map((item, i) => {
                                                const index = dropDownItems.findIndex(x => x[props.valueKey as string] === item[props.valueKey as string]);
                                                let className: string = "";
                                                if (!props.freezeValues || !props.freezeValues?.some(freezItem => freezItem[props.valueKey as string] === item[props.valueKey as string])) {
                                                    if (props.multi)
                                                        className = selectedItems.find(sel => sel[props.valueKey as string] === item[props.valueKey as string]) ? "has-hover" : "";
                                                    else
                                                        className = index === menuIndex ? "has-hover" : "";
                                                }
                                                return (
                                                    <div
                                                        id={`listItem${index}`}
                                                        key={`${index}${i}`}
                                                        className={`list-item${props.iconSetting ? " flex" : ""} ${className ? className : ""}`}
                                                        onClick={item[props.selectableKey as string] !== undefined ? (item[props.selectableKey as string] ? () => onItemSelect(item) : undefined) : () => onItemSelect(item)}
                                                    >
                                                        {props.displayMode !== DisplayMode.Text ? generateIcon(props.iconSetting, item) : ""}
                                                        {props.renderItem ? props.renderItem(item, index) : <div className="trim">{generateText(item, props.itemDisplayFormat || "")}</div>}
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                )
                            })
                        }
                    </> :
                        props.initialLoadingOptions?.loading ? loadingContent :
                            <div className="col-1-1 no-record flex flex-center">
                                <Icon name="icon-information" />
                                <span>{tr("no_record")}</span>
                            </div>
                }
            </div>
        </div>

        const onSubmitBtnClick = () => {
            const nextInput = document.getElementById(props.nextElement!) as HTMLInputElement;
            setTimeout(() => {
                if (nextInput && !nextInput.value && !props.renderItem)
                    nextInput.focus();
            }, (width > small || props.selectOptionsMode) ? 200 : 500)
            onInputBlur();
            if (props.onSubmit)
                props.onSubmit()
        }

        return (
            content ?
                width <= small && !props.selectOptionsMode ?
                    <Dialog
                        id="dropdownFull"
                        animate="slide-up"
                        show={showDropdown}
                        title={props.mobileTitle || props.label || props.placeholder}
                        onHiding={onCloseButtonClick}
                    >
                        <div className="input-search">
                            {
                                props.searchable ?
                                    <div className="form-container">
                                        <input
                                            id="dropdownFullInput"
                                            className={`form-control${props.dir ? ` dir-${props.dir}` : ""}`}
                                            ref={inputResponsiveRef}
                                            name={props.name}
                                            type={props.type}
                                            placeholder={placeholderValue}
                                            disabled={props.disabled}
                                            autoComplete={props.autoComplete}
                                            onChange={onInputChange}
                                        />
                                    </div>
                                    : ""
                            }
                            {content}
                        </div>
                        {
                            props.multi &&
                            <DialogFooter>
                                <div id="submitButton" className="submit-button">
                                    <Button
                                        variant="contained"
                                        text={tr("btn_select")}
                                        color="danger"
                                        onClick={onSubmitBtnClick}
                                    />
                                </div>
                            </DialogFooter>
                        }
                    </Dialog>
                    :
                    <CSSTransition
                        in={showDropdown}
                        classNames="fade-modal"
                        timeout={{ enter: 500, exit: 0 }}
                        unmountOnExit
                    >
                        {content}
                    </CSSTransition>
                : ""
        );
    }

    const onItemDelete = (e: any) => {
        const index = e.currentTarget.getAttribute("data-index");
        selectedItems.splice(index, 1);
        setSelectedItems(selectedItems.slice());
        props.validate && onChange(selectedItems.length ? selectedItems : undefined);
        props.onChange && props.onChange(props.name as string, selectedItems.map((item) => item));
    }

    const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        const keyCode = e.key;
        const itemsCount = dropDownItems.length;
        const listItemHeight = document.getElementById(`listItem${menuIndex}`)?.clientHeight;
        if (!itemsCount || !showDropdown) {
            if (keyCode === KeyCode.Tab || keyCode === KeyCode.Escape)
                onInputBlur();
            return null;
        }

        switch (keyCode) {
            case KeyCode.ArrowDown:
                setMenuIndex((menuIndex + 1) % itemsCount);
                const nextListItem = document.getElementById(`listItem${(menuIndex + 1) % itemsCount}`);
                if (nextListItem && listWrapperRef.current) {
                    if (nextListItem && nextListItem.getBoundingClientRect().bottom > listWrapperRef.current.getBoundingClientRect().bottom)
                        listWrapperRef.current.scrollTop += Math.abs(nextListItem.getBoundingClientRect().bottom - listWrapperRef.current.getBoundingClientRect().bottom);
                    if ((menuIndex + 1) % itemsCount === 0)
                        listWrapperRef.current.scrollTop = 0;
                }
                break;
            case KeyCode.ArrowUp:
                setMenuIndex(menuIndex - 1 < 0 ? itemsCount - 1 : menuIndex - 1);
                const prevListItem = document.getElementById(`listItem${menuIndex - 1 < 0 ? itemsCount - 1 : menuIndex - 1}`);
                if (prevListItem && listWrapperRef.current) {
                    if (prevListItem.getBoundingClientRect().top < listWrapperRef.current.getBoundingClientRect().top)
                        listWrapperRef.current.scrollTop -= Math.abs((prevListItem.getBoundingClientRect().top - listWrapperRef.current.getBoundingClientRect().top));
                    if (menuIndex - 1 < 0)
                        listWrapperRef.current.scrollTop = (prevListItem?.offsetTop! + listItemHeight!) - listWrapperRef.current.offsetHeight;
                }

                break;
            case KeyCode.Enter:
                if (menuIndex >= 0) {
                    selectItemByIndex(menuIndex);
                    changeMenuIndex();
                }
                setTimeout(() => {
                    if (props.nextElement && !props.renderItem)
                        document.getElementById(props.nextElement)?.focus();
                }, 200)
                onInputBlur();
                break;
            case KeyCode.NumpadEnter:
                if (menuIndex >= 0) {
                    selectItemByIndex(menuIndex);
                    changeMenuIndex();
                }
                setTimeout(() => {
                    if (props.nextElement && !props.renderItem)
                        document.getElementById(props.nextElement)?.focus();
                }, 200)
                onInputBlur();
                break;
            case KeyCode.Escape:
                onInputBlur();
                break;
            case KeyCode.Tab:
                if (menuIndex >= 0) {
                    selectItemByIndex(menuIndex);
                    changeMenuIndex();
                }
                onInputBlur();
                break;
        }
    }

    const renderedSelectedItems = props.multi ? renderSelectedItems() : '';
    let classNames = `${props.disabled ? " disabled" : ""}${renderList() ? " has-list" : ""}${props.error ? " has-error" : ""}${props.readonly ? " read-only" : ""}${props.icon ? " has-drop-down-icon" : ""}`;
    classNames += `${props.multi ? " is-multi" : ""}${props.displayMode !== DisplayMode.Text ? props.displayMode === DisplayMode.TextAndIcon ? " multi-display" : " icon-display" : ""}${selectedItems.length ? " is-selected-item" : ""}`;
    return (
        <div
            ref={containerRef}
            className={`form-group drop-down ${props.size ?? "default"} ${classNames ? ` ${classNames}` : ""}${inputRef.current?.value ? " has-value" : ""}${focused ? " form-focused" : ""} ${props.className ? props.className : ""}`.trim()}
        >
            {props.label ? <label htmlFor={props.name}>{props.label}{props.required ? <Icon name="icon-required" className="filed-required" size="8px" /> : null}</label> : null}
            <div className={`flex flex-center form-container${props.dir ? ` dir-${props.dir}` : ""}`} onClick={onInputFocus}>
                {props.icon && <Icon className="drop-down-icon icon-input" name={props.icon} />}
                {renderedSelectedItems}
                {props.displayMode !== DisplayMode.Text && props.value ? generateIcon(props.iconSetting, props.value) : ""}
                <input
                    id={props.id}
                    className={`form-control${props.selectOptionsMode ? " select-options-mode" : ""}${generateIcon(props.iconSetting, props.value) ? props.dir === "ltr" ? " no-padding-left" : " no-padding-x" : ""}`}
                    ref={inputRef}
                    name={props.name}
                    placeholder={placeholderValue}
                    disabled={props.disabled}
                    autoComplete={props.autoComplete}
                    onChange={onInputChange}
                    onKeyDown={onKeyDown}
                    onFocus={onInputFocus}
                    readOnly={(width <= small) || props.readonly || props.selectOptionsMode}
                />
                {
                    !props.renderItem ?
                        <svg className={`form-icon${props.dir ? ` arrow-dir-${props.dir}` : ""}`} focusable="false" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M7 10l5 5 5-5z" />
                        </svg> : ""
                }
                <fieldset aria-hidden="true" className={`form-fieldset${focused ? " form-focused" : ""}`}>
                    <legend className="form-fieldset-legend">
                        {props.label ? <label htmlFor={props.name}>{props.label}{props.required ? <Icon name="icon-required" className="filed-required" size="8px" /> : null}</label> : null}
                    </legend>
                </fieldset>
            </div>
            {renderList()}
            <p className="form-error">{(props.error as FieldError)?.message}</p>
        </div>
    );
}

DropDown.defaultProps = {
    autoComplete: "off",
    dir: Culture.getLocale()?.dir,
    itemDisplayFormat: "title",
    valueKey: "id",
    selectableKey: "selectable",
    displayMode: DisplayMode.Text,
    searchable: true,
    removable: true,
    type: "text",
}