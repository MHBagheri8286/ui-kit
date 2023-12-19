import { KeyCode } from '@ui-kit/common';
import { ChangeEventHandler, Divider, IFormControlProps, Icon, TextInput } from '@ui-kit/components/index';
import { FC, KeyboardEvent, useEffect, useState } from 'react';

interface ISearchProps extends IFormControlProps {
    placeHolder?: string;
    onFocus?: ChangeEventHandler;
    onClick?: (term: string) => void;
    onValueChange?: (term: string) => void;
    width?: string;
    height?: string;
    className?: string;
}

export const Search: FC<ISearchProps> = ({ value, autoComplete, placeHolder, className, width, height, onClick, onFocus, onValueChange }) => {
    const [searchText, setSearchText] = useState<string>(value || "");

    useEffect(() => {
        setSearchText(value);
    }, [value])

    const onKeyDown = (e: KeyboardEvent<HTMLInputElement>, value: any) => {
        if (e.key === KeyCode.Enter) {
            onClick && onClick(searchText);
        }
    }

    const onSearchChange = (name: string, value: any) => {
        setSearchText(value);
        onValueChange && onValueChange(value)
    }

    const onCloseBtnClick = () => {
        setSearchText("");
        onClick && onClick("");
        onValueChange && onValueChange("")
    }

    return (
        <div className={`search ${className || ""}`} style={{ width: width || "", height: height || "" }}>
            <div className="input-search">
                <TextInput
                    id="search"
                    type="search"
                    name="input-search"
                    value={searchText}
                    placeholder={placeHolder}
                    autoComplete={autoComplete}
                    onKeyDown={onKeyDown}
                    onChange={onSearchChange}
                    onFocus={(name: string, value: any) => onFocus && onFocus(name, value)}
                    onBlur={() => onClick && onClick(searchText)}
                />
            </div>
            {
                searchText ? <Icon name="icon-close" onClick={onCloseBtnClick} />
                    : ""
            }
            <Divider orientation="vertical" mode="default" />
            <Icon name="icon-search" onClick={() => onClick && onClick(searchText)} />
        </div>
    )
}