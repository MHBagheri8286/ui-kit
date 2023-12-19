import { ICustomization } from "./Customization";

export interface IAlignmentStyle extends ICustomization {
    verticalAlignment?: "start" | "center" | "end";
    horizontalAlignment?: "start" | "center" | "end";
}