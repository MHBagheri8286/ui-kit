import { ReactNode } from "react";
import { Culture, Dictionary } from "@ui-kit/core/index";

export const Translate = function () { }

Translate.tr = (key: string, ...placeholders: any[]): string => {
    const dictionary: Dictionary = Culture.getDictionary();
    if (!key) { return ""; }
    let tr = dictionary.lookup(key);
    if (!tr) { return key; }
    if (!placeholders.length) { return tr; }
    for (let i = 0, il = placeholders.length; i < il; ++i) {
        const term = dictionary.lookup(placeholders[i]) || placeholders[i];
        tr = tr.replace("%", term);
    }
    return tr;
}

Translate.re = (key: string, ...placeholders: any[]): ReactNode => {
    let re: ReactNode;
    const dictionary: Dictionary = Culture.getDictionary();
    if (!key) return {};
    let tr = dictionary.lookup(key);
    if (!tr) return <>{key}</>;
    const splitKey = tr.split("%");
    for (let i = 0, il = splitKey.length; i < il; ++i) {
        re = <>{re}{splitKey[i]}</>;
        if (placeholders[i])
            re = <>{re}{placeholders[i]}</>;
    }
    return re;
}
