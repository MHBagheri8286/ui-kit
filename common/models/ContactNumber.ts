import { FieldType, Model, Schema } from "@ui-kit/core/index";

export interface IContactNumber {
    areaCode?: string;
    internationalCode?: string;
    phoneNumber?: string;
    verified?: boolean;
    type?: string;
}

export class ContactNumber extends Model implements IContactNumber {
    public static schema: Schema = new Schema("ContactNumber");
    public phoneNumber?: string;
    public internationalCode?: string;
    public areaCode?: string;
    public verified?: boolean;

    constructor(values: IContactNumber) {
        super(ContactNumber.schema);
        this.setValues(values);
    }
}

ContactNumber.schema.addField("phoneNumber").type(FieldType.String).required().pattern(/^[0-9]{10}$/);
ContactNumber.schema.addField("internationalCode").type(FieldType.String).required();
ContactNumber.schema.addField("areaCode").type(FieldType.String).required().pattern(/^[0-9]{3}$/);
ContactNumber.schema.freeze();