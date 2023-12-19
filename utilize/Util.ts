import { IViewport } from "@config/appConfig";
import Config from "@service/Config";
import { IOptionsResizer } from "@ui-kit/components/fileInput/FileInput";
import { IFieldValidationMessage, IModelValidationMessage, IValidationError } from "@ui-kit/core/index";
import Resizer from "react-image-file-resizer";

export function getWidth() {
    let width = 0;
    if (typeof (window.innerWidth) === 'number') {
        width = window.innerWidth;

    } else {
        if (document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight)) {
            width = document.documentElement.clientWidth;

        } else {
            if (document.body && (document.body.clientWidth || document.body.clientHeight)) {
                width = document.body.clientWidth;
            }
        }
    }
    return width;
}

export function generateText(record: any, expr: string) {
    if (!record)
        return;
    let params = expr.match(/{.+?}/g);
    if (!params)
        return record[expr];
    else {
        let result = expr;
        params.forEach(param => {
            const propertyName = param.substring(1, param.length - 1);
            const searchValue = new RegExp(param, "g");
            result = result.replace(searchValue, record[propertyName]);
        });
        return result;
    }
}

export function isSafariBrowser() {
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.indexOf('safari') !== -1)
        if (userAgent.indexOf('chrome') > -1)
            // User Agent: Chrome
            return false
        else
            // User Agent: Safari
            return true
}

export const isAndroidPlatform = () => navigator.userAgent.includes('Android');

// check type of device
export const isMobile = (): boolean => {
    return /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
        || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\\-(n|u)|c55\/|capi|ccwa|cdm\\-|cell|chtm|cldc|cmd\\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\\-s|devi|dica|dmob|do(c|p)o|ds(12|\\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\\-|_)|g1 u|g560|gene|gf\\-5|g\\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\\-(m|p|t)|hei\\-|hi(pt|ta)|hp( i|ip)|hs\\-c|ht(c(\\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\\-(20|go|ma)|i230|iac( |\\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\\-[a-w])|libw|lynx|m1\\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\\-2|po(ck|rt|se)|prox|psio|pt\\-g|qa\\-a|qc(07|12|21|32|60|\\-[2-7]|i\\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\\-|oo|p\\-)|sdk\/|se(c(\\-|0|1)|47|mc|nd|ri)|sgh\\-|shar|sie(\\-|m)|sk\\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\\-|v\\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\\-|tdg\\-|tel(i|m)|tim\\-|t\\-mo|to(pl|sh)|ts(70|m\\-|m3|m5)|tx\\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\\-|your|zeto|zte\\-/i.test(navigator.userAgent.substring(0, 4));
}

export function distinctValue<T>(value: T, index: number, self: T[]) {
    return self.indexOf(value) === index;
}

export function getReadableFileSizeString(fileSizeInBytes: number = 0): string {
    let i = -1;
    let byteUnits = [' kB', ' MB', ' GB', ' TB', ' PB', ' EB', ' ZB', ' YB'];
    do {
        fileSizeInBytes = fileSizeInBytes / 1024;
        i++;
    } while (fileSizeInBytes > 1024);

    return Math.max(fileSizeInBytes, 0.1).toFixed(0) + byteUnits[i];
}

export function nameof<TObject>(key: keyof TObject): string;
export function nameof<TObject>(obj: TObject, key: keyof TObject): string;
export function nameof(key1: any, key2?: any): any {
    return key2 ?? key1;
}

export function validationMessage(messages: IModelValidationMessage, validationErrors: IValidationError): IFieldValidationMessage {
    const appliedMessages: any = {};
    for (let fieldNames = Object.keys(validationErrors), i = 0, il = fieldNames.length; i < il; ++i) {
        const fieldName = fieldNames[i];
        const failedRule = validationErrors[fieldName];
        appliedMessages[fieldName] = fieldName in messages ? messages[fieldName][failedRule] : null;
    }
    return appliedMessages;
}

export function onUnload(e: any) {
    e.preventDefault();
    e.returnValue = '';
}

export function resizeFile(file: File | Blob, options: IOptionsResizer): Promise<File | string> {
    return new Promise((resolve) => {
        Resizer.imageFileResizer(
            file,
            options.width,
            options.height,
            options.format,
            options.quality,
            options.rotation,
            (file) => {
                resolve(file as File | string);
            },
            options.outputFormat
        );
    });
}

export function scrollParentToChild(parent: HTMLElement, child: HTMLElement) {
    // Where is the parent on page
    const parentRect = parent.getBoundingClientRect();
    // What can you see?
    const parentViewableArea = {
        height: parent.clientHeight,
        width: parent.clientWidth
    };

    // Where is the child
    const childRect = child.getBoundingClientRect();
    // Is the child viewable?
    const isViewable = (childRect.top >= parentRect.top) && (childRect.bottom <= parentRect.top + parentViewableArea.height);

    // if you can't see the child try to scroll parent
    if (!isViewable) {
        // Should we scroll using top or bottom? Find the smaller ABS adjustment
        const scrollTop = childRect.top - parentRect.top;
        const scrollBot = childRect.bottom - parentRect.bottom;
        if (Math.abs(scrollTop) < Math.abs(scrollBot)) {
            // we're near the top of the list
            parent.scrollTop += (scrollTop - (parentViewableArea.height / 2));
        } else {
            // we're near the bottom of the list
            parent.scrollTop += (scrollBot + (parentViewableArea.height / 2));
        }
    }

}

export function searchInAllProperties(record: any, term: string) {
    for (const property in record)
        if (record[property] && typeof record[property] !== "object" && String(record[property]).toLowerCase().indexOf(term?.toLowerCase()) !== -1)
            return true;
    return false;
}

export const convertingNodesToArray = <TNode extends Node>(nodes: HTMLCollection | NodeListOf<TNode>): (Element | TNode)[] => {
    const result: (Element | TNode)[] = []
    for (let indexElement = 0; indexElement < nodes.length; indexElement++) {
        result.push(nodes[indexElement] as Element | TNode)
    }
    return result
}

export const walkingOnElementChildren = (regionElement: ChildNode): ChildNode[] => {
    const elements: ChildNode[] = [];
    let targetElements = convertingNodesToArray(regionElement?.childNodes);
    let continuing = convertingNodesToArray(regionElement?.childNodes).length ? true : false;
    while (continuing) {
        const newTarget: ChildNode[] = []
        continuing = targetElements.some(element => convertingNodesToArray(element?.childNodes).length);
        targetElements?.forEach(element => {
            elements.push(element);
            convertingNodesToArray(element?.childNodes)?.forEach(element => newTarget.push(element));
        });
        targetElements = newTarget;
    }
    return elements;
}

export const setModeOfEnum = (str: string, data: any): number => {
    const result = Object.values(data)?.find(x => data[Number(x)] === str);
    return result as number
}

export const renderSourceBaseOfDevice = (paths: string[]): string => {
    const width = getWidth();
    const { small, medium } = Config.get<IViewport>("viewport");
    if (paths.length)
        return width > medium ? paths[0]
            : width > small ? paths[Math.floor(paths.length / 2)]
                : paths[paths.length - 1];
    return "";
}

export const htmlSanitizer = (str: string): string => {
    return Config.getConfig().env === "Production" || Config.getConfig().env === "Staging" ? str.replace("content-preview", "content") : str
}

export async function translate(key: string) {
    key = encodeURI(key);
    const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&hl=fa-IR&q=${key}&dj=1&dt=t`);
    const data = await response.json();
    return data;
}

export function getPrint(title?: string) {
    if (title)
        document.title = title;
    // Print for Safari browser
    if (isSafariBrowser())
        document.execCommand('print', false, undefined);
    else
        window.print();
}