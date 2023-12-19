import { ICmsCountry, ICode, IContentPicker, ICurrency, IMonths, INumbers, IWeekDays } from "./index";

export interface ICultureSetting {
    abbreviation: string;
    code: ICode;
    country: IContentPicker<ICmsCountry>;
    currency: IContentPicker<ICurrency>;
    amDesignator: string;
    pmDesignator: string;
    dateSeparator: string;
    dateTimeSeparator: string;
    defaultDateFormat: string;
    defaultDateTimeFormat: string;
    direction: "ltr" | "rtl";
    lang: string;
    displayText: string;
    generalSeparator: string;
    leapMonth: number;
    months: IContentPicker<IMonths>;
    weekDays: IContentPicker<IWeekDays>;
    numbers: IContentPicker<INumbers>;
    timeSeparator: string;
}