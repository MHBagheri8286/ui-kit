import { ICustomization, ILink } from "./index";

export interface IHeaderSetting extends ICustomization {
    subtitle?: string;
    description?: string;
    darkMode?: boolean;
    alignment?: "Start" | "Center";
    navigation?: ILink;
    hidden?: boolean;
}