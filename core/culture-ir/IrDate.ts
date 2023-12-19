import { Locale } from "@common/constans";
import { ILocale, Culture, DateTime } from "@ui-kit/core/index";

declare function parseInt(s: string | number, radix?: number): number;

export class IrDate extends DateTime {
    public locale: ILocale = Culture.getLocale(Locale.fa);
    private gregorianDate: Date;
    private gregorianDaysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    private persianDaysInMonth: number[] = this.locale.daysInMonth;

    constructor() {
        super();
        this.gregorianDate = new Date();
    }

    public isLeapYear(year?: number) {
        year = year || this.getFullYear();
        const leap = [4, 37, 66, 99, 132, 165, 198, 231, 264, 297, 326
            , 359, 392, 425, 458, 491, 524, 553, 586, 619, 656, 685, 718, 751, 784, 817
            , 850, 883, 916, 949, 978, 1011, 1044, 1077, 1110, 1143, 1176, 1209, 1238
            , 1275, 1308, 1343, 1370, 1401, 1436, 1473, 1502];
        let k = 0;
        for (let i = 0; i <= year; i += 4) {
            if (i > leap[k]) {
                i++;
                k++;
            }
            if (year === i) {
                return true;
            }
        }
        return false;
    }

    public getDate(): number {
        const gd = this.gregorianDate.getDate();
        const gm = this.gregorianDate.getMonth();
        const gy = this.gregorianDate.getFullYear();
        const j = this.toPersian(gy, gm, gd);
        return j[2];
    }

    public getDay(): number {
        let day = this.gregorianDate.getDay();
        day = (day + 1) % 7;
        return day;
    }

    public getFullYear(): number {
        const gd = this.gregorianDate.getDate();
        const gm = this.gregorianDate.getMonth();
        const gy = this.gregorianDate.getFullYear();
        const j = this.toPersian(gy, gm, gd);
        return j[0];
    }

    public getHours(): number {
        return this.gregorianDate.getHours();
    }

    public getMinutes(): number {
        return this.gregorianDate.getMinutes();
    }

    public getMonth(): number {
        const gd = this.gregorianDate.getDate();
        const gm = this.gregorianDate.getMonth();
        const gy = this.gregorianDate.getFullYear();
        const j = this.toPersian(gy, gm, gd);
        return j[1];
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
        const gd = this.gregorianDate.getUTCDate();
        const gm = this.gregorianDate.getUTCMonth();
        const gy = this.gregorianDate.getUTCFullYear();
        const j = this.toPersian(gy, gm, gd);
        return j[2];
    }

    public getUTCDay(): number {
        let day = this.gregorianDate.getUTCDay();
        day = (day + 1) % 7;
        return day;
    }

    public getUTCFullYear(): number {
        const gd = this.gregorianDate.getUTCDate();
        const gm = this.gregorianDate.getUTCMonth();
        const gy = this.gregorianDate.getUTCFullYear();
        const j = this.toPersian(gy, gm, gd);
        return j[0];
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
        const gd = this.gregorianDate.getUTCDate();
        const gm = this.gregorianDate.getUTCMonth();
        const gy = this.gregorianDate.getUTCFullYear();
        const j = this.toPersian(gy, gm, gd);
        return j[1];
    }

    public getUTCSeconds(): number {
        return this.gregorianDate.getUTCSeconds();
    }

    public setDate(d: number): DateTime {
        const gd = this.gregorianDate.getDate();
        const gm = this.gregorianDate.getMonth();
        const gy = this.gregorianDate.getFullYear();
        const j = this.toPersian(gy, gm, gd);
        j[2] = d;
        const g = this.toGregorian(j[0], j[1], j[2]);
        this.gregorianDate.setFullYear(g[0], g[1], g[2])
        return this;
    }

    // 0 <= mount <= 11
    public setFullYear(year: number, month?: number, date?: number): DateTime {
        const gy = this.gregorianDate.getFullYear();
        const gm = this.gregorianDate.getMonth();
        const gd = this.gregorianDate.getDate();
        const persianDate = this.toPersian(gy, gm, gd);
        if (year < 100) {
            year += 1300;
        }
        persianDate[0] = year;
        if (month !== undefined) {
            if (month > 11) {
                persianDate[0] += Math.floor(month / 12);
                month = month % 12;
            }
            persianDate[1] = month;
        }
        if (date !== undefined) {
            persianDate[2] = date;
        }
        const g = this.toGregorian(persianDate[0], persianDate[1], persianDate[2]);
        this.gregorianDate.setFullYear(g[0], g[1], g[2])
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

    // 0 <= mount <= 11
    public setMonth(month: number, date?: number): DateTime {
        const gd = this.gregorianDate.getDate();
        const gm = this.gregorianDate.getMonth();
        const gy = this.gregorianDate.getFullYear();
        const persian = this.toPersian(gy, gm, gd);
        if (month > 11) {
            persian[0] += Math.floor(month / 12);
            month = month % 12;
        } else if (month < 0) {
            month *= -1;
            persian[0] -= Math.ceil(month / 12);
            month = 12 - (month % 12);
        }
        persian[1] = month;
        if (date !== undefined) {
            persian[2] = date;
        }
        const g = this.toGregorian(persian[0], persian[1], persian[2]);
        this.gregorianDate.setFullYear(g[0], g[1], g[2]);
        return this;
    }

    public setSeconds(second: number, ms: number): DateTime {
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
        ms = isNaN(ms as number) ? this.gregorianDate.getMilliseconds() : ms;
        this.gregorianDate.setUTCHours(hour, minute, second, ms);
        return this;
    }

    public setUTCMinutes(minute: number, second?: number, ms?: number): DateTime {
        second = isNaN(second as number) ? this.gregorianDate.getUTCSeconds() : second;
        ms = isNaN(ms as number) ? this.gregorianDate.getMilliseconds() : ms;
        this.gregorianDate.setUTCMinutes(minute, second, ms);
        return this;
    }

    public setUTCSeconds(second: number, ms?: number): DateTime {
        ms = isNaN(ms as number) ? this.gregorianDate.getMilliseconds() : ms;
        this.gregorianDate.setUTCMinutes(second, ms);
        return this;
    }

    // 0 <= mount <= 11
    public setUTCFullYear(year: number, month?: number, date?: number): DateTime {
        const gy = this.gregorianDate.getFullYear();
        const gm = this.gregorianDate.getMonth();
        const gd = this.gregorianDate.getDate();
        const persianDate = this.toPersian(gy, gm, gd);
        if (year < 100) {
            year += 1300;
        }
        persianDate[0] = year;
        if (month !== undefined) {
            if (month > 11) {
                persianDate[0] += Math.floor(month / 12);
                month = month % 12;
            }
            persianDate[1] = month;
        }
        if (date !== undefined) {
            persianDate[2] = date;
        }
        const g = this.toGregorian(persianDate[0], persianDate[1], persianDate[2]);
        this.gregorianDate.setUTCFullYear(g[0], g[1], g[2]);
        return this;
    }

    // 0 <= mount <= 11, 1<= day <= 31
    public toGregorian(year: number, month: number, day: number): number[] {
        const jy: number = year - 979;
        const jm: number = month;
        const jd: number = day - 1;

        let jalaliDayNo = 365 * jy + parseInt(jy / 33, 10) * 8 + parseInt((jy % 33 + 3) / 4, 10);
        for (let i = 0; i < jm; ++i) { jalaliDayNo += this.persianDaysInMonth[i]; }

        jalaliDayNo += jd;

        let gregorianDayNo = jalaliDayNo + 79;

        let gy = 1600 + 400 * parseInt(gregorianDayNo / 146097, 10);
        /* 146097 = 365*400 + 400/4 - 400/100 + 400/400 */
        gregorianDayNo = gregorianDayNo % 146097;

        let leap = true;
        if (gregorianDayNo >= 36525) {
            gregorianDayNo--;
            gy += 100 * parseInt(gregorianDayNo / 36524, 10);
            /* 36524 = 365*100 + 100/4 - 100/100 */
            gregorianDayNo = gregorianDayNo % 36524;

            if (gregorianDayNo >= 365) {
                gregorianDayNo++;
            } else {
                leap = false;
            }
        }

        gy += 4 * parseInt(gregorianDayNo / 1461, 10);
        /* 1461 = 365*4 + 4/4 */
        gregorianDayNo %= 1461;

        if (gregorianDayNo >= 366) {
            leap = false;

            gregorianDayNo--;
            gy += parseInt(gregorianDayNo / 365, 10);
            gregorianDayNo = gregorianDayNo % 365;
        }
        let j = 0;
        for (; gregorianDayNo >= this.gregorianDaysInMonth[j] + (j === 1 && leap ? 1 : 0); j++) {
            gregorianDayNo -= this.gregorianDaysInMonth[j] + (j === 1 && leap ? 1 : 0);
        }
        return [gy, j, gregorianDayNo + 1];
    }

    // 0 <= mount <= 11, 1<= day <= 31
    public toPersian(year: number, month: number, day: number) {
        const gy = year - 1600;
        const gm = month;
        const gd = day - 1;

        let gregorianDayNo = 365 * gy + parseInt((gy + 3) / 4, 10) - parseInt((gy + 99) / 100, 10) + parseInt((gy + 399) / 400, 10);

        for (let i = 0; i < gm; ++i) {
            gregorianDayNo += this.gregorianDaysInMonth[i];
        }
        if (gm > 1 && ((gy % 4 === 0 && gy % 100 !== 0) || (gy % 400 === 0))) {
            /* leap and after Feb */
            ++gregorianDayNo;
        }
        gregorianDayNo += gd;

        let jalaliDayNo = gregorianDayNo - 79;

        const jnp = parseInt(jalaliDayNo / 12053, 10);
        jalaliDayNo %= 12053;

        let jy = 979 + 33 * jnp + 4 * parseInt(jalaliDayNo / 1461, 10);

        jalaliDayNo %= 1461;

        if (jalaliDayNo >= 366) {
            jy += parseInt((jalaliDayNo - 1) / 365, 10);
            jalaliDayNo = (jalaliDayNo - 1) % 365;
        }
        let j = 0;
        for (; j < 11 && jalaliDayNo >= this.persianDaysInMonth[j]; ++j) {
            jalaliDayNo -= this.persianDaysInMonth[j];
        }
        return [jy, j, jalaliDayNo + 1];
    }

    public valueOf(): number {
        return this.gregorianDate.getTime();
    }

    // 0 <= mount <= 11
    protected validateLocale(year: number, month: number, day: number): boolean {
        const result = this.checkDate(year, month, day);
        if (result) {
            this.setFullYear(year, month, day);
            return true;
        }
        return false;
    }

    // 0 <= mount <= 11
    private checkDate(year: number, month: number, day: number): boolean {
        if (year < 0 || year > 32767) {
            return false;
        }
        if (month < 0 || month > 11) {
            return false;
        }
        const dayOffset = this.isLeapYear(year) ? 1 : 0;
        if (day < 1 || day > this.persianDaysInMonth[month] + dayOffset) {
            return false;
        }
        return true;
    }
}
