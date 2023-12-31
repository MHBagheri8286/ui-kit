import { ILocale } from "./Locale";

export abstract class DateTime {
    public locale!: ILocale;
    protected char2param: any = {
        D: "Day",
        H: "Hours",
        M: "Month",
        Y: "FullYear",
        d: "Date",
        a: "Date",
        h: "Hours",
        i: "Minutes",
        j: "Date",
        l: "Day",
        m: "Month",
        n: "Month",
        s: "Seconds"
        // y: 'Year',
    };
    protected leadingZeros = ["d", "m", "H", "h", "i", "s"];

    public abstract isLeapYear(): boolean;

    public format(format: string, utc: boolean = true) {
        let parsed = "";
        for (let i = 0, il = format.length; i < il; ++i) {
            parsed += this.getEqParam(format[i], utc);
        }
        return parsed;
    }

    public abstract getDate(): number;

    public abstract getDay(): number;

    public getDaysInMonth(month: number): number {
        // const year = this.getFullYear();
        // const month = this.getMonth();
        const offset = this.locale.leapMonth === month && this.isLeapYear() ? 1 : 0;
        return this.locale.daysInMonth[month] + offset;
    }

    public abstract getFullYear(): number;

    public abstract getHours(): number;

    public abstract getMinutes(): number;

    public abstract getMonth(): number;

    public abstract getSeconds(): number;

    public abstract getTime(): number;

    public abstract getTimezoneOffset(): number;

    public abstract getUTCDate(): number;

    public abstract getUTCDay(): number;

    public abstract getUTCFullYear(): number;

    public abstract getUTCHours(): number;

    public abstract getUTCMilliseconds(): number;

    public abstract getUTCMinutes(): number;

    public abstract getUTCMonth(): number;

    public abstract getUTCSeconds(): number;

    public abstract setDate(d: number): DateTime;

    public abstract setFullYear(year: number, month?: number, date?: number): DateTime;

    public abstract setHours(hour: number, minute?: number, second?: number, ms?: number): DateTime;

    public abstract setMinutes(minute: number, second?: number, ms?: number): DateTime;

    public abstract setMonth(month: number, date?: number): DateTime;

    public abstract setSeconds(second: number, ms?: number): DateTime;

    public abstract setTime(time: number): DateTime;

    public abstract setUTCHours(hour: number, minute?: number, second?: number, ms?: number): DateTime;

    public abstract setUTCMinutes(minute: number, second?: number, ms?: number): DateTime;

    public abstract setUTCFullYear(year: number, month?: number, date?: number): DateTime;

    public validate(date: string, hasTime?: boolean, utc: boolean = true): boolean {
        if (!date) { return false; }
        const [dateStr, timeStr] = date.split(this.locale.dateTimeSep);
        if (!dateStr) { return false; }
        const dateParts = dateStr.split(this.locale.dateSep);
        if (!dateParts || dateParts.length !== 3) { return false; }
        const year = +dateParts[0];
        // 0 <= month <= 11
        const month = +dateParts[1] - 1;
        const day = +dateParts[2];
        if (!this.validateLocale(year, month, day)) { return false; }
        if (hasTime && !timeStr) { return false; }
        let hour = 0;
        let minute = 0;
        let second = 0;
        if (hasTime) {
            const timeParts = timeStr.split(this.locale.timeSep);
            hour = +timeParts[0];
            minute = +timeParts[1];
            second = timeParts[2] ? +timeParts[2] : 0;
            if (isNaN(hour) || isNaN(minute) || isNaN(second)) { return false; }
            if (!this.validateTime(hour, minute, second)) { return false; }
        }
        // setting valid date-time
        utc ? this.setUTCFullYear(year, month, day) : this.setFullYear(year, month, day);
        if (hasTime) { this.setHours(hour, minute, second); }
        return true;
    }

    public abstract valueOf(): number;

    protected addZero(param: number) {
        return (param < 10 ? "0" : "") + param;
    }

    protected getEqParam(char: string, utc: boolean) {
        let param = char;
        let numeric = -1;
        if (this.char2param[char]) {
            const getter = `${utc ? "getUTC" : "get"}${this.char2param[char]}`;
            param = (this as any)[getter]();
            switch (char) {
                case "D":
                    param = this.locale.weekDays.map(x => x.abbreviation)[+param];
                    break;
                case "l":
                    param = this.locale.weekDays.map(x => x.displayText)[+param];
                    break;
                case "M":
                    param = this.locale.monthNamesShort[+param];
                    break;
                case "h":
                    numeric = +param % 12;
                    break;
                case "m":
                    // show month number [0-11] => [1-12]
                    numeric = +param + 1;
            }
            if (this.leadingZeros.indexOf(char) >= 0) {
                param = this.addZero(numeric > -1 ? numeric : +param);
            }
        }
        return param;
    }

    // 0 <= month <= 11
    protected abstract validateLocale(year: number, month: number, day: number): number | boolean;

    protected validateTime(hour: number, minute: number = 0, second: number = 0): boolean {
        if (0 <= hour && hour < 24) {
            this.setHours(hour, 0, 0);
        } else {
            return false;
        }
        if (0 <= minute && minute < 60) {
            this.setMinutes(minute, 0);
        } else {
            return false;
        }
        if (0 <= second && second < 60) {
            this.setSeconds(second);
        } else {
            return false;
        }
        return true;
    }
}
