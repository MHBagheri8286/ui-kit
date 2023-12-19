import { ICode, ICmsLocation, IMedia } from "./index";

export interface IContactPoint {
    address?: string;
    code?: ICode;
    displayText?: string;
    email?: string;
    icon?: IMedia;
    location?: ICmsLocation;
    mailBox?: string;
    phone?: string;
    visibleInContactUs?: boolean;
}