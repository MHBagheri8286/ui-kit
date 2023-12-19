import { ICustomization } from "./Customization";

export interface IPaddingStyle extends ICustomization{
    top?: string;
    bottom?: string;
    start?: string;
    end?: string;
}