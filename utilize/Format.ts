import { DateInMilliSec, Locale } from "@common/constans";
import Translate from "@service/Translate";
import { Culture } from "@ui-kit/core";

interface IDateTimeFormatOptions {
    format?: string;
    locale?: string;
    utc?: boolean;
}

export const formatToDateTime = (value: number, options?: IDateTimeFormatOptions): string | undefined => {
    if (value && !isNaN(value)) {
        const dateTime = Culture.getDateTimeInstance(options?.locale);
        const dateTimeForamt = options?.format ? options.format : dateTime.locale.defaultDateTimeFormat;
        dateTime.setTime(value);
        return dateTime.format(dateTimeForamt, options?.utc);
    }
    return undefined;
}

export const getBeautyTime = (date: number, compareDate: number, format: string) => {
    const dateTime = Culture.getDateTimeInstance();
    dateTime.setTime(compareDate)
    return dateTime.format(format);
}

export const formatToDate = (value: number, options: IDateTimeFormatOptions = { utc: true }): string | undefined => {
    if (value && !isNaN(value)) {
        const date = Culture.getDateTimeInstance(options?.locale);
        const dateForamt = options?.format ? options.format : date.locale.defaultDateFormat;
        date.setTime(value);
        return date.format(dateForamt, options?.utc);
    }
    return undefined;
}

export const formatToMonthYear = (lang: string): string => {
    const IrLocale = Culture.getLocale(Locale.fa);
    if (lang === IrLocale?.lang)
        return "a M Y";
    else
        return "M a, Y";
}

export const formatToDayMonth = (lang: string): string => {
    const IrLocale = Culture.getLocale(Locale.fa);
    if (lang === IrLocale?.lang)
        return "l a M";
    else
        return "M a, Y";
}

export const setToDawn = (timeStamp: number, loacle: boolean = false): number => {
    const dateTime = Culture.getDateTimeInstance();
    dateTime.setTime(timeStamp);
    loacle ? dateTime.setHours(0, 0, 0, 0) : dateTime.setUTCHours(0, 0, 0, 0);
    return dateTime.getTime();
}

export function setToLocaleDawn(timeStamp: number | undefined): number | undefined {
    if (timeStamp) {
        const dateTime = Culture.getDateTimeInstance();
        dateTime.setTime(timeStamp);
        dateTime.setHours(0, 0, 0, 0);
        const timezoneOffset = dateTime.getTimezoneOffset();
        dateTime.setTime(dateTime.getTime() - (timezoneOffset * 60 * 1000));
        return dateTime.getTime();
    }
    return undefined;
}

export const setToEvenFall = (timeStamp: number, loacle: boolean = false): number => {
    const dateTime = Culture.getDateTimeInstance();
    dateTime.setTime(timeStamp);
    loacle ? dateTime.setHours(23, 59, 59, 0) : dateTime.setUTCHours(23, 59, 59, 0);
    return dateTime.getTime();
}

export const minToMinHour = (value: number) => {
    const { tr } = Translate;
    const IrLocale = Culture.getLocale(Locale.fa);
    const lang = Culture.getLocale()?.lang;
    const hour = Math.floor(value / 60);
    const minute = value % 60;
    if (lang === IrLocale?.lang)
        return (hour ? `${hour} ${tr("hour")} ` : '') + (minute ? `${minute} ${tr("min_abbreviation")}` : '');
    else
        return (hour ? `${hour}${tr("hour")} ` : '') + (minute ? `${minute}${tr("min_abbreviation")}` : '');
}

export const miliSecondToMinHour = (value: number) => {
    const { tr } = Translate;
    const IrLocale = Culture.getLocale(Locale.fa);
    const lang = Culture.getLocale()?.lang;
    const hour = Math.floor(value / DateInMilliSec.hourPerMilliSeconds);
    const hourDiff = value % DateInMilliSec.hourPerMilliSeconds
    const minute = Math.floor(hourDiff / DateInMilliSec.minutePerMilliSeconds);
    if (lang === IrLocale?.lang)
        return (hour ? `${hour} ${hour === 1 ? tr("hour").toLowerCase() : tr("hours")} ` : '') + (minute ? `${minute} ${minute === 1 ? tr("minute") : tr("min_abbreviation")}` : '');
    else
        return (hour ? `${hour} ${hour === 1 ? tr("hour").toLowerCase() : tr("hours")} ` : '') + (minute ? `${minute} ${minute === 1 ? tr("minute") : tr("min_abbreviation")}` : '');
}

export const miliSecondToDays = (value: number, justHours?: boolean) => {
    const { tr } = Translate;
    const IrLocale = Culture.getLocale(Locale.fa);
    const lang = Culture.getLocale()?.lang;
    const days = Math.floor(value / DateInMilliSec.dayPerMilliSeconds);
    const daysDiff = value % DateInMilliSec.dayPerMilliSeconds
    const hours = Math.floor(daysDiff / DateInMilliSec.hourPerMilliSeconds);
    if (lang === IrLocale?.lang)
        return (days ? `${days} ${hours === 1 ? tr("day").toLowerCase() : tr("days")} ` : '') + (!justHours && hours ? `${hours} ${hours === 1 ? tr("hour").toLowerCase() : tr("hours")} ` : '');
    else
        return (days ? `${days} ${hours === 1 ? tr("day").toLowerCase() : tr("days")} ` : '') + (!justHours && hours ? `${hours} ${hours === 1 ? tr("hour").toLowerCase() : tr("hours")} ` : '');
}

export function toPascalCase(str: string) {
    return str?.replace(/\w\S*/g, (txt: string) => {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

export const formatToBase64 = (file: File) => new Promise<string | ArrayBuffer | null>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});

export function setKeyPascalCaseToDiffCase(model: "kebabCase" | "snakeCase", str: string): string {
    let kebabCase = str?.replace(/([A-Z])/g, " $1").toLowerCase().split(" ").join("_");
    if (kebabCase[0] === "_")
        kebabCase = kebabCase?.replace(kebabCase[0], "")
    switch (model) {
        case "kebabCase":
            return kebabCase?.replace('_', '-')
        case "snakeCase":
            return kebabCase
    }
}

export function hexToRgb(hex: string) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

export function rgbToHex(r: number, g: number, b: number) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);

    function componentToHex(c: number) {
        var hex = c.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
    }
}

export function DigitsToEN(str: string) {
    const persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g];
    const arabicNumbers = [/٠/g, /١/g, /٢/g, /٣/g, /٤/g, /٥/g, /٦/g, /٧/g, /٨/g, /٩/g];
    for (let i = 0; i < 10; i++) {
        str = str.replace(persianNumbers[i], i.toString()).replace(arabicNumbers[i], i.toString());
    }
    return str;
}

export const camelize = (str: string): string => {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
        return index === 0 ? word.toLowerCase() : word.toUpperCase();
    }).replace(/\s+/g, '');
}

export const convertToPlain = (html?: string) => {
    // Create a new div element
    var tempDivElement = document.createElement("div");

    // Set the HTML content with the given value
    tempDivElement.innerHTML = html!;
    const result = tempDivElement?.textContent || tempDivElement?.innerText || "";
    tempDivElement.remove();
    // Retrieve the text property of the element 
    return result;
}

export const setKeyCamelCaseToDiffCase = (str: string, model: "kebabCase" | "snakeCase"): string => {
    const kebabCase = str?.replace(/([A-Z])/g, " $1").toLowerCase().split(" ").join("_");
    switch (model) {
        case "kebabCase":
            return kebabCase?.replace('_', '-')
        case "snakeCase":
            return kebabCase
    }
}

export function capitalizeFirstLetter(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}
