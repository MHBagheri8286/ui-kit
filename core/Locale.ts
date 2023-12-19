import { ICultureSetting } from "@ui-kit/widgets/models";
import { ICurrency } from "@ui-kit/widgets/models/Currency";

interface IMonths {
    abbreviation: string;
    displayText: string;
    season: string;
    totalDays: number;
}

interface IWeekDays {
    abbreviation: string;
    day: string;
    displayText: string;
    sort: number;
}

interface INumbers {
    number?: number;
    displayText?: string;
    ordinal?: string;
}

export interface ILocale {
    abbreviation: string;
    designator: string[];
    code: string;
    country: string;
    countryCode: string;
    currency: ICurrency;
    dateSep: string;
    dateTimeSep: string;
    daysInMonth: number[];
    defaultDateFormat: string;
    defaultDateTimeFormat: string;
    dir: "rtl" | "ltr";
    lang: string;
    leapMonth: number;
    months: IMonths[];
    monthNamesShort: string[];
    numbers: INumbers[];
    phoneCode: string;
    sep: string;
    timeSep: string;
    title: string;
    weekDays: IWeekDays[];
}

export const mapCmsLocateToLocale = (cs: ICultureSetting): ILocale => {
    const locale: ILocale = {
        abbreviation: cs.abbreviation,
        designator: [cs.amDesignator, cs.pmDesignator],
        code: cs.code.code,
        country: cs.country.contentItems[0].name || "",
        countryCode: cs.country.contentItems[0].code?.code || "",
        currency: cs.currency.contentItems[0],
        dateSep: cs.dateSeparator,
        dateTimeSep: cs.dateTimeSeparator || " ",
        daysInMonth: cs.months.contentItems.map(x => x.totalDays),
        defaultDateFormat: cs.defaultDateFormat,
        defaultDateTimeFormat: cs.defaultDateTimeFormat,
        dir: cs.direction,
        lang: cs.lang,
        leapMonth: cs.leapMonth,
        months: cs.months.contentItems,
        monthNamesShort: cs.months.contentItems.map(x => x.abbreviation),
        phoneCode: cs.country.contentItems[0].callingCode || "",
        sep: cs.generalSeparator,
        timeSep: cs.timeSeparator,
        weekDays: cs.weekDays.contentItems,
        numbers: cs.numbers.contentItems,
        title: cs.displayText
    }

    return locale;
}
