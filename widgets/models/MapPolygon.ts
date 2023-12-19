import { IContentType } from "./ContentType";

export interface IMapPolygen extends IContentType {
    stroke?: string;
    strokeWidth?: number;
    strokeOpacity?: number;
    fill?: string;
    fillOpacity?: number;
    points?: string;
    invert?: boolean;
}