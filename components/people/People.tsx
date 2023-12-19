import { Icon } from "@ui-kit/components/index";
import { FC } from "react";

export interface IPeopleProps {
    name: string;
    avatar?: string | File;
    size?: 'small' | 'medium' | 'large';
    bold?: boolean;
}

export const People: FC<IPeopleProps> = (props) => {
    const { avatar, name, size, bold } = props;

    return (
        <div className={`people${size ? `size-${size}` : " size-small"}`}>
            <div className="people-avatar">
                {avatar && typeof (avatar) === "string" ? <img src={avatar} alt="people-avatar" /> : <Icon circle name="icon-account" />}
            </div>
            <div className={`people-name${bold ? " b" : ""} trim`}>{name}</div>
        </div>
    )
}
