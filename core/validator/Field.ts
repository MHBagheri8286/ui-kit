import { IModel, IModelValues } from "./Model";

export enum FieldType { String = 1, Text, Password, Tel, EMail, URL, Number, Integer, Float, File, Timestamp, Boolean, Object, Enum, Relation, List, NationalCode, FlightNumber, SeatNumber }

export interface IFieldProperties {
    type?: FieldType;
    list?: FieldType;
    // inline list won't create new table to hold list of data
    inline?: boolean;
    required?: boolean;
    pattern?: RegExp;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    // assert?: IAssertCallback;
    enum?: Array<any>;
    input?: string;
    isOneOf ?: IModelValues;
    default?: any;
    unique?: boolean;
    primary?: boolean;
    maxSize?: number;
    fileType?: Array<string>;
    multilingual?: boolean;
    [key: string]: any;
}

export class Field {
    private _fieldName: string;
    private _properties: IFieldProperties = {} as IFieldProperties;

    constructor(fieldName: string) {
        this._fieldName = fieldName;
        this._properties.enum = [];
        this._properties.fileType = [];
    }

    get fieldName(): string {
        return this._fieldName;
    }

    get properties(): IFieldProperties {
        return this._properties;
    }

    public required(): Field {
        this._properties.required = true;
        return this;
    }

    public type(type: FieldType): Field {
        this._properties.type = type;
        return this;
    }

    public listOf(type: FieldType): Field {
        this._properties.list = type;
        return this;
    }

    public pattern(pattern: RegExp): Field {
        this._properties.pattern = pattern;
        return this;
    }

    public minLength(minLength: number): Field {
        this._properties.minLength = +minLength;
        return this;
    }

    public maxLength(maxLength: number): Field {
        this._properties.maxLength = +maxLength;
        return this;
    }

    public min(min: number): Field {
        this._properties.min = +min;
        return this;
    }

    public max(max: number): Field {
        this._properties.max = +max;
        return this;
    }

    public enum(...values: any[]): Field {
        this._properties.enum = values;
        return this;
    }

    public default(value: any): Field {
        this._properties.default = value;
        return this;
    }

    public unique(): Field {
        this._properties.unique = true;
        return this;
    }

    public primary(): Field {
        this._properties.primary = true;
        return this;
    }

    public maxSize(sizeInKB: number): Field {
        this._properties.maxSize = sizeInKB;
        return this;
    }

    public fileType(...fileTypes: string[]): Field {
        this._properties.fileType = fileTypes;
        return this;
    }

    public multilingual(): Field {
        this._properties.multilingual = true;
        return this;
    }

    /**
     *  whether or not this is an inline list or another table must be created for it
     */
    public inline(): Field {
        this._properties.inline = true;
        return this;
    }

    public isOneOf(model: IModel): Field {
        this._properties.isOneOf = model;
        return this;
    }
}