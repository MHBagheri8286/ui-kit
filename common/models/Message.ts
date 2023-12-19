export enum MessageType { Information, Warning, Error, Success }

export interface IMessage {
    type: MessageType;
    code: string;
    text?: string;
}
