import { ICode } from "./Code";

export interface ICurrency {
    code?: ICode;
    ratio?: number;
    displayText?: string;
    abbreviation?: string;
}