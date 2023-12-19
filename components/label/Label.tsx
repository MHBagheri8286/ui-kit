import { Icon } from "@ui-kit/components/index";
import { CSSProperties, FC, ReactElement } from 'react';

interface ILabelProps {
    id?: string;
    className?: string;
    icon: string;
    dir?: "rtl" | "ltr";
    text: string | ReactElement;
    mode: 'inline' | 'block';
    order?: 'icon-text' | 'text-icon';
    size?: 'small' | 'base' | 'medium' | 'large' | 'xlarge';
    fontWeight?: "light" | "medium" | "bold";
    multi?: boolean;
    style?: CSSProperties;
}

export const Label: FC<ILabelProps> = ({ id, icon, dir, fontWeight, className, text, mode, order = 'icon-text', size = 'base', style, multi }) => {
    return (
        <div
            id={id}
            className={`label ${mode}-label ${order}-display ${size}-icon ${dir ?? ""} ${fontWeight ?? ""} ${className ? ` ${className}` : ''}`.trim()}
            style={style}
        >
            <Icon className="label-icon" name={icon} multi={multi} />
            <section className="label-description trim">{text}</section>
        </div>
    )
}