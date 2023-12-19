import { IContentPicker, IContentType } from './index'

export interface IGeneralContainer extends IContentType {
    content?: IContentPicker<IContentType>
}