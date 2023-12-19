import { IContentPicker, ILayoutStyle, IMedia, IWidget } from "./index";

export enum ImgRatio { Bigger = 1, Equal }

export enum ImageTextMode { None, Always, ImageHover, IconHover };

export enum ImageStyle { Curved, NoGap, RectAngle };

export interface IImageGalleryWidget extends IWidget {
    images?: IMedia;
    style?: string;
    textMode?: string;
    layouts?: IContentPicker<ILayoutStyle>;
}