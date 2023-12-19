import { DateTime } from "./DateTime";
import { Dictionary, IVocabs } from "./Dictionary";
import { ILocale } from "./Locale";

export type IDateTime = new () => DateTime;

interface ICultureItem {
    dateTime: IDateTime;
    dictionary: Dictionary;
    locale: ILocale;
}

interface ICultureCollection {
    [localeName: string]: ICultureItem;
}

export interface ICulture {
    getCode: () => string;
    getDateTime: (code?: string) => IDateTime;
    getDateTimeInstance: (code?: string) => DateTime;
    getDictionary: (code?: string) => Dictionary;
    getLocale: (code?: string) => ILocale;
    getLocaleWithLang: (lang?: string) => ILocale;
    register: (locale: ILocale, vocabs: IVocabs, dateTime: IDateTime) => void;
    setDefault: (locale: string) => void;
    getCultures: () => ICultureCollection;
}

export class Culture {

    public static getCode(): string {
        return Culture.defaultCode;
    }

    public static getDateTime(code?: string): IDateTime {
        const culture = Culture.cultures[code || Culture.defaultCode];
        return culture ? culture.dateTime : Culture.cultures[Culture.defaultCode].dateTime;
    }

    public static getDateTimeInstance(code?: string): DateTime {
        const dateTime = Culture.getDateTime(code);
        return new dateTime();
    }

    public static getDateInstance(code?: string, utc: boolean = true): DateTime {
        const dateTime = Culture.getDateTime(code);
        const dateTimeInstance = new dateTime();
        if (utc) {
            dateTimeInstance.setHours(0, 0, 0, 0);
            dateTimeInstance.setTime(dateTimeInstance.getTime() + (dateTimeInstance.getTimezoneOffset() * 60 * 1000 * -1))
        } else {
            dateTimeInstance.setHours(0, 0, 0, 0);
        }
        return dateTimeInstance;
    }

    public static getDictionary(code?: string): Dictionary {
        const culture = Culture.cultures[code || Culture.defaultCode];
        return culture ? culture.dictionary : Culture.cultures[Culture.defaultCode].dictionary;
    }

    public static getLocale(code?: string): ILocale {
        const culture = Culture.cultures[code || Culture.defaultCode];
        return culture ? culture?.locale : Culture.cultures[Culture.defaultCode]?.locale;
    }

    public static getLocaleWithLang(lang?: string): ILocale {
        let culture = Culture.cultures[Culture.defaultCode];
        for (const key in Culture.cultures) {
            if (Object.prototype.hasOwnProperty.call(Culture.cultures, key)) {
                const element = Culture.cultures[key];
                if (element.locale.lang === lang)
                    culture = Culture.cultures[key];
            }
        }
        return culture.locale;
    }

    public static getCultures(): ICultureCollection {
        return Culture.cultures;
    }

    public static findLang(path: string): string {
        let lang = "";
        for (const key in Culture.cultures) {
            if (Object.prototype.hasOwnProperty.call(Culture.cultures, key)) {
                const element = Culture.cultures[key];
                if (element.locale.lang === path.replace("/", "").split("/")[0])
                    lang = Culture.cultures[key].locale.lang;
            }
        }
        return lang;
    }

    public static register(locale: ILocale, dateTime: IDateTime) {
        const code = locale.code;
        if (!Culture.defaultCode) {
            Culture.setDefault(code);
        }
        Culture.cultures[code] = {
            locale,
            dateTime,
            dictionary: new Dictionary()
        };
    }

    public static setVocabs(code: string, vocabs: IVocabs) {
        const dictionary = new Dictionary();
        dictionary.inject(vocabs);
        Culture.cultures[code].dictionary = dictionary;
    }

    public static setDefault(code: string) {
        Culture.defaultCode = code;
    }

    private static cultures: ICultureCollection = {};
    private static defaultCode: string;
}
