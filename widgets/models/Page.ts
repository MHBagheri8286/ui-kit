
import { IFAQ } from "@common/models/CMS/FAQ";
import { ITermsConditions } from "@common/models/CMS/TermsConditions";
import { ICode, IContentPicker, IContentType, IHtmlBody, IMedia, IPageSettings, ISlideshowItem } from "./index";

export enum WidgetType { ParagraphWidget, ImageGalleryWidget, VideoWidget, FileWidget, MapWidget, ItineraryWidget, SlideshowWidget, CardWidget, ComponentWidget, BannerWidget }

export interface IPage extends IContentType {
    title?: string;
    code?: ICode;
    description?: string;
    cover?: IMedia;
    settings?: IContentPicker<IPageSettings>;
    covers?: IContentPicker<ISlideshowItem>;
    htmlBody?: IHtmlBody;
    content?: IContentPicker<IContentType>;
    relatedPages?: IContentPicker<IPage>;
    fAQs?: IContentPicker<IFAQ>;
    termsConditions?: IContentPicker<ITermsConditions>;
}
