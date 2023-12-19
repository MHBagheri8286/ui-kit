import { Label } from "@ui-kit/components/index";
import { FC } from "react";

export interface IContactItem {
    title: string;
    value: string,
};

export interface IContactProps {
    haveIcon: boolean
    phone: string;
    phoneText: string;
    email: string;
    emailText: string;
    emailSubject?: string;
    orientation?: "vertical" | "horizontal";
}

export const Contact: FC<IContactProps> = ({ haveIcon, phone, phoneText, email, emailText, emailSubject, orientation = 'vertical' }) => {
    return (
        <div className={`contact ${orientation}-align`}>
            {phone && <div className="adjust-icon">
                <Label
                    icon={haveIcon ? "icon-phone" : ''}
                    mode="inline"
                    size="medium"
                    text={<a href={`tel:${phone}`}>{phoneText}</a>}
                />
            </div>}
            {emailText && <div className="adjust-icon">
                <Label
                    icon={haveIcon ? "icon-email-outline" : ''}
                    mode="inline"
                    size="medium"
                    text={<a href={`mailto:${email}?subj}ect=${emailSubject || ""}`}>{emailText}</a>}
                />
            </div>}
        </div>
    )
}