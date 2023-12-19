import { IContentType } from "./ContentType";

export interface ICustomization extends IContentType {
    screenSize?: IScreenSize;
}

export type CustomizationType = "HeaderSettings" | "BackgroundColorStyle" | "BackgroundImageStyle" | "MarginStyle" | "PaddingStyle" | "SizingStyle";

export type ScreenSize = "small" | "medium" | "large" | "xlarge";

export interface IScreenSize{
    screen?: ScreenSize[];
}