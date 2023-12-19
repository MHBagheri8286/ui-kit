import { IIconSetting, generateIcon } from '@ui-kit/components/index';
import { CSSProperties, FC } from 'react';

interface IValueNotFoundProps {
    iconSetting?: IIconSetting;
    title?: string;
    cssproperties?: CSSProperties;
}

export const ValueNotFound: FC<IValueNotFoundProps> = (props) => {
    const { iconSetting, title, cssproperties } = props;

    return (
        <div className="value-not-found" style={cssproperties}>
            {generateIcon(iconSetting)}
            <span className="title">{title}</span>
            {props.children}
        </div>
    )
}