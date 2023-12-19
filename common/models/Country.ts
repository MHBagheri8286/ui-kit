import { ICmsCountry, IMedia, INews } from "@ui-kit/widgets/models";


export interface ICountry {
    guid?: string;
    code?: string;
    cover?: IMedia;
    name?: string;
    demonym?: string;
    demonymCode?: number;
    localizedName?: string;
    localizedDemonym?: string;
    callingCode?: string;
    currencyCode?: string;
    flagPosition?: number;
    travelConditions?: INews[];
}

export const mapCmsCountryToCountry = (c: ICmsCountry, localizedCountry?: ICmsCountry[]): ICountry => {
    const country: ICountry = {
        code: c.code?.code,
        callingCode: c.callingCode?.toString(),
        demonym: c.demonym,
        demonymCode: c.demonymCode,
        flagPosition: c.flagPosition,
        guid: c.guid,
        name: c.name,
        cover: c.cover,
        travelConditions: c.travelConditions?.contentItems
    }
    localizedCountry?.forEach((lc) => {
        if (lc.code?.code === c.code?.code) {
            country.localizedName = lc.name;
            country.localizedDemonym = lc.demonym;
        }
    })
    return country;
}