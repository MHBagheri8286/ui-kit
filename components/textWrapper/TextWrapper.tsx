import { Locale } from "@ui-kit/common";
import { FC, useEffect, useState } from "react";

interface ITextWrapper {
    text: string;
    locale?: string;
    className?: string;
    oppositeDirection?: boolean;
}

export const TextWrapper: FC<ITextWrapper> = ({ text, locale, className, oppositeDirection }) => {
    const [persianLanguage, setPersianLanguage] = useState<boolean>(false);

    useEffect(() => {
        if (text)
            setPersianLanguage(Array.from(text).find(str => str.charCodeAt(0) > 1569) ? true : false);
        if (locale)
            setPersianLanguage(locale === Locale.fa ? true : false)
    }, [text, locale]);

    return (
        <span className={`${persianLanguage ? `fa ${oppositeDirection ? 'ltr' : 'rtl'}` : `en ${oppositeDirection ? 'rtl' : 'ltr'}`} ${className}`}>{text}</span>
    )
}