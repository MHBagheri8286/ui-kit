import { Locale } from "@common/constans";
import { ILocale, DateTime, Culture } from "@ui-kit/core/index";

export class UsDate extends DateTime {
    public locale: ILocale = Culture.getLocale(Locale.en);
    private gregorianDate: Date;

    constructor() {
        super();
        this.gregorianDate = new Date();
    }

    public isLeapYear() {
        const year = this.getFullYear();
        return ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);
    }

    public getDate(): number {
        return this.gregorianDate.getDate();
    }

    public getDay(): number {
        return this.gregorianDate.getDay();
    }

    public getFullYear(): number {
        return this.gregorianDate.getFullYear();
    }

    public getHours(): number {
        return this.gregorianDate.getHours();
    }

    public getMinutes(): number {
        return this.gregorianDate.getMinutes();
    }

    public getMonth(): number {
        return this.gregorianDate.getMonth();
    }

    public getSeconds(): number {
        return this.gregorianDate.getSeconds();
    }

    public getTime(): number {
        return this.gregorianDate.getTime();
    }

    public getTimezoneOffset(): number {
        return this.gregorianDate.getTimezoneOffset();
    }

    public getUTCDate(): number {
        return this.gregorianDate.getUTCDate();
    }

    public getUTCDay(): number {
        return this.gregorianDate.getUTCDay();
    }

    public getUTCFullYear(): number {
        return this.gregorianDate.getUTCFullYear();
    }

    public getUTCHours(): number {
        return this.gregorianDate.getUTCHours();
    }

    public getUTCMilliseconds(): number {
        return this.gregorianDate.getUTCMilliseconds();
    }

    public getUTCMinutes(): number {
        return this.gregorianDate.getUTCMinutes();
    }

    public getUTCMonth(): number {
        return this.gregorianDate.getUTCMonth();
    }

    public getUTCSeconds(): number {
        return this.gregorianDate.getUTCSeconds();
    }

    public setDate(date: number): DateTime {
        this.gregorianDate.setDate(date);
        return this;
    }

    public setFullYear(year: number, month?: number, date?: number): DateTime {
        this.gregorianDate.setFullYear(year, month !== undefined ? month : this.gregorianDate.getMonth(), date || this.gregorianDate.getDate());
        return this;
    }

    public setHours(hour: number, minute?: number, second?: number, ms?: number): DateTime {
        minute = isNaN(minute as number) ? this.gregorianDate.getMinutes() : minute;
        second = isNaN(second as number) ? this.gregorianDate.getSeconds() : second;
        ms = isNaN(ms as number) ? this.gregorianDate.getMilliseconds() : ms;
        this.gregorianDate.setHours(hour, minute, second, ms);
        return this;
    }

    public setMinutes(minute: number, second?: number, ms?: number): DateTime {
        second = isNaN(second as number) ? this.gregorianDate.getSeconds() : second;
        ms = isNaN(ms as number) ? this.gregorianDate.getMilliseconds() : ms;
        this.gregorianDate.setMinutes(minute, second, ms);
        return this;
    }

    public setMonth(month: number, date?: number): DateTime {
        this.gregorianDate.setMonth(month, date || this.gregorianDate.getDate());
        return this;
    }

    public setSeconds(second: number, ms?: number): DateTime {
        ms = isNaN(ms as number) ? this.gregorianDate.getMilliseconds() : ms;
        this.gregorianDate.setSeconds(second, ms);
        return this;
    }

    public setTime(time: number): DateTime {
        this.gregorianDate.setTime(time);
        return this;
    }

    public setUTCHours(hour: number, minute?: number, second?: number, ms?: number): DateTime {
        minute = isNaN(minute as number) ? this.gregorianDate.getUTCMinutes() : minute;
        second = isNaN(second as number) ? this.gregorianDate.getUTCSeconds() : second;
        ms = isNaN(ms as number) ? this.gregorianDate.getUTCMilliseconds() : ms;
        this.gregorianDate.setUTCHours(hour, minute, second, ms);
        return this;
    }

    public setUTCMinutes(minute: number, second?: number, ms?: number): DateTime {
        second = isNaN(second as number) ? this.gregorianDate.getUTCSeconds() : second;
        ms = isNaN(ms as number) ? this.gregorianDate.getUTCMilliseconds() : ms;
        this.gregorianDate.setUTCMinutes(minute, second, ms);
        return this;
    }

    public setUTCSeconds(second: number, ms?: number): DateTime {
        ms = isNaN(ms as number) ? this.gregorianDate.getUTCMilliseconds() : ms;
        this.gregorianDate.setUTCSeconds(second, ms);
        return this;
    }

    public setUTCFullYear(year: number, month?: number, date?: number): DateTime {
        this.gregorianDate.setUTCFullYear(year, month !== undefined ? month : this.gregorianDate.getMonth(), date || this.gregorianDate.getDate());
        return this;
    }

    public valueOf(): number {
        return this.gregorianDate.getTime();
    }

    // 0 <= month <= 11
    protected validateLocale(year: number, month: number, day: number): number {
        const date = new Date(year, month, day);
        const timestamp = date.getTime();
        if (isNaN(timestamp)) { return 0; }
        return timestamp;
    }
}
