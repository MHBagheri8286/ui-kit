import { IContentPicker } from "./ContentPicker";
import { IItineraryActivity } from "./ItineraryActivity";
import { IWidget } from "./Widget";

export interface IItineraryWidget extends IWidget {
    startDate?: string;
    activities?: IContentPicker<IItineraryActivity>;
}