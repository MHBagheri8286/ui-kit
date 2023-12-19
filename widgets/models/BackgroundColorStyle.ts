import { ICustomization } from "./Customization";

export interface IBackgroundColorStyle extends ICustomization {
    color?: string;
    opacity?: number;
}