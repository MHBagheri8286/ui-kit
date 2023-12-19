import { ICustomization } from "./Customization";

export interface ISizingStyle extends ICustomization {
    heightMode?: "Full" | "Auto" | "Pixel" | "Percent";
    customHight?: number;
    widthMode?: "Full" | "Container";
}