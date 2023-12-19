
import { ViewPort } from "@ui-kit/common";
import { getWidth } from "@ui-kit/utilize";
import { CustomizationType, IContentPicker, ICustomization, ILayoutStyle, ScreenSize } from '@ui-kit/widgets/models';

export function getCurrentScreenSize() {
    const width: number = getWidth();
    const { small, medium, large } = ViewPort;
    let currentScreenSize: ScreenSize =
        width > large ? "xlarge" :
            width > medium && width <= large ? "large" :
                width > small && width <= medium ? "medium" : "small";
    return currentScreenSize
}


export function getCustomization<T>(customization?: IContentPicker<ICustomization>, contentType?: CustomizationType): T {
    const result = customization?.contentItems.find(x => x.screenSize?.screen?.includes(getCurrentScreenSize()) && x.contentType === contentType) as T;
    return result;
}

export function getCompatibleLayout(layouts?: IContentPicker<ILayoutStyle>): ILayoutStyle {
    const width: number = getWidth();
    const { small, medium, large } = ViewPort;
    let currentScreenSize: ScreenSize =
        width > large ? "xlarge" :
            width > medium && width <= large ? "large" :
                width > small && width <= medium ? "medium" : "small";
    return layouts?.contentItems.find(x => x.screenSize?.screen?.includes(currentScreenSize))
        || { wrap: true, columnCount: 1, itemLayouts: { contentItems: [{ colSpan: 1, rowSpan: 1 }] } };
}

export const renderSourceBaseOfDevice = (paths: string[]): string => {
    const width = getWidth();
    const { small, medium } = ViewPort;
    if (paths.length)
        return width > medium ? paths[0]
            : width > small ? paths[Math.floor(paths.length / 2)]
                : paths[paths.length - 1];
    return "";
}


export const getFilePath = (contentMedia: string, key: string, query: boolean = false) => {
    const path = encodeURI(key || "");
    const orchardSupportedSizes = [16, 32, 50, 100, 160, 240, 480, 600, 1024, 1200, 2048];
    const requestSize = orchardSupportedSizes.find(x => getWidth() <= x);
    if (path)
        return query ? `${contentMedia}/${path}?width=${requestSize}` : `${contentMedia}/${path}`;
    return "";
}