import { Schema } from "./Schema"
import { IValidationError, Validator } from "./Validator";

export interface IModelValues {
    [fieldName: string]: any;
}

export interface IModelValidationMessage {
    [fieldName: string]: { [ruleName: string]: string };
}
export interface IModel {
    new(values?: any): Model;
    schema: Schema;
}

export abstract class Model {
    private schema: Schema;
    public static schema: Schema;
    [key: string]: any;

    constructor(schema: Schema) {
        this.schema = schema;
    }

    public validate(...fieldNames: Array<string>): IValidationError | null {
        let result = Validator.validate(this.getValues(...fieldNames), this.schema);
        if (!result) { return null; }
        if (fieldNames.length) {
            let hasError = false;
            let subset: IValidationError = {};
            for (let i = 0, il = fieldNames.length; i < il; ++i) {
                let fieldName = fieldNames[i];
                if (!result[fieldName]) continue;
                subset[fieldName] = result[fieldName];
                hasError = true;
            }
            return hasError ? subset : null;
        }
        return result;
    }

    public setValues(values: IModelValues): void {
        if (!values) return;
        let fieldsNames = this.schema.getFieldsNames(),
            fieldName;
        for (let i = fieldsNames.length; i--;) {
            fieldName = fieldsNames[i];
            this[fieldName] = values[fieldName] !== undefined ? values[fieldName] : this[fieldName];
        }
    }

    public getValues<T>(...fields: string[]): T {
        let values: any = {} as T,
            fieldsNames = fields.length ? fields : this.schema.getFieldsNames(),
            fieldName;
        for (let i = fieldsNames.length; i--;) {
            fieldName = fieldsNames[i];
            if (this[fieldName] && this[fieldName].getValues) {
                values[fieldName] = this[fieldName].getValues();
            } else {
                values[fieldName] = this[fieldName];
            }
        }
        return values;
    }
}