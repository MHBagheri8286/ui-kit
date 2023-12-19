import { IContentPicker, ISlideshowItem, IWidget } from "./index";

export interface ISlideshowWidget extends IWidget {
    autoDisplay?: boolean;
    progressBar?: "InsideTab" | "OutsideTab" | "Stack" | "Point";
    slides?: IContentPicker<ISlideshowItem>;
    animation?: "SlideAndZoomOut" | "Slide" | "Fade";
    backgroundMode?: "Full" | "Circle" | "Square";
}