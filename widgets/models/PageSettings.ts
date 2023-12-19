import { IContentType } from "./ContentType";

export interface IPageSettings extends IContentType {
    menuStyle?: "Solid" | "Transparent" | "Blur";
    menuColor?: "Default" | "White";
    coverMode?: "Header" | "Full" | "None";
    footerMode?: "Full" | "Minimal" | "None";
}