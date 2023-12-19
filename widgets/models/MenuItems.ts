import { ICode, ILinkMenuItem } from "./index";

export interface IMenuItem {
    code?: ICode;
    contentItemId?: string;
    displayText?: string;
    description?: string;
    externalLink?: boolean;
    hiddenLink?: boolean;
    linkMenuItem?: ILinkMenuItem;
    menuItemsList?: IMenuItemsList;
}

export interface IMenuItemsList {
    menuItems: IMenuItem[];
}